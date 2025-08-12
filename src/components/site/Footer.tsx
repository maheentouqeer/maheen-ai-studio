const Footer = () => {
  return (
    <footer className="border-t border-border">
      <div className="container py-8 text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between gap-4">
        <p>© {new Date().getFullYear()} Maheen Touqeer. All rights reserved.</p>
        <nav className="flex gap-4">
          <a href="https://www.linkedin.com/in/maheen-touqeer-3b5b03289" aria-label="LinkedIn" className="story-link">LinkedIn</a>
          <a href="mailto:maheentouqeer@gmail.com" aria-label="Email" className="story-link">Email</a>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
