import { getContactInfo } from "@/server/globals";

/** WhatsApp link from the CMS social links, or undefined when unavailable (e.g. DB down). */
export async function getWhatsAppUrl(): Promise<string | undefined> {
  try {
    const info = await getContactInfo();
    return info.socialLinks.find((s) => s.platform.toLowerCase() === "whatsapp")?.url;
  } catch {
    return undefined;
  }
}
