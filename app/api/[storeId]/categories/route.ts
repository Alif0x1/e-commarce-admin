import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prismadb } from "@/lib/prismadb";

export async function POST(req: Request, props: { params: Promise<{ storeId: string }> }) {
  const params = await props.params;
  try {
    // Step 1: Authentication - Ensure the user is logged in
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized - Please log in', { status: 401 });
    }

    // Step 2: Parse the request body
    const body = await req.json();
    const { name, BillboardId } = body as { name: string; BillboardId : string };

    // Step 3: Validation - Ensure required fields are present
    if (!name || !BillboardId) {
      return new NextResponse('Name and BillboardId are required', { status: 400 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }


    // Step 5: Create the category in the database
    const categories = await prismadb.category.create({
      data: {
        name : name,
        BillboardId: BillboardId,
        storeId: params.storeId,
      },
    });

    return new NextResponse(JSON.stringify(categories), { status: 201 });
  } catch (error) {
    console.error('[CATEGORIES_POST] Error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


export async function GET(req: Request, props: { params: Promise<{ storeId: string }> }) {
  const params = await props.params;
  try {
    if (!params.storeId) {
      return new NextResponse('Missing storeId', { status: 400 })
    }

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    })

    return new NextResponse(JSON.stringify(categories), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[CATEGORIES_GET]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}