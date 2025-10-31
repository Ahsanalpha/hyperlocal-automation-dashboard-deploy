"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface OAuthAuthProps {
  service?: "drive";
  baseUrl?: string;
  accessToken?: string;
  isConnected?: boolean;
  connectedAt?: string;
  onCheckStatus?: () => void;
  showStatus?: boolean;
  buttonLabel?: string;
}

export default function DriveAuthentication({
  service = "drive",
  baseUrl = "",
  accessToken,
  isConnected = false,
  connectedAt = new Date().toISOString(),
  onCheckStatus = () => console.log("Check status triggered"),
  showStatus = true,
  buttonLabel = "Authenticate Google Drive",
}: OAuthAuthProps) {
  const [isDriveConnected, setIsDriveConnected] = useState(false);
  const [fetchedEmail, setFetchedEmail] = useState("");

  useEffect(()=>{
    onCheckAuthentication();
  },[])

  useEffect(() => {
  function handleOAuthMessage(event: MessageEvent) {
    if (event.data?.source === "google-oauth" && event.data?.success) {
      const user = event.data?.user;
      toast.success(`✅ Google Drive connected as ${user?.email || "Unknown"}`);
      console.log("Google user info:", user);
      setIsDriveConnected(true);
      onCheckStatus?.();
    }
  }

  window.addEventListener("message", handleOAuthMessage);
  return () => window.removeEventListener("message", handleOAuthMessage);
}, []);


  async function onCheckAuthentication() {
    let endpoint = `${process.env.NEXT_PUBLIC_DOMAIN}/check-google-auth`;
    try {
      const response = await fetch(endpoint,{
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
        },
      });
      if(response.status === 200) {
        const data = await response.json();
        console.log("Data on check:::",data);
        if(data.success === true) {
          setIsDriveConnected(true);
          setFetchedEmail(data.user.email);
          // toast.success("Google Drive authentication successful");
        }
        else {
          setIsDriveConnected(false);
          // toast.error("Google Drive authentication failed");
        }
      }
    }
    catch(error) {
      console.log("Error:::",error);
      toast.error("Error while checking Google Drive authentication");
    }
  }

  async function authorizeGoogleDrive() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/authorize-drive`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "", // must match backend API key
      },
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `Request failed: ${response.status}`);
    }

    const data = await response.json();

    if (data?.success && data?.authUrl) {
      console.log("Google OAuth URL:", data.authUrl);

      // ✅ Open Google OAuth URL in a popup window
      const popup = window.open(
  data.authUrl,
  "googleAuthPopup",
  "width=600,height=800"
);


      if (!popup) {
        alert("Popup blocked — please allow popups for this site.");
      }
    } else {
      console.error("Authorization failed:", data);
      alert(data?.message || "Authorization failed");
    }
  } catch (error) {
    console.error("Error during Google Drive authorization:", error);
    alert("Error authorizing Google Drive — check console for details.");
  }
}


  useEffect(() => {
    onCheckStatus();
  }, [onCheckStatus]);

  return (
    <section className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="bg-white dark:bg-card border rounded-lg shadow-sm p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold tracking-tight">
            Google Drive Integration
          </h2>
          {/* {!isConnected && ( */}
            <Button
              // onClick={onAuthClickHandler}
              onClick={authorizeGoogleDrive}
              className="mt-3 sm:mt-0 bg-[#2563EB] hover:bg-[#1d4ed8] text-white"
            >
              {buttonLabel}
            </Button>
          {/* )} */}
        </div>

        <div className="space-y-4">
          {showStatus && (
            <>
              {isDriveConnected ? (
                <div className="rounded-md border border-green-500 bg-green-50 dark:bg-green-950/30 p-4">
                  <h3 className="text-green-700 dark:text-green-400 font-semibold mb-2">
                    Connected to Google Drive
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    <strong>Email:</strong> {fetchedEmail.length > 0 ? fetchedEmail : "Not Available"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <strong>Connected At:</strong>{" "}
                    {new Date(connectedAt).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="rounded-md border border-red-500 bg-red-50 dark:bg-red-950/30 p-4">
                  <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">
                    Not Connected
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Please authenticate with your Google Drive account to save
                    and view SEO audit reports.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

// Helper
function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
