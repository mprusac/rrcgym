import { motion } from "framer-motion";
import { ArrowUpRight, Swords, Hand, Zap, Shield } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import mmaImage from "@/assets/discipline-mma.jpg";
import bjjImage from "@/assets/discipline-bjj.jpg";
import kickboxImage from "@/assets/discipline-kickbox.jpg";
import boksImage from "@/assets/discipline-boks.jpg";

const items = [
  {
    icon: Swords,
    title: "MMA",
    desc: "Mješovite borilačke vještine - udaračka tehnika, hrvanje i parter, integrirano u jedan sustav. Za sve razine.",
    image: mmaImage,
    objectPosition: "center 20%",
  },
  {
    icon: Shield,
    title: "Brazilian Jiu-Jitsu",
    desc: 'Parterna tehnika i submisije pod vodstvom Fabiana „Jacarezinho" Silve, BJJ crnog pojasa.',
    image: bjjImage,
    objectPosition: "center 30%",
  },
  {
    icon: Zap,
    title: "Kickboxing",
    desc: "Eksplozivni udarački sport koji razvija snagu, brzinu i kondiciju kroz strukturiran trening.",
    image: kickboxImage,
    objectPosition: "center 15%",
  },
  {
    icon: Hand,
    title: "Boks",
    desc: "Klasična škola udaranja - tehnika ruku, rad nogu, ritam i taktika u ringu.",
    image: boksImage,
    objectPosition: "center 25%",
  },
];

const Disciplines = () => {
  const featured = items.filter((it) => it.image);
  const compact = items.filter((it) => !it.image);

  return (
    <section id="discipline" className="relative bg-surface py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Discipline"
          title="Četiri škole pod jednim krovom"
          subtitle="Svaki program vode iskusni treneri uz pristup vrhunskoj opremi i prostoru."
          center
        />

        {/* Featured discipline rows — slika + tekst, puna širina */}
        <div className="mt-16 space-y-px bg-border">
          {featured.map((it, i) => (
            <motion.a
              key={it.title}
              href="#kontakt"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group grid gap-px overflow-hidden bg-background md:grid-cols-2 ${
                i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden sm:aspect-[4/3] md:aspect-auto md:min-h-[420px]">
                <img
                  src={it.image}
                  alt={`${it.title} trening u RRC Gym dvorani`}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{ objectPosition: it.objectPosition }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-background/30 to-transparent" />
              </div>
              <div className="flex flex-col justify-center gap-6 bg-background p-8 transition-colors group-hover:bg-surface-elevated md:p-12 lg:p-16">
                <div className="flex h-14 w-14 items-center justify-center border border-primary/40 bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                  <it.icon className="h-7 w-7" />
                </div>
                <div>
                  <h3 className="font-display text-4xl text-foreground md:text-5xl lg:text-6xl">
                    {it.title}
                  </h3>
                  <p className="mt-4 max-w-md text-base text-muted-foreground md:text-lg">
                    {it.desc}
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary">
                  Saznaj više
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Compact discipline grid — bez slika */}
        <div className="mt-px grid gap-px bg-border md:grid-cols-2">
          {compact.map((it, i) => (
            <motion.a
              key={it.title}
              href="#kontakt"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group flex flex-col gap-6 bg-background p-8 transition-colors hover:bg-surface-elevated md:p-12"
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
};

export default Disciplines;
