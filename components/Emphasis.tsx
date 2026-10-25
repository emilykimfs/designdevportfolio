/**
 * Renders a line of copy, setting **marked** words in the darker ink color.
 */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="text-ink">
            {part}
          </span>
        ) : (
          part
        ),
      )}
    </>
  );
}
