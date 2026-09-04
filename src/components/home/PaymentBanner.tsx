import Image from "next/image";
import Link from "next/link";
import Container from "../layout/Container";

export default function PaymentBanner() {
  return (
    <section className="font-[family-name:var(--font-google-sans)] w-full py-16 lg:py-[100px]">
      <Container className="flex flex-col items-start gap-10 lg:flex-row lg:items-center">
        <div className="relative h-[352px] w-full shrink-0 overflow-hidden bg-[#d5d4d4] lg:h-[484px] lg:w-[785px]">
          <Image
            src="/images/payment-bg.png"
            alt="Handing over car keys after a purchase"
            fill
            sizes="(min-width: 1024px) 785px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col gap-6 lg:w-[565px] lg:gap-10">
          <div className="flex flex-col items-start gap-4 lg:gap-6">
            <h2 className="text-[24px] font-bold leading-[normal] text-black lg:text-[32px]">
              ACCESS PAYMENT WITH OUR FLEXIBLE PAYMENT STRUCTURE
            </h2>
            <p className="text-[14px] leading-[normal] text-[#1e1e1e] lg:text-[19px]">
              Our collaboration with Access Bank allows you to access structured payment plans
              and financing solutions that make transitioning to electric mobility simple and
              affordable
            </p>
          </div>
          <Link
            href="/financing"
            className="w-fit text-[20px] font-normal leading-[normal] text-[#005eb8] underline underline-offset-4 lg:text-[32px]"
          >
            Learn More
          </Link>
        </div>
      </Container>
    </section>
  );
}
