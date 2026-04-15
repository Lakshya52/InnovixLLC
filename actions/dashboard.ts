"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

  const [totalRevenue, currentMonthRevenue, lastMonthRevenue, totalOrders, currentMonthOrders, fulfilledOrders] = await Promise.all([
    prisma.order.aggregate({
      _sum: { amount: true }
    }),
    prisma.order.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1)
        }
      }
    }),
    prisma.order.aggregate({
      _sum: { amount: true },
      where: {
        createdAt: {
          gte: lastMonth,
          lt: new Date(now.getFullYear(), now.getMonth(), 1)
        }
      }
    }),
    prisma.order.count(),
    prisma.order.count({
      where: {
        createdAt: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1)
        }
      }
    }),
    prisma.order.count({
      where: {
        status: "Fulfilled"
      }
    })
  ]);

  const revenue = totalRevenue._sum.amount || 0;
  const currentRevenue = currentMonthRevenue._sum.amount || 0;
  const previousRevenue = lastMonthRevenue._sum.amount || 0;
  
  const revenueChange = previousRevenue > 0 
    ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 
    : 0;

  const fulfillmentRate = totalOrders > 0 
    ? (fulfilledOrders / totalOrders) * 100 
    : 0;

  const [totalUsers, totalProducts] = await Promise.all([
    prisma.user.count({
      where: { role: "USER" }
    }),
    prisma.product.count()
  ]);

  return {
    revenue: revenue.toFixed(2),
    revenueChange: revenueChange.toFixed(1),
    totalOrders,
    ordersChange: 0,
    fulfillmentRate: fulfillmentRate.toFixed(1),
    totalUsers,
    totalProducts
  };
}

export async function getRecentOrders(limit = 10) {
  const orders = await prisma.order.findMany({
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" },
    take: limit
  });

  return orders;
}

export async function getOrdersWithPagination(page = 1, limit = 10, status?: string) {
  const skip = (page - 1) * limit;
  
  const where = status ? { status } : {};

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      include: { user: true, product: true },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      where
    }),
    prisma.order.count({ where })
  ]);

  return {
    orders,
    totalPages: Math.ceil(total / limit),
    currentPage: page,
    total
  };
}
