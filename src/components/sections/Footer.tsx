import { Instagram, Facebook } from "lucide-react";

const links = [
  { href: "#o-nama", label: "O nama" },
  { href: "#discipline", label: "Discipline" },
  { href: "#treneri", label: "Treneri" },
  { href: "#dvorana", label: "Dvorana" },
  { href: "#kampovi", label: "Kampovi" },
  { href: "#kontakt", label: "Kontakt" },
];

const TikTok = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M19.6 6.3c-1.4-.9-2.4-2.4-2.6-4.1V2h-3.2v13.4c-.1 1.5-1.3 2.7-2.8 2.7-1.6 0-2.8-1.3-2.8-2.8s1.3-2.8 2.8-2.8c.3 0 .6.1.9.2v-3.3c-.3 0-.6-.1-.9-.1-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6V8.5c1.3.9 2.9 1.5 4.6 1.5V6.8c-.7 0-1.4-.2-2-.5z" />
  </svg>
);

const Footer = () => (
  <footer className="border-t border-border bg-background">
    <div className="container-x py-14">
      <div className="grid gap-10 lg:grid-cols-3">
        <div>
          <a href="#pocetna" className="flex items-baseline gap-1 font-display text-3xl tracking-wide">
            <span className="text-foreground">RRC</span>
            <span className="ml-1 text-foreground">GYM</span>
          </a>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Borilački centar svjetske klase u srcu Bosne. MMA · BJJ · Kickboxing · Boks.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://instagram.com/rrcgym" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Facebook" className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all hover:border-primary hover:text-primary">
              <TikTok className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Brzi linkovi</h3>
          <ul className="mt-4 grid grid-cols-2 gap-2">
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-sm text-foreground transition-colors hover:text-primary">{l.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Kontakt</h3>
          <address className="mt-4 not-italic text-sm text-muted-foreground">
            Divjak b.b., 72250 Vitez<br />
            Bosna i Hercegovina<br />
            Svaki dan · 09:00 - 20:30
          </address>
        </div>
      </div>

      <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center">
        <p>© 2026 RRC Gym. Sva prava pridržana.</p>
        <p>RRC Gym je dio SRC Romari kompleksa.</p>
      </div>
    </div>
  </footer>
);

export default Footer;
