import "./globals.css";
import Header from "@/components/Header";
import ThemeCom from "@/components/ThemeCom";

export const metadata = {
  title: "MovieMeter",
  description: "Track and explore movies",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-black text-gray-800 dark:text-white transition-colors duration-300">
        <ThemeCom>
          <Header />
          {children}
        </ThemeCom>
      </body>
    </html>
  );
}

