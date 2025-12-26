import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
interface NavItem {
  id: string;
  label: string;
  href: string;
}
interface LimelightNavProps {
  items: NavItem[];
  className?: string;
}
const LimelightNav = ({
  items,
  className
}: LimelightNavProps) => {
  const [activeSection, setActiveSection] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Find active section
      const sections = items.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(items[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);
  const handleClick = (href: string) => {
    setIsMobileOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth"
      });
    }
  };
  return <nav className={cn("fixed top-0 left-0 right-0 z-50 transition-all duration-300", isScrolled ? "bg-background/80 backdrop-blur-xl border-b border-border/50 py-3" : "bg-transparent py-6", className)}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <motion.a href="#home" onClick={e => {
        e.preventDefault();
        handleClick("#home");
      }} whileHover={{
        scale: 1.05
      }} whileTap={{
        scale: 0.95
      }} className="font-bold title-gradient text-2xl font-serif shadow-sm rounded-sm">
          MT
        </motion.a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-full bg-card/50 backdrop-blur-sm border border-border/30">
          {items.map(item => <motion.button key={item.id} onClick={() => handleClick(item.href)} className={cn("relative px-4 py-2 text-sm font-medium rounded-full transition-colors", activeSection === item.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground")} whileHover={{
          scale: 1.05
        }} whileTap={{
          scale: 0.95
        }}>
              {activeSection === item.id && <motion.div className="absolute inset-0 bg-primary rounded-full" layoutId="activeSection" transition={{
            type: "spring",
            bounce: 0.2,
            duration: 0.6
          }} />}
              <span className="relative z-10">{item.label}</span>
            </motion.button>)}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden p-2 text-foreground" onClick={() => setIsMobileOpen(!isMobileOpen)}>
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileOpen && <motion.div initial={{
        opacity: 0,
        height: 0
      }} animate={{
        opacity: 1,
        height: "auto"
      }} exit={{
        opacity: 0,
        height: 0
      }} className="md:hidden bg-card/95 backdrop-blur-xl border-b border-border">
            <div className="container mx-auto px-4 py-4 flex flex-col gap-2">
              {items.map(item => <motion.button key={item.id} onClick={() => handleClick(item.href)} className={cn("px-4 py-3 text-left rounded-lg transition-colors", activeSection === item.id ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted")} whileTap={{
            scale: 0.98
          }}>
                  {item.label}
                </motion.button>)}
            </div>
          </motion.div>}
      </AnimatePresence>
    </nav>;
};
export default LimelightNav;