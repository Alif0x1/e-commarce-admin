import React from 'react';
import BillBoardClient from './components/client';
import { format } from 'date-fns';
import { ColoursColumn } from './components/columns';

import { prismadb } from '@/lib/prismadb';

const page = async (props: { params: Promise<{ storeId: string }> }) => {
  const params = await props.params;
  const colours = await prismadb.colour.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });





  const formattedColours: ColoursColumn[] = colours.map((item) => ({
    id: item.id,
    value: item.value,
    name: item.name,
    createdAt: format(new Date(item.createdAt), 'MMMM do, yyyy'), 
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-16">
        <BillBoardClient data={formattedColours} />

      </div>
    </div>
  );
};

export default page;
