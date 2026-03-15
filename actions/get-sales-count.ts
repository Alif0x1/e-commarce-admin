import { unstable_cache } from "next/cache"
import { prismadb } from "@/lib/prismadb"

const fetchSalesCount = async (storeId: string) => {
  const salesCount = await prismadb.order.count({
    where: {
      storeId,
      isPaid: true,
    },
  })

  return salesCount
}

export const getSalesCount = (storeId: string) =>
  unstable_cache(fetchSalesCount, ["sales-count", storeId], {
    tags: [`store-${storeId}-orders`],
    revalidate: 60,
  })(storeId)
