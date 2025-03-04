import { prismadb } from '@/lib/prismadb';
import React from 'react';
import { ProductsForm } from './components/product-form';


const BillboardPage = async (props: { params: Promise<{ productId: string  , storeId: string }> }) => {
  const params = await props.params;


 
  const products = await prismadb.product.findFirst({
    where: {
      id: params.productId,
    },
    include: {
      images: true,

    },
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  })

  const colors = await prismadb.colour.findMany({
    where: {
      storeId: params.storeId,
    },
  })





  return (

    <div className="p-5 bg-gray-100">
      <div className="border-2 border-gray-300 rounded-sm p-4">
        <ProductsForm initialData={products}
         categories={categories}
         sizes={sizes}
         colors={colors}
         

        />
      </div>
    </div>
  );
};

export default BillboardPage;
