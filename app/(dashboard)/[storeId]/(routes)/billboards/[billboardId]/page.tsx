import { prismadb } from '@/lib/prismadb';
import React from 'react';
import { BillboardForm } from './components/billboard-form';

const BillboardPage = async (props: { params: Promise<{ billboardId: string }> }) => {
    const params = await props.params;
    console.log('params form :', params.billboardId); // Debugging params

    // Assuming billboard might not exist, and you still want to show 'undefined' if it's not found
    const billboard = await prismadb.billboard.findFirst({
        where: {
            id: params.billboardId,
        },
    });



    return (
      
        <div className="p-5 bg-gray-100">
          <div className="border-2 border-gray-300 rounded-sm p-4">
            <BillboardForm initialData={billboard}/> 
          </div>
        </div>
    );
};

export default BillboardPage;
