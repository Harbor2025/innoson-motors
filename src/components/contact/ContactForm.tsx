"use client";

import { useState, type FormEvent } from "react";
import { VEHICLE_BRANDS } from "./contact-data";

export default function ContactForm({ className = "" }: { className?: string }) {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  function toggleBrand(brand: string) {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    e.currentTarget.reset();
    setSelectedBrands([]);
  }

  const inputClasses =
    "h-[48px] w-full rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 text-[16px] text-black outline-none placeholder:text-[#888888]";

  return (
    <div
      className={`font-[family-name:var(--font-google-sans)] w-full rounded-[9px] border-[0.5px] border-[#e6e6e6] bg-white p-3 lg:w-[684px] lg:p-[30px] ${className}`}
    >
      <h2 className="text-[20px] font-extrabold text-[#333333] lg:text-[40px] lg:leading-[62px]">
        Send a Message
      </h2>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4 lg:mt-10 lg:gap-6">
        <input type="text" name="name" placeholder="Name" required className={inputClasses} />
        <input type="tel" name="phone" placeholder="Phone Number" required className={inputClasses} />

        <div className="flex flex-col gap-4">
          <p className="text-[14px] font-extrabold uppercase text-[#1e1e1e] lg:text-[16px]">
            Choose your interested vehicle brand
          </p>
          <div className="flex flex-col gap-3">
            {VEHICLE_BRANDS.map((brand: string) => (
              <label key={brand} className="flex items-center gap-2 text-[14px] uppercase text-black">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => toggleBrand(brand)}
                  className="size-6 shrink-0 rounded-[6px] border-[1.15px] border-[#d5d7da] accent-[#005eb8]"
                />
                {brand}
              </label>
            ))}
          </div>
        </div>

        <input type="email" name="email" placeholder="Email Address" required className={inputClasses} />
        <input type="text" name="subject" placeholder="Subject" required className={inputClasses} />
        <textarea
          name="message"
          placeholder="Write a message"
          required
          rows={4}
          className="w-full resize-none rounded-[4px] border-[0.5px] border-[#cfcfcf] px-3 py-3 text-[16px] text-black outline-none placeholder:text-[#888888]"
        />

        <button
          type="submit"
          className="flex h-[48px] w-full items-center justify-center rounded-[4px] bg-[#005eb8] text-[14px] font-extrabold text-white"
        >
          Submit
        </button>

        {submitted && (
          <p className="text-[14px] text-[#005eb8]" role="status">
            Thanks — we&rsquo;ve received your message and will get back to you soon.
          </p>
        )}
      </form>
    </div>
  );
}