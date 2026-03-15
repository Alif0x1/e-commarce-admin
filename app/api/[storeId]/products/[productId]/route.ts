import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prismadb } from '@/lib/prismadb';

export async function GET(
  req: Request, 
  props: { params: Promise<{ productId: string }> }
) {
  const { productId } = await props.params; // Destructure params

  if (!productId) {
    return new NextResponse('Missing productId', { status: 400 });
  }

  try {
    const product = await prismadb.product.findUnique({
      where: { id: productId },
      include: {
        images: true,
        category: true,
        size: true,
        colour: true,
      },
    });

    if (!product) {
      return new NextResponse('Product not found', { status: 404 });
    }

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[PRODUCTS_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PATCH(
  req: Request, 
  props: { params: Promise<{ storeId: string; productId: string }> }
) {
  const { storeId, productId } = await props.params; // Destructure params
  const { userId } = await auth(); // Assuming auth() fetches the authenticated user
  const body = await req.json();

  const {
    name,
    price,
    categoryId,
    sizeId,
    colourId,
    images,
    isFeatured,
    isArchived,
  } = body;

  if (!userId) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!name || !price || !categoryId || !sizeId || !colourId || !images?.length) {
    return new NextResponse('Missing required fields', { status: 400 });
  }

  if (!productId || !storeId) {
    return new NextResponse('Missing storeId or productId', { status: 400 });
  }

  try {
    const storeByUserId = await prismadb.store.findFirst({
      where: { id: storeId, userId },
    });

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await prismadb.product.update({
      where: { id: productId },
      data: {
        name,
        price,
        categoryId,
        sizeId,
        colourId,
        isFeatured,
        isArchived,
        images: { deleteMany: {} }, // Clear existing images
      },
    });

    const updatedProduct = await prismadb.product.update({
      where: { id: productId },
      data: {
        images: {
          createMany: {
            data: images.map((image: { url: string }) => ({ url: image.url })),
          },
        },
      },
    });

    return new NextResponse(JSON.stringify(updatedProduct), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('[PRODUCT_PATCH]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}


export async function DELETE(
  req: Request,
  props: { params: Promise<{ storeId: string; productId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } =  await auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!params.productId) {
      return new NextResponse('Missing productId', { status: 400 })
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

    const product = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    })

    return new NextResponse(JSON.stringify(product), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error)

    return new NextResponse('Internal Server Error', { status: 500 })
  }
}