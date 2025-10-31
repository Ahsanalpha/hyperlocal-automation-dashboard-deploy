import Error from "next/error";


const API_KEY = process.env.NEXT_PUBLIC_API_KEY;
export async function runAutomations(id) {
     const isOk = (res) => res.ok ? res.json() : new Error("Automation failed!");
    
    return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users/run-audit/${id}`,
        {  
            headers:{
            "x-api-key": API_KEY
        }}
    ).then(isOk)
}

export async function getAllUsers () {
    const isOk = (res) => res.ok ? res.json() : new Error("Get all users failed!");
    
    return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users`,{  
            headers:{
            "x-api-key": API_KEY
        }}).then(isOk)
}

export async function createUser (newUserData) {
    
    const isOk = res => res.ok ? res.json() : new Error("Create users failed!");
    
    return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users`,{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            "x-api-key": API_KEY
        },
        body: JSON.stringify(newUserData)
    }).then(isOk)
}

export async function deleteUser (id) {
    const isOk = res => res.ok ? res.json() : new Error("Deleted the user!");
    
    return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users/${id}`,{
        method:'DELETE',
        headers: {
            "x-api-key": API_KEY
        }
    }).then(isOk)
}

export async function updateUser (id, updatedUser) {
    const isOk = res => res.ok ? res.json() : new Error("Updated the user!");
    
    return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/users/${id}`,{
        method: 'PUT',
        headers: {
            "x-api-key": API_KEY
        },
        body: JSON.stringify(updatedUser)
    }).then(isOk)
}

export async function onAuthClickHandler() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const access_token = Cookies.get("access_token");

    try {
      const authUrl = `${baseUrl}/tenant/calendar/auth/login`;
      const response = await fetch(authUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      });

      const res = await response.json();

      if (res && res.data.auth_url) {
        const popup = window.open(
          res.data.auth_url,
          "_blank",
          "width=600,height=800"
        );

        if (popup) {
          const timer = setInterval(() => {
            // 🔑 This is the only reliable "event" → check if closed
            if (popup.closed) {
              clearInterval(timer);

              // 👉 at this point, user either completed OAuth OR closed manually
              // So refresh connection status
              checkConnectionStatus();
              toast.info("Calendar connection status updated");
            }
          }, 500);
        }
      }
    } catch (error) {
      console.error("Error during auth redirection:", error);
    }
  };