"use client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/app-sidebar";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

export default function Navbar() {
  return (
    <div className="flex w-full">
      <div className="lg:hidden">
        <SidebarProvider
          style={
            {
              "--sidebar-width-mobile": "20rem",
            } as React.CSSProperties
          }
        >
          <AppSidebar />

          <SidebarTrigger size="lg" />
        </SidebarProvider>
      </div>
      <div className="hidden lg:flex w-full items-center gap-2 px-6  sticky top-0 z-50 bg-[#2d2d2d]">
        <ul className="flex items-center mx-auto">
          <li>
            <Button variant="ghost" className="text-white" asChild>
              <Link href="/">HOME</Link>
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">
                  Nyheter
                  <ChevronDown color="white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/">Ekonomi</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/">Inrikes</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/">Väder</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/">Utrikes</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-white">
                  Sport
                  <ChevronDown color="white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <Link href="/">Fotboll</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/">Friidrott</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/">Skidskytte</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/">Ishockey</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </li>
        </ul>
      </div>
    </div>
  );
}
