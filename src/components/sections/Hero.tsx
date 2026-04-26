import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import heroImage from "@/assets/hero-team.webp";
import logo from "@/assets/rrc-logo.webp";
import VideoModal from "@/components/VideoModal";

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const [videoOpen, setVideoOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="pocetna" className="relative min-h-screen w-full overflow-hidden bg-grain">
      {/* Background image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="RRC Gym tim - svi članovi kluba zajedno u dvorani"
          className="h-full w-full object-cover object-center"
          loading="eager"
          fetchPriority="high"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial-red" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="container-x relative z-10 flex min-h-screen flex-col items-center justify-center pb-20 pt-24 text-center"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-5 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary sm:text-xs"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse-red rounded-full bg-primary" />
          Vitez · Bosna i Hercegovina
        </motion.div>

        {/* Logo as hero title */}
        <motion.img
          src={logo}
          alt="RRC Gym"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mx-auto w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] lg:max-w-[460px] drop-shadow-[0_8px_40px_rgba(0,0,0,0.6)]"
          style={{ filter: "invert(1) brightness(1.1)" }}
        />
        <h1 className="sr-only">RRC Gym</h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-5 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/90 sm:text-sm md:text-base"
        >
          MMA · BJJ · Kickboxing · Boks
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row"
        >
          <Button asChild variant="fight" size="lg">
            <Link to="/prijava">
              Prijavi se na trening
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outlineFight" size="lg" onClick={() => setVideoOpen(true)}>
            <Play className="mr-1 h-4 w-4" />
            Pogledaj dvoranu
          </Button>
        </motion.div>
      </motion.div>

      <VideoModal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        src="/videos/dvorana.mp4"
        poster="/videos/dvorana-poster.jpg"
        title="Iza vrata RRC Gyma"
      />

      {/* Scroll indicator */}
      <motion.a
        href="#brojke"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-muted-foreground"
        aria-label="Pomakni se prema dolje"
      >
        <ChevronDown className="h-6 w-6 animate-bounce" />
      </motion.a>
    </section>
  );
};

export default Hero;
