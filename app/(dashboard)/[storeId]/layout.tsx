import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";
import Navbar from "@/components/Navbar";


export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard",
};

export default async function RootLayout(
  props: {
    children: React.ReactNode;
    params: Promise<{ storeId: string }>;
  }
) {
  const params = await props.params;

  const {
    children
  } = props;

  // Await the auth() to get the userId
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }
  
  // Await params to access storeId
  // const { storeId } =  await params;  // Now awaiting params to access storeId dynamically

  // if (!storeId) {
  //   redirect("/");
  // }

  // Fetch store information from the database

  const store = await prismadb.store.findFirst({
    where: {
      id:  params.storeId,
      userId: userId,
    },
  });

  if (!store) {
    redirect("/");
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
