import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "#o-nama", label: "O nama" },
  { href: "#discipline", label: "Discipline" },
  { href: "#treneri", label: "Treneri" },
  { href: "#dvorana", label: "Dvorana" },
  { href: "#kampovi", label: "Kampovi" },
  { href: "#kontakt", label: "Kontakt" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.35)]"
          : "bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a
          href="#pocetna"
          className="group flex items-center gap-2 font-display text-2xl tracking-wide text-foreground md:text-3xl"
          aria-label="RRC Gym početna"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-md border border-primary/60 bg-primary/10 text-sm font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground md:h-9 md:w-9 md:text-base">
            R
          </span>
          <span>
            RRC<span className="text-primary"> GYM</span>
          </span>
        </a>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full border border-border/60 bg-background/40 px-2 py-1.5 backdrop-blur-md lg:flex"
          aria-label="Glavna navigacija"
        >
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:bg-primary/10 hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button asChild variant="fight" size="default" className="rounded-full px-6">
            <a href="#kontakt">Prijavi se</a>
          </Button>
        </div>

        <button
          className="rounded-full border border-border/60 bg-background/40 p-2 text-foreground backdrop-blur-md transition-colors hover:border-primary/60 hover:text-primary lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Otvori meni"
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border/30 bg-background/40 backdrop-blur-xl lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobilna navigacija">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg border-l-2 border-transparent px-3 py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-all hover:border-primary hover:bg-primary/5 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Button asChild variant="fight" size="lg" className="mt-3 self-start rounded-full">
              <a href="#kontakt" onClick={() => setOpen(false)}>Prijavi se</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
