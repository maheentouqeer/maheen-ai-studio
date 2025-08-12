import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NavBar = () => {
  const links = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#skills", label: "Skills" },
    { href: "#education", label: "Education" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" }
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className={cn("container flex items-center justify-between py-4")}
        aria-label="Main Navigation">
        <a href="#home" className="font-semibold tracking-tight text-lg flex items-center gap-2">
          <span>Maheen</span>
          <span className="logo-dot" aria-hidden />
        </a>
        <ul className="hidden md:flex items-center gap-6">

          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} className="story-link text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="hidden md:block">
          <a href="#contact"><Button>{"Hire Me"}</Button></a>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
