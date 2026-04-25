import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import soldicImg from "@/assets/soldic.png";

const stats = [
  { value: "21", label: "Pobjeda" },
  { value: "4", label: "Poraza" },
  { value: "2×", label: "KSW prvak" },
  { value: "14", label: "KO / TKO" },
];

const Soldic = () => (
  <section id="soldic" className="relative bg-background py-20 md:py-28">
    <div className="container-x grid gap-10 lg:grid-cols-12 lg:gap-14">
      {/* Image */}
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="relative lg:col-span-6"
      >
        <div className="relative overflow-hidden">
          <img
            src={soldicImg}
            alt="Roberto 'Robocop' Soldić — trening u ringu"
            className="h-full w-full object-cover"
            loading="lazy"
          />
          <div className="absolute left-5 top-5">
            <span className="inline-flex items-center bg-primary/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground">
              Suvlasnik · Trener
            </span>
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="flex flex-col justify-center lg:col-span-6"
      >
        <div className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          01 — Lice kluba
        </div>

        <h2 className="font-display text-6xl leading-[0.9] text-foreground sm:text-7xl md:text-8xl">
          Robert <span className="text-gradient-red">"Robocop"</span>
          <br />
          Soldić
        </h2>

        <p className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg">
          Aktivni <span className="font-semibold text-foreground">ONE Championship</span> borac,
          dvostruki <span className="font-semibold text-foreground">KSW prvak</span>, rekord 21 — 4 — 1 NC.
          Rođen u Vitezu, trenira iz Viteza. Kad nije u Kataru ili Manili, ovdje je na strunjači
          — s profesionalcima i s djecom jednako.
        </p>

        {/* Stat strip */}
        <div className="mt-10 grid grid-cols-4 gap-px overflow-hidden border border-border bg-border">
          {stats.map((s) => (
            <div key={s.label} className="bg-background px-3 py-5 text-left">
              <div className="font-display tabular text-3xl text-foreground sm:text-4xl">
                {s.value}
              </div>
              <div className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <Button asChild variant="fight" size="lg">
            <a href="#kontakt">
              Treninzi sa Soldićem
              <ArrowRight className="ml-1 h-4 w-4" />
            </a>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default Soldic;
