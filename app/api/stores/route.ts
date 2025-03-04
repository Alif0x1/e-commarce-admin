import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prismadb } from "@/lib/prismadb";


export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    const body = await req.json();
    const { name } = body


    if(!userId) {
      return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    if(!name) {
      return new NextResponse(JSON.stringify({ error: 'Name is required' }), { status: 400 });
    }

    const store =  await prismadb.store.create({
        data: {
            name,
            userId
        }
    })

    return new NextResponse(JSON.stringify(store), { status: 201 });
  } catch (e) {
    console.error('[STORE_POST]', e);
    return new NextResponse(JSON.stringify({ error: 'Something went wrong' }), { status: 500 });
  }
}





 