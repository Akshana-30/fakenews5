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
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";



export default function UserNavbar() {
    return (
        // <SidebarProvider >
        //   <SidebarTrigger/>
        //   <Sidebar className="bg-white!">
        //     <SidebarHeader></SidebarHeader>
        //     <SidebarContent className="pt-20">
        //       <SidebarGroup></SidebarGroup>
        //       <SidebarGroup></SidebarGroup>
        //     </SidebarContent>
        //     <SidebarFooter></SidebarFooter>
        //   </Sidebar>
        // </SidebarProvider>

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
                        <Link href="/dashboard/profile/sub">
                            <Settings />
                            Subscription
                        </Link>
                    </Button>
                </li>
            </ul>
        </div>
    );
}
