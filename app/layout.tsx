import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { Inter } from "next/font/google";

import { auth } from "@/auth";
import ToastProvider from "@/components/providers/ToastProvider";
import { Box, Container } from "@mui/material";

import Navigation from "@/components/base/Navigation";
import CustomeThemeProvider from "@/components/providers/themeProvider";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PBL App",
  description: "This app was cretaed as PBL lecture at Gunma-u",
};

const RootLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const session = await auth();
  return (
    <html lang="ja">
      <body className={inter.className}>
        <CustomeThemeProvider>
          <Box
            sx={{
              display: "flex",
              minHeight: "100vh",
              flexDirection: "column",
            }}
          >
            <SessionProvider session={session}>
              <ToastProvider />
              <Navigation />
              <main>
                <Container sx={{ flex: 1 }}>{children}</Container>
              </main>
            </SessionProvider>
          </Box>
        </CustomeThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
