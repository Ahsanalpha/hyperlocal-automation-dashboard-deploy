"use client";
export const dynamic = "force-dynamic";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function OAuth2Callback() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");

    if (!code) {
      toast.error("Missing authorization code");
      return;
    }

    async function exchangeCode() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/oauth2callback?code=${code}`, {
          method: "GET",
          headers: {
            "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
          },
        });

        if (!res.ok) {
          const text = await res.text();
          throw new Error(text);
        }

        toast.success("✅ Google Drive connected successfully!");

        // Notify parent window and close
        window.opener?.postMessage({ success: true, source: "google-oauth" }, "*");
        setTimeout(() => window.close(), 1000);
      } catch (err) {
        console.error("Error exchanging code:", err);
        toast.error("Error connecting to Google Drive");
      }
    }

    exchangeCode();
  }, [searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Connecting your Google Drive...</h2>
      <p>This will only take a moment.</p>
    </div>
  );
}
