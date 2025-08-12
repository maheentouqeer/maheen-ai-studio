interface Item {
  school: string;
  detail: string;
  period: string;
}

const Timeline = ({ items, id, title }: { items: Item[]; id: string; title: string }) => {
  return (
    <section id={id} className="container py-16 md:py-24" data-animate="fade-up">
      <h2 className="text-3xl md:text-4xl font-bold mb-8">{title}</h2>
      <ol className="relative border-s border-border">
        {items.map((it, idx) => (
          <li key={idx} className="ms-6 mb-8 animate-fade-in" data-animate="fade-up">
            <span className="absolute -start-3 flex h-6 w-6 items-center justify-center rounded-full bg-secondary border border-border">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" />
            </span>
            <h3 className="font-semibold">{it.school}</h3>
            <p className="text-sm text-muted-foreground">{it.detail}</p>
            <p className="text-xs text-muted-foreground mt-1">{it.period}</p>
          </li>
        ))}
      </ol>
    </section>
  );
};

export default Timeline;
