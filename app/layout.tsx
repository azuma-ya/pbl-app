import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Box, Container } from "@mui/material";

import Navigation from "@/components/base/Navigation";
import AuthProvider from "@/components/providers/AuthProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import TrpcProvider from "@/components/providers/TrpcProvider";
import CustomeThemeProvider from "@/components/providers/themeProvider";

import { getAuthSession } from "@/lib/auth";
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
  const user = await getAuthSession();
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AuthProvider>
          <TrpcProvider>
            <CustomeThemeProvider>
              <Box
                sx={{
                  display: "flex",
                  minHeight: "100vh",
                  flexDirection: "column",
                }}
              >
                <ToastProvider />
                <Navigation user={user} />
                <main>
                  <Container sx={{ flex: 1 }}>{children}</Container>
                </main>
              </Box>
            </CustomeThemeProvider>
          </TrpcProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
