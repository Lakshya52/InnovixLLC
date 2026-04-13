"use client";

import Image from "next/image";
import { ThemeToggle } from "@/components/theme-toggle";
import { ArrowRight } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Hero() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroImgSrc = mounted && resolvedTheme === "light" ? "/HeroImageLight.png" : "/HeroImage.png";

  return (
    <>
    <div className="bg-(--bg-less-dark) w-full flex items-center justify-center" >
      <div className="flex items-center justify-center h-[90dvh] mt-[10dvh] w-[80dvw] ">
        <div className="flex flex-col gap-10" >
          {/* left section */}
          {/* <span className=" text-(--bg-light) text-xs rounded-full w-fit font-inter border p-2 px-3" >TRUSTED MICROSOFT PARTNER</span> */}
          <h1 className="text-(--text-main) font-grotesk text-7xl font-bold max-w-3xl" >
            Your Hub for <span className="text-(--accent)">Microsoft</span> <br /> Solutions & <br /> Expert Support
          </h1>
          <p className="text-(--text-main) font-inter text-xl max-w-3xl ">Experience high-velocity digital delivery and 24/7
            technical expertise. Empowering your infrastructure
            with the world's leading OS and productivity suites.
          </p>
          <div className="flex gap-5">
            <Link href="/products" className="button-green">Shop Products <ArrowRight /></Link>
            <Link href="/contact" className="button-dark">Contact Us</Link>
          </div>
        </div>
        <div className="h-full w-1/2 py-30 pl-30" >
          <img src={heroImgSrc} alt="InnovixLLC hero image" className="h-full w-full rounded-4xl overflow-hidden shadow-2xl shadow-[10px_10px_100px_var(--accent)] hover:shadow-[10px_10px_300px_var(--accent)] transition-all duration-300 cursor-pointer " />
        </div>
      </div>
    </div>
    </>
  );
}
