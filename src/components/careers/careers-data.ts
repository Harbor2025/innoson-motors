/** General enquiries address used for CVs and role applications. */
export const CAREERS_EMAIL = "Enquiries@innosonmotors.com";

export const DEPARTMENTS = [
  "All",
  "Production",
  "Engineering",
  "Sales",
  "After-sales",
  "Corporate",
] as const;

export type Department = (typeof DEPARTMENTS)[number];

export const LOCATIONS = ["All locations", "Nnewi", "Abuja", "Lagos", "Enugu"] as const;

export type Location = (typeof LOCATIONS)[number];

export type Role = {
  id: string;
  title: string;
  department: Exclude<Department, "All">;
  location: Exclude<Location, "All locations">;
  type: string;
};

/** Figma "Open roles · sample" list. */
export const ROLES: Role[] = [
  {
    id: "production-line-technician",
    title: "Production Line Technician",
    department: "Production",
    location: "Nnewi",
    type: "Full-time",
  },
  {
    id: "quality-control-inspector",
    title: "Quality Control Inspector",
    department: "Production",
    location: "Nnewi",
    type: "Full-time",
  },
  {
    id: "automotive-electrician",
    title: "Automotive Electrician",
    department: "Engineering",
    location: "Nnewi",
    type: "Full-time",
  },
  {
    id: "sales-executive-abuja",
    title: "Sales Executive",
    department: "Sales",
    location: "Abuja",
    type: "Full-time",
  },
  {
    id: "sales-executive-lagos",
    title: "Sales Executive",
    department: "Sales",
    location: "Lagos",
    type: "Full-time",
  },
  {
    id: "service-advisor-enugu",
    title: "Service Advisor",
    department: "After-sales",
    location: "Enugu",
    type: "Full-time",
  },
];

export const CAREER_PILLARS = [
  {
    id: "build",
    title: "Build at scale",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
    icon: "factory",
  },
  {
    id: "learn",
    title: "Learn on the line",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
    icon: "learn",
  },
  {
    id: "grow",
    title: "Grow with us",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
    icon: "grow",
  },
  {
    id: "team",
    title: "A team of thousands",
    body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus.",
    icon: "team",
  },
] as const;

export const roleMailto = (role: Role) =>
  `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
    `Application: ${role.title} (${role.location})`,
  )}`;

export const CV_MAILTO = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(
  "Career enquiry — CV",
)}`;
