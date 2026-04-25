import { motion } from "framer-motion";
import { Users } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";

const Coaches = () => (
  <section id="treneri" className="relative bg-background py-24 md:py-32">
    <div className="container-x">
      <SectionHeading
        eyebrow="Treneri"
        title="Vođeni iskusnim borcima"
        subtitle="Vrhunsko znanje koje stiže direktno iz najjačih borilačkih organizacija svijeta."
        center
      />

      {/* Silva */}
      <motion.article
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mt-8 grid items-stretch overflow-hidden border border-border bg-surface lg:grid-cols-5"
      >
        <div className="flex flex-col justify-center gap-6 p-8 md:p-12 lg:col-span-3 lg:order-1">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">Jacarezinho</div>
            <h3 className="mt-1 font-display text-4xl leading-none text-foreground md:text-5xl">
              Fabiano Silva
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {["BJJ crni pojas", "Carlson Gracie linija", "American Top Team"].map((t) => (
              <span key={t} className="border border-border bg-surface-elevated px-3 py-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {t}
              </span>
            ))}
          </div>
          <p className="text-muted-foreground md:text-lg">
            Brazilski crni pojas s linijom Carlson Gracie / American Top Team. Glavni gostujući
            trener BJJ programa u RRC Gymu — donosi tehniku i pristup koji su izgradili neke od
            najboljih grapplera svijeta.
          </p>
        </div>
        <div className="relative lg:col-span-2 lg:order-2">
          <img
            src="https://images.unsplash.com/photo-1555597673-b21d5c935865?w=900&q=80"
            alt="BJJ trening — portret"
            className="h-full min-h-[360px] w-full object-cover grayscale"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent lg:bg-gradient-to-l" />
        </div>
      </motion.article>

      <div className="mt-8 flex items-center gap-4 border border-dashed border-border bg-surface/50 p-6 text-muted-foreground">
        <Users className="h-6 w-6 text-primary" />
        <p className="text-sm">Uskoro više informacija o ostatku našeg trenerskog tima.</p>
      </div>
    </div>
  </section>
);

export default Coaches;
