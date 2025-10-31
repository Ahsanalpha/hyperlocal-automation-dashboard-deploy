import type { Metadata } from "next"
import ClientDashboard from "../dashboard"

export const metadata: Metadata = {
  title: "Jumper Media Automations",
  description: "Client dashboard for managing Google Business Profile automation services",
  openGraph: {
    title: "Jumper Media Automations",
    description: "Client dashboard for managing Google Business Profile automation services",
    type: "website",
  },
}

export default function Page() {
  return <ClientDashboard />
}
