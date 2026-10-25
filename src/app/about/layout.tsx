import type { ReactNode } from "react";
import { ivmInter } from "@/components/revamp/ivm-font";

export default function AboutLayout({ children }: { children: ReactNode }) {
  return <div className={ivmInter.variable}>{children}</div>;
}
