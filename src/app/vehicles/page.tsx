import type { Metadata } from "next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import VehiclesPageContent from "@/components/vehicles/VehiclesPageContent";

export const metadata: Metadata = {
  title: "Vehicles | Innoson Vehicle Manufacturing",
};

export default function VehiclesPage() {
  return (
    <>
      <Header />
      <main>
        <VehiclesPageContent />
      </main>
      <Footer />
    </>
  );
}