import { unstable_cache } from "next/cache";
import { prismadb } from "@/lib/prismadb";


const fetchOrderInfo = async (storeId: string) => {
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
                            name: true,
                            price: true,
                            category: {
                                select: {
                                    name: true
                                }
                            }
                            
                        }
                    }
                }
            }
        }
    })

    return paidOrders
}

export const getOrderInfo = (storeId: string) =>
    unstable_cache(fetchOrderInfo, ["order-info", storeId], {
        tags: [`store-${storeId}-orders`],
        revalidate: 60,
    })(storeId)
