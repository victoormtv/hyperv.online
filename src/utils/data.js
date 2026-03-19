import { BookA, Home, Settings, UsersRound } from "lucide-react";

export const components = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content—known as tab panels—that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
];

export const profile = [
  {
    title: "Profile",
    img: "/banner1.png",
    badge: "Status: Indetectable",
    heading: "Domina todo el lobby",
    subheading: "HyperV",
    text: "Descubre productos premium con entrega rápida, actualizaciones constantes y soporte dedicado. Calidad en la que puedes confiar.",
    cta: "Compra Ahora",
    ctaSecondary: "Únete en Discord",
    icon: "paint-brush",
  },
  {
    title: "Quotes",
    badge: "✦ OFERTAS",
    heading: "Ofertas Exclusivas",
    subheading: "Todos los Días",
    text: "Tu destino final para productos premium, en cualquier momento y en cualquier lugar. Calidad inigualable a precios inmejorables.",
    cta: "Explorar Ofertas",
    ctaSecondary: "Ver Todos los Productos",
    icon: "quote-left",
    img: "/banner2.png",
  },
  {
    title: "Inspiration",
    badge: "✦ BEST SELLERS",
    heading: "Top Picks",
    subheading: "Just For You",
    text: "Explore our curated selection of best-selling products delivering unmatched style and convenience.",
    cta: "Buy Now",
    ctaSecondary: "Learn More",
    img: "/banner3.png",
    icon: "lightbulb",
  },
];

export const staticTime = [
  { count: 23, time: "Hours" },
  { count: 10, time: "Days" },
  { count: 59, time: "Minutes" },
  { count: 35, time: "Seconds" },
];

export const sidebarRoutes = [
  {
    id: 1,
    title: "Dashboard",
    route: "/dashboard",
    icon: <Home className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 2,
    title: "Users",
    route: "/dashboard/users",
    icon: <UsersRound className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 3,
    title: "Orders",
    route: "/dashboard/orders",
    icon: <BookA className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 4,
    title: "Products",
    route: "/dashboard/products",
    icon: <BookA className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 5,
    title: "Categories",
    route: "/dashboard/categories",
    icon: <BookA className="h-5 w-5 text-gray-500" />,
  },
  {
    id: 6,
    title: "Settings",
    route: "/dashboard/settings",
    icon: <Settings className="h-5 w-5 text-gray-500" />,
  },
];

export const userList = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@yahoo.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "Abe45@gmail.com" },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

export const communityReviews = [
  {
    username: "Owen",
    date: "15 de Marzo, 2026",
    message: "Producto: Bypass UID | Funciona perfecto, no me banearon",
  },
  {
    username: "Mac_0214",
    date: "14 de Marzo, 2026",
    message:
      "Producto: Panel only aimbot + Bypass | Subi mjy rapido al rango aparte fvbri es buen soporte",
  },
  {
    username: "Gersonorellana0220",
    date: "14 de Marzo, 2026",
    message:
      "Producto: Panel Full Semanal | tiene de todo y lo mejor es que fue rapida la atenciom",
  },
  {
    username: "xKairos",
    date: "14 de Marzo, 2026",
    message:
      "Producto: Panel Full Anual | +rep panel full insano, nada de ban 🔥",
  },
  {
    username: "Theninoig",
    date: "14 de Marzo, 2026",
    message:
      "Producto: Aimbot de Valorant | sin ban hace 3 meses y subi a diamante ya.",
  },
  {
    username: "Diego",
    date: "14 de Marzo, 2026",
    message:
      "Producto: Aimbot de Valorant | +rep aimbot color indetectable 🚀 mejor del mercado",
  },
  {
    username: "NovaStar",
    date: "14 de Marzo, 2026",
    message:
      "Producto: Panel Blood | soporte rapidísimo, resolvieron mi problema en 5 min",
  },
  {
    username: "Jxzxn",
    date: "14 de Marzo, 2026",
    message:
      "Producto: Menu Chams | ahora se ven todos los jugadores hasta con su HP y distancia jajsja 💯",
  },
];

export const footerData = {
  brand: "HyperV",
  year: 2026,
  legalText:
    "Los nombres de productos, logotipos, imágenes y marcas comerciales mencionados o utilizados en este sitio son propiedad de sus respectivos dueños. No estamos afiliados, asociados ni respaldados por ninguna de estas empresas, a menos que se indique específicamente. Todos los derechos de autor, marcas comerciales y marcas de servicio pertenecen a sus respectivos propietarios.",
  termsLabel: "Términos de Servicio",
  termsHref: "/terms",
  paymentMethods: [
    { name: "PayPal" },
    { name: "Western Union" },
    { name: "Binance" },
    { name: "Tether" },
  ],
};

export const affiliateData = {
  badge: "Affiliate Program",
  heading: "Make Money With Every Sale",
  commission: "20% Commission",
  subtext:
    "Promote ALL our products and earn 20% on every sale. Exclusive program for content creators.",
  cta: "Become An Affiliate",
  ctaFinal: "Become An Affiliate Now",
  discordUrl: "https://discord.com/invite/hypervgg",
  stats: [
    {
      label: "Commission Earned",
      value: "$2,845",
      sub: "+32% this month",
      subColor: "text-green-400",
    },
    {
      label: "Sales Made",
      value: "47",
      sub: "total sales",
      subColor: "text-white/30",
    },
    {
      label: "Conversion Rate",
      value: "8.2%",
      sub: "average",
      subColor: "text-white/30",
    },
  ],
  steps: [
    {
      n: "01",
      title: "Sign Up",
      desc: "Create your affiliate account in less than 10 seconds. 100% free.",
    },
    {
      n: "02",
      title: "Get Your Link",
      desc: "Get your unique link that tracks all your sales automatically.",
    },
    {
      n: "03",
      title: "Promote",
      desc: "Share your link on social media, videos, streams or wherever you prefer.",
    },
    {
      n: "04",
      title: "Track",
      desc: "Monitor clicks, conversions and earnings in real-time on your dashboard.",
    },
    {
      n: "05",
      title: "Get Paid",
      desc: "Receive your payments via cryptocurrency quickly and securely.",
    },
  ],
  benefits: [
    {
      title: "20% Commission",
      desc: "Earn 20% on every sale of ANY product. No earning limits.",
    },
    {
      title: "Fast Payments",
      desc: "Payments in less than 12h via Pix or cryptocurrency.",
    },
    {
      title: "24/7 Support",
      desc: "Dedicated team to help you maximize your sales.",
    },
  ],
  faqs: [
    {
      q: "How does the 20% commission work?",
      a: "You earn 20% of every sale made through your unique affiliate link. There is no cap — the more you promote, the more you earn.",
    },
    {
      q: "How and when do I get paid?",
      a: "Payments are processed within 12 hours via cryptocurrency or Pix. You can request a withdrawal at any time once you reach the minimum threshold.",
    },
    {
      q: "Do I need previous experience?",
      a: "No experience needed. Sign up, get your link, and start sharing. Our dashboard tracks everything automatically.",
    },
    {
      q: "What products can I promote?",
      a: "You can promote ALL of our products — Free Fire, Valorant, CS2, COD, Bloodstrike, Discord tools and more.",
    },
    {
      q: "Is there any cost to participate?",
      a: "100% free. There are no fees, no subscriptions and no hidden costs to join our affiliate program.",
    },
  ],
  howItWorksTitle: "How It Works",
  howItWorksSub: "5 simple steps to start earning",
  whyTitle: "Why Promote Our Products?",
  whySub:
    "Premium products with high conversion and the best benefits for affiliates",
  faqTitle: "Frequently Asked Questions",
  ctaTitle: "Ready to Get Started?",
  ctaSub: "Sign up now and start earning 20% on every sale",
};
