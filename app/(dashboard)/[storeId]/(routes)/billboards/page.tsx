import React from 'react';
import BillBoardClient from './components/client';
import { format } from 'date-fns';
import { BillboardColumn } from './components/columns';

import { prismadb } from '@/lib/prismadb';

const page = async (props: { params: Promise<{ storeId: string }> }) => {
  const params = await props.params;
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      creatAt: 'desc',
    },
  });





  const formattedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    label: item.label,
    creatAt: format(new Date(item.creatAt), 'MMMM do, yyyy'), 
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-16">
        <BillBoardClient data={formattedBillboards} />
      </div>
    </div>
  );
};

export default page;
