"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@radix-ui/react-separator";
import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import React from "react";

import { BillboardColumn, columns } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import ApiList from "@/components/ui/api-list";


interface BillBoardClientProps {
  data: BillboardColumn[];
}


const BillBoardClient: React.FC<BillBoardClientProps> = ({data}) => {

  const router = useRouter()
  const { storeId } = useParams();

 
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Billboards (${data.length})`} description="Manage your billboards" />
        <Button onClick={() => router.push(`/${storeId}/billboards/new`)}>
          <Plus className="mr-2 h-4 w-4"/>
          Add New
        </Button>
      </div>
      <Separator/>
      <DataTable searchKey="label" columns={columns} data={data} />
      <Heading title="Api" description="API calls for Billboard" />
      <ApiList entityName="billboards" entityIDName="billboardsId"/>
    </>
  );
};

export default BillBoardClient;
