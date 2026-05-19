type TransmissionMarqueeProps = {
  items: string[];
  tone?: "warm" | "shadow" | "cosmic";
};

export function TransmissionMarquee({ items, tone = "warm" }: TransmissionMarqueeProps) {
  const loop = [...items, ...items];

  return (
    <div className={`transmission-marquee transmission-marquee--${tone}`} aria-hidden="true">
      <div className="transmission-marquee__track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`}>
            {item}
            <i>◇</i>
          </span>
        ))}
      </div>
    </div>
  );
}
