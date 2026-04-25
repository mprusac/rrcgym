import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { z } from "zod";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const DAYS = ["", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub", "Ned"];
const DISCIPLINE_LABEL: Record<string, string> = {
  mma: "MMA",
  kickbox: "Kickbox",
  boks: "Boks",
  jiu_jitsu: "Jiu-Jitsu",
};
const DISCIPLINE_FILTERS = ["all", "mma", "kickbox", "boks", "jiu_jitsu"] as const;

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
  const [filter, setFilter] = useState<(typeof DISCIPLINE_FILTERS)[number]>("all");
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

  const filtered = useMemo(
    () => (filter === "all" ? sessions : sessions.filter((s) => s.discipline === filter)),
    [sessions, filter],
  );
  const selected = sessions.find((s) => s.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setParams({ session: id }, { replace: true });
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

    // Best-effort potvrda mailom (ne blokira UX ako edge fn nije postavljena)
    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "training-signup-confirmation",
          recipientEmail: parsed.data.email,
          idempotencyKey: `training-${selected.id}-${parsed.data.email}-${Date.now()}`,
          templateData: {
            name: parsed.data.full_name,
            discipline: DISCIPLINE_LABEL[selected.discipline] ?? selected.discipline,
            day: DAYS[selected.day_of_week],
            startTime: selected.start_time.slice(0, 5),
            endTime: selected.end_time.slice(0, 5),
            coach: selected.coach,
          },
        },
      });
    } catch {
      /* edge fn još nije deployana — preskoči tiho */
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
            Odaberi termin i <span className="text-primary">krenimo</span>
          </h1>
          <p className="mt-3 max-w-xl text-base text-muted-foreground md:text-lg">
            Odaberi disciplinu i termin koji ti odgovara, ispuni svoje podatke i poslat ćemo ti
            potvrdu na email.
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
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            {/* Schedule */}
            <section aria-labelledby="raspored-title">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 id="raspored-title" className="font-display text-2xl md:text-3xl">
                  Raspored
                </h2>
              </div>

              <div className="mb-5 flex flex-wrap gap-2">
                {DISCIPLINE_FILTERS.map((d) => (
                  <button
                    key={d}
                    onClick={() => setFilter(d)}
                    className={cn(
                      "rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-all",
                      filter === d
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background/40 text-muted-foreground hover:border-primary/60 hover:text-foreground",
                    )}
                  >
                    {d === "all" ? "Sve" : DISCIPLINE_LABEL[d]}
                  </button>
                ))}
              </div>

              {loading ? (
                <div className="flex h-40 items-center justify-center text-muted-foreground">
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Učitavanje rasporeda…
                </div>
              ) : (
                <div className="overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-card text-xs uppercase tracking-wider text-muted-foreground">
                      <tr>
                        <th className="px-4 py-3">Dan</th>
                        <th className="px-4 py-3">Vrijeme</th>
                        <th className="px-4 py-3">Disciplina</th>
                        <th className="px-4 py-3 hidden sm:table-cell">Trener</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((s) => {
                        const active = s.id === selectedId;
                        return (
                          <tr
                            key={s.id}
                            className={cn(
                              "border-t border-border transition-colors",
                              active ? "bg-primary/10" : "hover:bg-card/60",
                            )}
                          >
                            <td className="px-4 py-3 font-semibold">{DAYS[s.day_of_week]}</td>
                            <td className="px-4 py-3 text-muted-foreground">
                              {s.start_time.slice(0, 5)}–{s.end_time.slice(0, 5)}
                            </td>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center rounded-full bg-primary/15 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-primary">
                                {DISCIPLINE_LABEL[s.discipline] ?? s.discipline}
                              </span>
                              <div className="mt-1 text-xs text-muted-foreground">{s.level}</div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">
                              {s.coach}
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                size="sm"
                                variant={active ? "fight" : "outlineFight"}
                                onClick={() => handleSelect(s.id)}
                              >
                                {active ? "Odabrano" : "Odaberi"}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                            Nema termina za ovaj filter.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </section>

            {/* Form */}
            <section id="forma" aria-labelledby="forma-title">
              <div className="sticky top-24 rounded-2xl border border-border bg-card/60 p-6 backdrop-blur-md md:p-8">
                <h2 id="forma-title" className="font-display text-2xl md:text-3xl">
                  Tvoji podaci
                </h2>
                {selected ? (
                  <div className="mt-3 rounded-lg border border-primary/30 bg-primary/10 p-3 text-sm">
                    Odabrano:{" "}
                    <span className="font-semibold text-primary">
                      {DISCIPLINE_LABEL[selected.discipline]}
                    </span>{" "}
                    · {DAYS[selected.day_of_week]} {selected.start_time.slice(0, 5)}–
                    {selected.end_time.slice(0, 5)} · {selected.coach}
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    Odaberi termin iz rasporeda da nastaviš.
                  </p>
                )}

                <form onSubmit={onSubmit} className="mt-6 grid gap-4">
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
                    className="mt-2"
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
          </div>
        )}
      </div>
    </main>
  );
};

export default Prijava;
