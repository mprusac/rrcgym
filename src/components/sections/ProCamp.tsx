import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/SectionHeading";
import obanElliott from "@/assets/guest-oban-elliott.jpg";
import ahmedVila from "@/assets/guest-ahmed-vila.jpg";
import juricBatur from "@/assets/guest-juric-batur.jpg";
import ivanErslan from "@/assets/guest-ivan-erslan.jpg";
import croataBarrio from "@/assets/guest-croata-barrio.jpg";
import selverMahmic from "@/assets/guest-selver-mahmic.jpg";

const featuredGuests = [
  { name: "Oban Elliott", image: obanElliott },
  { name: "Ahmed Vila", image: ahmedVila },
  { name: "Jure Jurić & Martin Batur", image: juricBatur },
  { name: "Ivan Erslan", image: ivanErslan },
  { name: 'Francisco „Croata" Barrio', image: croataBarrio },
  { name: "Selver Mahmić", image: selverMahmic },
];

const orgs = ["UFC", "ONE Championship", "KSW", "FNC"];

const ProCamp = () => (
  <section id="kampovi" className="relative overflow-hidden bg-background py-24 md:py-32">
    <div className="absolute inset-0 -z-10 opacity-40">
      <img
        src="https://images.unsplash.com/photo-1614633836764-b14abb29ed83?w=1600&q=80"
        alt=""
        aria-hidden
        className="h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/40" />
    </div>

    <div className="container-x">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <SectionHeading eyebrow="Pro kamp" title="Destinacija za profesionalce" />
      </motion.div>

      {/* Galerija boraca odmah ispod naslova */}
      <div className="mt-12">
        <div className="mb-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            Gostovali kod nas
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {featuredGuests.map((g, i) => (
            <motion.div
              key={g.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="group relative aspect-[3/4] overflow-hidden border border-border"
            >
              <img
                src={g.image}
                alt={`${g.name} u RRC Gym dvorani`}
                className="h-full w-full object-cover object-top transition-all duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="font-display text-xl text-foreground md:text-2xl">
                  {g.name}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-20"
      >
        <div>
          <p className="text-lg leading-relaxed text-muted-foreground">
            RRC Gym redovito ugošćuje vrhunske borce regije i Europe za pripremne kampove. Naša
            dvorana, oprema i smještaj omogućuju cjelovitu pripremu za međunarodne mečeve - od
            UFC-a do ONE Championshipa i KSW-a.
          </p>

        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Organizacije u kojima nastupaju
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {orgs.map((o) => (
              <span
                key={o}
                className="border border-border bg-surface px-4 py-2 font-display text-lg tracking-wider text-foreground"
              >
                {o}
              </span>
            ))}
          </div>

          <Button asChild variant="fight" size="lg" className="mt-10 w-full max-w-full whitespace-normal text-center text-sm leading-tight sm:w-auto sm:text-base md:size-xl">
            <Link to="/rezervacija-kamp">
              <span className="text-balance">Kontaktiraj za kamp rezervaciju</span>
              <ArrowRight className="ml-1 h-4 w-4 flex-shrink-0 sm:h-5 sm:w-5" />
            </Link>
          </Button>
        </div>
      </motion.div>
    </div>
  </section>
);

export default ProCamp;
