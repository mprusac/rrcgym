const items = [
  "KSW WELTERWEIGHT",
  "OKTAGON",
  "21-4-1 NC",
  "VITEZ · BIH",
  "ONE CHAMPIONSHIP",
  "ROBOCOP",
  "KSW MIDDLEWEIGHT",
  "FFC PRVAK",
];

const Marquee = () => {
  const loop = [...items, ...items];
  return (
    <section
      aria-label="Soldić - istaknuto"
      className="relative overflow-hidden border-y border-border bg-background py-5"
    >
      <div className="flex w-max animate-marquee items-center gap-12 whitespace-nowrap">
        {loop.map((t, i) => (
          <div key={i} className="flex items-center gap-12">
            <span className="font-display text-xl tracking-widest text-foreground sm:text-2xl">
              {t}
            </span>
            <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden />
          </div>
        ))}
      </div>
    </section>
  );
};

export default Marquee;
