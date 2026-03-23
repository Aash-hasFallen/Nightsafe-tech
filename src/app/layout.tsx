import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NightSafe: Smart Campus Guardian",
  description: "Advanced safety companion for students at Night.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#050b15" />
      </head>
      <body className={`${inter.className} min-h-screen bg-[#050b15] text-slate-200 overflow-x-hidden relative`}>
        {/* Background Gradients */}
        <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[0%] right-[-10%] w-[35%] h-[45%] bg-blue-600/5 rounded-full blur-[100px]" />
          <div className="absolute top-[20%] right-[10%] w-[25%] h-[30%] bg-emerald-500/5 rounded-full blur-[120px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
