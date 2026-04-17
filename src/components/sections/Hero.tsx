import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ChevronDown, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";

const Hero = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} id="pocetna" className="relative min-h-screen w-full overflow-hidden bg-grain">
      {/* Background image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0 -z-10">
        <img
          src="https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=1920&q=80"
          alt="MMA borac u kavezu, dramatično osvjetljenje"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute inset-0 bg-gradient-radial-red" />
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="container-x relative z-10 flex min-h-screen flex-col justify-center pb-24 pt-32"
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex w-fit items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary"
        >
          <span className="inline-block h-1.5 w-1.5 animate-pulse-red rounded-full bg-primary" />
          Vitez · Bosna i Hercegovina
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="font-display text-5xl leading-[0.95] sm:text-7xl md:text-8xl lg:text-9xl"
        >
          Borilački centar<br />
          <span className="text-gradient-red">svjetske klase</span><br />
          u srcu Bosne
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25 }}
          className="mt-8 max-w-2xl text-lg text-muted-foreground sm:text-xl"
        >
          MMA · BJJ · Kickboxing · Boks — pod vodstvom{" "}
          <span className="font-semibold text-foreground">Roberta Soldića</span> i vrhunskih
          gostujućih trenera.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Button asChild variant="fight" size="xl">
            <a href="#kontakt">
              Prijavi se na trening
              <ArrowRight className="ml-1 h-5 w-5" />
            </a>
          </Button>
          <Button asChild variant="outlineFight" size="xl">
            <a href="#dvorana">
              <Play className="mr-1 h-4 w-4" />
              Pogledaj dvoranu
            </a>
          </Button>
        </motion.div>
      </motion.div>

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
