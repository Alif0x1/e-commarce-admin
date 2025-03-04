"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { ColoursColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";


interface BillBoardClientProps {
  data: ColoursColumn[];
}


const BillBoardClient: React.FC<BillBoardClientProps> = ({data}) => {

  const router = useRouter()
  const { storeId } = useParams();

 
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Colors (${data.length})`} description="Manage your Colors" />
        <Button onClick={() => router.push(`/${storeId}/colours/new`)}>
          <Plus className="mr-2 h-4 w-4"/>
          Add New
        </Button>
      </div>
      <Separator/>
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="Api" description="API calls for colours" />
      <ApiList entityName="colours" entityIDName="colourId"/>
    </>
  );
};

export default BillBoardClient;
