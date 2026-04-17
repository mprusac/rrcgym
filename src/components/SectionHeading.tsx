import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

const SectionHeading = ({ eyebrow, title, subtitle, center, className }: Props) => (
  <div className={cn("max-w-3xl", center && "mx-auto text-center", className)}>
    {eyebrow && (
      <div className={cn("flex items-center gap-3 text-xs font-semibold uppercase tracking-widest text-primary", center && "justify-center")}>
        <span className="h-px w-8 bg-primary" aria-hidden />
        {eyebrow}
        <span className="h-px w-8 bg-primary" aria-hidden />
      </div>
    )}
    <h2 className="mt-4 font-display text-4xl leading-[0.95] text-foreground sm:text-5xl md:text-6xl">
      {title}
    </h2>
    {subtitle && <p className="mt-5 text-base text-muted-foreground md:text-lg">{subtitle}</p>}
  </div>
);

export default SectionHeading;
