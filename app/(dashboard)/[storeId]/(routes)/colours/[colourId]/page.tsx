import { prismadb } from '@/lib/prismadb';
import React from 'react';
import { ColoursForm } from './components/size-form';

const BillboardPage = async (props: { params: Promise<{ colourId: string }> }) => {
    const params = await props.params;
    console.log('params form :', params.colourId); // Debugging params

    // Assuming billboard might not exist, and you still want to show 'undefined' if it's not found
    const colour = await prismadb.colour.findFirst({
        where: {
            id: params.colourId,
        },
    });



    return (
      
        <div className="p-5 bg-gray-100">
          <div className="border-2 border-gray-300 rounded-sm p-4">
            <ColoursForm initialData={colour}/> 
          </div>
        </div>
    );
};

export default BillboardPage;
