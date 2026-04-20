import type { Metadata } from "next";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FindCentersClient from "./FindCentersClient";

export const metadata: Metadata = {
  title: "Find Centers | VaxCare",
  description: "Discover nearby vaccination centers with real-time slot availability.",
};

export default function FindCentersPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <Navbar />
      <main style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <FindCentersClient />
      </main>
      <Footer />
    </div>
  );
}
