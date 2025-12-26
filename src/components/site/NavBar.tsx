import { useState, useRef, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PasscodeModal from "./PasscodeModal";
import { Shield, Home, User, Code, GraduationCap, Briefcase, FolderOpen, Mail, HandCoins } from "lucide-react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactElement;
}

const NavBar = () => {
  const [passcodeModalOpen, setPasscodeModalOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement>(null);

  const links: NavItem[] = [
    { href: "#home", label: "Home", icon: <Home className="h-4 w-4" /> },
    { href: "#about", label: "About", icon: <User className="h-4 w-4" /> },
    { href: "#skills", label: "Skills", icon: <Code className="h-4 w-4" /> },
    { href: "#education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { href: "#experience", label: "Experience", icon: <Briefcase className="h-4 w-4" /> },
    { href: "#projects", label: "Projects", icon: <FolderOpen className="h-4 w-4" /> },
    { href: "#hire", label: "Hire Me", icon: <HandCoins className="h-4 w-4" /> },
    { href: "#contact", label: "Contact", icon: <Mail className="h-4 w-4" /> }
  ];

  useLayoutEffect(() => {
    if (links.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];
    
    if (limelight && activeItem) {
      const newLeft = activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  }, [activeIndex, isReady, links]);

  const handleItemClick = (index: number, href: string) => {
    setActiveIndex(index);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className={cn("container flex items-center justify-between py-4")}
        aria-label="Main Navigation">
        <a href="#home" className="font-semibold tracking-tight text-lg flex items-center gap-2">
          <span>Maheen</span>
          <span className="logo-dot" aria-hidden />
        </a>
        
        {/* Desktop Navigation with Limelight Effect */}
        <div className="hidden md:flex relative rounded-full bg-secondary/50 dark:bg-card/50 border border-border/50 px-2 py-1">
          {links.map(({ href, label, icon }, index) => (
            <a
              key={href}
              href={href}
              ref={(el) => (navItemRefs.current[index] = el)}
              className={cn(
                "relative z-20 flex items-center gap-2 px-4 py-2 text-sm transition-all duration-200 rounded-full",
                activeIndex === index 
                  ? "text-foreground font-medium" 
                  : "text-muted-foreground hover:text-foreground"
              )}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(index, href);
              }}
            >
              {React.cloneElement(icon, {
                className: cn(
                  "h-4 w-4 transition-opacity duration-100",
                  activeIndex === index ? "opacity-100" : "opacity-60"
                ),
              })}
              <span className="hidden lg:inline">{label}</span>
            </a>
          ))}
          
          {/* Limelight indicator */}
          <div
            ref={limelightRef}
            className={cn(
              "absolute bottom-0 h-0.5 w-12 rounded-full bg-primary transition-all duration-300 ease-out",
              isReady ? "opacity-100" : "opacity-0"
            )}
            style={{ transform: 'translateY(2px)' }}
          >
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary/50 blur-sm" />
          </div>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setPasscodeModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Shield className="h-4 w-4" />
            Admin
          </Button>
          <a href="#contact"><Button>{"Hire Me"}</Button></a>
        </div>
      </nav>
      
      <PasscodeModal 
        open={passcodeModalOpen} 
        onOpenChange={setPasscodeModalOpen} 
      />
    </header>
  );
};

// Need to import React for cloneElement
import React from "react";

export default NavBar;
