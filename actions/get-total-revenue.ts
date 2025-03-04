import { prismadb } from "@/lib/prismadb";


export const getTotalRevenue = async (storeId: string) => {
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

    // let totalRevenue = 0
    // for (const order of paidOrders){
    //     for (const orderItem of order.orderItems){
    //         totalRevenue += orderItem.product.price
    //     }
    // }

    // return totalRevenue

    const totalRevenue = paidOrders.reduce((total, order) => {
        const orderTotal = order.orderItems.reduce((orderSum, orderItem) => {
            return orderSum + orderItem.product.price;
        }, 0)
        return total + orderTotal
    }, 0)

    return totalRevenue


}