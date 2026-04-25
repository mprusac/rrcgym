import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";

const DISCIPLINES = [
  { v: "mma", l: "MMA" },
  { v: "kickbox", l: "Kickbox" },
  { v: "boks", l: "Boks" },
  { v: "jiu_jitsu", l: "Jiu-Jitsu" },
  { v: "drugo", l: "Drugo" },
] as const;

const EXPERIENCE = ["Amater", "Poluprofesionalac", "Profesionalac", "Trener"];
const ACCOMMODATION = ["Kamp soba u dvorani", "Hotel u Vitezu", "Vlastiti smještaj"];

const schema = z.object({
  full_name: z.string().trim().min(2, "Ime mora imati barem 2 znaka").max(100),
  email: z.string().trim().email("Neispravan email").max(255),
  phone: z.string().trim().min(5, "Unesite broj telefona").max(30),
  country: z.string().trim().min(2, "Unesite državu").max(60),
  age: z.string().optional().refine((v) => !v || (/^\d+$/.test(v) && +v >= 14 && +v <= 65), "Dob 14–65"),
  club: z.string().max(80).optional(),
  weight_class: z.string().max(40).optional(),
  discipline: z.enum(["mma", "kickbox", "boks", "jiu_jitsu", "drugo"]),
  experience_level: z.string().min(2, "Odaberi razinu").max(60),
  arrival_date: z.string().min(1, "Datum dolaska"),
  departure_date: z.string().min(1, "Datum odlaska"),
  sparring_partners: z.string().refine((v) => /^\d+$/.test(v) && +v >= 0 && +v <= 20, "0–20"),
  accommodation: z.string().min(2, "Odaberi smještaj").max(60),
  dietary_notes: z.string().max(300).optional(),
  injuries: z.string().max(300).optional(),
  extra_notes: z.string().max(500).optional(),
});

const initial = {
  full_name: "",
  email: "",
  phone: "",
  country: "",
  age: "",
  club: "",
  weight_class: "",
  discipline: "mma" as (typeof DISCIPLINES)[number]["v"],
  experience_level: "",
  arrival_date: "",
  departure_date: "",
  sparring_partners: "1",
  accommodation: "",
  dietary_notes: "",
  injuries: "",
  extra_notes: "",
};

const RezervacijaKamp = () => {
  const [form, setForm] = useState(initial);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = "Rezervacija kampa - RRC Gym";
  }, []);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    if (new Date(parsed.data.departure_date) < new Date(parsed.data.arrival_date)) {
      toast.error("Datum odlaska mora biti nakon dolaska");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("camp_reservations").insert({
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      country: parsed.data.country,
      age: parsed.data.age ? Number(parsed.data.age) : null,
      club: parsed.data.club || null,
      weight_class: parsed.data.weight_class || null,
      discipline: parsed.data.discipline,
      experience_level: parsed.data.experience_level,
      arrival_date: parsed.data.arrival_date,
      departure_date: parsed.data.departure_date,
      sparring_partners: Number(parsed.data.sparring_partners),
      accommodation: parsed.data.accommodation,
      dietary_notes: parsed.data.dietary_notes || null,
      injuries: parsed.data.injuries || null,
      extra_notes: parsed.data.extra_notes || null,
    });
    if (error) {
      toast.error("Slanje nije uspjelo. Pokušaj ponovno.");
      setSubmitting(false);
      return;
    }

    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "camp-reservation-confirmation",
          recipientEmail: parsed.data.email,
          idempotencyKey: `camp-${parsed.data.email}-${Date.now()}`,
          templateData: {
            name: parsed.data.full_name,
            arrival: parsed.data.arrival_date,
            departure: parsed.data.departure_date,
          },
        },
      });
    } catch {
      /* edge fn još nije dostupna — preskoči */
    }

    setDone(true);
    setSubmitting(false);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <main className="min-h-screen bg-background bg-grain text-foreground">
      <div className="container-x py-12 md:py-16">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Natrag
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 max-w-3xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary sm:text-xs">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-red rounded-full bg-primary" />
            Pro kamp · rezervacija
          </div>
          <h1 className="font-display text-4xl leading-tight md:text-6xl">
            Rezerviraj svoj <span className="text-primary">kamp</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground md:text-lg">
            Pošalji nam podatke o sebi i tvojim kamp potrebama. Javljamo se s prijedlogom termina,
            sparing partnera i smještaja u roku 48h.
          </p>
        </motion.header>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-xl rounded-2xl border border-primary/40 bg-card p-10 text-center shadow-red"
          >
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
            <h2 className="font-display text-3xl">Zahtjev poslan!</h2>
            <p className="mt-3 text-muted-foreground">
              Hvala, {form.full_name.split(" ")[0]}! Javljamo se na{" "}
              <span className="font-semibold text-foreground">{form.email}</span> u roku 48h s
              detaljima kampa.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="fight">
                <Link to="/">Natrag na početnu</Link>
              </Button>
              <Button
                variant="outlineFight"
                onClick={() => {
                  setDone(false);
                  setForm(initial);
                }}
              >
                Pošalji još jedan
              </Button>
            </div>
          </motion.div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="mx-auto max-w-3xl rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md md:p-10"
          >
            {/* Osnovni podaci */}
            <h2 className="font-display text-2xl">Osnovni podaci</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Ime i prezime *" id="full_name">
                <Input id="full_name" required value={form.full_name} onChange={(e) => set("full_name", e.target.value)} />
              </Field>
              <Field label="Email *" id="email">
                <Input id="email" type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} />
              </Field>
              <Field label="Telefon *" id="phone">
                <Input id="phone" required value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="+387 ..." />
              </Field>
              <Field label="Država *" id="country">
                <Input id="country" required value={form.country} onChange={(e) => set("country", e.target.value)} placeholder="BiH / HR / DE..." />
              </Field>
              <Field label="Dob" id="age">
                <Input id="age" inputMode="numeric" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="25" />
              </Field>
              <Field label="Klub / tim" id="club">
                <Input id="club" value={form.club} onChange={(e) => set("club", e.target.value)} placeholder="Naziv kluba" />
              </Field>
            </div>

            {/* Borilački profil */}
            <h2 className="mt-10 font-display text-2xl">Borilački profil</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Glavna disciplina *" id="discipline">
                <Select value={form.discipline} onValueChange={(v) => set("discipline", v as typeof form.discipline)}>
                  <SelectTrigger id="discipline"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {DISCIPLINES.map((d) => (
                      <SelectItem key={d.v} value={d.v}>{d.l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Razina iskustva *" id="experience_level">
                <Select value={form.experience_level} onValueChange={(v) => set("experience_level", v)}>
                  <SelectTrigger id="experience_level"><SelectValue placeholder="Odaberi" /></SelectTrigger>
                  <SelectContent>
                    {EXPERIENCE.map((e) => <SelectItem key={e} value={e}>{e}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Težinska kategorija" id="weight_class">
                <Input id="weight_class" value={form.weight_class} onChange={(e) => set("weight_class", e.target.value)} placeholder="npr. -77 kg" />
              </Field>
              <Field label="Broj sparing partnera *" id="sparring_partners">
                <Input id="sparring_partners" inputMode="numeric" required value={form.sparring_partners} onChange={(e) => set("sparring_partners", e.target.value)} />
              </Field>
            </div>

            {/* Termin i smještaj */}
            <h2 className="mt-10 font-display text-2xl">Termin i smještaj</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Datum dolaska *" id="arrival_date">
                <Input id="arrival_date" type="date" required min={today} value={form.arrival_date} onChange={(e) => set("arrival_date", e.target.value)} />
              </Field>
              <Field label="Datum odlaska *" id="departure_date">
                <Input id="departure_date" type="date" required min={form.arrival_date || today} value={form.departure_date} onChange={(e) => set("departure_date", e.target.value)} />
              </Field>
              <Field label="Smještaj *" id="accommodation" full>
                <Select value={form.accommodation} onValueChange={(v) => set("accommodation", v)}>
                  <SelectTrigger id="accommodation"><SelectValue placeholder="Odaberi" /></SelectTrigger>
                  <SelectContent>
                    {ACCOMMODATION.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {/* Dodatno */}
            <h2 className="mt-10 font-display text-2xl">Dodatno</h2>
            <div className="mt-5 grid gap-4">
              <Field label="Dijetetske napomene" id="dietary_notes">
                <Textarea id="dietary_notes" rows={2} value={form.dietary_notes} onChange={(e) => set("dietary_notes", e.target.value)} placeholder="Alergije, posebna prehrana..." />
              </Field>
              <Field label="Aktualne ozljede" id="injuries">
                <Textarea id="injuries" rows={2} value={form.injuries} onChange={(e) => set("injuries", e.target.value)} placeholder="Bilo kakva ograničenja..." />
              </Field>
              <Field label="Dodatna napomena" id="extra_notes">
                <Textarea id="extra_notes" rows={3} value={form.extra_notes} onChange={(e) => set("extra_notes", e.target.value)} placeholder="Sve što bismo trebali znati" />
              </Field>
            </div>

            <Button type="submit" variant="fight" size="lg" className="mt-8 w-full sm:w-auto" disabled={submitting}>
              {submitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Šaljem...</>) : "Pošalji rezervaciju"}
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              Slanjem zahtjeva pristaješ da te kontaktiramo s detaljima i ponudom za kamp.
            </p>
          </form>
        )}
      </div>
    </main>
  );
};

const Field = ({
  label,
  id,
  children,
  full,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
  full?: boolean;
}) => (
  <div className={`grid gap-2 ${full ? "sm:col-span-2" : ""}`}>
    <Label htmlFor={id}>{label}</Label>
    {children}
  </div>
);

export default RezervacijaKamp;
