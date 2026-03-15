import { unstable_cache } from "next/cache"
import { prismadb } from "@/lib/prismadb"


const fetchStockCount = async (storeId: string) => {
  const stockCount = await prismadb.product.count({
    where: {
      storeId,
      isArchived: false,
    },
  })

  return stockCount
}

export const getStockCount = (storeId: string) =>
  unstable_cache(fetchStockCount, ["stock-count", storeId], {
    tags: [`store-${storeId}-products`],
    revalidate: 60,
  })(storeId)
