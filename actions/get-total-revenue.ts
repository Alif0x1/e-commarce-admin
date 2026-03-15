import { unstable_cache } from "next/cache";
import { prismadb } from "@/lib/prismadb";


const fetchTotalRevenue = async (storeId: string) => {
    const paidOrders = await prismadb.order.findMany({
        where: {
            storeId,
            isPaid: true
        },
        select: {
            orderItems: {
                select: {
                    product: {
                        select: {
                            price: true
                        }
                    }
                }
            }
        }
    })

    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, orderItem) => {
            return orderSum + orderItem.product.price;
        }, 0)
        return total + orderTotal
    }, 0)

    return totalRevenue
}

export const getTotalRevenue = (storeId: string) =>
    unstable_cache(fetchTotalRevenue, ["total-revenue", storeId], {
        tags: [`store-${storeId}-orders`],
        revalidate: 60,
    })(storeId)
