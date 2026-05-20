"use client";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const WhatsAppIcon = ({ className = "w-4 h-4" }) => (
    <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        className={className}
    >
        <path d="M13.601 2.326A7.854 7.854 0 0 0 8.002 0C3.584 0 0 3.582 0 8c0 1.414.37 2.794 1.073 4.01L0 16l4.092-1.05A7.963 7.963 0 0 0 8.002 16C12.42 16 16 12.418 16 8a7.948 7.948 0 0 0-2.399-5.674ZM8.002 14.64a6.62 6.62 0 0 1-3.372-.922l-.242-.144-2.428.623.648-2.368-.158-.245A6.61 6.61 0 0 1 1.36 8a6.642 6.642 0 0 1 11.339-4.697A6.594 6.594 0 0 1 14.64 8a6.64 6.64 0 0 1-6.638 6.64Zm3.64-4.98c-.2-.1-1.182-.583-1.365-.649-.183-.067-.316-.1-.45.1-.133.2-.516.648-.632.782-.116.133-.233.15-.433.05-.2-.1-.844-.311-1.608-.992-.594-.53-.995-1.185-1.112-1.385-.116-.2-.012-.308.088-.408.09-.09.2-.233.3-.35.1-.116.133-.2.2-.333.066-.133.033-.25-.017-.35-.05-.1-.45-1.082-.616-1.482-.162-.39-.327-.337-.45-.343l-.383-.007a.733.733 0 0 0-.533.25c-.183.2-.7.683-.7 1.666 0 .982.716 1.932.816 2.065.1.133 1.41 2.153 3.416 3.018.477.206.85.329 1.14.421.479.152.915.131 1.26.08.384-.057 1.182-.483 1.349-.95.166-.466.166-.866.116-.949-.05-.083-.183-.133-.383-.233Z" />
    </svg>
);

const DiscordIcon = ({ className = "w-4 h-4" }) => (
    <svg
        viewBox="0 0 16 16"
        fill="currentColor"
        aria-hidden="true"
        className={className}
    >
        <path d="M13.545 2.907A13.227 13.227 0 0 0 10.227 2a.05.05 0 0 0-.053.025c-.144.25-.305.577-.417.837a12.19 12.19 0 0 0-3.514 0 8.258 8.258 0 0 0-.423-.837A.051.051 0 0 0 5.768 2c-1.153.197-2.265.504-3.318.907a.041.041 0 0 0-.019.014C.533 5.734-.32 8.478.099 11.189a.06.06 0 0 0 .022.038 13.34 13.34 0 0 0 4.085 2.067.05.05 0 0 0 .056-.019c.315-.43.593-.885.832-1.367a.05.05 0 0 0-.028-.07 8.782 8.782 0 0 1-1.248-.595.05.05 0 0 1-.005-.084c.084-.063.168-.129.248-.195a.05.05 0 0 1 .052-.007c2.619 1.196 5.454 1.196 8.042 0a.05.05 0 0 1 .053.006c.08.066.164.132.248.195a.05.05 0 0 1-.004.084 8.44 8.44 0 0 1-1.249.595.05.05 0 0 0-.027.07c.244.48.522.936.832 1.367a.05.05 0 0 0 .056.019 13.296 13.296 0 0 0 4.086-2.067.05.05 0 0 0 .021-.037c.5-3.137-.838-5.857-2.332-8.267a.04.04 0 0 0-.02-.015ZM5.67 9.813c-.79 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.808 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Zm4.656 0c-.79 0-1.438-.724-1.438-1.612 0-.889.637-1.613 1.438-1.613.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612Z" />
    </svg>
);

const sellers = [
    {
        id: 1,
        name: "HyperV",
        roleKey: "WhatsApp Oficial",
        image: "/hyperv.png",
        whatsapp: "https://wa.me/51938431125",
        discordProfile: "https://discord.gg/k3AgjMPGHB",
        discordApp: "https://discord.gg/k3AgjMPGHB65014",
        featured: true,
    },
    {
        id: 2,
        name: "Tanato",
        roleKey: "Owner",
        image: "/tanato.png",
        whatsapp: "https://wa.me/51938431125",
        discordProfile: "https://discord.com/users/1117934669002965014",
        discordApp: "discord://-/users/1117934669002965014",
        discordUsername: "@tanatoboss",
        featured: false,
    },
    {
        id: 3,
        name: "Strix",
        roleKey: "Web Developer",
        image: "/strix.jpg",
        whatsapp: "https://wa.me/51987898909",
        discordProfile: "https://discord.com/users/1288338421772849275",
        discordApp: "discord://-/users/1288338421772849275",
        discordUsername: "@strixboss",
        featured: false,
    },
    {
        id: 4,
        name: "fvbriix",
        roleKey: "Seller",
        image: "/fvbrix.jpeg",
        whatsapp: "https://wa.me/51907376433",
        discordProfile: "https://discord.com/users/749738427150499930",
        discordApp: "discord://-/users/749738427150499930",
        discordUsername: "@fvbriix",
        featured: false,
    },
    {
        id: 5,
        name: "mattyzn",
        roleKey: "Seller",
        image: "/mattyzn.jpeg",
        whatsapp: "https://wa.me/51935626515",
        discordProfile: "https://discord.com/users/1260582155709583433",
        discordApp: "discord://-/users/1260582155709583433",
        discordUsername: "@mattizynn",
        featured: false,
    },
    {
        id: 6,
        name: "josuex_17",
        roleKey: "Seller",
        image: "/josuex.jpeg",
        whatsapp: "https://wa.me/51901249348",
        discordProfile: "https://discord.com/users/919384973717418054",
        discordApp: "discord://-/users/919384973717418054",
        discordUsername: "@josuex_16",
        featured: false,
    },
    {
        id: 7,
        name: "Em444",
        roleKey: "Seller",
        image: "/ema.jpeg",
        whatsapp: "https://wa.me/51943515472",
        discordProfile: "https://discord.com/users/646194799036203028",
        discordApp: "discord://-/users/646194799036203028",
        discordUsername: "@xem444x",
        featured: false,
    },
    {
        id: 8,
        name: "Mya",
        roleKey: "Seller",
        image: "/mya.jpeg",
        whatsapp: "https://wa.me/51924063213",
        discordProfile: "https://discord.com/users/1503584377588809749",
        discordApp: "discord://-/users/1503584377588809749",
        discordUsername: "@myayat",
        featured: false,
    },
];

const HyperVendedores = () => {
    const { t, locale } = useLanguage();

    const getText = (key, fallback = "") => {
        const value = t?.[key];
        return typeof value === "string" && value.trim() ? value : fallback;
    };

    return (
        <section className="py-16 mt-10 px-4 md:px-12 lg:px-24">
            <div className="text-center mb-10">
                <p className="text-sm text-white/50 uppercase tracking-widest mb-1">
                    {getText("staffBadge", "Nuestro Staff")}
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {getText("staffHeading", "Equipo de Vendedores")}
                </h2>
                <p className="text-white/40 text-sm mt-2">
                    {getText(
                        "staffSubtitle",
                        "Contacta con los representantes oficiales de HyperV"
                    )}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {sellers.map((seller, index) => (
                    <article
                        key={seller.id}
                        className={[
                            "relative rounded-xl flex flex-col transition-all duration-300 group bg-[#07080b] hover:-translate-y-1 overflow-hidden",
                            index === sellers.length - 1 ? "xl:col-start-2" : "",
                            seller.featured
                                ? "border border-[#fbbf24]/50 shadow-[0_0_8px_rgba(251,191,36,0.08)] hover:shadow-[0_0_20px_rgba(251,191,36,0.30)] hover:border-yellow-300"
                                : "border border-cyan-500/20 shadow-[0_0_8px_rgba(34,211,238,0.06)] hover:shadow-[0_0_20px_rgba(34,211,238,0.22)] hover:border-cyan-400/60",
                        ].join(" ")}
                    >
                        {seller.featured && (
                            <div className="absolute top-3 right-3 z-10 bg-yellow-400 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                                {getText("staffCompany", "EMPRESA")}
                            </div>
                        )}

                        <div className="relative h-52 overflow-hidden">
                            <img
                                src={seller.image}
                                alt={seller.name}
                                className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#07080b] via-[#07080b]/30 to-transparent" />

                            <div className="absolute top-3 left-3">
                                <span className="flex items-center gap-1 bg-green-500/20 border border-green-500/40 text-green-400 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                                    {getText("staffOnline", "ONLINE")}
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 p-4 gap-4">
                            <div className="text-center">
                                <h3
                                    className={[
                                        "font-extrabold text-lg uppercase tracking-wide transition-colors duration-300",
                                        seller.featured
                                            ? "text-white group-hover:text-yellow-300"
                                            : "text-white group-hover:text-cyan-400",
                                    ].join(" ")}
                                >
                                    {seller.name}
                                </h3>

                                <p className="text-white/40 text-[11px] uppercase tracking-[0.25em] mt-2">
                                    {getText(seller.roleKey, seller.roleKey)}
                                </p>

                                {seller.discordUsername && (
                                    <p className="text-white/35 text-[11px] mt-2">
                                        {seller.discordUsername}
                                    </p>
                                )}
                            </div>

                            <div className="flex flex-col gap-3 mt-auto pt-3 border-t border-white/5">
                                <a
                                    href={seller.whatsapp}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={[
                                        "flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-xs font-bold transition-all duration-200 hover:scale-[1.02] active:scale-95",
                                        seller.featured
                                            ? "bg-yellow-400 hover:bg-yellow-300 text-black"
                                            : "bg-cyan-500 hover:bg-cyan-400 text-black",
                                    ].join(" ")}
                                >
                                    <WhatsAppIcon className="w-4 h-4" />
                                    {getText("staffWhatsapp", "WhatsApp")}
                                </a>

                                <a
                                    href={seller.discordProfile}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/75 text-xs font-bold hover:border-cyan-500/40 hover:text-white transition-all duration-200"
                                >
                                    <DiscordIcon className="w-4 h-4" />
                                    {getText("staffViewProfile", "Ver perfil")}
                                </a>

                                <a
                                    href={seller.discordApp}
                                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/60 text-xs font-bold hover:border-yellow-400/40 hover:text-white transition-all duration-200"
                                >
                                    <DiscordIcon className="w-4 h-4" />
                                    {getText("staffOpenDiscord", "Abrir en Discord")}
                                </a>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default HyperVendedores;