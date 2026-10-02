export function RevealWords({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="reveal-mask">
          <span className="reveal-word" style={{ "--i": i } as React.CSSProperties}>
            {word}
          </span>
          {"\u00A0"}
        </span>
      ))}
    </>
  );
}