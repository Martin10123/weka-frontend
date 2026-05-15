"use client"

import { Ship, Trophy, Database, Brain, Sparkles, Settings, HelpCircle } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar"

interface AppSidebarProps {
  activeModule: "titanic" | "football"
  onModuleChange: (module: "titanic" | "football") => void
}

export function AppSidebar({ activeModule, onModuleChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
            <Brain className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-sidebar-foreground">ML Platform</span>
            <span className="text-xs text-sidebar-foreground/60">Predictive Analytics</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarSeparator />
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider">
            Modules
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeModule === "titanic"}
                  onClick={() => onModuleChange("titanic")}
                  className="gap-3"
                >
                  <Ship className="h-4 w-4" />
                  <span>Titanic Survival</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  isActive={activeModule === "football"}
                  onClick={() => onModuleChange("football")}
                  className="gap-3"
                >
                  <Trophy className="h-4 w-4" />
                  <span>Football Match</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
