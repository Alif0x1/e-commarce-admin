"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellActions } from "./cell-actions";

// Define the shape of our data
export type CategoryColumn = {
  id: string;
  name: string;
  billboardLabel: string;
  createdAt: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name", // This key must match the key in the data structure
    header: "Name",
  },
  {
    accessorKey: "billboardLabel", // Ensure this matches the key you're passing in the data
    header: "Billboard",
    cell: ({ row }) => row.original.billboardLabel || "No Label", // Custom cell rendering
  },
  {
    accessorKey: "createdAt", // This key must also match the key in the data structure
    header: "Date",
  },
  {
    id: "actions", // Ensure actions column is defined correctly
    cell: ({ row }) => <CellActions data={row.original} />,
  },
];
