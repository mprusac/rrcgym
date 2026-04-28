import { motion } from "framer-motion";
import coach1 from "@/assets/coach-1.webp";
import coach2 from "@/assets/coach-2.webp";
import soldic from "@/assets/soldic.webp";

const coaches = [
  {
    img: coach1,
    role: "Fabiano\nJacarezinho",
    tags: ["BJJ", "Crni pojas"],
    desc: "Brazilski crni pojas, gostujući trener. BJJ i no-gi program.",
  },
  {
    img: coach2,
    role: "Lucas\nAguiar",
    tags: ["Boks", "Kickboxing", "K-1"],
    desc: "Vodi udaračke programe kluba. Profesionalna i rekreativna grupa.",
  },
  {
    img: soldic,
    role: "Roberto\nSoldić",
    tags: ["MMA", "Grappling"],
    desc: "Vodi osnovnu MMA grupu i kampove za goste.",
  },
];

const Coaches = () => (
  <section id="treneri" className="relative bg-background py-24 md:py-32">
    <div className="container-x">
      {/* Header row */}
      <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7"
        >
          <h2 className="font-display text-4xl leading-[0.9] text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="text-primary">Tim koji</span>
            <br className="hidden sm:block" />{" "}
            drži dvoranu
          </h2>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-end lg:col-span-5"
        >
          <p className="max-w-md text-muted-foreground md:text-lg">
            Soldić je lice kluba. Dvoranu drži tim koji radi svaki dan - od jutarnjeg
            treninga djece do večernjeg sparinga.
          </p>
        </motion.div>
      </div>

      {/* Coach grid */}
      <div className="mt-14 grid gap-px overflow-hidden border border-border bg-border md:grid-cols-3">
        {coaches.map((c, i) => (
          <motion.article
            key={i}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            className="group flex flex-col bg-background"
          >
            <div className="relative overflow-hidden">
              <img
                src={c.img}
                alt={c.role.replace("\n", " ")}
                className="aspect-[4/3] h-full w-full object-cover object-top transition-all duration-700 group-hover:scale-[1.03] sm:aspect-[4/5]"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            </div>

            <div className="flex flex-1 flex-col gap-3 p-6 md:p-7">
              <h3 className="whitespace-pre-line font-display text-3xl leading-[0.95] text-foreground md:text-4xl">
                {c.role}
              </h3>
              <div className="text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
                {c.tags.join(" · ")}
              </div>
              <p className="text-sm text-muted-foreground">{c.desc}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </section>
);

export default Coaches;
