import { prismadb } from '@/lib/prismadb';
import React from 'react';
import { SizeForm } from './components/size-form';

const BillboardPage = async (props: { params: Promise<{ sizeId: string }> }) => {
    const params = await props.params;
    console.log('params form :', params.sizeId); // Debugging params

    // Assuming billboard might not exist, and you still want to show 'undefined' if it's not found
    const size = await prismadb.size.findFirst({
        where: {
            id: params.sizeId,
        },
    });



    return (
      
        <div className="p-5 bg-gray-100">
          <div className="border-2 border-gray-300 rounded-sm p-4">
            <SizeForm initialData={size}/> 
          </div>
        </div>
    );
};

export default BillboardPage;
