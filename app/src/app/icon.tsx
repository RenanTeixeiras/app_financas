import { ImageResponse } from "next/og";

export const size = {
  width: 512,
  height: 512,
};

export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at top right, rgba(125,211,252,0.45), transparent 35%), linear-gradient(135deg, #7c3aed 0%, #38bdf8 55%, #08101b 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            width: 360,
            height: 360,
            borderRadius: 96,
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(8, 16, 27, 0.78)",
            border: "1px solid rgba(255,255,255,0.16)",
            boxShadow: "0 30px 80px rgba(8, 16, 27, 0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 184,
              height: 184,
              borderRadius: 48,
              background: "linear-gradient(135deg, #7dd3fc, #8b5cf6)",
              color: "#020617",
              fontSize: 96,
              fontWeight: 800,
            }}
          >
            F$
          </div>
        </div>
      </div>
    ),
    size,
  );
}
