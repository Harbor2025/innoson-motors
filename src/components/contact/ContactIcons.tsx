import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaWhatsapp,
  FaXTwitter,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa6";
import type { IconType } from "react-icons";

interface IconProps {
  className?: string;
}

/* ---------- Contact icons (outline, white) ---------- */

export function MailIcon({ className = "" }: IconProps) {
  return <Mail className={className} color="white" strokeWidth={1.5} />;
}

export function PhoneIcon({ className = "" }: IconProps) {
  return <Phone className={className} color="white" strokeWidth={1.5} />;
}

export function LocationIcon({ className = "" }: IconProps) {
  return <MapPin className={className} color="white" strokeWidth={1.5} />;
}

/* ---------- Social icons: official glyphs on brand-blue circle ---------- */

function MonoSocial({
  Icon,
  className = "",
  label,
}: {
  Icon: IconType;
  className?: string;
  label: string;
}) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-center justify-center rounded-full bg-[#005EB8] ${className}`}
    >
      <Icon color="white" style={{ width: "50%", height: "50%" }} />
    </span>
  );
}

export const FacebookMonoIcon = ({ className }: IconProps) => (
  <MonoSocial Icon={FaFacebookF} className={className} label="Facebook" />
);

export const LinkedInMonoIcon = ({ className }: IconProps) => (
  <MonoSocial Icon={FaLinkedinIn} className={className} label="LinkedIn" />
);

export const WhatsAppMonoIcon = ({ className }: IconProps) => (
  <MonoSocial Icon={FaWhatsapp} className={className} label="WhatsApp" />
);

export const XMonoIcon = ({ className }: IconProps) => (
  <MonoSocial Icon={FaXTwitter} className={className} label="X" />
);

export const InstagramMonoIcon = ({ className }: IconProps) => (
  <MonoSocial Icon={FaInstagram} className={className} label="Instagram" />
);

export const YouTubeMonoIcon = ({ className }: IconProps) => (
  <MonoSocial Icon={FaYoutube} className={className} label="YouTube" />
);