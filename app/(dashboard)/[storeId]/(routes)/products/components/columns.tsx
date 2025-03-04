"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellActions } from "./cell-actions"


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductsColumn  = {
  id: string
  name: string
  price: string
  isFeatured: boolean
  isArchived: boolean
  size: string
  color: string
  category: string
  createdAt: string
}

export const columns: ColumnDef<ProductsColumn >[] = [
  {
    accessorKey: "name",
    header: "name",
    
  },
  {
    accessorKey: "Size",
    header: "Size",
    cell: ({row}) => row.original.size || "No Label",
  },
  {
    accessorKey: "Color",
    header: "Color",
    cell: ({row}) => (
      <div className="flex items-center gap-x-2">
        {row.original.color}
        <div className="h-6 w-6 rounded-full border" style={{backgroundColor: row.original.color}}/>
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
     cell: ({ row }) => row.original.category || "No Label",
  },

  {
    accessorKey: "price",
    header: "Price",
     cell: ({ row }) => row.original.price || "No Label",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({row}) => row.original.isFeatured ? "Yes" : "No",
  },
  {
    accessorKey:"isArchived",
    header: "Archived",
    cell: ({row}) => row.original.isArchived ? "Yes" : "No",
  },

  {
    accessorKey: "createdAt",
    header: "Date",
  },

  {
    id: "actions",
    cell: ({row}) => <CellActions data={row.original}/>
  }
]
