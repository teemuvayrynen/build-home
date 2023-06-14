"use client"
import TopBar from "@/components/topBar";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <TopBar />
      {children}
    </div>
  )
}