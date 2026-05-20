import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kasparo | AI Representation Optimizer",
  description: "Diagnose and optimize your Shopify store's representation for AI shopping agents.",
};

import Navigation from "@/components/Navigation";
import { StoreProvider } from "@/context/StoreContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {/* Background Orbs */}
          <div className="bg-orb orb-1"></div>
          <div className="bg-orb orb-2"></div>
          
          <nav className="global-nav">
            <div className="container nav-container">
              <div className="logo">KASPARO AI</div>
              <Navigation />
            </div>
          </nav>
          <div className="page-content-wrapper">
            {children}
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
