"use client";
import React, { forwardRef, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { LayoutDashboard, ShoppingCart } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import { logout } from "@/utils/actions";
import { useLanguage } from "@/context/LanguageContext";
import { useSelector, useDispatch } from "react-redux";
import { setShowCartDrawer } from "@/redux/slice/cartSlice";
import Navbar from "./Navbar";
import { NavigationMenuLink } from "@/components/ui/navigation-menu";
import { cn as cnUtil } from "@/lib/utils";

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

const LanguageSelector = () => {
  const { locale, changeLocale } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = languages.find((l) => l.code === locale) || languages[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white/80 border border-white/25 bg-transparent backdrop-blur-sm hover:border-white/60 hover:text-white transition-all duration-200"
      >
        <span>{current.flag}</span>
        <span className="hidden sm:inline">{current.label}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-40 rounded-lg border border-white/20 bg-black/90 backdrop-blur-md shadow-xl overflow-hidden" style={{ zIndex: 100001 }}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { changeLocale(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors hover:bg-white/10 ${locale === lang.code ? "text-cyan-400 font-semibold" : "text-white/80"}`}
            >
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {locale === lang.code && (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Floating cart button (bottom right)
const FloatingCart = () => {
  const dispatch = useDispatch();
  const { cart, showCartDrawer } = useSelector((state) => state.auth);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const totalItems = mounted ? cart.reduce((sum, item) => sum + item.quantity, 0) : 0;

  return (
    <button
      onClick={() => dispatch(setShowCartDrawer(true))}
      className="fixed bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
      style={{
        background: "#ffffff",
        boxShadow: "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)",
        zIndex: showCartDrawer ? 99998 : 100002,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = "0 0 35px rgba(255,255,255,0.55), 0 0 70px rgba(255,255,255,0.2)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)";
      }}
    >
      <ShoppingCart size={26} className="text-black" strokeWidth={2} />
      {totalItems > 0 && (
        <span
          className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
          style={{ background: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.6)" }}
        >
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
};

const Header = ({ categories, session }) => {
  const { t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-50 flex flex-col">
        <Navbar />
        <header className={cn("w-full relative transition-all duration-500 ease-in-out", scrolled ? "liquid-glass" : "bg-transparent")}>
          <div className="flex justify-between items-center h-20 px-4 md:px-[10%]">

            <Link href="/" className="flex items-center gap-2">
              <img src="/logo.png" className="h-8 cursor-pointer" alt="logo" />
              <span className="text-white font-bold hidden sm:block" style={{ fontSize: "1.5rem" }}>
                HyperV Community
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-white/80">
              <Link href="/" className="px-3 py-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200">{t.home}</Link>
              <Link href="/products" className="px-3 py-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200">{t.products}</Link>
              <Link href="/affiliate" className="px-3 py-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200">{t.affiliate}</Link>
              <Link href="/terms" className="px-3 py-1.5 rounded-md hover:bg-white/10 hover:text-white transition-all duration-200">{t.terms}</Link>
            </nav>

            <div className="flex items-center gap-3">
              {session?.isLoggedIn && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Avatar className="cursor-pointer h-8 w-8">
                      <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                      <AvatarFallback className="text-xs">{session?.user?.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="w-60 bg-black/90 border border-white/10 text-white">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">{session?.user?.name}</h4>
                        <p className="text-sm text-white/50">{session?.user?.email}</p>
                        <Separator className="my-4 bg-white/10" />
                        <Link href="/dashboard" className="flex items-center gap-2 text-sm hover:text-cyan-400 transition-colors">
                          <LayoutDashboard size={16} /> Dashboard
                        </Link>
                        <Separator className="my-4 bg-white/10" />
                        <form action={logout}>
                          <button className="cursor-pointer text-sm text-red-400 hover:text-red-300 transition-colors">Logout</button>
                        </form>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              <a
                href="https://discord.com/invite/hypervgg"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all duration-200 hover:scale-105 active:scale-95"
                style={{ background: "linear-gradient(135deg, #06b6d4, #0891b2)" }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 13.94 13.94 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.030zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                {t.joinDiscord}
              </a>

              <LanguageSelector />
            </div>
          </div>
        </header>
      </div>

      {/* Floating cart button */}
      <FloatingCart />
    </>
  );
};

export default Header;

const ListItem = forwardRef(({ className, title, image, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn("flex select-none gap-3 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-white/10 focus:bg-white/10", className)}
          {...props}
        >
          <img src={image} alt="" className="h-9 w-9 rounded-md object-cover shrink-0" />
          <div>
            <div className="text-sm font-semibold text-white mb-1">{title}</div>
            <p className="line-clamp-2 text-xs leading-snug text-white/50">{children}</p>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
