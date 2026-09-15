"use client";
import { useEffect, useState } from "react";
export function ProgressStorageNotice(){const [failed,setFailed]=useState(false);useEffect(()=>{const onStatus=(event:Event)=>setFailed(!(event as CustomEvent<{saved:boolean}>).detail.saved);window.addEventListener("history-ebook:storage-status",onStatus);return()=>window.removeEventListener("history-ebook:storage-status",onStatus)},[]);if(!failed)return null;return <p role="alert" className="border-b border-amber-300 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">브라우저 저장 공간을 사용할 수 없어 이번 실행에서만 학습 기록을 유지합니다.</p>}
