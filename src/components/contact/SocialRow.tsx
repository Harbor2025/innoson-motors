import { FacebookMonoIcon, LinkedInMonoIcon, WhatsAppMonoIcon } from "./ContactIcons";

export default function SocialRow() {
  return (
    <div className="font-[family-name:var(--font-google-sans)] flex flex-col items-center gap-4 py-12 lg:gap-4 lg:py-16">
      <p className="text-[16px] font-extrabold tracking-[0.005em] text-[#1e1e1e] lg:text-[24px]">
        Follow Us:
      </p>
      <div className="flex items-center gap-8 lg:gap-10">
        <a href="#" aria-label="Facebook">
          <FacebookMonoIcon className="size-8" />
        </a>
        <a href="#" aria-label="LinkedIn">
          <LinkedInMonoIcon className="size-8" />
        </a>
        <a href="#" aria-label="WhatsApp">
          <WhatsAppMonoIcon className="size-8" />
        </a>
      </div>
    </div>
  );
}
