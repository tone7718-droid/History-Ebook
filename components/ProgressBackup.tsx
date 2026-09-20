"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { createBackup, MAX_BACKUP_BYTES, parseBackup, type ProgressBackup as Backup, type RestoreMode } from "@/lib/progress-backup";
import { readProgress, restoreProgress } from "@/lib/progress";

export function ProgressBackup() {
  const [preview, setPreview] = useState<Backup | null>(null);
  const [mode, setMode] = useState<RestoreMode>("merge");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const request = useRef(0);
  const button = "min-h-11 rounded-lg border border-slate-300 px-4 py-2 text-sm dark:border-slate-600";
  const clear = () => { request.current += 1; setPreview(null); setError(""); setMessage(""); };
  const exportFile = () => {
    setError(""); setMessage("");
    try {
      const raw = createBackup(readProgress());
      const url = URL.createObjectURL(new Blob([raw], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `history-ebook-progress-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setMessage("백업 파일 다운로드를 요청했습니다. 다운로드 폴더 또는 파일 앱에서 확인하세요.");
    } catch (e) { setError(e instanceof Error ? e.message : "백업 파일을 만들지 못했습니다."); }
  };
  const chooseFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    clear(); setMode("merge");
    if (!file) return;
    const token = request.current;
    try {
      if (file.size > MAX_BACKUP_BYTES) throw new Error("백업 파일은 5MB 이하여야 합니다.");
      const backup = parseBackup(await file.text());
      if (request.current === token) setPreview(backup);
    } catch (e) { if (request.current === token) setError(e instanceof Error ? e.message : "파일을 읽지 못했습니다."); }
  };
  const restore = () => {
    if (!preview) return;
    if (mode === "replace" && !window.confirm("현재 읽음·퀴즈·오답 기록을 백업 내용으로 모두 교체할까요? 먼저 현재 기록을 백업하는 것이 좋습니다.")) return;
    setError(""); setMessage("");
    try {
      if (!restoreProgress(preview.progress, mode)) throw new Error("브라우저에 저장하지 못해 복원을 적용하지 않았습니다. 기존 기록은 유지됩니다.");
      setPreview(null);
      setMessage(mode === "merge" ? "백업을 현재 기록과 병합해 저장했습니다." : "백업 내용으로 교체해 저장했습니다.");
    } catch (e) { setError(e instanceof Error ? e.message : "복원하지 못했습니다. 기존 기록은 유지됩니다."); }
  };
  return <section aria-labelledby="backup-heading" className="mt-8 space-y-4 rounded-xl border border-slate-200 p-5 dark:border-slate-800">
    <h2 id="backup-heading" className="text-xl font-bold">학습 기록 백업·복원</h2>
    <p className="text-sm text-slate-600 dark:text-slate-400">읽음 상태, 퀴즈 점수·횟수, 오답 노트와 마지막 방문 차시를 파일로 보관하고 다른 기기로 옮길 수 있습니다.</p>
    <button type="button" className={button} onClick={exportFile}>백업 파일 저장</button>
    <div><label htmlFor="progress-backup-file" className="block text-sm font-medium">백업 파일 선택 (JSON, 최대 5MB)</label>
      <input id="progress-backup-file" type="file" accept=".json,application/json" onChange={chooseFile} className="mt-2 block w-full min-w-0 text-sm" /></div>
    {preview && <div className="space-y-3 rounded-lg border border-slate-200 p-4 dark:border-slate-700">
      <h3 className="font-semibold">복원 미리보기</h3>
      <p className="text-sm">백업 생성: {new Date(preview.exportedAt).toLocaleString("ko-KR")}</p>
      <p className="text-sm">차시 기록 {Object.keys(preview.progress.lessons).length}개 · 읽음 {Object.values(preview.progress.lessons).filter((l) => l.read).length}개 · 오답 {preview.progress.mistakes?.length ?? 0}개</p>
      <fieldset className="space-y-2"><legend className="font-medium">복원 방식</legend>
        <label className="flex min-h-11 items-center gap-2"><input type="radio" name="restore-mode" checked={mode === "merge"} onChange={() => setMode("merge")} />현재 기록과 병합</label>
        <label className="flex min-h-11 items-center gap-2"><input type="radio" name="restore-mode" checked={mode === "replace"} onChange={() => setMode("replace")} />백업 내용으로 교체</label>
      </fieldset>
      <p className="text-sm text-slate-600 dark:text-slate-400">병합은 읽음 상태와 높은 점수를 유지하며, 중복 시도 횟수는 큰 값을 사용합니다. 같은 오답은 최신 기록을 남깁니다. 백업에 남아 있는 예전 오답이 다시 추가될 수 있습니다.</p>
      <div className="flex flex-wrap gap-2"><button type="button" className={button} onClick={restore}>복원 적용</button><button type="button" className={button} onClick={clear}>취소</button></div>
    </div>}
    {error && <p role="alert" className="text-sm text-rose-700 dark:text-rose-300">{error}</p>}
    {message && <p role="status" className="text-sm text-emerald-700 dark:text-emerald-300">{message}</p>}
  </section>;
}
