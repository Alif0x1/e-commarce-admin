import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prismadb } from "@/lib/prismadb";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
    return null;
  }

  const store = await prismadb.store.findFirst({
    where: {
      userId: userId,
    },
  });



  if (store) {
    redirect(`/${store.id}`);
    return null; 
  }




  return <>{children}</>;
}
