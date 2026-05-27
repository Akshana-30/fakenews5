import type { Metadata } from "next";
import { Anuphan, Geist, Geist_Mono, Lora, Roboto_Mono } from "next/font/google";
import "./globals.css";

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
            className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased h-full`}
        >
            <body className="min-h-full flex flex-col">{children}</body>
        </html>
    );
}
