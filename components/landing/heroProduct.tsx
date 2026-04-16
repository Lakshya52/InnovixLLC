"use client"
import { ArrowRight, CircleCheck, Database } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";


export default function HeroProduct() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroImgSrc = mounted && resolvedTheme === "light" ? "/HeroProductImageLight.png" : "/HeroProductImage.png";
  return (
    <>
      <div className="flex flex-col items-center justify-between h-auto min-h-[90dvh] my-[5dvh] lg:my-[10dvh] py-[5dvh] lg:py-0 w-[80dvw] gap-10">

        <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between w-full gap-5 lg:gap-0">
          <div className="flex flex-col gap-5" >

            <h1 className="text-(--text-main) font-grotesk text-4xl lg:text-5xl font-bold max-w-3xl" >
              Elite Digital <span className="text-(--accent)">Assets</span>
            </h1>
            <p className="text-(--text-main) font-inter text-lg lg:text-xl max-w-3xl ">
              High-velocity infrastructure and data solutions engineered for
              extreme <br className="hidden lg:block" />scalability and reliability.
            </p>
          </div>
          <div>
            <Link href='/products' className="button-green w-fit">View All Products <ArrowRight /></Link>
          </div>
        </div>
        <div className="h-auto lg:h-[75vh] w-full flex lg:flex-row flex-col gap-5 lg:gap-10">
          <div className="w-full lg:w-6/10 flex items-end justify-start h-auto min-h-[50vh] lg:h-full rounded-[30px] lg:rounded-[50px] overflow-hidden relative">

            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImgSrc})` }}
            />

            {/* Dark overlay (optional but recommended) */}
            <div className={`absolute inset-0  ${mounted && resolvedTheme === "light" ? "bg-(--text-main)/50" : "bg-(--bg-dark)/50"}`}></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end items-start h-full p-6 lg:p-10 text-(--text-main) gap-5 lg:gap-10">
              <h1 className="text-3xl lg:text-5xl font-bold font-grotesk text-(--text-main)">Windows Server <span className="text-(--accent)" >2022</span> <br />Datacenter</h1>
              <ul className="font-inter text-(--text-main) text-base lg:text-lg flex flex-col items-start justify-start gap-2">
                <li className="flex items-center justify-center gap-2" > <CircleCheck size={20} className="text-(--accent) min-w-[20px]" /> Advanced Multi-layer Security</li>
                <li className="flex items-center justify-center gap-2" > <CircleCheck size={20} className="text-(--accent) min-w-[20px]" /> Hybrid Capabilities with Azure</li>
                <li className="flex items-center justify-center gap-2" > <CircleCheck size={20} className="text-(--accent) min-w-[20px]" /> Flexible Application Platform</li>
              </ul>
              {/* buy now button and view product details buttons */}
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full gap-5 lg:gap-0">

                <div className="flex flex-wrap sm:flex-nowrap gap-3 lg:gap-5 w-full lg:w-auto">
                  <Link href="/products" className="button-green text-sm lg:text-base justify-center flex-1 sm:flex-none">Buy Now <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6" /></Link>

                  {/* bordered button */}
                  <Link href="/products" className="button-dark text-sm lg:text-base justify-center flex-1 sm:flex-none">View More</Link>
                </div>
                {/* price of the product in dollars */}
                <div className="flex items-center justify-center gap-2 text-(--accent) font-inter text-3xl lg:text-4xl rounded-full w-fit font-bold">$1499.00</div>
              </div>
            </div>

          </div>
          <div className="w-full lg:w-4/10 h-auto lg:h-full flex flex-col gap-5 lg:gap-10" >
            <div className="text-(--text-main) flex gap-4 lg:gap-5 flex-col items-start justify-end w-full h-auto lg:h-[80%] rounded-[30px] lg:rounded-[50px] bg-(--bg-less-dark) p-6 lg:p-10">
              <Database className="text-(--text-main) w-10 h-10 lg:w-[50px] lg:h-[50px]" />
              <h1 className=" text-3xl lg:text-5xl font-grotesk font-bold "  >
                SQL Server 2022
              </h1>
              <p className="text-base lg:text-lg font-inter" >Experience industry-leading performance and
                security with the most cloud-connected SQL
                Server release yet.</p>
              {/* bordered button */}
              <Link href="/products" className="button-green w-full flex items-center justify-center text-sm lg:text-base" >View Product <ArrowRight className="w-4 h-4 lg:w-6 lg:h-6" /></Link>
            </div>
            <div className="w-full flex flex-col items-start justify-center p-6 lg:p-10 bg-(--accent)/20 h-auto lg:h-[20%] rounded-[30px] lg:rounded-[50px] gap-2 lg:gap-0">
              <span className="text-(--text-main) font-inter text-base lg:text-lg font-bold" >LIVE SUPPORT</span>
              <span className="text-(--text-main) font-inter text-sm lg:text-lg" >Expert migration assistance included
                with all products.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}