import { motion } from "framer-motion";
import { ArrowUpRight, Swords, Hand, Zap, Shield } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const items = [
  {
    icon: Swords,
    title: "MMA",
    desc: "Mješovite borilačke vještine - udaračka tehnika, hrvanje i parter, integrirano u jedan sustav. Za sve razine.",
  },
  {
    icon: Shield,
    title: "Brazilian Jiu-Jitsu",
    desc: 'Parterna tehnika i submisije pod vodstvom Fabiana „Jacarezinho" Silve, BJJ crnog pojasa.',
  },
  {
    icon: Zap,
    title: "Kickboxing",
    desc: "Eksplozivni udarački sport koji razvija snagu, brzinu i kondiciju kroz strukturiran trening.",
  },
  {
    icon: Hand,
    title: "Boks",
    desc: "Klasična škola udaranja - tehnika ruku, rad nogu, ritam i taktika u ringu.",
  },
];

const Disciplines = () => (
  <section id="discipline" className="relative bg-surface py-24 md:py-32">
    <div className="container-x">
      <SectionHeading
        eyebrow="Discipline"
        title="Četiri škole pod jednim krovom"
        subtitle="Svaki program vode iskusni treneri uz pristup vrhunskoj opremi i prostoru."
        center
      />

      <div className="mt-16 grid gap-px bg-border md:grid-cols-2">
        {items.map((it, i) => (
          <motion.a
            key={it.title}
            href="#kontakt"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="group relative flex flex-col gap-6 bg-background p-8 transition-colors hover:bg-surface-elevated md:p-12"
          >
            <div className="flex h-14 w-14 items-center justify-center border border-primary/40 bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
              <it.icon className="h-7 w-7" />
            </div>
            <div>
              <h3 className="font-display text-3xl text-foreground md:text-4xl">{it.title}</h3>
              <p className="mt-3 max-w-md text-muted-foreground">{it.desc}</p>
            </div>
            <div className="mt-2 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
              Saznaj više
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default Disciplines;
