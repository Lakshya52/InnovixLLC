import Hero from "@/components/landing/hero";
import Image from "next/image";


export default function Home() {
  return (
    <>
    <Hero />
    <div className="flex flex-col items-center justify-center " >
        <h1 className="text-4xl font-bold text-center mt-10">Welcome to Innovix LLC</h1>
        <p className="w-full text-center" >this is the landing page inside "(public)" folder</p>
    </div>
    </>
  );
}
