"use client";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bookmark, ChevronDown, CircleUserRound, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";



export default function UserNavbar() {
  return (
    <div>
      {/* <SidebarProvider>
        <SidebarTrigger />
        <Sidebar  className="bg-white!">
          <SidebarHeader></SidebarHeader>
          <SidebarContent className="pt-40 flex flex-col gap-5">
            <SidebarMenuItem className="flex align-middle gap-2">
              <CircleUserRound />
              Overview
            </SidebarMenuItem>
            <SidebarMenuItem className="flex align-middle gap-2">
              <Bookmark />
              Saved Articles
            </SidebarMenuItem>
            <SidebarMenuItem className="flex align-middle gap-2">
              <Settings />
              Subscription
            </SidebarMenuItem>
          </SidebarContent>
          <SidebarFooter></SidebarFooter>
        </Sidebar>
      </SidebarProvider> */}
      <div className="flex w-full gap-2 px-6 sticky top-0 bg-muted-foreground">
        <ul className="flex items-center mx-auto">
          <li>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/dashboard">
                <CircleUserRound />
                Overview
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/dashboard/profile/saved-articles">
                <Bookmark />
                Saved Articles
              </Link>
            </Button>
          </li>
          <li>
            <Button asChild variant="ghost" className="text-white">
              <Link href="/dashboard/sub">
                <Settings />
                Subscription
              </Link>
            </Button>
          </li>
        </ul>
      </div>
    </div>
  );
}
