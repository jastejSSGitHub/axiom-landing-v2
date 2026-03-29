"use client";

import { useState, useEffect } from "react";

const V1_URL =
  process.env.NEXT_PUBLIC_V1_URL || "https://axiom-landing.vercel.app";

export default function VersionSwitcher() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 9999,
        fontFamily: "var(--font-ibm-plex-mono, 'IBM Plex Mono', monospace)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.5s ease, transform 0.5s ease",
      }}
    >
      {/* Dropdown card */}
      <div
        style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          right: 0,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: "14px",
          padding: "6px",
          minWidth: "220px",
          boxShadow: "0 16px 40px rgba(0,0,0,0.4)",
          pointerEvents: open ? "all" : "none",
          opacity: open ? 1 : 0,
          transform: open ? "translateY(0) scale(1)" : "translateY(8px) scale(0.96)",
          transformOrigin: "bottom right",
          transition: "opacity 0.2s cubic-bezier(0.25,0.46,0.45,0.94), transform 0.2s cubic-bezier(0.25,0.46,0.45,0.94)",
        }}
      >
        <div style={{ padding: "8px 12px 6px", color: "rgba(255,255,255,0.4)", fontSize: "10px", letterSpacing: "0.12em", textTransform: "uppercase" }}>
          Switch Version
        </div>

        {/* V1 — link */}
        <a
          href={V1_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "9px",
            textDecoration: "none",
            marginBottom: "4px",
            transition: "background 0.15s ease",
            cursor: "pointer",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "inline-block", flexShrink: 0 }} />
          <div>
            <div style={{ color: "#fff", fontSize: "12px", fontWeight: 600, lineHeight: 1.2 }}>Version 1</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", marginTop: "1px" }}>Original design</div>
          </div>
          <svg style={{ marginLeft: "auto", opacity: 0.4 }} width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17L17 7M17 7H7M17 7v10" />
          </svg>
        </a>

        {/* V2 — current */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 12px",
            borderRadius: "9px",
            background: "rgba(255,255,255,0.06)",
            cursor: "default",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e", display: "inline-block", flexShrink: 0 }} />
          <div>
            <div style={{ color: "#fff", fontSize: "12px", fontWeight: 600, lineHeight: 1.2 }}>Version 2</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "10px", marginTop: "1px" }}>Current page</div>
          </div>
          <span style={{ marginLeft: "auto", fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.08em" }}>LIVE</span>
        </div>
      </div>

      {/* Trigger pill button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Switch landing page version"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "9px 14px",
          background: "rgba(10,10,10,0.88)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderRadius: "99px",
          color: "#fff",
          fontSize: "11px",
          fontWeight: 600,
          letterSpacing: "0.08em",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.35)",
          textTransform: "uppercase",
          transition: "transform 0.18s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.18s ease",
          outline: "none",
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03) translateY(-1px)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 30px rgba(0,0,0,0.5)";
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1) translateY(0)";
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.35)";
        }}
      >
        {/* Version chip */}
        <span style={{
          background: "rgba(34,197,94,0.2)",
          border: "1px solid rgba(34,197,94,0.4)",
          color: "#22c55e",
          borderRadius: "4px",
          padding: "1px 6px",
          fontSize: "9px",
          fontWeight: 700,
          letterSpacing: "0.1em",
        }}>
          V2
        </span>
        Landing Page Version
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ transition: "transform 0.2s ease", transform: open ? "rotate(180deg)" : "rotate(0deg)", opacity: 0.6 }}
        >
          <polyline points="18 15 12 9 6 15" />
        </svg>
      </button>
    </div>
  );
}
