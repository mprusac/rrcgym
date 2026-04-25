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
          ? "border-b border-border bg-background/85 backdrop-blur-lg"
          : "bg-transparent",
      )}
    >
      <div className="container-x flex h-16 items-center justify-between md:h-20">
        <a href="#pocetna" className="font-display text-2xl tracking-wide text-foreground md:text-3xl" aria-label="RRC Gym početna">
          RRC <span className="ml-1">GYM</span>
        </a>

        <nav className="ml-auto hidden items-center gap-8 lg:flex" aria-label="Glavna navigacija">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-8 hidden lg:block">
          <Button asChild variant="fight" size="default">
            <a href="#kontakt">Prijavi se</a>
          </Button>
        </div>

        <button
          className="text-foreground lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Otvori meni"
          aria-expanded={open}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background/95 backdrop-blur-lg lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-4" aria-label="Mobilna navigacija">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-l-2 border-transparent px-3 py-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Button asChild variant="fight" size="lg" className="mt-3">
              <a href="#kontakt" onClick={() => setOpen(false)}>Prijavi se</a>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
