import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
  });

  if (!product) {
    notFound();
  }

  // Build system requirements
  const dbRequirements = (product.systemRequirements as any[]) || [];
  const systemRequirements = dbRequirements.length > 0
    ? dbRequirements.map((req) => ({
        component: req.title,
        minimum: req.minimum || "—",
        recommended: req.recommended || "—",
      }))
    : [
        { component: "Processor", minimum: (product as any).minCPU || "—", recommended: (product as any).recCPU || "—" },
        { component: "Memory", minimum: (product as any).minRAM || "—", recommended: (product as any).recRAM || "—" },
        { component: "Storage", minimum: (product as any).minStorage || "—", recommended: (product as any).recStorage || "—" },
        { component: "Graphics", minimum: (product as any).minGPU || "—", recommended: (product as any).recGPU || "—" },
      ].filter(req => req.minimum !== "—" || req.recommended !== "—");


  // Fetch related products (same category, excluding current)
  const relatedProducts = await prisma.product.findMany({
    where: {
      id: { not: product.id },
      status: "Live",
    },
    take: 4,
    select: {
      id: true,
      name: true,
      price: true,
      image: true,
      category: true,
    },
  });

  // Serialize for client component
  const serializedProduct = {
    id: product.id,
    name: product.name,
    shortDescription: product.shortDescription || "",
    description: product.description || "",
    longDescriptionTwo: product.longDescriptionTwo || "",
    featureHeading: product.featureHeading || "",
    category: product.category,
    price: product.price,
    msrp: product.msrp || null,
    image: product.image || "",
    features: product.features || [],
    systemRequirements,
  };

  const serializedRelated = relatedProducts.map((rp) => ({
    id: rp.id,
    name: rp.name,
    price: rp.price,
    image: rp.image || "",
    category: rp.category,
  }));

  return (
    <ProductDetailsClient
      product={serializedProduct}
      relatedProducts={serializedRelated}
    />
  );
}
