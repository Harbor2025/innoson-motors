import type { ReactNode } from "react";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * Shared page gutter/max-width wrapper.
 * Figma: mobile content width 353px inside a 393px frame -> 20px side gutters.
 * Desktop content width 1339-1340px inside a 1440px frame -> 50px side gutters.
 */
export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-5 md:px-10 lg:px-[50px] ${className}`}>
      {children}
    </div>
  );
}
