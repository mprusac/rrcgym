import { motion } from "framer-motion";
import { Box, Layers, Target, BedDouble, ShowerHead, Coffee } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import g1 from "@/assets/gallery-1.webp";
import g2 from "@/assets/gallery-2.webp";
import g3 from "@/assets/gallery-3.webp";
import g4 from "@/assets/gallery-4.webp";
import g5 from "@/assets/gallery-5.webp";
import g6 from "@/assets/gallery-6.webp";
import g7 from "@/assets/gallery-7.webp";
import g8 from "@/assets/gallery-8.webp";
import g9 from "@/assets/gallery-9.webp";
import g10 from "@/assets/gallery-10.webp";
// removed last gallery image (g6)

const features = [
  { icon: Box, title: "MMA kavez 6×6 m", desc: "Profesionalni borilački kavez prema regulativi natjecanja." },
  { icon: Layers, title: "Zebra Mats strunjače", desc: "Vrhunske strunjače za parter, BJJ i hrvanje." },
  { icon: Target, title: "Teške vreće i fokuseri", desc: "Kompletna oprema za udaračke discipline." },
  { icon: BedDouble, title: "Kamp-sobe", desc: "Smještaj za gostujuće borce tijekom priprema." },
  { icon: ShowerHead, title: "Svlačionice i tuševi", desc: "Moderan prostor s punim sanitarijama." },
  { icon: Coffee, title: "Kafić i parking", desc: "U sklopu SRC Romari kompleksa." },
];

const gallery = [g9, g1, g3, g10, g4, g5, g2, g7, g8];

const Facility = () => (
  <section id="dvorana" className="relative bg-surface py-24 md:py-32">
    <div className="container-x">
      <SectionHeading
        eyebrow="Dvorana i oprema"
        title="Oprema svjetske klase"
        subtitle="Sve što treba za ozbiljan rad - od prvog treninga do profesionalnog kampa."
        center
      />

      <div className="mt-16 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.45, delay: i * 0.05 }}
            className="group flex gap-5 bg-background p-6 transition-colors hover:bg-surface-elevated md:p-8"
          >
            <f.icon className="h-8 w-8 flex-shrink-0 text-primary transition-transform group-hover:scale-110" />
            <div>
              <h3 className="font-display text-xl text-foreground">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-4">
        {gallery.map((src, i) => (
          <motion.div
            key={src}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-30px" }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="group relative aspect-square overflow-hidden bg-surface-elevated"
          >
            <img
              src={src}
              alt={`Galerija RRC Gym ${i + 1}`}
              className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-background/40 opacity-0 transition-opacity group-hover:opacity-0" />
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Facility;
