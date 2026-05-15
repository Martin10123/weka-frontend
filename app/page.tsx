"use client"

import { useState } from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { TitanicModule } from "@/components/titanic/titanic-module"
import { FootballModule } from "@/components/football/football-module"
import { Ship, Trophy } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function Home() {
  const [activeModule, setActiveModule] = useState<"titanic" | "football">("titanic")

  return (
    <SidebarProvider>
      <AppSidebar activeModule={activeModule} onModuleChange={setActiveModule} />
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:px-6">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex items-center gap-2">
            {activeModule === "titanic" ? (
              <>
                <Ship className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">Titanic Survival Prediction</h1>
              </>
            ) : (
              <>
                <Trophy className="h-5 w-5 text-primary" />
                <h1 className="text-lg font-semibold">Football Match Intelligence</h1>
              </>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          {activeModule === "titanic" ? <TitanicModule /> : <FootballModule />}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
