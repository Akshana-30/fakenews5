import type { Metadata } from "next";
import { Anuphan, Geist, Geist_Mono, Lora, Roboto_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar/navbar";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/navbar/_components/app-sidebar";

const fontSans = Anuphan({
    subsets: ["latin"],
    variable: "--font-sans",
});

const fontSerif = Lora({
    subsets: ["latin"],
    variable: "--font-serif",
});

const fontMono = Roboto_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

export const metadata: Metadata = {
    title: "Fakenews",
    description: "A news website.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

  return (
    <html
      lang="en"
      data-theme="light"
      className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased h-full`}
      suppressHydrationWarning
    >
      <head>
        {/* Prevents flash of wrong theme on load */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');if(t==='dark')document.documentElement.classList.add('dark');document.documentElement.setAttribute('data-theme',t);}catch(_){}})();` }} />
      </head>
            <body className="flex flex-col bg-gray-200 dark:bg-gray-900">
                <Header />
                <div className="sticky top-0"><Navbar /></div>
                <div className="flex min-h-screen lg:min-w-5xl max-w-6xl shadow-2xl border-x border-gray-500 flex-1 mx-auto bg-white">
                    <SidebarProvider
                        defaultOpen={false}
                        style={
                            {
                                "--sidebar-width-mobile": "20rem",
                            } as React.CSSProperties
                        }
                    >
                        <AppSidebar />
                        <main className="flex max-w-6xl lg:min-w-5xl">
                            <SidebarTrigger size="lg" className="lg:hidden" />
                            {children}
                        </main>
                    </SidebarProvider>
                </div>
                <Footer />
            </body>
        </html>
    );
}
