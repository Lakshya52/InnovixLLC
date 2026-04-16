"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  ShoppingCart, 
  Plus, 
  Minus,
  Monitor
} from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product;
  categoryIcon: React.ReactNode;
}

export function ProductCard({ product, categoryIcon }: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const router = useRouter();

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
  };

  const adjustQuantity = (e: React.MouseEvent, amount: number) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity(Math.max(1, quantity + amount));
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden transition-all duration-500 hover:bg-white/[0.04] hover:border-white/10 flex flex-col cursor-pointer"
    >
      <div className="aspect-square w-full h-full bg-[#121212] border-b border-white/5 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Monitor className="w-20 h-20 text-[#6eDD86]/20" />
        )}
      </div>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-start justify-between gap-5 mb-4">
          {categoryIcon || <Monitor className="min-w-10 max-w-10 min-h-10 max-h-10 text-(--accent)" />}
          <h3 className="text-2xl font-bold font-grotesk">{product.name}</h3>
        </div>

        <p className="text-gray-400 font-inter text-sm leading-relaxed mb-8 line-clamp-2">
          {product.description}
        </p>

        <div className="space-y-1">
          <span className="block text-3xl mb-6 font-bold font-grotesk">${product.price}</span>
        </div>

        {/* Quantity Selector */}
        {/* <div className="flex items-center gap-4 mb-8 bg-black/40 border border-white/10 rounded-2xl p-2 w-fit">
            <button 
                onClick={(e) => adjustQuantity(e, -1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                type="button"
            >
                <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold font-grotesk">{quantity}</span>
            <button 
                onClick={(e) => adjustQuantity(e, 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                type="button"
            >
                <Plus className="w-4 h-4" />
            </button>
        </div> */}

        <div className="grid grid-cols-2 gap-3 mt-auto">
          <button 
            onClick={handleBuyNow}
            className="flex items-center justify-center gap-2 bg-[#6eDD86] text-black px-6 py-4 rounded-2xl transition-all duration-300 font-bold hover:bg-[#5dbb72] active:scale-[0.98]"
          >
            <span>Buy Now</span>
          </button>
          
          <button 
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-white/[0.05] hover:bg-white/[0.1] text-white px-6 py-4 rounded-2xl transition-all duration-300 font-bold border border-white/5 active:scale-[0.98]"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </Link>
  );
}
