import React from 'react';
import BillBoardClient from './components/client';
import { format } from 'date-fns';
import { ProductsColumn } from './components/columns';
import { prismadb } from '@/lib/prismadb';
import { formatter } from '@/lib/utils';



const page = async (props: { params: Promise<{ storeId: string }> }) => {
  const params = await props.params;
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      colour: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });





  const formattedProducts: ProductsColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(item.price),
    size: item.size?.name ,
    color: item.colour?.name,
    category: item.category?.name,
    createdAt: format(new Date(item.createdAt), 'MMMM do, yyyy'), 
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-16">
        <BillBoardClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default page;
