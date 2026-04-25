import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Loader2, Dumbbell, Zap, Hand, Swords } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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
  { v: "mma", l: "MMA", desc: "Kompletan borac", icon: Swords },
  { v: "kickbox", l: "Kickbox", desc: "Eksplozivni udarci", icon: Zap },
  { v: "boks", l: "Boks", desc: "Slatka znanost", icon: Dumbbell },
  { v: "jiu_jitsu", l: "Jiu-Jitsu", desc: "Igra na partu", icon: Hand },
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
    .refine((v) => !v || (/^\d+$/.test(v) && +v >= 6 && +v <= 99), "Dob 6–99"),
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
  const [selectedId, setSelectedId] = useState<string | null>(params.get("session"));
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
    document.title = "Prijava na trening — RRC Gym";
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

  // Group sessions of selected discipline by day
  const byDay = useMemo(() => {
    const map: Record<number, Session[]> = {};
    for (const d of DAYS) map[d.idx] = [];
    for (const s of sessions) {
      if (s.discipline === discipline) map[s.day_of_week]?.push(s);
    }
    return map;
  }, [sessions, discipline]);

  const selected = sessions.find((s) => s.id === selectedId) ?? null;

  const pickDiscipline = (d: DisciplineV) => {
    setDiscipline(d);
    setSelectedId(null);
    const np = new URLSearchParams(params);
    np.set("d", d);
    np.delete("session");
    setParams(np, { replace: true });
  };

  const handleSelect = (id: string) => {
    setSelectedId(id);
    const np = new URLSearchParams(params);
    np.set("session", id);
    setParams(np, { replace: true });
    setTimeout(() => {
      document.getElementById("forma")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) {
      toast.error("Odaberi termin treninga");
      return;
    }
    const parsed = signupSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("training_signups").insert({
      session_id: selected.id,
      full_name: parsed.data.full_name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      age: parsed.data.age ? Number(parsed.data.age) : null,
      experience: parsed.data.experience || null,
      notes: parsed.data.notes || null,
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
          idempotencyKey: `training-${selected.id}-${parsed.data.email}-${Date.now()}`,
          templateData: {
            name: parsed.data.full_name,
            discipline: DISCIPLINE_LABEL[selected.discipline] ?? selected.discipline,
            day: DAYS.find((d) => d.idx === selected.day_of_week)?.long ?? "",
            startTime: selected.start_time.slice(0, 5),
            endTime: selected.end_time.slice(0, 5),
            coach: selected.coach,
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
          className="mb-10 max-w-3xl"
        >
          <div className="mb-4 inline-flex items-center gap-2 border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary sm:text-xs">
            <span className="inline-block h-1.5 w-1.5 animate-pulse-red rounded-full bg-primary" />
            Prijava na trening
          </div>
          <h1 className="font-display text-4xl leading-tight md:text-6xl">
            Odaberi sport pa <span className="text-primary">termin</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground md:text-lg">
            Klikni disciplinu, pa odaberi termin iz tjednog rasporeda. Ispod ispuni svoje podatke
            i šaljemo potvrdu na email.
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
                  setSelectedId(null);
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
                  const Icon = d.icon;
                  return (
                    <button
                      key={d.v}
                      onClick={() => pickDiscipline(d.v)}
                      className={cn(
                        "group relative flex flex-col items-center justify-center gap-2 rounded-2xl border p-5 text-center transition-all md:p-6",
                        active
                          ? "border-primary bg-primary/10 shadow-red"
                          : "border-border bg-card/40 hover:border-primary/60 hover:bg-card",
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-7 w-7 transition-colors md:h-8 md:w-8",
                          active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
                        )}
                      />
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

            {/* Step 2 — Schedule grid */}
            <section aria-labelledby="step-2" className="mt-12">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-display text-sm text-primary">02</span>
                <h2 id="step-2" className="font-display text-2xl md:text-3xl">
                  Tjedni raspored —{" "}
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
                            <div className="flex flex-wrap gap-2">
                              {byDay[d.idx].map((s) => (
                                <SlotButton
                                  key={s.id}
                                  s={s}
                                  active={s.id === selectedId}
                                  onClick={() => handleSelect(s.id)}
                                />
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
                                —
                              </div>
                            ) : (
                              byDay[d.idx].map((s) => (
                                <SlotButton
                                  key={s.id}
                                  s={s}
                                  active={s.id === selectedId}
                                  onClick={() => handleSelect(s.id)}
                                />
                              ))
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </AnimatePresence>
              )}
            </section>

            {/* Step 3 — Form */}
            <section id="forma" aria-labelledby="step-3" className="mt-12">
              <div className="mb-4 flex items-baseline gap-3">
                <span className="font-display text-sm text-primary">03</span>
                <h2 id="step-3" className="font-display text-2xl md:text-3xl">
                  Tvoji podaci
                </h2>
              </div>

              <div className="rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md md:p-8">
                {selected ? (
                  <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
                    Odabrano:{" "}
                    <span className="font-semibold text-primary">
                      {DISCIPLINE_LABEL[selected.discipline]}
                    </span>{" "}
                    ·{" "}
                    {DAYS.find((d) => d.idx === selected.day_of_week)?.long}{" "}
                    {selected.start_time.slice(0, 5)}–{selected.end_time.slice(0, 5)} ·{" "}
                    <span className="text-muted-foreground">trener {selected.coach}</span>
                  </div>
                ) : (
                  <p className="mb-6 text-sm text-muted-foreground">
                    Odaberi termin iz rasporeda iznad da nastaviš.
                  </p>
                )}

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
                      placeholder="Ozljede, alergije, pitanja..."
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="fight"
                    size="lg"
                    disabled={submitting || !selected}
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
                    Slanjem prijave pristaješ da te kontaktiramo radi potvrde termina.
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

const SlotButton = ({
  s,
  active,
  onClick,
}: {
  s: Session;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full rounded-lg border px-2.5 py-2 text-left transition-all",
      active
        ? "border-primary bg-primary text-primary-foreground shadow-red"
        : "border-border bg-background hover:border-primary/60 hover:bg-card",
    )}
  >
    <div className="font-display text-sm leading-tight tabular md:text-base">
      {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}
    </div>
    <div
      className={cn(
        "mt-0.5 truncate text-[10px] leading-tight md:text-[11px]",
        active ? "text-primary-foreground/85" : "text-muted-foreground",
      )}
      title={`${s.coach} · ${s.level}`}
    >
      {s.coach}
    </div>
  </button>
);

export default Prijava;
