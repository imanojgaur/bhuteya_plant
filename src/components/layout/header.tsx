import { Logo } from "../shared/logo";
import { CartDrawer } from "./cart";
import MobileNav from "./mobile-nav";
import { Navbar } from "./navbar";
import { SearchBar } from "./search-bar";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        
        {/* Left: Logo */}
        <div className="flex w-32 items-center justify-start">
          <Logo />
        </div>

        {/* Center: Main Navigation (Hidden on mobile) */}
        <div className="hidden flex-1 justify-center md:flex">
          <Navbar />
        </div>

        {/* Right: Actions (Search, Cart, Mobile Menu) */}
        <div className="flex w-32 items-center justify-end gap-4">
          <div className="hidden md:flex items-center gap-4">
            <SearchBar />
          </div>
          <CartDrawer />
          <div className="md:hidden">
            <MobileNav />
          </div>
        </div>

      </div>
    </header>
  );
}