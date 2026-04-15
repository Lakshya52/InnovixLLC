import React from "react";
import { Key, Lock } from "lucide-react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import RevealKey from "./RevealKey";

async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  if (!session) return null;
  return await decrypt(session);
}

export default async function KeysPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const keys = await prisma.productKey.findMany({
    where: { userId: session.id },
    orderBy: { id: 'desc' }
  });

  return (
    <div className="mx-auto w-[90%] pb-20">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Digital <span className="text-[#6eDD86]">Vault</span></h1>
        <p className="text-[#a0a0a0] text-sm max-w-xl">
          Secure, end-to-end storage for your premium software licenses. Any product keys you purchase are instantly delivered here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keys.length > 0 ? (
          keys.map((key) => (
            <div
              key={key.id}
              className="bg-[#121212] border border-[#1f1f1f] rounded-[40px] p-8 flex flex-col relative group hover:border-[#2a2a2a] transition-all"
            >
              <div
                className={`absolute top-8 right-8 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                  key.status === "Active"
                    ? "bg-green-400/10 text-green-400"
                    : "bg-yellow-400/10 text-yellow-400"
                }`}
              >
                {key.status}
              </div>

              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-8 bg-[#1a1a1a] text-[#6eDD86] border border-white/5">
                <Key size={24} />
              </div>

              <h3 className="text-xl font-bold mb-1">{key.name}</h3>
              <p className="text-[#a0a0a0] text-xs font-bold uppercase tracking-widest mb-8">
                {key.edition || "Premium License"} {key.expiresAt ? `• Exp: ${key.expiresAt.toLocaleDateString()}` : "• Lifetime Access"}
              </p>

              {/* Reveal Key Interactivity */}
              <RevealKey keyValue={key.keyValue} />
              
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between">
                 <p className="text-[10px] text-gray-500 font-mono">ID: {key.id.slice(-8).toUpperCase()}</p>
                 <Link href="/support" className="text-[10px] font-bold text-[#6eDD86] uppercase hover:underline">Get Help</Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[#1f1f1f] rounded-[40px] bg-white/[0.01]">
            <div className="w-20 h-20 bg-[#1a1a1a] rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/5">
              <Lock size={32} className="text-gray-700" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Vault is Empty</h3>
            <p className="text-gray-500 mb-10 max-w-sm mx-auto text-sm font-inter">
              You haven't purchased any licenses yet. Explore our marketplace to secure your high-performance enterprise tools.
            </p>
            <Link
              href="/products"
              className="bg-[#6eDD86] text-black px-10 py-4 rounded-2xl font-bold text-sm hover:transform hover:scale-105 transition-all inline-block shadow-[0_0_20px_rgba(110,221,134,0.3)]"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}