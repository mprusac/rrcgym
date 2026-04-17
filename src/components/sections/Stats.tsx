import { motion } from "framer-motion";

const stats = [
  { value: "21–4", label: "Soldićev MMA rekord" },
  { value: "6×6 m", label: "Profesionalni MMA kavez" },
  { value: "4", label: "Borilačke discipline" },
  { value: "2025", label: "Godina otvorenja" },
];

const Stats = () => (
  <section id="brojke" className="relative border-y border-border bg-surface">
    <div className="container-x grid grid-cols-2 gap-px overflow-hidden lg:grid-cols-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="relative bg-background px-4 py-10 text-center md:py-14"
        >
          <div className="font-display tabular text-5xl text-foreground sm:text-6xl md:text-7xl">
            {s.value}
          </div>
          <div className="mt-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground sm:text-sm">
            {s.label}
          </div>
          <span className="absolute left-1/2 top-0 h-1 w-12 -translate-x-1/2 bg-primary" aria-hidden />
        </motion.div>
      ))}
    </div>
  </section>
);

export default Stats;
