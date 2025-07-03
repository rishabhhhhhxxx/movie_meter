

import Link from "next/link";
import DarkModeSwitch from "./DarkModeSwitch";

export default function Header() {
  return (
    <div className="bg-white dark:bg-black shadow-sm transition-colors duration-300">
      <header className="flex justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        {/* Left: Navigation Links */}
        <ul className="flex gap-6 text-gray-800 dark:text-white text-lg font-medium transition-colors">
          <li className="hidden sm:block">
            <Link href="/">Home</Link>
          </li>
          <li className="hidden sm:block">
            <Link href="/favorites">Favorites</Link>
          </li>
          <li className="hidden sm:block">
            <Link href="/about">About</Link>
          </li>
        </ul>

        {/* Right: Theme Toggle + Logo */}
        <div className="flex items-center gap-4">
          <DarkModeSwitch />
          <Link href="/" className="flex gap-2 items-center">
            <div className="bg-amber-500 text-white text-2xl font-bold px-3 py-1 rounded-lg shadow">
              MM
            </div>
            <span className="text-xl font-semibold text-gray-800 dark:text-white hidden sm:inline transition-colors">
              MovieMeter
            </span>
          </Link>
        </div>
      </header>
    </div>
  );
}
