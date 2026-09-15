import { describe, expect, it, vi } from "vitest";
import { PROGRESS_KEY, markLessonRead, readProgress, recordQuizAttempt } from "@/lib/progress";
const key="korean/goryeo/politics/lesson";
describe("progress persistence",()=>{
 it("marks a lesson once without inflating writes",()=>{const spy=vi.spyOn(Storage.prototype,"setItem");markLessonRead(key);markLessonRead(key);expect(readProgress().lessons[key].read).toBe(true);expect(spy).toHaveBeenCalledTimes(1);spy.mockRestore()});
 it("a review answer removes its original mistake without creating review progress",()=>{localStorage.setItem(PROGRESS_KEY,JSON.stringify({version:1,lessons:{},mistakes:[{id:`${key}::q1`,lessonKey:key,questionId:"q1",prompt:"p",choices:[{id:"a",text:"A"},{id:"b",text:"B"}],answer:"a",chosen:"b",chosenText:"B",answerText:"A",href:`/${key}`,at:"2026-01-01"}]}));recordQuizAttempt("review/mistakes",100,[{questionId:`${key}::q1`,sourceLessonKey:key,sourceQuestionId:"q1",prompt:"p",choices:[{id:"a",text:"A"},{id:"b",text:"B"}],answer:"a",chosen:"a",href:`/${key}`}]);const s=readProgress();expect(s.mistakes).toEqual([]);expect(s.lessons["review/mistakes"]).toBeUndefined()});
});
