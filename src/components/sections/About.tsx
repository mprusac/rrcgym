import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const About = () => (
  <section id="o-nama" className="relative bg-background py-24 md:py-32">
    <div className="container-x mx-auto max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading eyebrow="O nama" title={<>Mjesto gdje sport živi,<br />a strast raste</>} center />
        <div className="mt-6 space-y-5 text-base leading-relaxed text-muted-foreground md:text-lg">
          <p>
            RRC Gym je otvoren u lipnju 2025. kao prvi borilački centar u Bosni i Hercegovini
            opremljen po svjetskim standardima. Smješten je u sklopu SRC Romari kompleksa u Vitezu,
            a iza projekta stoje obitelj Rajković i MMA borac Roberto „Robocop" Soldić.
          </p>
          <p>
            Naša misija je jednostavna - graditi novu generaciju boraca i rekreativaca u srcu
            Bosne, uz uvjete koji se ne razlikuju od onih u najboljim kampovima Europe i svijeta.
            Vrata su otvorena svima - od djece do profesionalaca koji se pripremaju za UFC,
            ONE Championship i KSW.
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
