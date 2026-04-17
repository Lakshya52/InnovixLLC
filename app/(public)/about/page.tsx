"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";
import WhyChooseUs from "@/components/landing/whyChooseUs";
import FooterCTA from "@/components/landing/footerCta";
import FAQ from "@/components/landing/faq";

export default function About() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // const heroImgSrc = mounted && resolvedTheme === "light" ? "/HeroImageLight.png" : "/HeroImage.png";

  return (
    <>
      <div className="flex flex-col bg-(--bg-less-dark) items-center justify-center w-full mt-[5dvh]">

        <div className="w-[80dvw] flex items-center justify-center pt-[10dvh] md:pt-[5dvh]">
          <div className="flex flex-col lg:flex-row items-center justify-center min-h-[90dvh] py-16 lg:py-0 w-full  mx-auto gap-12 lg:gap-0">
            <div className="flex flex-col gap-6 lg:gap-10 w-full lg:w-1/2" >
              {/* left section */}
              <span className=" text-(--bg-light) text-xs rounded-full w-fit font-inter border p-2 px-3 button-dark" >About Us</span>
              <h1 className="text-(--text-main) font-grotesk text-4xl lg:text-5xl font-bold max-w-3xl leading-tight" >
                High-performance <span className="text-(--accent)">digital delivery </span> at scale.
              </h1>
              <p className="text-(--text-main) font-inter text-lg lg:text-xl max-w-3xl leading-relaxed">
                InnovixLLC is dedicated to bridging the gap between
                enterprise-grade technology and everyday efficiency. We
                provide the infrastructure for seamless digital
                transformation.
              </p>
              {/* <div className="flex gap-5">
            <Link href="/products" className="button-green">Shop Products <ArrowRight /></Link>
            <Link href="/contact" className="button-dark">Contact Us</Link>
          </div> */}
            </div>
            <div className="w-full lg:w-1/2 lg:pl-16 py-8 lg:py-20 flex items-center justify-center" >
              <img src="/AboutHeroImage.png" alt="InnovixLLC hero image" className="w-full max-w-[400px] lg:max-w-none h-auto rounded-3xl lg:rounded-4xl overflow-hidden shadow-2xl shadow-[10px_10px_100px_var(--accent)] hover:shadow-[10px_10px_300px_var(--accent)] transition-all duration-300 cursor-pointer " />
            </div>
          </div>
        </div>
        <div className="h-fit py-20 lg:py-40  flex flex-col items-start justify-center w-[80dvw]  mx-auto  gap-16 lg:gap-32">

          {/* Heading */}
          <h1 className="pl-6 md:pl-10 border-l-[4px] md:border-l-[7px] border-(--accent) font-grotesk font-bold text-4xl lg:text-5xl">
            The Pillars Of our Reliability
          </h1>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 w-full">

            {/* Card 1 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-(--accent) flex items-center justify-center text-(--bg-dark) font-bold text-lg shrink-0">
                1
              </div>
              <div>
                <h3 className="text-2xl font-bold font-grotesk text-(--text-main) mb-2">
                  Real-time Activation
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  No wait times. No manual processing. Our proprietary Kinetic Engine ensures that 98% of licenses are delivered and ready for activation within seconds of purchase completion.
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-(--accent) flex items-center justify-center text-(--bg-dark) font-bold text-lg shrink-0">
                2
              </div>
              <div>
                <h3 className="text-2xl font-bold font-grotesk text-(--text-main) mb-2">
                  Lifelong Validity
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  We only deal in retail-channel permanent licenses. Once you activate a product through InnovixLLC, it is yours for the life of the machine, with no recurring fees.
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-(--accent) flex items-center justify-center text-(--bg-dark) font-bold text-lg shrink-0">
                3
              </div>
              <div>
                <h3 className="text-2xl font-bold font-grotesk text-(--text-main) mb-2">
                  Legal Compliance
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  Every transaction is fully invoiced and legally compliant. We provide complete chain-of-custody documentation for enterprise clients requiring audit-ready licensing.
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex items-start gap-6">
              <div className="w-14 h-14 rounded-full bg-(--accent) flex items-center justify-center text-(--bg-dark) font-bold text-lg shrink-0">
                4
              </div>
              <div>
                <h3 className="text-2xl font-bold font-grotesk text-(--text-main) mb-2">
                  Direct MS Integration
                </h3>
                <p className="text-gray-400 font-inter leading-relaxed">
                  Unlike grey-market resellers, we utilize official Microsoft Partner Center portals to manage and verify license authenticity, ensuring zero risk of revocation.
                </p>
              </div>
            </div>

          </div>
        </div>
        <WhyChooseUs />
        <FooterCTA />
        <FAQ />
      </div>

    </>
  );
}
