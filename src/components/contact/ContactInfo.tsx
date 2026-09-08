import { EMAIL, FACTORY_ADDRESS, PHONE_NUMBERS, SHOWROOMS } from "./contact-data";
import { MailIcon, PhoneIcon, LocationIcon } from "./ContactIcons";

function InfoRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-4 lg:gap-4">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#005eb8] lg:size-10">
        <span className="size-6 lg:size-[30px]">{icon}</span>
      </span>
      <div className="flex flex-col gap-2">
        <p className="text-[16px] font-extrabold tracking-[0.005em] text-black lg:text-[24px]">{label}</p>
        <div className="text-[14px] leading-[22px] tracking-[0.005em] text-[#8a8a8a] lg:text-[20px] lg:leading-[31px]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ContactInfo({ className = "" }: { className?: string }) {
  return (
    <div className={`font-[family-name:var(--font-google-sans)] flex w-full flex-col gap-6 lg:w-[522px] lg:gap-10 ${className}`}>
      <div className="flex flex-col gap-3">
        <h2 className="text-[20px] font-extrabold text-[#333333] lg:text-[40px] lg:leading-[62px]">
          Get In Touch with us
        </h2>
        <p className="text-[14px] leading-[22px] tracking-[0.02em] text-[#8a8a8a] lg:text-[20px] lg:leading-[31px]">
          Lorem ipsum dolor sit amet consectetur. Pulvinar dolor nunc
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:gap-10">
        <InfoRow icon={<MailIcon className="size-full" />} label="E-Mail">
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
        </InfoRow>

        <InfoRow icon={<PhoneIcon className="size-full" />} label="Phone Numbers">
          <div className="flex flex-col">
            {PHONE_NUMBERS.map((number) => (
              <a key={number} href={`tel:${number}`}>
                {number}
              </a>
            ))}
          </div>
        </InfoRow>

        <InfoRow icon={<LocationIcon className="size-full" />} label="Factory Address">
          <p>{FACTORY_ADDRESS}</p>
        </InfoRow>
      </div>

      <div className="flex flex-col gap-3 lg:gap-3">
        <h3 className="text-[16px] font-extrabold capitalize text-black lg:text-[24px]">Showroom Addresses</h3>

        <div className="flex flex-col gap-6 lg:gap-8">
          {SHOWROOMS.map((showroom) => (
            <div key={showroom.city} className="flex flex-col gap-3">
              <p className="text-[14px] font-extrabold uppercase tracking-[0.005em] text-[#1e1e1e] lg:text-[20px]">
                {showroom.city}
              </p>
              {showroom.subLocations ? (
                showroom.subLocations.map((loc) => (
                  <p
                    key={loc.label}
                    className="text-[14px] font-extrabold leading-[22px] tracking-[0.005em] text-[#524e4e] lg:text-[20px] lg:leading-[31px]"
                  >
                    <span>{loc.label} – </span>
                    {loc.address}
                  </p>
                ))
              ) : (
                <p className="text-[14px] leading-[22px] tracking-[0.005em] text-[#8a8a8a] lg:text-[20px] lg:leading-[31px]">
                  {showroom.address}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}