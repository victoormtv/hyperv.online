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

const SOCIALS = [
  {
    href: "https://www.youtube.com/@hyperggg",
    color: "#FF0000",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    href: "https://www.instagram.com/_hypervgg/",
    color: "#E1306C",
    path: "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12c0 3.259.014 3.668.072 4.948.061 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.061 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.061-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.061-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z",
  },
  {
    href: "https://www.tiktok.com/@hypervgg",
    color: "#ffffff",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
];

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
      onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 0 35px rgba(255,255,255,0.55), 0 0 70px rgba(255,255,255,0.2)"; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 0 20px rgba(255,255,255,0.3), 0 0 40px rgba(255,255,255,0.1)"; }}
    >
      <ShoppingCart size={26} className="text-black" strokeWidth={2} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-extrabold"
          style={{ background: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.6)" }}>
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
                HyperV Store
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

              {/* Social icons */}
              <div className="hidden sm:flex items-center gap-0.5">
                {SOCIALS.map(({ href, path }) => (
                  <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-all duration-200 hover:scale-110">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
              </div>

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
