'use client';

import { ThemeProvider } from 'next-themes';

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system'>
      <div className='min-h-screen select-none transition-colors duration-300'>

        {children}
      </div>
    </ThemeProvider>
  );
}
// "use client";
// import { useEffect, useState } from "react";
// import { ThemeProvider } from "next-themes";

// export default function ThemeCom({ children }) {
//   const [mounted, setMounted] = useState(false);

//   // Only render children after component mounts on client
//   useEffect(() => setMounted(true), []);

//   if (!mounted) return null; // Prevent mismatched hydration

//   return (
//     <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
//       <div className="min-h-screen select-none transition-colors duration-300">
//         {children}
//       </div>
//     </ThemeProvider>
//   );
// }
