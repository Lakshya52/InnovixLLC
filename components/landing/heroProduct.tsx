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
      <div className="flex flex-col items-center justify-between h-[90dvh] my-[10dvh] w-[80dvw]">

        <div className="flex items-end justify-between w-full ">
          <div className="flex flex-col gap-5" >

            <h1 className="text-(--text-main) font-grotesk text-7xl font-bold max-w-3xl" >
              Elite Digital <span className="text-(--accent)">Assets</span>
            </h1>
            <p className="text-(--text-main) font-inter text-xl max-w-3xl ">
              High-velocity infrastructure and data solutions engineered for
              extreme <br />scalability and reliability.
            </p>
          </div>
          <div>
            <Link href='/products' className="button-green">View All Products <ArrowRight /></Link>
          </div>
        </div>
        <div className="h-[75%] w-full flex gap-10">
          <div className="w-6/10 h-full rounded-[50px] overflow-hidden relative">

            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${heroImgSrc})` }}
            />

            {/* Dark overlay (optional but recommended) */}
            <div className={`absolute inset-0  ${mounted && resolvedTheme === "light" ? "bg-white/50" : "bg-black/50"}`}></div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-end items-start h-full p-10 text-white gap-10">
              <h1 className="text-5xl font-bold font-grotesk text-(--text-main)">Windows Server <span className="text-(--accent)" >2022</span> <br />Datacenter</h1>
              <ul className="font-inter text-(--text-main) text-lg flex flex-col items-start justify-start flex-col gap-2">
                <li className="flex items-center justify-center gap-2" > <CircleCheck size={20} className="text-(--accent)" /> Advanced Multi-layer Security</li>
                <li className="flex items-center justify-center gap-2" > <CircleCheck size={20} className="text-(--accent)" /> Hybrid Capabilities with Azure</li>
                <li className="flex items-center justify-center gap-2" > <CircleCheck size={20} className="text-(--accent)" /> Flexible Application Platform</li>
              </ul>
              {/* buy now button and view product details buttons */}
              <div className="flex items-center justify-between w-full">

                <div className="flex gap-5">
                  <Link href="/products" className="button-green">Buy Now <ArrowRight /></Link>

                  {/* bordered button */}
                  <Link href="/products" className="button-dark">View More</Link>
                </div>
                {/* price of the product in dollars */}
                <div className="flex items-center justify-center gap-2 text-(--accent) font-inter text-4xl  rounded-full w-fit ">$1499.00</div>
              </div>
            </div>

          </div>
          <div className="w-4/10  h-full flex flex-col  gap-10" >
            <div className="text-(--text-main) flex gap-5 flex-col items-start justify-end w-full h-8/10 rounded-[50px] bg-(--bg-less-dark) p-10">
              <Database className="text-(--text-main)" size={50} />
              <h1 className=" text-5xl font-grotesk font-bold "  >
                SQL Server 2022
              </h1>
              <p className="text-lg font-inter" >Experience industry-leading performance and
                security with the most cloud-connected SQL
                Server release yet.</p>
              {/* bordered button */}
              <Link href="/products" className="button-green w-full flex items-center justify-center " >View Product <ArrowRight /></Link>
            </div>
            <div className="w-full flex flex-col items-start justify-center p-10 bg-(--accent)/20 h-2/10 rounded-[50px] ">
              <span className="text-(--text-main) font-inter text-lg font-bold" >LIVE SUPPORT</span>
              <span className="text-(--text-main) font-inter text-lg" >Expert migration assistance included
                with all products.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}