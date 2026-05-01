import { prisma } from "@/lib/prisma";
import KeysClient from "./KeysClient";

export default async function KeysPage() {
  const [keys, products] = await Promise.all([
    prisma.inventoryKey.findMany({
      include: {
        product: {
          select: {
            name: true,
            category: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    }),
    prisma.product.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        status: true,
      },
      orderBy: {
        name: "asc",
      },
    })
  ]);

  return <KeysClient initialKeys={JSON.parse(JSON.stringify(keys))} products={products} />;
}
