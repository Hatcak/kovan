import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = `${site.name}: ${site.tagline}`;
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
          background: "#ffffff",
          color: "#0f172a",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="72" height="72" viewBox="0 0 32 32">
            <path d="M16 2.5 27.7 9.25v13.5L16 29.5 4.3 22.75V9.25z" fill="#047857" />
            <path d="M16 10.2 21 13.1v5.8L16 21.8 11 18.9v-5.8z" fill="#ffffff" />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 700 }}>{site.name}</div>
        </div>
        <div style={{ marginTop: 40, fontSize: 64, fontWeight: 700, lineHeight: 1.1 }}>{site.tagline}</div>
        <div style={{ marginTop: 24, fontSize: 30, color: "#475569" }}>
          Tek anahtar, birçok veri kaynağı, kullandığın kadar kredi.
        </div>
      </div>
    ),
    size,
  );
}
