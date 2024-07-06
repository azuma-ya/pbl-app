import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Box, Container } from "@mui/material";

import Navigation from "@/components/base/Navigation";
import AuthProvider from "@/components/providers/AuthProvider";
import ToastProvider from "@/components/providers/ToastProvider";
import TrpcProvider from "@/components/providers/TrpcProvider";
import CustomeThemeProvider from "@/components/providers/themeProvider";

import MuiProvider from "@/components/providers/MuiProvider";
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
            <MuiProvider>
              <CustomeThemeProvider>
                <Box
                  sx={{
                    display: "flex",
                    height: "100vh",
                    flexDirection: "column",
                  }}
                >
                  <ToastProvider />
                  <Navigation user={user} />
                  <Container sx={{ flex: 1 }}>{children}</Container>
                </Box>
              </CustomeThemeProvider>
            </MuiProvider>
          </TrpcProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
