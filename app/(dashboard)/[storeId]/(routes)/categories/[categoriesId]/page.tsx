import { prismadb } from '@/lib/prismadb';
import React from 'react';
import { CategoryForm } from './components/category-form';

const CategoryPage = async (props: { params: Promise<{ categoriesId: string , storeId: string}> }) => {
    const params = await props.params;
    console.log('params form :', params.categoriesId , params.storeId); // Debugging params

    // Assuming billboard might not exist, and you still want to show 'undefined' if it's not found
    const category = await prismadb.category.findFirst({
        where: {
            id: params.categoriesId,
        },
    });

    const billboard = await prismadb.billboard.findMany(
      {
        where: {
          storeId: params.storeId
        }
      }
    )



    return (
      
        <div className="p-5 bg-gray-100">
          <div className="border-2 border-gray-300 rounded-sm p-4">
           <CategoryForm billboards={billboard} initialData={category} />
          </div>
        </div>
    );
};

export default CategoryPage;