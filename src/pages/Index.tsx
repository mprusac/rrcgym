import { useEffect } from "react";
import Navbar from "@/components/sections/Navbar";
import Hero from "@/components/sections/Hero";
import Soldic from "@/components/sections/Soldic";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Disciplines from "@/components/sections/Disciplines";
import Coaches from "@/components/sections/Coaches";
import Facility from "@/components/sections/Facility";
import ProCamp from "@/components/sections/ProCamp";
import Schedule from "@/components/sections/Schedule";
import Membership from "@/components/sections/Membership";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/sections/Footer";

const Index = () => {
  useEffect(() => {
    // JSON-LD for local SEO
    const ld = {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: "RRC Gym",
      description:
        "Borilački centar svjetske klase u Vitezu, BiH. MMA, BJJ, kickboxing i boks pod vodstvom Roberta Soldića.",
      address: {
        "@type": "PostalAddress",
        streetAddress: "Divjak b.b.",
        addressLocality: "Vitez",
        postalCode: "72250",
        addressCountry: "BA",
      },
      geo: { "@type": "GeoCoordinates", latitude: 44.168061, longitude: 17.772802 },
      openingHours: "Mo-Su 09:00-20:30",
      sport: ["MMA", "Brazilian Jiu-Jitsu", "Kickboxing", "Boks"],
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(ld);
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <h1 className="sr-only">RRC Gym Vitez — Borilački centar Roberta Soldića</h1>
      <Hero />
      <Soldic />
      <About />
      <Disciplines />
      <Coaches />
      <Facility />
      <ProCamp />
      <Schedule />
      <Membership />
      <Contact />
      <Footer />
    </main>
  );
};

export default Index;
