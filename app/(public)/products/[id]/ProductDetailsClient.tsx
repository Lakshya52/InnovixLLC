"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ShoppingCart,
  Check,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductData {
  id: string;
  name: string;
  shortDescription: string;
  description: string;
  longDescriptionTwo: string;
  featureHeading: string;
  category: string;
  price: number;
  msrp: number | null;
  image: string;
  features: string[];
  systemRequirements: { component: string; minimum: string; recommended: string }[];
}

interface RelatedProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductDetailsClient({
  product,
  relatedProducts,
}: {
  product: ProductData;
  relatedProducts: RelatedProduct[];
}) {
  const router = useRouter();
  const { addToCart, cart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  // Build a cart-compatible product object
  const cartProduct = {
    id: product.id,
    name: product.name,
    price: product.price.toString(),
    image: product.image,
    category: product.category,
    description: product.shortDescription,
  };

  const handleAddToCart = () => {
    addToCart(cartProduct as any, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(cartProduct as any, 1);
    router.push("/cart");
  };

  const alreadyInCart = cart.some((item) => item.product.id === product.id);

  return (
    <div className="min-h-screen text-(--text-main) pt-28 w-full pb-20 px-4 md:px-8 mt-20 relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-(--accent)/20 top-0 rotate-135 w-1/5 left-0 blur-3xl h-1/5 rounded-full shadow-[10px_10px_100px_var(--accent)] z-[-10]" />

      <div className="w-[80dvw] mx-auto">
        {/* Main Product Section */}
        <div className="flex items-center justify-between h-[70dvh] gap-20">
          {/* Left: Product Info */}
          <div className="flex flex-col">
            <h1 className="text-4xl max-w-xl md:text-6xl font-bold font-grotesk mb-6 leading-tight">
              
              {product.name.split(" ").map((word, i, arr) =>
              i >= arr.length - 1 ? (
                <span key={i} className="text-(--accent)">
                  {word + " "}
                </span>
              ) : (
                word + " "
              )
            )}
            </h1>

            <p className="text-gray-400 text-lg md:text-xl font-inter leading-relaxed mb-8">
              {product.shortDescription || product.description}
            </p>

            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-5xl font-bold font-grotesk">
                ${product.price.toFixed(2)}
              </span>
              {product.msrp && product.msrp > product.price && (
                <span className="text-gray-500 text-lg line-through font-inter">
                  ${product.msrp.toFixed(2)}
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
              <button
                onClick={handleAddToCart}
                disabled={alreadyInCart}
                className={`flex-1 w-full font-bold h-16 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(110,221,134,0.3)] flex items-center justify-center gap-3 font-grotesk text-lg group ${
                  alreadyInCart
                    ? "bg-(--text-main)/10 text-gray-500 cursor-not-allowed border border-(--text-main)/5 shadow-none"
                    : isAdded
                    ? "bg-(--text-main) text-(--bg-dark)"
                    : "bg-(--accent) hover:bg-(--accent) text-(--bg-dark)"
                }`}
              >
                {alreadyInCart
                  ? "Already Added"
                  : isAdded
                  ? "Added!"
                  : "Add to Cart"}
                {!isAdded && !alreadyInCart && (
                  <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
                )}
                {alreadyInCart && <Check className="w-5 h-5" />}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 w-full bg-(--text-main)/[0.05] hover:bg-(--text-main)/[0.1] text-(--text-main) font-bold h-16 rounded-2xl transition-all duration-300 border border-(--text-main)/10 flex items-center justify-center gap-3 font-grotesk text-lg"
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Product Image */}
          {product.image && (
            <img
              src={product.image}
              alt={`${product.name} product image`}
              className="w-1/2 h-[70dvh] rounded-[40px] shadow-2xl shadow-[10px_10px_100px_var(--accent)] hover:shadow-[10px_10px_300px_var(--accent)] transition-all duration-300 object-cover"
            />
          )}
        </div>

        {/* Section 1: Performance & Trust Architecture */}
        {(product.description || product.features.length > 0) && (
          <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-16 border-t border-(--text-main)/5 pt-32">
            <div className="lg:col-span-2">
              <h2 className="text-4xl md:text-5xl font-bold font-grotesk mb-8">
                {product.featureHeading.split(" ").map((word, i, arr) =>
              i >= arr.length - 1 ? (
                <span key={i} className="text-(--accent)">
                  {word + " "}
                </span>
              ) : (
                word + " "
              )
            )}
              </h2>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-inter">
                {product.description && <p>{product.description}</p>}
                {product.longDescriptionTwo && <p>{product.longDescriptionTwo}</p>}
              </div>
            </div>

            {product.features.length > 0 && (
              <div className="bg-(--text-main)/[0.02] backdrop-blur-xl border border-(--text-main)/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 bg-(--accent) opacity-30" />
                <h3 className="text-xl font-bold font-grotesk mb-8 flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-(--accent)" />
                  Trust Architecture
                </h3>
                <ul className="space-y-6">
                  {product.features.map((feature, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-4 text-sm text-gray-400 font-inter leading-relaxed"
                    >
                      <Check className="w-4 h-4 text-(--accent) shrink-0 mt-1" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Section 2: System Requirements Table */}
        {product.systemRequirements.length > 0 && (
          <div className="mt-32 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-grotesk mb-4">
              System{" "}
              <span className="underline decoration-(--accent) decoration-4 underline-offset-12">
                Requirements
              </span>
            </h2>

            <div className="mt-16 overflow-hidden rounded-[40px] border border-(--text-main)/5 bg-(--text-main)/[0.01] backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-(--text-main)/[0.03]">
                      <th className="p-8 text-(--accent) font-bold font-grotesk uppercase tracking-wider">
                        Component
                      </th>
                      <th className="p-8 text-(--accent) font-bold font-grotesk uppercase tracking-wider">
                        Minimum Specification
                      </th>
                      <th className="p-8 text-(--accent) font-bold font-grotesk uppercase tracking-wider">
                        Recommended Specification
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.systemRequirements.map((req, i) => (
                      <tr
                        key={i}
                        className="border-t border-(--text-main)/5 hover:bg-(--text-main)/[0.02] transition-colors"
                      >
                        <td className="p-8 font-bold font-grotesk text-gray-300">
                          {req.component}
                        </td>
                        <td className="p-8 font-inter text-gray-500 text-sm leading-relaxed">
                          {req.minimum}
                        </td>
                        <td className="p-8 font-inter text-gray-500 text-sm leading-relaxed">
                          {req.recommended}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Related Products / Ecosystem */}
        {relatedProducts.length > 0 && (
          <div className="mt-32 pt-32 border-t border-(--text-main)/5">
            <h2 className="text-4xl md:text-5xl font-bold font-grotesk mb-16">
              Complete Your <span className="text-(--accent)">Ecosystem</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((rp) => (
                <Link
                  href={`/products/${rp.id}`}
                  key={rp.id}
                  className="bg-(--text-main)/[0.02] border border-(--text-main)/5 p-6 rounded-[35px] hover:bg-(--text-main)/[0.05] transition-all group relative"
                >
                  <div className="aspect-square rounded-[25px] overflow-hidden mb-6 bg-(--text-main)/[0.03]">
                    {rp.image ? (
                      <img
                        src={rp.image}
                        alt={rp.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-600 text-sm">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="text-lg font-bold font-grotesk mb-2 text-gray-200 group-hover:text-(--text-main) transition-colors line-clamp-1">
                    {rp.name}
                  </h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold font-grotesk text-(--accent)">
                      ${rp.price.toFixed(2)}
                    </span>
                    <div className="w-10 h-10 rounded-full border border-(--text-main)/10 flex items-center justify-center hover:bg-(--accent) hover:text-(--bg-dark) transition-all">
                      <ShoppingCart size={16} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
