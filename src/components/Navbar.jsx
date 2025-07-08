import NavbarItem from "./NavbarItem";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-center gap-6 p-4 
                    bg-white dark:bg-black
                    text-gray-800 dark:text-gray-200
                    border-b border-gray-200 dark:border-gray-800
                    transition-colors duration-300">
      <NavbarItem 
        title="Trending" 
        param="trending" 
        className="hover:text-[#FF5722] focus:text-[#FF5722] focus:outline-none transition-colors" 
      />
      <NavbarItem 
        title="Top Rated" 
        param="rated" 
        className="hover:text-[#FF5722] focus:text-[#FF5722] focus:outline-none transition-colors" 
      />
    </nav>
  );
}