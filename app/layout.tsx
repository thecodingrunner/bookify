import {ClerkProvider} from "@clerk/nextjs";
import {shadcn} from "@clerk/ui/themes";
import type {Metadata} from "next";
import {Suspense} from "react";
import {Mona_Sans, IBM_Plex_Serif} from "next/font/google";

import "./globals.css";
import Navbar from "@/components/Navbar";
import {Toaster} from "sonner";

const ibmPlexSerif = IBM_Plex_Serif({
    variable: "--font-ibm-plex-serif",
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    display: 'swap'
});

const monaSans = Mona_Sans({
    variable: "--font-mona-sans",
    subsets: ['latin'],
    display: 'swap'
})

export const metadata: Metadata = {
    title: "Bookify",
    description: "Transform your books into interactive AI conversations",
};

export default function RootLayout({children}: LayoutProps<"/">) {
    return (
        <html
            lang="en"
            className={`${ibmPlexSerif.variable} ${monaSans.variable} relative font-sans h-full antialiased`}
        >
        <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{theme: shadcn}}>
            <Suspense fallback={null}>
                <Navbar/>
            </Suspense>
            {children}
            <Toaster/>
        </ClerkProvider>
        </body>
        </html>
    );
}