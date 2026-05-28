"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { ChevronDown} from "lucide-react";
import Link from "next/link";

export function AppSidebar() {
  const {
    // state,
    // open,
    // setOpen,
    // openMobile,
    // setOpenMobile,
    // isMobile,
    toggleSidebar,
  } = useSidebar();

  return (
    <Sidebar>
        
      <SidebarHeader>
        {/* <SidebarMenuButton onClick={toggleSidebar} className="text-center">
          <Menu />
        </SidebarMenuButton> */}
      </SidebarHeader>
      <SidebarContent>
         <SidebarMenuItem>
          <SidebarMenuButton asChild isActive>
            <Link href="/">Home</Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    Nyheter
                    <ChevronDown color="black" />
                  </SidebarMenuButton>
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
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    Sport
                    <ChevronDown color="black" />
                  </SidebarMenuButton>
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
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarMenu>
             <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    Author/Editor/Admin
                    <ChevronDown color="black" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                  <Link href="/article/add-article">Create article</Link>
                </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>

          
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link href="/api/auth/register">Register</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          

        </SidebarGroup>
       
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              className="w-full text-center"
            >
              X
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
