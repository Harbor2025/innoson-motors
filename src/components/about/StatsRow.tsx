import Image from "next/image";
import Container from "../layout/Container";

export default function StatsRow() {
  return (
    <section className="white py-8 lg:py-[45px]">
      <Container className="flex flex-col items-center gap-10 lg:flex-row lg:items-center lg:justify-center lg:gap-[138px]">
        <div className="flex flex-col items-center gap-0 lg:items-start">
          <p className="text-[24px] leading-[normal] text-[#1e1e1e]">100K+</p>
          <p className="text-[14px] leading-[normal] text-[#1e1e1e]">Employees</p>
        </div>

        <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:gap-[15px] lg:text-left">
          <Image src="/images/africa.png" alt="" width={42} height={42} />
          <p className="max-w-[262px] text-[20px] leading-[31px] text-[#1e1e1e]">
            1ST Africa&rsquo;s Automobile Brand
          </p>
        </div>

        <div className="flex flex-col items-center gap-0 lg:items-start">
          <p className="text-[24px] leading-[normal] text-[#1e1e1e]">0%</p>
          <p className="text-[14px] leading-[normal] text-[#1e1e1e]">Imported Parts</p>
        </div>
      </Container>
    </section>
  );
}