"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellActions } from "./cell-actions"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BillboardColumn  = {
  id: string
  label: string
  creatAt: string
}

export const columns: ColumnDef<BillboardColumn >[] = [
  {
    accessorKey: "label",
    header: "Label",
  },

  {
    accessorKey: "creatAt",
    header: "Date",
  },

  {
    id: "actions",
    cell: ({row}) => <CellActions data={row.original}/>
  }
]
