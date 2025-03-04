import { prismadb } from "@/lib/prismadb";


export const getOrderInfo = async (storeId: string) => {
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