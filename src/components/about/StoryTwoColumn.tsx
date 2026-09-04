import Image from "next/image";
import Container from "../layout/Container";

const BODY = `We are manufacturing durable and affordable brand new automobiles for Africans. Our brand new automobiles are selling for almost the cost of their tokunbo equivalents. And they are as good as any foreign automobile brand you know. The statistics are alarming, according to a recent research by PricewatershouseCoopers (PwC), the ratio of brand new automobiles to foreign used ones on Nigerian road is 1 : 131. Meaning that for every brand new car bought, there are 131 tokunbo ones!`;

export default function StoryWithImage() {
  return (
    <section className="12 lg:py-16">
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-[82px]">
        <div className="order-1 flex flex-col gap-4 lg:order-2 lg:max-w-[741px] lg:gap-6">
          <p className="text-[14px] leading-[normal] text-[#878383] lg:text-[17px]">OUR STORY</p>
          <h2 className="text-[24px] font-extrabold uppercase leading-[normal] text-[#1e1e1e] lg:text-[40px] lg:leading-[62px]">
            Made in Nigeria
          </h2>
          <h3 className="text-[20px]  leading-[normal] text-[#1e1e1e] lg:text-[34px] lg:leading-[62px]">
            Present
          </h3>
          <p className="text-[16px] leading-[27px] text-[#1e1e1e] lg:text-[19px]">{BODY}</p>
        </div>

        <div className="order-2 flex flex-col gap-4 lg:order-2 lg:max-w-[741px] lg:gap-6">
          <p className="text-[14px] leading-[normal] text-[#878383] lg:text-[17px]"></p>
          <h3 className="text-[20px] leading-[normal] text-[#1e1e1e] lg:text-[34px] lg:leading-[62px] lg:mt-[100px]">
            Present
          </h3>
          <p className="text-[16px] leading-[27px] text-[#1e1e1e] lg:text-[19px]">{BODY}</p>
        </div>
      </Container>
    </section>
  );
}