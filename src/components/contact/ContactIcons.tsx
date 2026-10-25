import { Mail, MapPin, Phone } from "lucide-react";

interface IconProps {
  className?: string;
}

/* ---------- Contact icons (outline, inherit the brand blue from their parent) ---------- */

export function MailIcon({ className = "" }: IconProps) {
  return <Mail className={className} strokeWidth={1.5} aria-hidden="true" />;
}

export function PhoneIcon({ className = "" }: IconProps) {
  return <Phone className={className} strokeWidth={1.5} aria-hidden="true" />;
}

export function LocationIcon({ className = "" }: IconProps) {
  return <MapPin className={className} strokeWidth={1.5} aria-hidden="true" />;
}
