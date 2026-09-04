"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "./Container";

const NAV_COLUMNS = [
  {
    heading: "Vehicles",
    links: ["SUV", "Pickup", "MPV", "Cars", "Bus", "EV"],
  },
  {
    heading: "IVM",
    links: ["News", "Find Showroom", "Book a Test Drive"],
  },
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function Footer() {
  return (
    <footer className="font-[family-name:var(--font-google-sans)] w-full bg-[#002a52] pt-6 text-white lg:rounded-[6px]">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="mx-auto flex flex-col items-center gap-[7px] text-[13px] text-[#d9d9d9]"
      >
        <Image
          src="/icons/icon-back-to-top.svg"
          alt=""
          width={14}
          height={7}
          className="rotate-90"
        />
        Up
      </button>

      <Container className="mt-6 flex flex-col gap-10 lg:mt-[100px] lg:gap-16">
        {/* Brand + nav columns row (desktop); brand block stands alone on mobile */}
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between lg:gap-0">
          <div className="flex max-w-[499px] flex-col gap-4">
            <Image
              src="/images/logo-footer.png"
              alt="Innoson Vehicle Manufacturing"
              width={111}
              height={66}
              className="h-[66px] w-[111px] object-contain"
            />
            <div className="flex flex-col gap-3">
              <h2 className="text-[24px] font-bold capitalize leading-[normal] lg:text-[33px] lg:leading-[42px]">
                The Future of Mobility.
              </h2>
              <p className="max-w-[472px] text-[14px] font-light leading-[normal] lg:text-[17px] lg:leading-[27px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean consectetur massa
                in turpis commodo, id ultrices nisi tincidunt. Lorem ipsum dolor sit amet,
                consectetur adipiscing elit.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-[91px] gap-y-10">
            {NAV_COLUMNS.map((column) => (
              <div key={column.heading} className="flex flex-col gap-5">
                <h3 className="text-[22px] font-black leading-[20px]">{column.heading}</h3>
                <ul className="flex flex-col gap-4 text-[14px] leading-[20px]">
                  {column.links.map((link) => (
                    <li key={link}>
                      <Link href="#">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="flex flex-col gap-4 lg:w-[300px]">
              <h3 className="text-[22px] font-black leading-[20px]">Help &amp; Support</h3>
              <div className="flex flex-col gap-4 text-[14px] leading-normal">
                <a href="mailto:Support@innosonmotors.com" className="flex items-center gap-2">
                  <Image src="/icons/icon-email.svg" alt="" width={24} height={24} />
                  Support@innosonmotors.com
                </a>
                <a href="tel:+23407xxxxxxxxxxxxxxxxx" className="flex items-center gap-2">
                  <Image src="/icons/icon-phone.svg" alt="" width={24} height={24} />
                  +23407xxxxxxxxxxxxxxxxx
                </a>
                <div className="flex items-start gap-2 capitalize tracking-[0.07px]">
                  <Image
                    src="/icons/icon-location.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  <div className="flex flex-col gap-2">
                    <p>No 2 Innoson Industrial Estate, Akwa-Uru, Uru Umudim, Nnewi, Anambra State</p>
                    <p>IVM Service Center, Lekki/ Ajah express Way, After Cosharis Ibeju Lekki</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <form className="flex flex-col gap-4 lg:gap-6" onSubmit={(e) => e.preventDefault()}>
          <div className="flex flex-col gap-2">
            <h3 className="text-[24px] font-bold tracking-[0.5px] leading-[normal]">
              Join our newsletter
            </h3>
            <p className="text-[16px] tracking-[0.5px] leading-[normal] text-[#e1e1e1]">
              Sign up to receive or weekly newsletter about new and trending discount offers
            </p>
          </div>
          <div className="flex flex-col gap-2 lg:flex-row">
            <input
              type="email"
              required
              placeholder="Email address"
              className="h-[48px] flex-1 rounded-[5px] border-[0.5px] border-white bg-transparent px-[10px] text-[16px] tracking-[0.5px] text-white placeholder:text-[#b0b0b0]"
            />
            <button
              type="submit"
              className="flex h-[48px] w-full items-center justify-center rounded-[6px] bg-white px-[14px] text-[16px] font-bold tracking-[0.192px] text-[#00a0ff] lg:w-[158px]"
            >
              Submit
            </button>
          </div>
        </form>
      </Container>

      <Container className="mt-10 flex flex-col items-center gap-[30px] pb-10 lg:mt-16">
        <div className="h-px w-full bg-white/30" />
        <p className="text-center text-[13px] leading-[20px]">
          ©Copyright 2025. All rights reserved (Innoson Manufacturing Vehicles, LTD)
        </p>
      </Container>
    </footer>
  );
}
