"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Clock, RefreshCw } from "lucide-react";

/** Calcula el próximo domingo a las 00:00:00 */
function getNextWeeklyReset() {
  const now = new Date();
  const copy = new Date(now);
  const daysUntilSunday = ((7 - now.getDay()) % 7) || 7;
  copy.setDate(now.getDate() + daysUntilSunday);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function calcTimeLeft(target) {
  const diff = +target - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1_000),
  };
}

const pad = (n) => String(n).padStart(2, "0");

/**
 * CountdownTimer
 * @param {Date|string|null} targetDate  – si es null se calcula el próximo domingo
 * @param {string}           resetLabel – texto bajo el timer  (default: "Disponible gratuitamente hasta el próximo reset")
 */
export default function CountdownTimer({
  targetDate = null,
  resetLabel = "Disponible gratuitamente · Se renueva cada semana",
}) {
  const target = useMemo(
    () => (targetDate ? new Date(targetDate) : getNextWeeklyReset()),
    [targetDate]
  );

  const [timeLeft, setTimeLeft] = useState(() => calcTimeLeft(target));
  const [mounted, setMounted]   = useState(false);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setTimeLeft(calcTimeLeft(target)), 1_000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { v: timeLeft.days,    l: "días"     },
    { v: timeLeft.hours,   l: "horas"    },
    { v: timeLeft.minutes, l: "minutos"  },
    { v: timeLeft.seconds, l: "segundos" },
  ];

  return (
    <div className="flex flex-col items-center gap-3 py-5 px-6 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 backdrop-blur-sm">
      {/* label superior */}
      <div className="flex items-center gap-1.5 text-yellow-400/70 text-[10px] font-bold uppercase tracking-widest">
        <Clock size={11} />
        Tiempo restante para el reset
      </div>

      {/* dígitos */}
      <div className="flex items-center gap-2 sm:gap-3">
        {units.map(({ v, l }, i) => (
          <React.Fragment key={l}>
            {/* bloque */}
            <div className="flex flex-col items-center gap-1">
              <div
                className="relative w-14 sm:w-16 h-14 sm:h-16 rounded-xl flex items-center justify-center overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,rgba(251,191,36,0.12),rgba(251,191,36,0.05))",
                  border: "1px solid rgba(251,191,36,0.25)",
                  boxShadow: "0 0 16px rgba(251,191,36,0.08) inset",
                }}
              >
                {/* shimmer line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px"
                  style={{ background: "rgba(251,191,36,0.35)" }}
                />
                <span
                  className="text-2xl sm:text-3xl font-extrabold tabular-nums"
                  style={{ color: "#fbbf24", textShadow: "0 0 12px rgba(251,191,36,0.5)" }}
                >
                  {mounted ? pad(v) : "--"}
                </span>
              </div>
              <span className="text-white/30 text-[9px] uppercase tracking-widest">{l}</span>
            </div>

            {/* separador ":" */}
            {i < units.length - 1 && (
              <span
                className="text-2xl font-extrabold pb-5"
                style={{ color: "rgba(251,191,36,0.4)" }}
              >
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* label inferior */}
      <div className="flex items-center gap-1.5 text-white/30 text-[10px]">
        <RefreshCw size={10} />
        {resetLabel}
      </div>
    </div>
  );
}
