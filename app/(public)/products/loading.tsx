import React from "react";
import { ProductSkeleton } from "@/components/product-skeleton";
import { Search, ListFilterPlus, Zap, Headphones, ShieldCheck, CheckCircle } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full min-h-screen text-(--text-main) py-20 mt-[15dvh]">
      <div className="w-[80dvw] mx-auto">
        {/* Header Section Skeleton */}
        <div className="mb-5">
          <div className="h-14 bg-(--text-main)/[0.1] rounded-lg w-3/4 mb-8 animate-pulse" />
          <div className="space-y-3 max-w-2xl">
            <div className="h-6 bg-(--text-main)/[0.05] rounded w-full animate-pulse" />
            <div className="h-6 bg-(--text-main)/[0.05] rounded w-5/6 animate-pulse" />
          </div>
        </div>

        {/* Search & Filter Bar Skeleton */}
        <div className="flex flex-col gap-2 mb-20">
          <div className="relative">
            <div className="w-full bg-(--bg-dark) border border-(--accent)/20 rounded-full h-20 animate-pulse" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-8 pt-5">
            <div className="flex flex-wrap gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-11 w-32 bg-(--bg-dark) border border-(--bg-dark) rounded-2xl animate-pulse" />
              ))}
            </div>

            <div className="h-11 w-48 bg-(--bg-dark) border border-(--bg-dark) rounded-2xl animate-pulse" />
          </div>
        </div>

        {/* Product Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3, 4, 5].map((i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>

        {/* Load More Button Skeleton */}
        <div className="flex justify-center mb-32">
          <div className="h-16 w-64 bg-(--bg-dark) border border-(--bg-dark) rounded-2xl animate-pulse" />
        </div>

        {/* Footer Features Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-4 p-8 bg-(--bg-dark) border border-(--bg-dark) rounded-3xl animate-pulse">
              <div className="w-12 h-12 rounded-2xl bg-(--bg-dark) border border-(--bg-dark)" />
              <div className="space-y-2">
                <div className="h-5 bg-(--text-main)/[0.1] rounded w-3/4" />
                <div className="h-3 bg-(--text-main)/[0.05] rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
