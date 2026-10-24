/**
 * Copy for the Financing page, taken from the Figma "Financing" frames.
 * Contact targets are placeholders until dedicated destinations exist.
 */

// TODO: replace with a dedicated quote / finance-enquiry route when one exists
export const QUOTE_HREF = "/contact";
export const SALES_HREF = "/contact";

export const FINANCE_HOTLINES = ["0704 908 7160", "0803 722 2939", "0812 220 2053"];
export const ACCESS_BANK_HOTLINES = ["0700 300 0000"];
/** "Call finance hotline" dials the first IVM Auto Finance number. */
export const HERO_HOTLINE_HREF = `tel:${FINANCE_HOTLINES[0].replace(/\s/g, "")}`;

export type PlanPoint = {
  text: string;
  /**
   * The mobile Figma frame sets this one bullet at 16px while its siblings are
   * 14px. Kept to match the design exactly; likely a design slip.
   */
  mobileLarge?: boolean;
};

export type Plan = {
  id: string;
  eyebrow: string;
  title: string;
  description: string;
  points: PlanPoint[];
  cta: { label: string; href: string; variant: "primary" | "outline" };
  featured?: boolean;
};

export const PLANS: Plan[] = [
  {
    id: "outright",
    eyebrow: "Pay in full",
    title: "Outright purchase",
    description: "For buyers paying the full price upfront.",
    points: [
      { text: "Get a proforma invoice from IVM" },
      { text: "Pay in full", mobileLarge: true },
      { text: "Vehicle delivered anywhere in Nigeria" },
    ],
    cta: { label: "Get a Quote", href: QUOTE_HREF, variant: "outline" },
  },
  {
    id: "auto-finance",
    eyebrow: "With Access Bank",
    title: "IVM Auto Finance",
    description: "Spread the cost of a brand-new IVM vehicle.",
    points: [
      { text: "Repayments over up to 36 months" },
      { text: "Down payment paid at Access Bank" },
      { text: "Vehicle delivered anywhere in Nigeria" },
    ],
    cta: { label: "Start with Auto Finance", href: QUOTE_HREF, variant: "primary" },
    featured: true,
  },
  {
    id: "fleet",
    eyebrow: "Bulk orders",
    title: "Fleet & government",
    description: "For businesses, schools, hospitals and government agencies.",
    points: [
      { text: "Buses, pickups and utility vehicles" },
      { text: "Talk to our sales team about your order" },
      { text: "Delivery across Nigeria", mobileLarge: true },
    ],
    cta: { label: "Talk to sales", href: SALES_HREF, variant: "outline" },
  },
];

export const STEPS = [
  { title: "Choose your vehicle", body: "Pick the IVM model that fits your needs from our range." },
  {
    title: "Open an Access Bank account",
    body: "Visit any Access Bank branch to open an account for auto finance processing.",
  },
  {
    title: "Get your proforma invoice",
    body: "Contact IVM for a proforma invoice for your chosen vehicle once your account is confirmed.",
  },
  {
    title: "Pay the down payment",
    body: "Pay the required down payment at Access Bank, and we deliver your vehicle anywhere in Nigeria.",
  },
];

export type GoodToKnowIcon = "bank" | "repayments" | "insurance" | "ownership";

export const GOOD_TO_KNOW: { icon: GoodToKnowIcon; title: string; body: string }[] = [
  {
    icon: "bank",
    title: "Not an Access Bank customer?",
    body: "You can still apply — you’ll just need to open an Access Bank account first.",
  },
  {
    icon: "repayments",
    title: "Affordable repayments",
    body: "The bank checks that your monthly repayments fit comfortably within your income.",
  },
  {
    icon: "insurance",
    title: "Insurance included",
    body: "The bank insures the vehicle for the length of the plan, at the customer’s cost.",
  },
  {
    icon: "ownership",
    title: "Ownership",
    body: "The bank holds the vehicle’s title documents until the plan is fully repaid.",
  },
];

/**
 * FAQ. Only the first answer exists in Figma. The other four answers are NOT in
 * the design: they are short restatements of facts already stated elsewhere on
 * the page and need sign-off from the IVM finance team before launch.
 */
export const FAQS: { q: string; a: string }[] = [
  {
    q: "How long can I spread my payments?",
    a: "With IVM Auto Finance, repayments are spread over up to 36 months (3 years).",
  },
  {
    q: "How much is the down payment?",
    // TODO(content): confirm wording and any figures with the finance team
    a: "The down payment is paid at Access Bank. Call the IVM Auto Finance hotlines and we’ll confirm what applies to your chosen vehicle.",
  },
  {
    q: "Can I apply if I don’t bank with Access Bank?",
    // TODO(content): confirm wording with the finance team
    a: "Yes. You’ll just need to open an Access Bank account first.",
  },
  {
    q: "Where will my vehicle be delivered?",
    // TODO(content): confirm wording with the finance team
    a: "We deliver your vehicle anywhere in Nigeria.",
  },
  {
    q: "Which vehicles can I finance?",
    // TODO(content): confirm wording with the finance team
    a: "IVM Auto Finance is for brand-new IVM vehicles. Browse the range on our Vehicles page, or talk to our sales team about bulk orders.",
  },
];
