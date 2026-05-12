"use client";

import React from "react";

export function ProductSkeleton() {
  return (
    <div className="bg-(--text-main)/[0.02] border border-(--text-main)/5 rounded-[40px] overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Section Skeleton */}
      <div className="aspect-square w-full bg-(--text-main)/[0.05]" />

      {/* Content Section Skeleton */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-5 mb-4">
          <div className="h-8 bg-(--text-main)/[0.1] rounded-lg w-3/4" />
        </div>

        <div className="space-y-2 mb-8">
          <div className="h-4 bg-(--text-main)/[0.05] rounded w-full" />
          <div className="h-4 bg-(--text-main)/[0.05] rounded w-5/6" />
        </div>

        {/* Price and Actions Skeleton */}
        <div className="mt-auto pt-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="h-10 bg-(--text-main)/[0.1] rounded-lg w-24" />
            
            {/* Quantity Selector Skeleton */}
            <div className="h-12 bg-(--text-main)/[0.05] rounded-xl w-32" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="h-14 bg-(--text-main)/[0.1] rounded-2xl w-full" />
            <div className="h-14 bg-(--text-main)/[0.1] rounded-2xl w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
