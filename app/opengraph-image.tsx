import { ImageResponse } from "next/og";

export const alt = "역사 e-book";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0f172a",
          color: "#f8fafc",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 4, color: "#94a3b8" }}>
          HISTORY E-BOOK
        </div>
        <div style={{ marginTop: 18, fontSize: 72, fontWeight: 700 }}>
          역사 e-book
        </div>
        <div style={{ marginTop: 24, fontSize: 32, color: "#cbd5e1" }}>
          한국사 55차시 · 세계사 70차시
        </div>
        <div style={{ marginTop: 12, fontSize: 24, color: "#94a3b8" }}>
          시대 → 단원 → 차시 · 퀴즈 · 브라우저 진도
        </div>
      </div>
    ),
    size
  );
}
