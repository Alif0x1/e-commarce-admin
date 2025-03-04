import React from 'react';
import BillBoardClient from './components/client';
import { format } from 'date-fns';
import { SizesColumn } from './components/columns';

import { prismadb } from '@/lib/prismadb';

const page = async (props: { params: Promise<{ storeId: string }> }) => {
  const params = await props.params;
  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });



  const formattedSizes: SizesColumn[] = sizes.map((item) => ({
    id: item.id,
    value: item.value,
    name: item.name,
    createdAt: format(new Date(item.createdAt), 'MMMM do, yyyy'), 
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-16">
        <BillBoardClient data={formattedSizes} />
      </div>
    </div>
  );
};

export default page;
