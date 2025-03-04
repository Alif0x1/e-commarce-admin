"use client"

import React from 'react'
import { BillboardColumn } from './columns'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { Bounce, toast } from 'react-toastify'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useState } from 'react'



import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@radix-ui/react-separator'





interface CellActionprops {
    data: BillboardColumn
}

export const CellActions: React.FC<CellActionprops> = ({
    data
}) => {

    const router = useRouter()
    const params = useParams()
    const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

    const handleCopy = (id:string) => {
        navigator.clipboard.writeText(id)
        toast.success('🦄 Copied!', {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
        });
    };

      const onDelete = async ( ) => {
    setLoading(true);

    try {
      await axios.delete(`/api/${params.storeId}/billboards/${data.id}`);
      router.push(`/${params.storeId}/billboards`);
    } catch (err) {
      toast.error('Make sure you remove all categories using this billboard first');
      console.log(err)
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };





    return (
       <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant={"ghost"} className=' w-8 h-8 '>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
            </Button></DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=> handleCopy(data.id)}><Copy className='mr-2 h-4 w-4' />Copy Id</DropdownMenuItem>
                <DropdownMenuItem onClick={()=> router.push(`/${params.storeId}/billboards/${data.id}`)}><Edit className='mr-2 h-4 w-4' />Update</DropdownMenuItem>
                <DropdownMenuItem onClick={()=>  setDialogOpen(true)}><Trash className='mr-2 h-4 w-4' />Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

  
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete this billboard? This action cannot be undone.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={onDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      <Separator orientation="horizontal" className='my-2' />
      </>
    )
}



