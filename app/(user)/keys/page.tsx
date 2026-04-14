import React from "react";
import { Laptop, Database, Palette, FileCode2, EyeOff, Lock, Key } from "lucide-react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

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
    <div className="p-8 mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Digital <span className="text-[#6eDD86]">Vault</span></h1>
        <p className="text-[#a0a0a0] text-sm max-w-xl">
          Secure end-to-end encrypted storage for your premium software licenses and enterprise product keys.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keys.length > 0 ? keys.map((key, i) => (
          <div key={i} className="bg-[#121212] border border-[#1f1f1f] rounded-3xl p-8 flex flex-col relative group hover:border-[#2a2a2a] transition-all">
            <div className={`absolute top-8 right-8 px-2.5 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider ${
              key.status === 'Active' ? 'bg-green-400/10 text-green-400' : 'bg-yellow-400/10 text-yellow-400'
            }`}>
              {key.status}
            </div>

            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-8 bg-[#1a1a1a] text-[#6eDD86]`}>
              <Key size={20} />
            </div>

            <h3 className="text-xl font-bold mb-1">{key.name}</h3>
            <p className="text-[#a0a0a0] text-sm font-medium mb-8">
              {key.edition || 'Product Key'} {key.expiresAt ? `• Expires ${key.expiresAt.toLocaleDateString()}` : ''}
            </p>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-2xl p-4 flex items-center justify-between mb-8">
              <div className="flex items-center gap-1">
                {[...Array(3)].map((_, j) => (
                  <div key={j} className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 bg-[#333] rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-[#333] rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-[#333] rounded-full"></div>
                    {j < 2 && <span className="text-[#333] mx-0.5">,</span>}
                  </div>
                ))}
              </div>
              <EyeOff size={16} className="text-[#333]" />
            </div>

            <button className="w-full bg-[#6eDD86] text-black py-4 rounded-full font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#5dbb72] transition-colors cursor-pointer active:scale-[0.98]">
              <Lock size={16} />
              Reveal Key
            </button>
          </div>
        )) : (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-[#1f1f1f] rounded-[40px]">
             <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-6">
                <Lock size={24} className="text-gray-600" />
             </div>
             <h3 className="text-xl font-bold mb-2">Vault is Empty</h3>
             <p className="text-gray-600 mb-8 max-w-xs mx-auto text-sm">You haven't purchased any licenses yet. Any keys you purchase will be securely stored here.</p>
             <Link href="/products" className="bg-[#6eDD86] text-black px-8 py-3 rounded-full font-bold text-sm hover:transform hover:scale-105 transition-all">Explore Marketplace</Link>
          </div>
        )}
      </div>
    </div>
  );
}