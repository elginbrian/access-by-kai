import TrainNavigation from "@/components/trains/navbar/TrainNavigation";
import Footer from "@/components/footer/Footer";
import SearchCard from "@/components/onboarding/search/SearchCard";
import ServicesSection from "@/components/onboarding/services/ServicesSection";
import PromotionsSection from "@/components/onboarding/promotions/PromotionsSection";
import DestinationSection from "@/components/onboarding/destinations/DestinationSection";
import WhyChooseSection from "@/components/onboarding/whyChoose/WhyChooseSection";
import DiscountsSection from "@/components/onboarding/discounts/DiscountsSection";
import FAQSection from "@/components/onboarding/faq/FAQSection";
import HelpSection from "@/components/onboarding/help/HelpSection";
import { colors } from "./design-system";
import KAIPay from "@/components/KAIPay";
import ServSection from "@/components/onboarding/services/ServSection";
import TrainBookingSection from "@/components/trains/TrainBookingSection";

export default function Home() {
  return (
    <div className="bg-white min-h-screen w-full relative">
      <TrainNavigation />

      <section className="relative w-full h-[600px] overflow-hidden rounded-b-[32px]">
        <img src="/header.png" alt="Onboarding Background" className="absolute inset-0 w-full h-full object-cover rounded-b-[32px]" />
        <div className="absolute inset-0 bg-black opacity-30 z-10" />
        <div className="relative z-20 h-full flex flex-col items-center justify-center text-center">
          <h1 className="text-[56px] font-bold text-white mb-0 leading-tight drop-shadow-lg">
            Lepaskan Penat Kota,
            <br />
            <span className="text-[#a29bfe]">Temukan Perjalananmu</span>
          </h1>
          <p className="text-[22px] text-white mt-6 font-normal drop-shadow-lg">Jelajahi keindahan Indonesia dengan perjalanan kereta yang nyaman</p>
        </div>
      </section>

      <div className="absolute left-0 right-0 top-[400px] flex justify-center z-20">
        <SearchCard />
      </div>

      <div className="pt-[84px]">
        <KAIPay />
        <ServSection />
        <ServicesSection />
        <TrainBookingSection />
        <PromotionsSection />
        <div className="relative">
          <div className="relative z-10">
            <DestinationSection />
          </div>
          <img src="/img_ornament_line.png" alt="Ornament Line" className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0 w-full pointer-events-none" />
          <div className="relative z-10">
            <WhyChooseSection />
          </div>
        </div>
        <DiscountsSection />
        <FAQSection />
        <HelpSection />
      </div>

      <Footer />
    </div>
  );
}
