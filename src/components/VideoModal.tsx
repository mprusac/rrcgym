import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, VolumeX } from "lucide-react";
import { useState } from "react";

interface VideoModalProps {
  open: boolean;
  onClose: () => void;
  src: string;
  poster?: string;
  title?: string;
  subtitle?: string;
}

const VideoModal = ({ open, onClose, src, poster, title, subtitle }: VideoModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  // ESC + scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  // Autoplay when opened, pause when closed
  useEffect(() => {
    if (open && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [open]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title ?? "Video"}
        >
          {/* Backdrop with red glow */}
          <motion.div
            className="absolute inset-0 bg-background/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{
              background:
                "radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.18) 0%, transparent 55%)",
            }}
          />
          {/* Grain */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay bg-grain"
          />
          {/* Top crosshair lines */}
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute left-0 right-0 top-[8%] h-px origin-left bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />
          <motion.div
            aria-hidden
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="pointer-events-none absolute left-0 right-0 bottom-[8%] h-px origin-right bg-gradient-to-r from-transparent via-primary/60 to-transparent"
          />

          {/* Stage */}
          <motion.div
            className="relative z-10 mx-auto flex max-h-[90vh] w-full max-w-[420px] flex-col items-center px-4 sm:max-w-[460px]"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Video frame with red border glow */}
            <motion.div
              className="relative w-full overflow-hidden rounded-2xl border border-primary/40 bg-black shadow-[0_0_60px_-10px_hsl(var(--primary)/0.6),0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              initial={{ clipPath: "inset(50% 0 50% 0)" }}
              animate={{ clipPath: "inset(0% 0 0% 0)" }}
              transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1], delay: 0.1 }}
            >
              {/* Corner brackets */}
              <CornerBracket className="left-2 top-2" />
              <CornerBracket className="right-2 top-2 rotate-90" />
              <CornerBracket className="left-2 bottom-2 -rotate-90" />
              <CornerBracket className="right-2 bottom-2 rotate-180" />

              <video
                ref={videoRef}
                src={src}
                poster={poster}
                playsInline
                autoPlay
                loop
                muted={muted}
                className="block aspect-[758/1292] w-full object-cover"
              />

              {/* Vignette */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.55) 100%)",
                }}
              />

              {/* Title overlay bottom */}
              {(title || subtitle) && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55, duration: 0.5 }}
                  className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-5 pt-16"
                >
                  {subtitle && (
                    <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                      {subtitle}
                    </div>
                  )}
                  {title && (
                    <h3 className="font-display text-2xl leading-tight text-foreground sm:text-3xl">
                      {title}
                    </h3>
                  )}
                </motion.div>
              )}

              {/* Mute toggle */}
              <button
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Uključi zvuk" : "Isključi zvuk"}
                className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white backdrop-blur-sm transition hover:border-primary hover:bg-primary hover:text-primary-foreground"
              >
                {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </button>
            </motion.div>

            {/* Footer caption */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-4 text-center text-xs uppercase tracking-[0.3em] text-muted-foreground"
            >
              RRC Gym · Vitez
            </motion.p>
          </motion.div>

          {/* Close button */}
          <motion.button
            onClick={onClose}
            aria-label="Zatvori"
            initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
            className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-red transition hover:border-primary hover:bg-primary hover:text-primary-foreground sm:right-6 sm:top-6"
          >
            <X className="h-5 w-5" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

const CornerBracket = ({ className = "" }: { className?: string }) => (
  <div
    aria-hidden
    className={`pointer-events-none absolute z-[5] h-5 w-5 border-l-2 border-t-2 border-primary ${className}`}
  />
);

export default VideoModal;
