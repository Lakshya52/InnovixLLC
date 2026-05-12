import React from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen overflow-hidden text-(--text-main) mt-[10dvh] pt-20 md:pt-28 w-full pb-20 relative">
      <div className="w-full max-w-[80dvw] mx-auto">
        {/* Main Product Section Skeleton */}
        <div className="flex flex-col-reverse lg:flex-row lg:items-start lg:justify-between lg:h-[70dvh] gap-10 lg:gap-20">
          {/* Left: Product Info Skeleton */}
          <div className="flex flex-col w-full lg:w-1/2">
            <div className="h-16 bg-(--text-main)/[0.1] rounded-lg w-3/4 mb-6 animate-pulse" />
            <div className="space-y-3 mb-8">
              <div className="h-6 bg-(--text-main)/[0.05] rounded w-full animate-pulse" />
              <div className="h-6 bg-(--text-main)/[0.05] rounded w-5/6 animate-pulse" />
              <div className="h-6 bg-(--text-main)/[0.05] rounded w-4/6 animate-pulse" />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 md:gap-10 mb-10">
              <div className="h-12 bg-(--text-main)/[0.1] rounded-lg w-32 animate-pulse" />
              <div className="h-14 bg-(--text-main)/[0.05] rounded-2xl w-40 animate-pulse" />
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-12">
              <div className="h-16 bg-(--accent)/20 rounded-2xl w-full animate-pulse" />
              <div className="h-16 bg-(--text-main)/[0.05] rounded-2xl w-full animate-pulse" />
            </div>
          </div>

          {/* Product Image Skeleton */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full max-w-[500px] lg:max-w-none lg:w-full h-[400px] lg:h-[70dvh] rounded-[30px] md:rounded-[40px] bg-(--text-main)/[0.1] animate-pulse" />
          </div>
        </div>

        {/* Section 1: Features Skeleton */}
        <div className="mt-20 md:mt-32 grid grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16 border-t border-(--text-main)/5 pt-20 md:pt-32">
          <div className="lg:col-span-2">
            <div className="h-12 bg-(--text-main)/[0.1] rounded-lg w-2/3 mb-8 animate-pulse" />
            <div className="space-y-4">
              <div className="h-4 bg-(--text-main)/[0.05] rounded w-full animate-pulse" />
              <div className="h-4 bg-(--text-main)/[0.05] rounded w-full animate-pulse" />
              <div className="h-4 bg-(--text-main)/[0.05] rounded w-3/4 animate-pulse" />
            </div>
          </div>
          <div className="h-80 bg-(--text-main)/[0.02] border border-(--text-main)/5 rounded-[30px] animate-pulse" />
        </div>

        {/* Section 2: System Requirements Skeleton */}
        <div className="mt-20 md:mt-32">
          <div className="h-12 bg-(--text-main)/[0.1] rounded-lg w-1/3 mx-auto mb-10 animate-pulse" />
          <div className="h-64 bg-(--text-main)/[0.01] border border-(--text-main)/5 rounded-[40px] animate-pulse" />
        </div>

        {/* Section 3: Related Products Skeleton */}
        <div className="mt-20 md:mt-32 pt-20 md:pt-32 border-t border-(--text-main)/5">
          <div className="h-12 bg-(--text-main)/[0.1] rounded-lg w-1/4 mb-10 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-(--text-main)/[0.02] border border-(--text-main)/5 p-6 rounded-[35px] animate-pulse">
                <div className="aspect-square rounded-[25px] bg-(--text-main)/[0.05] mb-6" />
                <div className="h-6 bg-(--text-main)/[0.1] rounded w-3/4 mb-4" />
                <div className="flex justify-between items-center">
                  <div className="h-8 bg-(--accent)/20 rounded w-1/3" />
                  <div className="w-10 h-10 rounded-full bg-(--text-main)/[0.05]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
