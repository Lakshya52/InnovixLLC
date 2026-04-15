import { prisma } from "@/lib/prisma";
import KeysClient from "./KeysClient";

export default async function KeysPage() {
  const products = await prisma.product.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      status: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return <KeysClient products={products} />;
}
