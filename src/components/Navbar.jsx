"use client";
import { useState } from "react";
import { X, ExternalLink, Tag } from "lucide-react";

const Navbar = () => {
  const [visible, setVisible] = useState(true);

  return (
    <div
      className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${
        visible ? "max-h-20 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <div className="bg-[#3b1a08] border-b border-orange-900/40 px-4 py-3">
        <div className="flex items-center justify-center gap-4 text-orange-100 relative">

          <Tag className="h-5 w-5 text-orange-400 shrink-0" />

          <p className="text-center text-sm md:text-base font-medium">
            <span className="font-extrabold text-orange-300">10% de descuento</span>
            {" "}en todos nuestros productos usando el cupón{" "}
            <span className="font-extrabold text-white bg-white/10 px-2 py-0.5 rounded-md tracking-wider">HYPERV10</span>
          </p>

          <a
            href="/addtocart"
            className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm md:text-base font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors shrink-0"
          >
            Usar Cupón
            <ExternalLink className="h-4 w-4" />
          </a>

          <button
            onClick={() => setVisible(false)}
            className="absolute right-0 text-orange-300/60 hover:text-orange-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

        </div>
      </div>
    </div>
  );
};

export default Navbar;
