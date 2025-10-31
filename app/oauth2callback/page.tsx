// app/oauth2callback/page.tsx
"use client";
import { useEffect } from "react";

export default function OAuthCallback() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ success: true, source: 'google-oauth' }, "*");
      window.close();
    } else {
      console.warn("No opener found for this window");
    }
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Authorization successful ✅</h2>
      <p>This window will close automatically...</p>
    </div>
  );
}
