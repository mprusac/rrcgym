import { motion } from "framer-motion";
import { Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";

const days = ["Pon", "Uto", "Sri", "Čet", "Pet"];
const slots = [
  { time: "09:00 - 10:00", items: ["Kickboxing", "MMA", "Boks", "MMA", "Boks"] },
  { time: "10:00 - 11:30", items: ["MMA · PRO", "Grappling · PRO", "Kickboxing · PRO", "Hrvanje · PRO", "MMA · PRO"] },
  { time: "17:00 - 18:00", items: ["Kickboxing", "Boks", "Kickboxing", "Boks", "Kickboxing"] },
  { time: "18:00 - 19:30", items: ["MMA", "No-Gi / Wrestling", "MMA", "No-Gi / Wrestling", "MMA"] },
  { time: "19:30 - 20:30", items: ["BJJ", "-", "BJJ", "-", "BJJ"] },
];

const Schedule = () => (
  <section id="raspored" className="relative bg-surface py-24 md:py-32">
    <div className="container-x">
      <SectionHeading
        eyebrow="Raspored"
        title="Tjedni plan treninga"
        subtitle="Okvirni raspored po danima i disciplinama."
        center
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-12 overflow-x-auto border border-border bg-background"
      >
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-border bg-surface-elevated">
              <th className="p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Vrijeme</th>
              {days.map((d) => (
                <th key={d} className="p-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {slots.map((row) => (
              <tr key={row.time} className="border-b border-border last:border-b-0">
                <td className="p-4 font-display tabular text-lg text-primary">{row.time}</td>
                {row.items.map((it, i) => (
                  <td key={i} className="p-4">
                    {it === "-" ? (
                      <span className="text-muted-foreground/50">-</span>
                    ) : (
                      <span className="inline-block border-l-2 border-primary pl-2 text-sm font-semibold uppercase tracking-wider text-foreground">
                        {it}
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>

      <div className="mt-6 flex flex-col items-start justify-between gap-4 border border-dashed border-border bg-background p-5 md:flex-row md:items-center">
        <div className="flex items-start gap-3">
          <Calendar className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Za ulazak u dvoranu prijavite se preko Sportin aplikacije.</span>
          </p>
        </div>
        <Button asChild variant="fight" size="default">
          <a href="https://sportin.rs/en/venue/rrc-gym" target="_blank" rel="noopener noreferrer">
            Otvori Sportin
            <ExternalLink className="ml-1 h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  </section>
);

export default Schedule;
