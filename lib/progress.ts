"use client";
import type { ProgressStore, LessonProgress } from "./types";
export const PROGRESS_KEY = "history-ebook:progress:v1";
const emptyStore = (): ProgressStore => ({ version: 1, lessons: {} });
let unsaved: ProgressStore | null = null;
const LESSON_KEY = /^(korean|world)\/[^/]+\/[^/]+\/[^/]+$/;
const isLessonKey = (key: string) => LESSON_KEY.test(key);
export function readProgress(): ProgressStore {
  if (typeof window === "undefined") return emptyStore();
  if (unsaved) return structuredClone(unsaved);
  try {
    const parsed = JSON.parse(localStorage.getItem(PROGRESS_KEY) || "null") as ProgressStore | null;
    if (!parsed || parsed.version !== 1 || !parsed.lessons || typeof parsed.lessons !== "object") return emptyStore();
    const lessons = Object.fromEntries(Object.entries(parsed.lessons).filter(([key, value]) => isLessonKey(key) && value && typeof value.read === "boolean"));
    return { version: 1, lessons, lastVisited: parsed.lastVisited && isLessonKey(parsed.lastVisited) ? parsed.lastVisited : undefined, mistakes: Array.isArray(parsed.mistakes) ? parsed.mistakes : [] };
  } catch { return emptyStore(); }
}
export function writeProgress(store: ProgressStore): boolean {
  if (typeof window === "undefined") return false;
  let saved = true;
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(store)); unsaved = null; }
  catch { unsaved = structuredClone(store); saved = false; }
  window.dispatchEvent(new CustomEvent("history-ebook:storage-status", { detail: { saved } }));
  window.dispatchEvent(new Event("history-ebook:progress"));
  return saved;
}
export function clearProgress() { const next=emptyStore(); if (typeof window!=="undefined") writeProgress(next); return next; }
export function getLessonProgress(key:string):LessonProgress|undefined { return readProgress().lessons[key]; }
export function markLessonRead(key:string) { const store=readProgress(); if(!isLessonKey(key)) return store; const prev=store.lessons[key]??{read:false}; if(prev.read) return store; store.lessons[key]={...prev,read:true,readAt:new Date().toISOString()}; writeProgress(store); return store; }
export function setLastVisited(key:string) { const store=readProgress(); if(!isLessonKey(key)||store.lastVisited===key) return store; store.lastVisited=key; writeProgress(store); return store; }
function applyQuizScore(store:ProgressStore,key:string,score:number){ if(!isLessonKey(key)) return; const prev=store.lessons[key]??{read:false}; const safe=Math.max(0,Math.min(100,Number.isFinite(score)?score:0)); store.lessons[key]={...prev,quizBestScore:Math.max(prev.quizBestScore??0,safe),quizAttempts:(prev.quizAttempts??0)+1,lastQuizAt:new Date().toISOString()}; store.lastVisited=key; }
export function recordQuizScore(key:string,score:number){const store=readProgress();applyQuizScore(store,key,score);writeProgress(store);return store;}
export function recordQuizAttempt(lessonKey:string,score:number,results:Array<{questionId:string;prompt:string;choices:{id:string;text:string}[];answer:string;chosen:string;explanation?:string;href:string;sourceLessonKey?:string;sourceQuestionId?:string}>){
 const store=readProgress(); applyQuizScore(store,lessonKey,score); const now=new Date().toISOString(); let mistakes=store.mistakes??[];
 for(const r of results){ const existing=mistakes.find(m=>m.id===r.questionId); const origin=r.sourceLessonKey??existing?.lessonKey??lessonKey; const qid=r.sourceQuestionId??existing?.questionId??r.questionId; if(!isLessonKey(origin)) continue; const id=`${origin}::${qid}`; mistakes=mistakes.filter(m=>m.id!==id); if(r.chosen===r.answer) continue; mistakes.unshift({id,lessonKey:origin,questionId:qid,prompt:r.prompt,choices:r.choices,answer:r.answer,chosen:r.chosen,chosenText:r.choices.find(c=>c.id===r.chosen)?.text??r.chosen,answerText:r.choices.find(c=>c.id===r.answer)?.text??r.answer,explanation:r.explanation,href:r.href,at:now}); }
 store.mistakes=mistakes.slice(0,80); writeProgress(store); return store;
}
export function clearMistakes(){const s=readProgress();s.mistakes=[];writeProgress(s);return s;}
export function removeMistake(id:string){const s=readProgress();s.mistakes=(s.mistakes??[]).filter(m=>m.id!==id);writeProgress(s);return s;}
export function useProgressStore(){return{readProgress,writeProgress,clearProgress,PROGRESS_KEY};}
