import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7c3aed 0%, #38bdf8 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 128,
            height: 128,
            borderRadius: 36,
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(8, 16, 27, 0.82)",
            border: "1px solid rgba(255,255,255,0.14)",
            color: "#e2e8f0",
            fontSize: 56,
            fontWeight: 800,
          }}
        >
          F$
        </div>
      </div>
    ),
    size,
  );
}
