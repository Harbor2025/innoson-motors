import type { Metadata } from "next";
import RevampNav from "@/components/revamp/RevampNav";
import RevampFooter from "@/components/revamp/RevampFooter";
import BookTestDriveClient from "@/components/test-drive/BookTestDriveClient";
import { getPublishedModels } from "@/server/models";
import { listDealerships } from "@/server/globals";
import { modelsAsVehicleCards } from "@/lib/adapters";
import type { DealershipDTO } from "@/types/dto";

export const metadata: Metadata = {
  title: "Book a Test Drive | Innoson Vehicle Manufacturing",
  description:
    "Book a test drive at your nearest IVM showroom - choose any Innoson model.",
};

export const revalidate = 60;

export default async function BookTestDrivePage() {
  let vehicles: ReturnType<typeof modelsAsVehicleCards> | undefined;
  try {
    const res = await getPublishedModels({ limit: 50 });
    vehicles = modelsAsVehicleCards(res.docs);
  } catch {
    vehicles = undefined;
  }

  let dealerships: DealershipDTO[] = [];
  try {
    dealerships = await listDealerships();
  } catch {
    dealerships = [];
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-[family-name:var(--font-ivm-inter)]">
      <RevampNav />
      <main className="flex-1">
        <BookTestDriveClient initialVehicles={vehicles} dealerships={dealerships} />
      </main>
      <RevampFooter />
    </div>
  );
}
