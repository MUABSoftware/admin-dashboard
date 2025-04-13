"use client";
import { useState, useEffect } from "react";
import { ThemeProvider as MUIThemeProvider, CssBaseline } from "@mui/material";
import Layout from "@src/components/Layout";
import createDashboardTheme from "@src/components/theme";
import { usePathname } from "next/navigation";
import "@src/global.css";
import "@src/globals.css";
import { ThemeContext } from "@src/context/theme-context";
import { ToastContainer } from 'react-toastify';
   import 'react-toastify/dist/ReactToastify.css'; // Import the CSS for styling

const pathsWithNoLayout = ["/login"];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const [isLoading, setIsLoading] = useState(true);
  const [pageTitle, setPageTitle] = useState("Dashboard - Muab");

  const theme = createDashboardTheme(mode);
  const currentPath = usePathname();

  const shouldUseLayout = !pathsWithNoLayout.some((path) => currentPath.startsWith(path));

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  useEffect(() => {
    const savedMode = localStorage.getItem("theme");
    if (savedMode) {
      setMode(savedMode as "light" | "dark");
    } else {
      setMode("light");
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("theme", mode);
    }
    setIsLoading(false);
  }, [mode, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <html lang="en">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" />
      <title>{pageTitle}</title>
      <body>
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
          <MUIThemeProvider theme={theme}>
            <CssBaseline />
            {shouldUseLayout ? (
              <Layout mode={mode} toggleMode={toggleTheme} setPageTitle={setPageTitle}>
                {children}
              </Layout>
            ) : (
              children
            )}
          </MUIThemeProvider>
        </ThemeContext.Provider>
        <ToastContainer />
      </body>
    </html>
  );
}
