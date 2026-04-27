import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Loader2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import sportMma from "@/assets/sport-mma.webp";
import sportKickbox from "@/assets/sport-kickbox.webp";
import sportBoks from "@/assets/sport-boks.webp";
import sportJiuJitsu from "@/assets/sport-jiu-jitsu.webp";
import { Check } from "lucide-react";
import { PLANS } from "@/components/sections/Membership";

const DAYS = [
  { idx: 1, short: "Pon", long: "Ponedjeljak" },
  { idx: 2, short: "Uto", long: "Utorak" },
  { idx: 3, short: "Sri", long: "Srijeda" },
  { idx: 4, short: "Čet", long: "Četvrtak" },
  { idx: 5, short: "Pet", long: "Petak" },
  { idx: 6, short: "Sub", long: "Subota" },
  { idx: 7, short: "Ned", long: "Nedjelja" },
];

const DISCIPLINES = [
  { v: "mma", l: "MMA", desc: "Stand-up + grappling u jednom", img: sportMma },
  { v: "kickbox", l: "Kickbox", desc: "Udarci rukama i nogama", img: sportKickbox },
  { v: "boks", l: "Boks", desc: "Tehnika, brzina, footwork", img: sportBoks },
  { v: "jiu_jitsu", l: "Jiu-Jitsu", desc: "Borba u parteru i submisije", img: sportJiuJitsu },
] as const;

type DisciplineV = (typeof DISCIPLINES)[number]["v"];

const DISCIPLINE_LABEL: Record<string, string> = Object.fromEntries(
  DISCIPLINES.map((d) => [d.v, d.l]),
);

interface Session {
  id: string;
  discipline: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  coach: string;
  level: string;
  capacity: number;
}

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Ime mora imati barem 2 znaka").max(100),
  email: z.string().trim().email("Neispravan email").max(255),
  phone: z.string().trim().min(5, "Unesite broj telefona").max(30),
  age: z
    .string()
    .optional()
    .refine((v) => !v || (/^\d+$/.test(v) && +v >= 6 && +v <= 99), "Dob 6-99"),
  experience: z.string().max(60).optional(),
  notes: z.string().max(500).optional(),
});

const Prijava = () => {
  const [params, setParams] = useSearchParams();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [discipline, setDiscipline] = useState<DisciplineV>(
    (params.get("d") as DisciplineV) || "mma",
  );
  // If user came from a Membership card, plan is pre-selected via URL and we hide the pricing grid.
  const initialPlanFromUrl = params.get("plan");
  const planLockedFromUrl = !!initialPlanFromUrl && PLANS.some((p) => p.id === initialPlanFromUrl);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(
    planLockedFromUrl ? initialPlanFromUrl : null,
  );
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    age: "",
    experience: "",
    notes: "",
  });

  useEffect(() => {
    document.title = "Prijava na trening - RRC Gym";
    window.scrollTo({ top: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("training_sessions")
        .select("*")
        .order("day_of_week")
        .order("start_time");
      if (error) toast.error("Greška pri učitavanju rasporeda");
      else setSessions((data ?? []) as Session[]);
      setLoading(false);
    })();
  }, []);

  // Group sessions of selected discipline by day (info only)
  const byDay = useMemo(() => {
    const map: Record<number, Session[]> = {};
    for (const d of DAYS) map[d.idx] = [];
    for (const s of sessions) {
      if (s.discipline === discipline) map[s.day_of_week]?.push(s);
    }
    return map;
  }, [sessions, discipline]);

  const pickDiscipline = (d: DisciplineV) => {
    setDiscipline(d);
    const np = new URLSearchParams(params);
    np.set("d", d);
    np.delete("session");
    setParams(np, { replace: true });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);

    // Pick any session of this discipline to satisfy NOT NULL session_id
    const anySession = sessions.find((s) => s.discipline === discipline);
    if (!anySession) {
      toast.error("Trenutno nema dostupnih termina za ovaj sport.");
      setSubmitting(false);
      return;
    }

    const { error } = await supabase.from("training_signups").insert({
      session_id: anySession.id,
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      age: parsed.data.age ? Number(parsed.data.age) : null,
      experience: parsed.data.experience || null,
      notes: [
        `Sport: ${DISCIPLINE_LABEL[discipline]}`,
        parsed.data.notes ? `Napomena: ${parsed.data.notes}` : null,
      ]
        .filter(Boolean)
        .join(" | "),
    });
    if (error) {
      toast.error("Slanje nije uspjelo. Pokušaj ponovno.");
      setSubmitting(false);
      return;
    }

    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "training-signup-confirmation",
          recipientEmail: parsed.data.email,
          idempotencyKey: `training-${discipline}-${parsed.data.email}-${Date.now()}`,
          templateData: {
            name: parsed.data.full_name,
            discipline: DISCIPLINE_LABEL[discipline],
          },
        },
      });
    } catch {
      /* edge fn još nije postavljena — preskoči tiho */
    }

    setDone(true);
    setSubmitting(false);
  };

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
          className="mb-10 max-w-3xl mx-auto text-center"
        >
          <div className="mb-4 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary sm:text-xs">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-red rounded-full bg-primary" />
            Prijava na trening
          </div>
          <h1 className="font-display text-4xl leading-tight md:text-6xl">
            Odaberi <span className="text-primary">sport</span> i prijavi se
          </h1>
          <p className="mt-3 mx-auto max-w-xl text-base text-muted-foreground md:text-lg">
            Klikni disciplinu i pogledaj kad se odvijaju treninzi. Ispod ispuni svoje podatke i
            šaljemo potvrdu na email.
          </p>
        </motion.header>

        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-xl rounded-2xl border border-primary/40 bg-card p-10 text-center shadow-red"
          >
            <CheckCircle2 className="mx-auto mb-4 h-14 w-14 text-primary" />
            <h2 className="font-display text-3xl">Prijava poslana!</h2>
            <p className="mt-3 text-muted-foreground">
              Hvala, {form.full_name.split(" ")[0]}! Poslali smo ti potvrdu na{" "}
              <span className="font-semibold text-foreground">{form.email}</span>. Vidimo se na
              treningu.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild variant="fight">
                <Link to="/">Natrag na početnu</Link>
              </Button>
              <Button
                variant="outlineFight"
                onClick={() => {
                  setDone(false);
                  setForm({ full_name: "", email: "", phone: "", age: "", experience: "", notes: "" });
                }}
              >
                Prijavi još jedan
              </Button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Step 1 — Discipline picker */}
            <section aria-labelledby="step-1">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-display text-sm text-primary">01</span>
                <h2 id="step-1" className="font-display text-2xl md:text-3xl">
                  Odaberi sport
                </h2>
              </div>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {DISCIPLINES.map((d) => {
                  const active = d.v === discipline;
                  return (
                    <button
                      key={d.v}
                      onClick={() => pickDiscipline(d.v)}
                      className={cn(
                        "group relative flex flex-col items-center justify-center gap-3 rounded-2xl border p-5 text-center transition-all md:p-6",
                        active
                          ? "border-primary bg-primary/10 shadow-red"
                          : "border-border bg-card/40 hover:border-primary/60 hover:bg-card",
                      )}
                    >
                      <div
                        className={cn(
                          "flex h-20 w-20 items-center justify-center rounded-xl transition-all md:h-24 md:w-24",
                          active
                            ? "bg-primary/15 scale-105"
                            : "bg-muted/40 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105",
                        )}
                      >
                        <img
                          src={d.img}
                          alt={`${d.l} sticker`}
                          loading="lazy"
                          width={96}
                          height={96}
                          className="h-full w-full object-contain p-1.5 drop-shadow-[0_4px_10px_rgba(220,38,38,0.25)]"
                        />
                      </div>
                      <div className="font-display text-lg md:text-xl">{d.l}</div>
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                        {d.desc}
                      </div>
                      {active && (
                        <span className="absolute right-2 top-2 inline-block h-2 w-2 rounded-full bg-primary" />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Step 2 — Schedule (info only) */}
            <section aria-labelledby="step-2" className="mt-12">
              <div className="mb-4 flex items-baseline justify-center gap-3 text-center">
                <span className="font-display text-sm text-primary">02</span>
                <h2 id="step-2" className="font-display text-2xl md:text-3xl">
                  Raspored treninga -{" "}
                  <span className="text-primary">{DISCIPLINE_LABEL[discipline]}</span>
                </h2>
              </div>

              {loading ? (
                <div className="flex h-40 items-center justify-center text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Učitavanje rasporeda…
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={discipline}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden rounded-xl border border-border"
                  >
                    {/* Mobile: stacked per day */}
                    <div className="divide-y divide-border md:hidden">
                      {DAYS.map((d) => (
                        <div key={d.idx} className="bg-card/40 p-4">
                          <div className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {d.long}
                          </div>
                          {byDay[d.idx].length === 0 ? (
                            <div className="text-sm text-muted-foreground/60">Nema termina</div>
                          ) : (
                            <div className="flex flex-col gap-2">
                              {byDay[d.idx].map((s) => (
                                <SlotInfo key={s.id} s={s} />
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Desktop: 7-column grid */}
                    <div className="hidden grid-cols-7 md:grid">
                      {DAYS.map((d) => (
                        <div
                          key={d.idx}
                          className="border-r border-border bg-card/30 p-3 last:border-r-0"
                        >
                          <div className="mb-3 text-center text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {d.short}
                          </div>
                          <div className="flex flex-col gap-2">
                            {byDay[d.idx].length === 0 ? (
                              <div className="rounded-lg border border-dashed border-border/60 px-2 py-3 text-center text-[11px] text-muted-foreground/50">
                                -
                              </div>
                            ) : (
                              byDay[d.idx].map((s) => <SlotInfo key={s.id} s={s} />)
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </section>

            {/* Step 3 — Cjenovnik (skriven ako je korisnik došao s odabranog plana) */}
            {!planLockedFromUrl && (
              <section aria-labelledby="cjenovnik" className="mt-12">
                <div className="mb-6 flex items-baseline justify-center gap-3 text-center">
                  <span className="font-display text-sm text-primary">03</span>
                  <h2 id="cjenovnik" className="font-display text-2xl md:text-3xl">
                    Odaberi članarinu
                  </h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {PLANS.map((p) => {
                    const isSelected = selectedPlan === p.id;
                    return (
                      <button
                        type="button"
                        key={p.id}
                        onClick={() => setSelectedPlan(p.id)}
                        className={cn(
                          "group relative flex flex-col rounded-xl border bg-card/40 p-5 text-left transition-all",
                          isSelected
                            ? "border-primary bg-primary/10 shadow-red"
                            : "border-border hover:border-primary/60",
                        )}
                      >
                        {isSelected && (
                          <div className="absolute -top-3 left-5 bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                            Odabrano
                          </div>
                        )}
                        <h3 className="font-display text-lg text-foreground">{p.name}</h3>
                        <div className="my-3 flex items-baseline gap-1.5">
                          <span className="font-display text-3xl text-foreground">{p.price}</span>
                          <span className="text-xs text-muted-foreground">{p.period}</span>
                        </div>
                        <ul className="space-y-1.5 text-sm text-muted-foreground">
                          {p.perks.map((perk) => (
                            <li key={perk} className="flex items-start gap-2">
                              <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                              <span>{perk}</span>
                            </li>
                          ))}
                        </ul>
                      </button>
                    );
                  })}
                </div>
                <p className="mt-4 text-center text-xs text-muted-foreground">
                  Svi članovi RRC Gyma ostvaruju 50% popusta na članarinu u FTC Romari.
                </p>
              </section>
            )}

            {/* Step 4 — Form */}
            <section id="forma" aria-labelledby="step-4" className="mt-12">
              <div className="mb-4 flex items-baseline justify-center gap-3 text-center">
                <span className="font-display text-sm text-primary">04</span>
                <h2 id="step-4" className="font-display text-2xl md:text-3xl">
                  Tvoji podaci
                </h2>
              </div>

              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md md:p-8">
                <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
                  Prijavljuješ se za:{" "}
                  <span className="font-semibold text-primary">
                    {DISCIPLINE_LABEL[discipline]}
                  </span>
                </div>

                <form onSubmit={onSubmit} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="full_name">Ime i prezime</Label>
                    <Input
                      id="full_name"
                      required
                      value={form.full_name}
                      onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                      placeholder="Ivan Horvat"
                    />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="ti@email.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        placeholder="+387 ..."
                      />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label htmlFor="age">Dob</Label>
                      <Input
                        id="age"
                        inputMode="numeric"
                        value={form.age}
                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                        placeholder="25"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="experience">Iskustvo</Label>
                      <Input
                        id="experience"
                        value={form.experience}
                        onChange={(e) => setForm({ ...form, experience: e.target.value })}
                        placeholder="Početnik / 1 god / ..."
                      />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="notes">Napomena (opcionalno)</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      placeholder="Ozljede, alergije, pitanja, željeni termin..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="fight"
                    size="lg"
                    disabled={submitting}
                    className="mt-2 w-full sm:w-auto"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Šaljem...
                      </>
                    ) : (
                      "Pošalji prijavu"
                    )}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    Slanjem prijave pristaješ da te kontaktiramo radi dogovora termina.
                  </p>
                </form>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
};

const SlotInfo = ({ s }: { s: Session }) => (
  <div className="rounded-lg border border-border bg-background px-2.5 py-2">
    <div className="flex items-center gap-1.5 font-display text-sm leading-tight md:text-base">
      <Clock className="h-3.5 w-3.5 text-primary" />
      {s.start_time.slice(0, 5)}-{s.end_time.slice(0, 5)}
    </div>
    <div
      className="mt-0.5 truncate text-[10px] leading-tight text-muted-foreground md:text-[11px]"
      title={`${s.coach} · ${s.level}`}
    >
      {s.coach}
    </div>
  </div>
);

export default Prijava;
