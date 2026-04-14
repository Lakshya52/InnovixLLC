"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import {
  ChevronRight,
  Star,
  ShieldCheck,
  Zap,
  Headphones,
  Globe,
  ArrowLeft,
  ShoppingCart,
  Zap as ZapIcon,
  Shield,
  Cpu,
  Lock,
  Briefcase,
  Database,
  Terminal,
  Server,
  Monitor,
  LayoutGrid,
  Plus,
  Minus,
  Check,
  CheckCircle2
} from "lucide-react";
import { products } from "@/lib/products";
import { notFound, useRouter } from "next/navigation";

// Map icons from strings to components
const iconMap: Record<string, React.ReactNode> = {
  Shield: <Shield className="w-10 h-10 text-(--accent)" />,
  Zap: <ZapIcon className="w-10 h-10 text-(--accent)" />,
  Cpu: <Cpu className="w-10 h-10 text-(--accent)" />,
  Globe: <Globe className="w-10 h-10 text-(--accent)" />,
  Lock: <Lock className="w-10 h-10 text-(--accent)" />,
  Briefcase: <Briefcase className="w-10 h-10 text-(--accent)" />,
  Database: <Database className="w-10 h-10 text-(--accent)" />,
  Terminal: <Terminal className="w-10 h-10 text-(--accent)" />,
  Server: <Server className="w-10 h-10 text-(--accent)" />,
  Monitor: <Monitor className="w-10 h-10 text-(--accent)" />,
  LayoutGrid: <LayoutGrid className="w-10 h-10 text-(--accent)" />
};

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const product = products.find((p) => p.id === resolvedParams.id);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("Overview");
  const { addToCart, cart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  if (!product) {
    notFound();
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, 1);
    router.push("/cart");
  };

  return (
    <div className=" min-h-screen text-white pt-28 w-full pb-20 px-4 md:px-8 mt-20 relative">
      {/* background gradient */}
      <div className="absolute inset-0 bg-(--accent)/20 top-0 rotate-135 w-1/5 left-0 blur-3xl h-1/5 rounded-full shadow-[10px_10px_100px_var(--accent)] z-[-10]" />
      <div className="w-[80dvw] mx-auto">
        {/* Breadcrumbs */}
        {/* Main Product Section */}
        <div className="flex items-center justify-between h-[70dvh] gap-20">
          {/* Left: Product Info */}
          <div className="flex flex-col">

            <h1 className="text-4xl max-w-xl md:text-6xl font-bold font-grotesk mb-6 leading-tight">
              {product.name}
            </h1>

            <p className="text-gray-400 text-lg md:text-xl font-inter leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="flex items-baseline gap-4 mb-10">
              <span className="text-5xl font-bold font-grotesk">${product.price}</span>
              <span className="text-gray-500 text-lg line-through font-inter">${(parseFloat(product.price) * 1.5).toFixed(2)}</span>
            </div>

            {/* Quantity and Actions - Commented out quantity as per request */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-12">
              {/* <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-2xl p-2 h-16">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-bold text-xl font-grotesk">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center hover:bg-white/5 rounded-xl transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div> */}

              <button
                onClick={handleAddToCart}
                disabled={cart.some(item => item.product.id === product.id)}
                className={`flex-1 w-full font-bold h-16 rounded-2xl transition-all duration-300 shadow-[0_0_20px_rgba(110,221,134,0.3)] flex items-center justify-center gap-3 font-grotesk text-lg group ${
                  cart.some(item => item.product.id === product.id) 
                    ? "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5 shadow-none" 
                    : isAdded ? "bg-white text-black" : "bg-[#6eDD86] hover:bg-[#5dbb72] text-black"
                }`}
              >
                {cart.some(item => item.product.id === product.id) 
                  ? "Already Added" 
                  : isAdded ? "Added!" : "Add to Cart"}
                {!isAdded && !cart.some(item => item.product.id === product.id) && <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />}
                {cart.some(item => item.product.id === product.id) && <Check className="w-5 h-5" />}
              </button>

              <button
                onClick={handleBuyNow}
                className="flex-1 w-full bg-white/[0.05] hover:bg-white/[0.1] text-white font-bold h-16 rounded-2xl transition-all duration-300 border border-white/10 flex items-center justify-center gap-3 font-grotesk text-lg"
              >
                Buy Now
              </button>
            </div>

            {/* Features List */}
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-400 font-inter py-2 border-b border-white/[0.03]">
                  <Check className="w-4 h-4 text-[#6eDD86]" />
                  <span>{feature}</span>
                </div>
              ))}
            </div> */}
          </div>
          {/* product image */}
          <img src={product.image} alt={`${product.name} product image`} className="w-1/2 h-[70dvh] rounded-[40px] shadow-2xl shadow-[10px_10px_100px_var(--accent)] hover:shadow-[10px_10px_300px_var(--accent)] transition-all duration-300" />
        </div>

        {/* Details & Specs Section */}
        {/* <div className="border-t border-white/5 pt-20">
          <div className="flex items-center gap-8 mb-12 border-b border-white/5">
            {["Overview", "Technical Info", "Reviews"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`pb-4 text-lg font-bold font-grotesk transition-all relative ${activeTab === tab ? "text-white" : "text-gray-500 hover:text-white/70"
                  }`}
              >
                {tab}
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-0 w-full h-1 bg-[#6eDD86] rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div> */}

        {/* Dynamic New Sections from Image */}

        {/* Section 1: Performance & Trust Architecture */}
        {product.trustArchitecture && (
          <div className="mt-32 grid grid-cols-1 lg:grid-cols-3 gap-16 border-t border-white/5 pt-32">
            <div className="lg:col-span-2">
              <h2 className="text-4xl md:text-5xl font-bold font-grotesk mb-8">
                High-Velocity <span className="text-[#6eDD86]">Performance</span>
              </h2>
              <div className="space-y-6 text-gray-400 text-lg leading-relaxed font-inter">
                <p>{product.longPara1}</p>
                <p>{product.longPara2}</p>
              </div>
            </div>

            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/5 p-10 rounded-[40px] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-[#6eDD86] opacity-30" />
              <h3 className="text-xl font-bold font-grotesk mb-8 flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-[#6eDD86]" />
                {product.trustArchitecture.title}
              </h3>
              <ul className="space-y-6">
                {product.trustArchitecture.points.map((point, i) => (
                  <li key={i} className="flex items-start gap-4 text-sm text-gray-400 font-inter leading-relaxed">
                    <Check className="w-4 h-4 text-[#6eDD86] shrink-0 mt-1" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Section 2: System Requirements Table */}
        {product.systemRequirements && (
          <div className="mt-32 text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-grotesk mb-4">System <span className="underline decoration-[#6eDD86] decoration-4 underline-offset-12">Requirements</span></h2>

            <div className="mt-16 overflow-hidden rounded-[40px] border border-white/5 bg-white/[0.01] backdrop-blur-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-white/[0.03]">
                      <th className="p-8 text-[#6eDD86] font-bold font-grotesk uppercase tracking-wider">Component</th>
                      <th className="p-8 text-[#6eDD86] font-bold font-grotesk uppercase tracking-wider">Minimum Specification</th>
                      <th className="p-8 text-[#6eDD86] font-bold font-grotesk uppercase tracking-wider">Recommended Specification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {product.systemRequirements.map((req, i) => (
                      <tr key={i} className="border-t border-white/5 hover:bg-white/[0.02] transition-colors">
                        <td className="p-8 font-bold font-grotesk text-gray-300">{req.component}</td>
                        <td className="p-8 font-inter text-gray-500 text-sm leading-relaxed">{req.minimum}</td>
                        <td className="p-8 font-inter text-gray-500 text-sm leading-relaxed">{req.recommended}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Related Products / Ecosystem */}
        <div className="mt-32 pt-32 border-t border-white/5">
          <h2 className="text-4xl md:text-5xl font-bold font-grotesk mb-16">Complete Your <span className="text-[#6eDD86]">Ecosystem</span></h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products
              .filter(p => p.id !== product.id)
              .slice(0, 4)
              .map((rp) => (
                <Link
                  href={`/products/${rp.id}`}
                  key={rp.id}
                  className="bg-white/[0.02] border border-white/5 p-6 rounded-[35px] hover:bg-white/[0.05] transition-all group relative"
                >
                  <div className="aspect-square rounded-[25px] overflow-hidden mb-6 bg-white/[0.03]">
                    <img
                      src={rp.image}
                      alt={rp.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h3 className="text-lg font-bold font-grotesk mb-2 text-gray-200 group-hover:text-white transition-colors line-clamp-1">{rp.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xl font-bold font-grotesk text-[#6eDD86]">${rp.price}</span>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#6eDD86] hover:text-black transition-all">
                      <ShoppingCart size={16} />
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
