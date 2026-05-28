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
    <div className="max-w-6xl mx-auto border-b-4 border-b-primary">
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
      <div className="hidden lg:flex items-center gap-2 px-6  sticky top-0 z-50 bg-secondary">
        <ul className="flex items-center">
          <li>
            <Button asChild>
              <Link href="/">HOME</Link>
            </Button>
          </li>
          <li>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
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
                <Button>
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
