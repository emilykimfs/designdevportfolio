import type { CSSProperties, ElementType, ReactNode } from "react";

type RevealProps = {
  as?: ElementType;
  /** Delay in milliseconds, used to stagger elements on page load. */
  delay?: number;
  className?: string;
  children: ReactNode;
};

/** Fades its content up on page load. Disabled under reduced motion. */
export function Reveal({ as: Tag = "div", delay = 0, className = "", children }: RevealProps) {
  return (
    <Tag className={`reveal ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Tag>
  );
}
