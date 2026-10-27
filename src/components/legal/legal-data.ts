/**
 * Placeholder legal copy. The structure and the Privacy Policy wording come
 * straight from Figma; the Terms and Cookie tabs mirror that structure so the
 * tabs are functional. Replace with approved legal text before launch.
 */

export type LegalDocumentId = "privacy" | "terms" | "cookies";

export type LegalSection = {
  id: string;
  /** Heading shown in the document body. */
  heading: string;
  /** Shorter label shown in the "On this page" list. */
  nav: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  id: LegalDocumentId;
  tab: string;
  title: string;
  intro: string;
  sections: LegalSection[];
  contactTitle: string;
};

const LOREM =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus. Maecenas faucibus mollis interdum, nulla vitae elit libero, a pharetra augue. Donec ullamcorper nulla non metus auctor fringilla.";

const LOREM_SHORT =
  "Vestibulum id ligula porta felis euismod semper. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.";

const BULLETS = [
  "Lorem ipsum dolor sit amet, consectetur.",
  "Integer posuere erat a ante venenatis.",
  "Maecenas faucibus mollis interdum.",
];

export const LAST_UPDATED = "27 October 2026";

export const LEGAL_EMAIL = "Enquiries@innosonmotors.com";

export const LEGAL_ADDRESS =
  "Innoson Vehicle Manufacturing Co. Ltd, No 2 Innoson Industrial Estate, Akwa-Uru, Uru Umudim, Nnewi, Anambra State";

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "privacy",
    tab: "Privacy Policy",
    title: "Privacy Policy",
    intro: LOREM,
    contactTitle: "Questions about your data?",
    sections: [
      {
        id: "information-we-collect",
        heading: "1. Information we collect",
        nav: "1. Information we collect",
        paragraphs: [LOREM],
        bullets: BULLETS,
      },
      {
        id: "how-we-use-your-information",
        heading: "2. How we use your information",
        nav: "2. How we use your information",
        paragraphs: [LOREM, LOREM_SHORT],
      },
      {
        id: "sharing-your-information",
        heading: "3. Sharing your information",
        nav: "3. Sharing your information",
        paragraphs: [LOREM],
      },
      {
        id: "how-long-we-keep-it",
        heading: "4. How long we keep it",
        nav: "4. How long we keep it",
        paragraphs: [LOREM],
      },
      {
        id: "your-rights",
        heading: "5. Your rights",
        nav: "5. Your rights",
        paragraphs: [LOREM],
        bullets: BULLETS,
      },
      {
        id: "cookies",
        heading: "6. Cookies",
        nav: "6. Cookies",
        paragraphs: [LOREM],
      },
      {
        id: "contact-us",
        heading: "7. Contact us",
        nav: "7. Contact us",
        paragraphs: [LOREM],
      },
    ],
  },
  {
    id: "terms",
    tab: "Terms of Use",
    title: "Terms of Use",
    intro: LOREM,
    contactTitle: "Questions about these terms?",
    sections: [
      {
        id: "acceptance-of-terms",
        heading: "1. Acceptance of terms",
        nav: "1. Acceptance of terms",
        paragraphs: [LOREM],
      },
      {
        id: "vehicle-orders-and-pricing",
        heading: "2. Vehicle orders and pricing",
        nav: "2. Vehicle orders and pricing",
        paragraphs: [LOREM, LOREM_SHORT],
      },
      {
        id: "delivery-and-inspection",
        heading: "3. Delivery and inspection",
        nav: "3. Delivery and inspection",
        paragraphs: [LOREM],
      },
      {
        id: "warranty-and-servicing",
        heading: "4. Warranty and servicing",
        nav: "4. Warranty and servicing",
        paragraphs: [LOREM],
        bullets: BULLETS,
      },
      {
        id: "limitation-of-liability",
        heading: "5. Limitation of liability",
        nav: "5. Limitation of liability",
        paragraphs: [LOREM],
      },
      {
        id: "governing-law",
        heading: "6. Governing law",
        nav: "6. Governing law",
        paragraphs: [LOREM],
      },
      {
        id: "terms-contact-us",
        heading: "7. Contact us",
        nav: "7. Contact us",
        paragraphs: [LOREM],
      },
    ],
  },
  {
    id: "cookies",
    tab: "Cookie Policy",
    title: "Cookie Policy",
    intro: LOREM,
    contactTitle: "Questions about cookies?",
    sections: [
      {
        id: "what-cookies-are",
        heading: "1. What cookies are",
        nav: "1. What cookies are",
        paragraphs: [LOREM],
      },
      {
        id: "cookies-we-use",
        heading: "2. Cookies we use",
        nav: "2. Cookies we use",
        paragraphs: [LOREM],
        bullets: BULLETS,
      },
      {
        id: "analytics-and-performance",
        heading: "3. Analytics and performance",
        nav: "3. Analytics and performance",
        paragraphs: [LOREM, LOREM_SHORT],
      },
      {
        id: "managing-cookies",
        heading: "4. Managing cookies",
        nav: "4. Managing cookies",
        paragraphs: [LOREM],
      },
      {
        id: "third-party-cookies",
        heading: "5. Third-party cookies",
        nav: "5. Third-party cookies",
        paragraphs: [LOREM],
      },
      {
        id: "updates-to-this-policy",
        heading: "6. Updates to this policy",
        nav: "6. Updates to this policy",
        paragraphs: [LOREM],
      },
      {
        id: "cookies-contact-us",
        heading: "7. Contact us",
        nav: "7. Contact us",
        paragraphs: [LOREM],
      },
    ],
  },
];
