"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";

// Figma: desktop 766:425 (785x484 image, 515 text column) / mobile 773:1883 (353x352 image)
export default function PaymentBanner() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.visible = "true";
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={ref} className="mt-10 w-full lg:mt-[120px]">
      <Container className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:gap-10">
        <div className="pay-frame relative h-[352px] w-full shrink-0 overflow-hidden bg-[#d5d4d4] lg:h-[484px] lg:w-[785px] lg:rounded-[4px]">
          <Image
            src="/images/home/payment.png"
            alt="Handing over car keys after a purchase"
            fill
            sizes="(min-width: 1024px) 785px, 100vw"
            className="pay-img object-cover"
          />
        </div>

        <div className="flex w-full flex-col gap-6 lg:w-[515px] lg:gap-10">
          <div className="flex flex-col items-start gap-4 lg:gap-6">
            <h2
              className="pay-slide text-[24px] font-extrabold uppercase leading-[normal] text-black font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:text-[40px] lg:font-semibold lg:capitalize lg:font-[family-name:var(--font-inter)]"
              style={{ "--i": 0 } as React.CSSProperties}
            >
              Access Payment with our flexible payment structure
            </h2>
            <p
              className="pay-slide text-[14px] leading-[normal] text-[#1e1e1e] font-[Avenir,'Avenir_Next','Nunito_Sans',sans-serif] lg:text-[24px] lg:text-[#878383] lg:font-[family-name:var(--font-inter)]"
              style={{ "--i": 1 } as React.CSSProperties}
            >
              Our collaboration with Access Bank allows you to access structured payment plans
              and financing solutions that make transitioning to electric mobility simple and
              affordable
            </p>
          </div>
          <Link
            href="/book-a-test-drive"
            className="pay-slide flex h-[31px] w-[107px] items-center justify-center rounded-[1.268px] bg-[#005eb8] p-[3.169px] text-[12px] font-medium text-white font-[family-name:var(--font-inter)] lg:h-12 lg:w-[173px] lg:rounded-[4px] lg:p-[10px] lg:text-[16px]"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            Learn More
          </Link>
        </div>
      </Container>
    </section>
  );
}
