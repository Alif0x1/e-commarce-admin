import { unstable_cache } from 'next/cache'
import {prismadb} from '@/lib/prismadb'


const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const fetchGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: { storeId, isPaid: true },
    select: { createdAt: true, orderItems: { select: { product: { select: { price: true } } } } }
  })

  const monthlyRevenue = new Array(12).fill(0)

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth()
    monthlyRevenue[month] += order.orderItems.reduce((sum, item) => sum + item.product.price, 0)
  }

  return months.map((name, i) => ({ name, total: monthlyRevenue[i] }))
}

export const getGraphRevenue = (storeId: string) =>
  unstable_cache(fetchGraphRevenue, ["graph-revenue", storeId], {
    tags: [`store-${storeId}-orders`],
    revalidate: 60,
  })(storeId)
