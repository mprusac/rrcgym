import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const About = () => (
  <section id="o-nama" className="relative bg-background py-24 md:py-32">
    <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <motion.div
        initial={{ opacity: 0, x: -24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <div className="relative aspect-[4/5] w-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=900&q=80"
            alt="Unutrašnjost MMA dvorane"
            className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-background via-transparent to-transparent" />
        </div>
        <div className="absolute -bottom-6 -right-6 hidden h-32 w-32 border-l-4 border-t-4 border-primary md:block" aria-hidden />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 24 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <SectionHeading eyebrow="O nama" title="Mjesto gdje sport živi, a strast raste" />
        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            RRC Gym je otvoren u lipnju 2025. kao prvi borilački centar u Bosni i Hercegovini
            opremljen po svjetskim standardima. Smješten je u sklopu SRC Romari kompleksa u Vitezu,
            a iza projekta stoje obitelj Rajković i MMA borac Roberto „Robocop" Soldić.
          </p>
          <p>
            Naša misija je jednostavna - graditi novu generaciju boraca i rekreativaca u srcu
            Bosne, uz uvjete koji se ne razlikuju od onih u najboljim kampovima Europe i svijeta.
            Vrata su otvorena svima - od djece od 8 godina do profesionalaca koji se pripremaju
            za UFC, ONE Championship i KSW.
          </p>
        </div>

        <blockquote className="mt-8 border-l-2 border-primary bg-surface p-6">
          <Quote className="mb-3 h-6 w-6 text-primary" />
          <p className="font-display text-2xl leading-tight text-foreground md:text-3xl">
            „Želimo graditi borilačku priču iz srca Bosne i Hercegovine."
          </p>
          <footer className="mt-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            - Roberto „Robocop" Soldić
          </footer>
        </blockquote>
      </motion.div>
    </div>
  </section>
);

export default About;
