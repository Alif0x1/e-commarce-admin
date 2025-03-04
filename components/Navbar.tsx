import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import MainNav from "./MainNav";
import StoreSwitcher from "./store-switcher";
import { redirect } from "next/navigation";
import  {prismadb}  from "@/lib/prismadb";
import { ModeToggle } from "./themebutton";

const Navbar = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const stores = await prismadb.store.findMany({
    where: {
      userId,
    },
  });
  return (
    <div className="border-b bg-background">
      <div className="flex h-16 items-center px-4">
        {/* Store Switcher */}
        <div>
          <StoreSwitcher items={stores} />
        </div>

        {/* Main Navigation */}
        <MainNav className="mx-6"   />

        {/* User Button */}
        <div className="ml-auto flex items-center space-x-4">
          <div className="hidden md:block">
            <ModeToggle />
          </div>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
};

export default Navbar;

