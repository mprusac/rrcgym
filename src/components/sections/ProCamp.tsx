import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";

const guests = [
  "Aleksandar Rakić",
  "Gegard Mousasi",
  "Ante Delija",
  "Ivan Erslan",
  "Jure Jurić",
  'Francisco „Croata" Barrio',
];
const orgs = ["UFC", "ONE Championship", "KSW", "FNC"];

const ProCamp = () => (
  <section id="kampovi" className="relative overflow-hidden bg-background py-24 md:py-32">
    <div className="absolute inset-0 -z-10 opacity-40">
      <img
        src="https://images.unsplash.com/photo-1614633836764-b14abb29ed83?w=1600&q=80"
        alt=""
        aria-hidden
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
    </div>

    <div className="container-x grid gap-12 lg:grid-cols-2 lg:gap-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading eyebrow="Pro kamp" title="Destinacija za profesionalce" />
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          RRC Gym redovito ugošćuje vrhunske borce regije i Europe za pripremne kampove. Naša
          dvorana, oprema i smještaj omogućuju cjelovitu pripremu za međunarodne mečeve — od
          UFC-a do ONE Championshipa i KSW-a.
        </p>

        <div className="mt-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-primary">Gostovali kod nas</div>
          <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {guests.map((g) => (
              <li key={g} className="flex items-center gap-3 border-l-2 border-primary/60 pl-3 font-display text-xl text-foreground">
                {g}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-10">
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Organizacije u kojima nastupaju</div>
          <div className="mt-4 flex flex-wrap gap-3">
            {orgs.map((o) => (
              <span key={o} className="border border-border bg-surface px-4 py-2 font-display text-lg tracking-wider text-foreground">
                {o}
              </span>
            ))}
          </div>
        </div>

        <Button asChild variant="fight" size="xl" className="mt-10">
          <a href="#kontakt">
            Kontaktiraj za kamp rezervaciju
            <ArrowRight className="ml-1 h-5 w-5" />
          </a>
        </Button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative hidden lg:block"
      >
        <div className="relative aspect-[3/4] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1517649763962-0c623066013b?w=900&q=80"
            alt="Profesionalni borac u kampu"
            className="h-full w-full object-cover grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        </div>
        <div className="absolute -left-4 -top-4 h-24 w-24 border-l-4 border-t-4 border-primary" aria-hidden />
      </motion.div>
    </div>
  </section>
);

export default ProCamp;
