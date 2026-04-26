import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Instagram, Facebook, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import SectionHeading from "@/components/SectionHeading";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast({ title: "Poruka spremna!", description: "Forma trenutno radi u demo načinu. Backend slanja stiže uskoro." });
      setForm({ name: "", email: "", message: "" });
    }, 700);
  };

  return (
    <section id="kontakt" className="relative bg-surface py-24 md:py-32">
      <div className="container-x">
        <SectionHeading
          eyebrow="Lokacija i kontakt"
          title="Dođi i osjeti dvoranu"
          subtitle="Vrata su otvorena svaki dan. Najbolji je trening - onaj koji započneš."
          center
        />

        <div className="mt-16 grid gap-px overflow-hidden border border-border bg-border lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative min-h-[400px] bg-background"
          >
            <iframe
              title="Lokacija RRC Gym Vitez"
              src="https://www.google.com/maps?q=44.168061,17.772802&z=15&output=embed"
              className="h-full w-full"
              style={{ filter: "invert(90%) hue-rotate(180deg) brightness(0.95) contrast(0.9)" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-background p-8 md:p-12"
          >
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Adresa</div>
                  <div className="text-foreground">Divjak b.b., 72250 Vitez<br />Bosna i Hercegovina</div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Radno vrijeme</div>
                  <div className="text-foreground">Svaki dan · 09:00 - 20:30</div>
                </div>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <a href="https://instagram.com/rrcgym" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" aria-label="Facebook" className="flex h-11 w-11 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </a>
              </div>
            </div>

            <form onSubmit={onSubmit} className="mt-10 space-y-4 border-t border-border pt-8">
              <div>
                <Label htmlFor="name" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Ime i prezime</Label>
                <Input
                  id="name"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-2 border-border bg-surface focus-visible:ring-primary"
                  placeholder="Tvoje ime"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="mt-2 border-border bg-surface focus-visible:ring-primary"
                  placeholder="ti@example.com"
                />
              </div>
              <div>
                <Label htmlFor="msg" className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Poruka</Label>
                <Textarea
                  id="msg"
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="mt-2 border-border bg-surface focus-visible:ring-primary"
                  placeholder="Što te zanima?"
                />
              </div>
              <Button type="submit" variant="fight" size="lg" className="w-full" disabled={loading}>
                <Send className="mr-2 h-4 w-4" />
                {loading ? "Šaljem..." : "Pošalji poruku"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
