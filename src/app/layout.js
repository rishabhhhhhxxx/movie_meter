import "./globals.css";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import ThemeCom from "@/components/ThemeCom";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata = {
  title: "MovieMeter",
  description: "Track and explore movies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <body className="bg-white dark:bg-black text-gray-800 dark:text-white transition-colors duration-300">
          <ThemeCom>
            <Header />
            <Navbar/>
            {children}
          </ThemeCom>
        </body>
      </ClerkProvider>
    </html>
  );
}
