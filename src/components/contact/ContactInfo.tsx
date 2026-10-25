import { Fragment } from "react";
import { MailIcon, PhoneIcon, LocationIcon } from "./ContactIcons";
import {
  EMAIL as EMAIL_FB,
  FACTORY_ADDRESS as ADDR_FB,
  PHONE_NUMBERS as PHONES_FB,
} from "./contact-data";
import type { ContactInfoDTO } from "@/types/dto";

/** 08037222939 -> 0803 722 2939 */
function formatPhone(number: string) {
  const digits = number.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }
  return number;
}

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
    <div className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[rgba(0,94,184,0.08)] text-ivm-blue">
        <span className="size-5">{icon}</span>
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="text-[16px] font-bold leading-[1.4] text-ivm-n900">{label}</p>
        <div className="text-[16px] leading-[1.4] text-ivm-n600">{children}</div>
      </div>
    </div>
  );
}

type Props = {
  className?: string;
  contactInfo?: ContactInfoDTO;
};

/**
 * Figma: "Contact details" column of "Section – Get in Touch". Sales lines are
 * shown two numbers per line, like the design.
 */
export default function ContactInfo({ className = "", contactInfo }: Props) {
  const email = contactInfo?.emails[0] ?? EMAIL_FB;
  const phones =
    contactInfo?.phones && contactInfo.phones.length > 0
      ? contactInfo.phones.map((p) => p.number)
      : PHONES_FB;
  const address = contactInfo?.address ?? ADDR_FB;

  const phoneRows: string[][] = [];
  for (let i = 0; i < phones.length; i += 2) {
    phoneRows.push(phones.slice(i, i + 2));
  }

  return (
    <div className={`flex w-full min-w-0 flex-col gap-8 ${className}`}>
      <div className="flex flex-col gap-[10px]">
        <h2
          id="get-in-touch-title"
          className="text-[32px] font-semibold leading-[1.2] text-ivm-n900 md:text-[40px] xl:text-[48px]"
        >
          Get in touch
        </h2>
        <p className="text-[16px] leading-[1.4] text-ivm-n600 md:text-[20px]">
          Call, email or send us a message. For showroom visits, see the locations below.
        </p>
      </div>

      <div className="flex flex-col gap-8">
        <InfoRow icon={<PhoneIcon className="size-full" />} label="Sales lines">
          <div className="flex flex-col gap-1">
            {phoneRows.map((row, rowIndex) => (
              <p key={rowIndex}>
                {row.map((number, index) => (
                  <Fragment key={number}>
                    <a
                      href={`tel:${number.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-ivm-blue"
                    >
                      {formatPhone(number)}
                    </a>
                    {index < row.length - 1 ? " · " : null}
                  </Fragment>
                ))}
              </p>
            ))}
          </div>
        </InfoRow>

        <InfoRow icon={<MailIcon className="size-full" />} label="Email">
          <a
            href={`mailto:${email}`}
            className="break-words transition-colors hover:text-ivm-blue"
          >
            {email}
          </a>
        </InfoRow>

        <InfoRow icon={<LocationIcon className="size-full" />} label="Factory & head office">
          <p>{address}</p>
        </InfoRow>
      </div>
    </div>
  );
}
