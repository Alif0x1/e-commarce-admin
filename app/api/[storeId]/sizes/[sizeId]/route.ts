import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prismadb } from '@/lib/prismadb';

export async function GET(req: Request, props: { params: Promise<{ sizeId: string }> }) {
  const params = await props.params;
  try {
    if (!params.sizeId) {
      return new NextResponse('Missing sizeId', { status: 400 })
    }

    const billboard = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    })

    return new NextResponse(JSON.stringify(billboard), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[BILLBOARD_GET]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}


export async function PATCH(
  req: Request,
  props: { params: Promise<{ storeId: string; sizeId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth()
    const body = await req.json()
    const { name, value } = body

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!name) {
      return new NextResponse('Missing name', { status: 400 })
    }

    if (!value) {
      return new NextResponse('Missing value', { status: 400 })
    }

    if (!params.sizeId) {
      return new NextResponse('Missing sizeId', { status: 400 })
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

    const billboard = await prismadb.size.updateMany({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    })

    return new NextResponse(JSON.stringify(billboard), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  props: { params: Promise<{ storeId: string; sizeId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.sizeId) {
      return new NextResponse('Missing sizeId', { status: 400 })
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

    const billboard = await prismadb.size.deleteMany({
      where: {
        id: params.sizeId,
      },
    })

    return new NextResponse(JSON.stringify(billboard), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}