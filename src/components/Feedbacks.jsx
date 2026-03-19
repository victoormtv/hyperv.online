"use client";
import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

const DiscordIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#5865F2]">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057c.002.022.015.043.032.054a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z"/>
  </svg>
);

const getInitials = (name) => name.slice(0, 2).toUpperCase();

const getAvatarColor = (name) => {
  const colors = ["#5865F2", "#57F287", "#FEE75C", "#EB459E", "#ED4245", "#00b0f4"];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const ReviewCard = ({ review }) => (
  <div className="flex-shrink-0 w-[320px] mx-3 bg-[#111216] border border-white/8 rounded-2xl p-5 flex flex-col gap-3 select-none">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: getAvatarColor(review.username) }}
        >
          {getInitials(review.username)}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-white font-semibold text-sm">{review.username}</span>
            <DiscordIcon />
          </div>
          <p className="text-white/35 text-[11px]">{review.date}</p>
        </div>
      </div>
      <svg width="24" height="18" viewBox="0 0 24 18" fill="none" className="text-white/10">
        <path d="M0 18V11.4C0 8.26667 0.633333 5.66667 1.9 3.6C3.16667 1.53333 5.16667 0.133333 7.9 0L8.5 1.8C6.9 2.2 5.66667 3.03333 4.8 4.3C3.93333 5.56667 3.53333 7 3.6 8.6H7.2V18H0ZM13.2 18V11.4C13.2 8.26667 13.8333 5.66667 15.1 3.6C16.3667 1.53333 18.3667 0.133333 21.1 0L21.7 1.8C20.1 2.2 18.8667 3.03333 18 4.3C17.1333 5.56667 16.7333 7 16.8 8.6H20.4V18H13.2Z" fill="currentColor"/>
      </svg>
    </div>
    <p className="text-white/70 text-sm leading-relaxed">{review.message}</p>
    {review.image && (
      <div className="rounded-lg overflow-hidden mt-1">
        <img src={review.image} alt="review attachment" className="w-full max-h-40 object-cover" />
      </div>
    )}
  </div>
);

const Feedbacks = () => {
  const { t } = useLanguage();
  const reviews = t.communityReviews;

  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const positionRef = useRef(0);
  const isPausedRef = useRef(false);
  const [showArrows, setShowArrows] = useState(false);

  const doubled = [...reviews, ...reviews];
  const SPEED = 0.5;
  const CARD_W = 320 + 24;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const totalWidth = reviews.length * CARD_W;
    const animate = () => {
      if (!isPausedRef.current) {
        positionRef.current += SPEED;
        if (positionRef.current >= totalWidth) positionRef.current = 0;
        track.style.transform = `translateX(-${positionRef.current}px)`;
      }
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, []);

  const handlePrev = () => {
    positionRef.current = Math.max(0, positionRef.current - CARD_W);
    trackRef.current.style.transform = `translateX(-${positionRef.current}px)`;
  };

  const handleNext = () => {
    positionRef.current = (positionRef.current + CARD_W) % (reviews.length * CARD_W);
    trackRef.current.style.transform = `translateX(-${positionRef.current}px)`;
  };

  return (
    <section className="py-20 mt-10">
      <div className="text-center mb-12 px-4">
        <div className="inline-flex items-center gap-2 bg-[#5865F2]/15 border border-[#5865F2]/30 text-[#5865F2] text-xs font-semibold px-4 py-1.5 rounded-full mb-5">
          <DiscordIcon /> {t.feedbacksBadge}
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white">{t.feedbacksHeading}</h2>
        <p className="text-white/40 text-sm mt-2">{t.feedbacksSubtitle}</p>
      </div>

      <div
        ref={containerRef}
        className="relative overflow-hidden"
        onMouseEnter={() => { isPausedRef.current = true; setShowArrows(true); }}
        onMouseLeave={() => { isPausedRef.current = false; setShowArrows(false); }}
      >
        {/* fades usando transparent en vez de from-black */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-transparent/0 to-transparent z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, rgba(3,4,5,0.95), transparent)" }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, rgba(3,4,5,0.95), transparent)" }}
        />

        <button
          onClick={handlePrev}
          className={`absolute left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-transparent border border-white/10 text-white/30 flex items-center justify-center hover:text-white/60 hover:border-white/25 hover:scale-110 transition-all duration-300 [&>svg]:stroke-[1.5] ${showArrows ? "opacity-100" : "opacity-0"}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <button
          onClick={handleNext}
          className={`absolute right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-transparent border border-white/10 text-white/30 flex items-center justify-center hover:text-white/60 hover:border-white/25 hover:scale-110 transition-all duration-300 [&>svg]:stroke-[1.5] ${showArrows ? "opacity-100" : "opacity-0"}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <div
          ref={trackRef}
          className="flex py-4"
          style={{ width: "max-content", willChange: "transform" }}
        >
          {doubled.map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feedbacks;
