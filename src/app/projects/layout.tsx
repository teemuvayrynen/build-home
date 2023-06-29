"use client"
import TopBar from "@/components/topBar";
import Provider from "@/app/Providers"

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Provider>
        <TopBar />
        {children}
      </Provider>
    </div>
  )
}