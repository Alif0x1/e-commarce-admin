import React from 'react';
import CategoryClient from './components/client';
import { format } from 'date-fns';
import { CategoryColumn } from './components/columns';

import { prismadb } from '@/lib/prismadb';

const categoriespage = async (props: { params: Promise<{ storeId: string }> }) => {
  const params = await props.params;
  const Categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const formattedCategories: CategoryColumn[] = Categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard?.label || "No Label",
    createdAt: format(new Date(item.createdAt), 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-16">
        <CategoryClient data={formattedCategories} />
      </div>
    </div>
  );
};


export default categoriespage;
