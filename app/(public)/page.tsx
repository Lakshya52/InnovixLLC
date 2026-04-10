import Hero from "@/components/landing/hero";
import Image from "next/image";
import HeroProduct from "@/components/landing/heroProduct";
import ChatBot from "@/components/landing/chatbot";
import WhyChooseUs from "@/components/landing/whyChooseUs";


export default function Home() {
  return (
    <>
    <Hero />
    <HeroProduct />
    <ChatBot />
    <WhyChooseUs />
    {/* <div className="flex flex-col items-center justify-center " >
        <h1 className="text-4xl font-bold text-center mt-10 font-grotesk">Welcome to Innovix LLC</h1>
        <p className="w-full text-center" >this is the landing page inside "(public)" folder</p>
    </div> */}
    </>
  );
}
