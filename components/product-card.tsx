"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ShoppingCart,
  Monitor,
  Check,
  Plus,
  Minus
} from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Product } from "@/lib/products";

interface ProductCardProps {
  product: Product;
  categoryIcon: React.ReactNode;
}

export function ProductCard({ product, categoryIcon }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const stockCount = product.stockKeys?.length || 0;

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      addToCart(product as any, quantity);
      router.push("/cart");
    } catch (err: any) {
      alert(err.message || "Failed to initiate buy now");
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product as any, quantity);
    setQuantity(1); // Reset quantity after adding
    
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-(--text-main)/[0.02] border border-(--text-main)/5 rounded-[40px] overflow-hidden transition-all duration-500 hover:bg-(--text-main)/[0.04] hover:border-(--text-main)/10 flex flex-col cursor-pointer h-full"
    >
      {/* Image Section */}
      <div className="aspect-square w-full bg-(--bg-dark) border-b border-(--text-main)/5 flex items-center justify-center overflow-hidden relative">
        {product.image ? (
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <Monitor className="w-20 h-20 text-(--accent)/20" />
        )}

        {/* Stock Badge */}
        {/* {stockCount === 0 ? (
          <div className="absolute inset-0 bg-(--bg-dark)/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-red-500 text-(--text-main) px-6 py-2 rounded-full font-bold text-sm uppercase tracking-widest shadow-lg">
              Out of Stock
            </span>
          </div>
        ) : stockCount < 10 ? (
          <div className="absolute top-6 left-6">
            <span className="bg-yellow-500/90 backdrop-blur-md text-(--bg-dark) px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-widest shadow-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-(--bg-dark) animate-pulse"></span>
              Only {stockCount} Left
            </span>
          </div>
        ) : null} */}
      </div>

      {/* Content Section */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-5 mb-4">
          <h3 className="text-2xl font-bold font-grotesk">{product.name}</h3>
        </div>

        <p className="text-gray-400 font-inter text-sm leading-relaxed mb-8 line-clamp-2">
          {product.description}
        </p>

        {/* Price and Actions - Pushed to bottom */}
        <div className="mt-auto pt-4">
          <div className="mb-6 flex items-center justify-between">
            <span className="block text-3xl font-bold font-grotesk">${product.price}</span>
            
            {/* Quantity Selector */}
            <div className="flex items-center gap-4 bg-(--text-main)/[0.05] border border-(--text-main)/5 px-3 py-2 rounded-xl">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity(Math.max(1, quantity - 1));
                }}
                disabled={quantity <= 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-(--text-main)/10 transition-colors text-(--text-main) disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-bold font-grotesk min-w-[1.5rem] text-center">{quantity}</span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setQuantity(quantity + 1);
                }}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-(--text-main)/10 transition-colors text-(--text-main)"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleBuyNow}
              // disabled={stockCount === 0}
              className="flex items-center justify-center gap-2 bg-(--accent) text-(--bg-dark) px-6 py-4 rounded-2xl transition-all duration-300 font-bold hover:bg-(--accent) active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed disabled:grayscale cursor-pointer"
            >
              <span>Buy Now</span>
            </button>

            <button
              onClick={handleAddToCart}
              // disabled={stockCount === 0}
              className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl transition-all duration-300 font-bold border active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer ${
                added 
                  ? "bg-green-500/10 border-green-500/20 text-green-500" 
                  : "bg-(--text-main)/[0.05] hover:bg-(--text-main)/[0.1] text-(--text-main) border-(--text-main)/5"
              }`}
            >
              {added ? (
                <>
                  <Check className="w-5 h-5" />
                  <span className="text-sm">Added</span>
                </>
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
