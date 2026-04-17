import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Pojedinačni trening",
    perks: ["Pristup jednom treningu", "Bilo koja disciplina", "Idealno za isprobati"],
  },
  {
    name: "Mjesečna članarina",
    perks: ["Neograničeni treninzi", "Sve discipline", "Pristup opremi"],
    featured: true,
  },
  {
    name: "Pro paket",
    perks: ["Individualni rad", "Personalizirani plan", "Pristup kamp-sobama"],
  },
];

const Membership = () => (
  <section id="clanarine" className="relative bg-background py-24 md:py-32">
    <div className="container-x">
      <SectionHeading
        eyebrow="Članarine"
        title="Paketi za svaki ritam treniranja"
        subtitle="Cjenik se finalizira. Za detaljne informacije i posebne ponude kontaktirajte nas direktno."
        center
      />

      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {plans.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={cn(
              "relative flex flex-col border bg-surface p-8 transition-all hover:border-primary/60",
              p.featured ? "border-primary shadow-red md:-translate-y-3" : "border-border",
            )}
          >
            {p.featured && (
              <div className="absolute -top-3 left-8 bg-primary px-3 py-1 text-xs font-bold uppercase tracking-widest text-primary-foreground">
                Najpopularnije
              </div>
            )}
            <h3 className="font-display text-3xl text-foreground">{p.name}</h3>

            <div className="my-6 flex items-baseline gap-2">
              <span className="font-display text-5xl text-muted-foreground">Uskoro</span>
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
              <a href="#kontakt">Kontaktiraj nas</a>
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Membership;
