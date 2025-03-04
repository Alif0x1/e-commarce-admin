import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prismadb } from '@/lib/prismadb';

export async function GET(req: Request, props: { params: Promise<{ categorieId: string }> }) {
  const params = await props.params;
  try {
    if (!params.categorieId) {
      return new NextResponse('Missing categorieId', { status: 400 })
    }

    const categorie = await prismadb.category.findUnique({
      where: {
        id: params.categorieId,
      },
      include: {
        billboard: true
      }
    })

    return new NextResponse(JSON.stringify(categorie), {
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


export async function PATCH(
  req: Request,
  props: { params: Promise<{ storeId: string; categorieId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth()
    const body = await req.json()
    const { name, BillboardId } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Missing label', { status: 400 })
    }

    if (!BillboardId) {
      return new NextResponse('Missing BillboardId', { status: 400 })
    }

    if (!params.categorieId) {
      return new NextResponse('Missing categorieId', { status: 400 })
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

    const categorie = await prismadb.category.updateMany({
      where: {
        id: params.categorieId,
      },
      data: {
        name,
        BillboardId,
      },
    })

    return new NextResponse(JSON.stringify(categorie), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[CATEGORIES_PATCH]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ storeId: string; categorieId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.categorieId) {
      return new NextResponse('Missing categorieId', { status: 400 })
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

    const categorie = await prismadb.category.deleteMany({
      where: {
        id: params.categorieId,
      },
    })

    return new NextResponse(JSON.stringify(categorie), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[CATEGORIES_DELETE]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}