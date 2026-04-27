import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

export const PLANS = [
  {
    name: "Godišnja članarina",
    price: "100 KM",
    period: "/ mjesečno",
    perks: ["Ugovor na 12 mjeseci", "Sve discipline", "Najpovoljnija opcija"],
  },
  {
    name: "Polugodišnja članarina",
    price: "120 KM",
    period: "/ mjesečno",
    perks: ["Ugovor na 6 mjeseci", "Sve discipline", "100 KM za djecu 8–14 god."],
  },
  {
    name: "Mladi - godišnja",
    price: "80 KM",
    period: "/ mjesečno",
    perks: ["Mladi do 18 godina", "Ugovor na 12 mjeseci", "Sve discipline"],
  },
  {
    name: "Mladi - polugodišnja",
    price: "100 KM",
    period: "/ mjesečno",
    perks: ["Mladi do 18 godina", "Ugovor na 6 mjeseci", "Sve discipline"],
  },
  {
    name: "Tromjesečna članarina",
    price: "150 KM",
    period: "/ mjesečno",
    perks: ["Ugovor na 3 mjeseca", "Sve discipline", "Kraći angažman"],
  },
  {
    name: "Bez obveze",
    price: "200 KM",
    period: "/ mjesečno",
    featured: true,
    perks: ["Bez obvezivanja na duži period", "Sve discipline", "Maksimalna fleksibilnost"],
  },
  {
    name: "Boxing za žene",
    price: "60 KM",
    period: "/ mjesečno",
    perks: ["Bez obvezivanja", "Samo boxing", "Posebno za žene"],
  },
];

const Membership = () => (
  <section id="clanarine" className="relative bg-background py-24 md:py-32">
    <div className="container-x">
      <SectionHeading
        eyebrow="Članarine"
        title="Paketi za svaki ritam treniranja"
        subtitle="Odaberi opciju koja ti odgovara. Svi članovi RRC Gyma ostvaruju 50% popusta na članarinu u FTC Romari."
        center
      />

      <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className={cn(
              "relative flex flex-col border bg-surface p-8 transition-all hover:border-primary/60",
              p.featured ? "border-primary shadow-red lg:-translate-y-3" : "border-border",
            )}
          >
            {p.featured && (
              <div className="absolute -top-3 left-8 bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                Najfleksibilnije
              </div>
            )}
            <h3 className="font-display text-2xl text-foreground">{p.name}</h3>

            <div className="my-6 flex items-baseline gap-2">
              <span className="font-display text-5xl text-foreground">{p.price}</span>
              <span className="text-sm text-muted-foreground">{p.period}</span>
            </div>

            <ul className="space-y-3 text-muted-foreground">
              {p.perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
                  <span>{perk}</span>
                </li>
              ))}
            </ul>

            <Button asChild variant={p.featured ? "fight" : "outlineFight"} className="mt-8">
              <Link to="/prijava">Prijavi se</Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Membership;
