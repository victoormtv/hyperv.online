"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import {
    Users,
    TrendingUp,
    Shield,
    CreditCard,
    Zap,
    DollarSign,
} from "lucide-react";

const CredibilityBand = () => {
    const { t } = useLanguage();

    const getText = (key, fallback = "") => {
        const value = t?.[key];
        return typeof value === "string" && value.trim() ? value : fallback;
    };

    const items = [
        {
            icon: Shield,
            title: getText("credibilityItem1Title", "Seguridad confiable"),
            desc: getText(
                "credibilityItem1Desc",
                "Pagos protegidos y acceso entregado con seriedad."
            ),
        },
        {
            icon: Zap,
            title: getText("credibilityItem2Title", "Entrega rápida"),
            desc: getText(
                "credibilityItem2Desc",
                "Procesos ágiles para que empieces sin esperar de más."
            ),
        },
        {
            icon: Users,
            title: getText("credibilityItem3Title", "Soporte activo"),
            desc: getText(
                "credibilityItem3Desc",
                "Atención constante por los canales principales de HyperV."
            ),
        },
        {
            icon: CreditCard,
            title: getText("credibilityItem4Title", "Compra sencilla"),
            desc: getText(
                "credibilityItem4Desc",
                "Experiencia clara, directa y sin fricción innecesaria."
            ),
        },
    ];

    const bottomItems = [
        {
            label: getText("credibilityBottom1", "Pagos seguros"),
            icon: DollarSign,
        },
        {
            label: getText("credibilityBottom2", "Soporte 24/7"),
            icon: Users,
        },
        {
            label: getText("credibilityBottom3", "Entrega inmediata"),
            icon: Zap,
        },
        {
            label: getText("credibilityBottom4", "Actualizaciones constantes"),
            icon: TrendingUp,
        },
    ];

    return (
        <section className="relative w-full py-12 md:py-16">
            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03] backdrop-blur-sm">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(6,182,212,0.14),transparent_38%)] pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-cyan-500/5 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />

                <div className="relative px-5 py-8 sm:px-7 md:px-10 md:py-10">
                    <div className="flex flex-col gap-8 xl:flex-row xl:items-center xl:justify-between">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-yellow-300/90">
                                <Zap className="h-3.5 w-3.5" />
                                {getText("credibilityBadge", "HyperV Standard")}
                            </div>

                            <h2 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl md:text-4xl">
                                {getText("credibilityHeadingLine1", "Compra con más confianza,")}
                                <span className="block text-cyan-400">
                                    {getText("credibilityHeadingLine2", "entra con más tranquilidad.")}
                                </span>
                            </h2>

                            <p className="mt-4 max-w-xl text-sm leading-7 text-white/65 sm:text-base">
                                {getText(
                                    "credibilitySubtitle",
                                    "HyperV combina rapidez, soporte y una experiencia más limpia para que cada compra se sienta seria, estable y bien cuidada."
                                )}
                            </p>
                        </div>

                        <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 xl:max-w-3xl">
                            {items.map((item, index) => {
                                const Icon = item.icon;

                                return (
                                    <article
                                        key={index}
                                        className="group rounded-2xl border border-white/10 bg-black/20 px-4 py-4 transition-all duration-300 hover:border-cyan-400/30 hover:bg-cyan-400/[0.04]"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="mt-0.5 rounded-xl border border-cyan-400/20 bg-cyan-400/10 p-2 text-cyan-300 transition-all duration-300 group-hover:border-cyan-300/40 group-hover:text-cyan-200">
                                                <Icon className="h-4 w-4" />
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-semibold text-white sm:text-[15px]">
                                                    {item.title}
                                                </h3>
                                                <p className="mt-1 text-sm leading-6 text-white/80">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-3 border-t border-white/10 pt-6 md:grid-cols-4">
                        {bottomItems.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-center gap-2 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-center text-xs font-medium text-white/85 sm:text-sm"
                                >
                                    <Icon className="h-4 w-4 text-cyan-400" />
                                    <span>{item.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CredibilityBand;