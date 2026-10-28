"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DEPARTMENTS,
  LOCATIONS,
  ROLES,
  roleMailto,
  type Department,
  type Location,
} from "./careers-data";

const INPUT =
  "h-12 w-full appearance-none rounded-[8px] border border-ivm-n200 bg-white py-0 pl-4 pr-10 text-[16px] leading-[1.4] text-ivm-n900 outline-none transition-colors focus:border-ivm-blue focus:ring-1 focus:ring-ivm-blue";

const FILTER_BASE =
  "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-semibold leading-[1.4] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ivm-blue";

/** Figma: "Section – Open Roles" — location select, department filters, role list. */
export default function OpenRoles() {
  const [department, setDepartment] = useState<Department>("All");
  const [location, setLocation] = useState<Location>("All locations");

  const roles = useMemo(
    () =>
      ROLES.filter(
        (role) =>
          (department === "All" || role.department === department) &&
          (location === "All locations" || role.location === location),
      ),
    [department, location],
  );

  return (
    <section
      id="open-roles"
      aria-labelledby="open-roles-title"
      className="flex scroll-mt-14 flex-col gap-5 px-4 pt-16 md:px-6 xl:gap-7 xl:px-24 xl:pt-28"
    >
      <div className="flex flex-col gap-[10px] xl:flex-row xl:items-end xl:justify-between xl:gap-0">
        <div className="flex flex-col gap-[10px]">
          <p className="text-[12px] font-semibold uppercase leading-[normal] tracking-[1.44px] text-ivm-blue">
            Open roles
          </p>
          <h2
            id="open-roles-title"
            className="text-[24px] font-semibold leading-[1.2] text-ivm-n900 md:text-[32px] xl:text-[48px]"
          >
            Join the team
          </h2>
        </div>

        <div className="flex w-full flex-col gap-[6px] xl:w-[260px] xl:shrink-0">
          <label
            htmlFor="careers-location"
            className="text-[14px] font-semibold leading-[1.4] text-ivm-n900"
          >
            Location
          </label>
          <div className="relative">
            <select
              id="careers-location"
              value={location}
              onChange={(event) => setLocation(event.target.value as Location)}
              className={`${INPUT} ${location === "All locations" ? "text-ivm-n500" : ""}`}
            >
              {LOCATIONS.map((option) => (
                <option key={option} value={option}>
                  {option === "All locations" ? "Choose a location" : option}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              size={18}
              strokeWidth={1.35}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#757575]"
            />
          </div>
        </div>
      </div>

      <div className="hv-noscrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0 xl:gap-2">
        {DEPARTMENTS.map((option) => {
          const selected = department === option;
          return (
            <button
              key={option}
              type="button"
              aria-pressed={selected}
              onClick={() => setDepartment(option)}
              className={`${FILTER_BASE} ${
                selected
                  ? "bg-ivm-n900 text-white"
                  : "bg-ivm-n50 text-ivm-n900 hover:bg-ivm-n200"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <p className="sr-only" role="status" aria-live="polite">
        {roles.length} open {roles.length === 1 ? "role" : "roles"}
      </p>

      {roles.length > 0 ? (
        <ul className="flex flex-col">
          {roles.map((role) => (
            <li key={role.id} className="border-b border-ivm-n200 first:border-t">
              <div className="flex flex-col gap-2 py-5 xl:flex-row xl:items-center xl:gap-6 xl:py-6">
                <div className="flex flex-col gap-[6px] xl:min-w-0 xl:flex-1">
                  <h3 className="text-[20px] font-semibold leading-[1.3] text-ivm-n900 md:text-[24px] md:leading-[1.2]">
                    {role.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-2 gap-y-[6px]">
                    {[role.department, role.location, role.type].map((tag) => (
                      <span
                        key={tag}
                        className="whitespace-nowrap rounded-[4px] bg-ivm-n50 px-[10px] py-1 text-[12px] font-medium leading-[1.4] text-ivm-n600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <a
                  href={roleMailto(role)}
                  aria-label={`View role: ${role.title} in ${role.location}`}
                  className="self-start text-[16px] font-medium leading-[1.4] text-ivm-blue transition-opacity hover:opacity-80 xl:self-auto"
                >
                  View role <span aria-hidden="true">→</span>
                </a>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-start gap-2 rounded-[12px] bg-ivm-n50 p-6">
          <p className="text-[16px] font-semibold leading-[1.4] text-ivm-n900">
            No open roles match these filters.
          </p>
          <p className="text-[14px] leading-[1.4] text-ivm-n600">
            Try another department or location, or send us your CV and we’ll keep you in mind.
          </p>
        </div>
      )}
    </section>
  );
}
