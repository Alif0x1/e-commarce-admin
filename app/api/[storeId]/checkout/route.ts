import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { prismadb } from '@/lib/prismadb';

const corHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
    return NextResponse.json(null, { headers: corHeaders });
}

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { productIds } = await req.json();

        if (!productIds || productIds.length === 0) {
            return NextResponse.json({ error: 'Invalid productIds' }, { status: 400 });
        }

        // Fetch products from DB
        const products = await prismadb.product.findMany({
            where: { id: { in: productIds } },
        });

        // Prepare Stripe checkout items
        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = products.map((product) => ({
            price_data: {
                currency: 'usd',
                product_data: { name: product.name },
                unit_amount: product.price * 100, // Convert to cents
            },
            quantity: 1, // ✅ Ensure quantity is defined
        }));

        // Create order in Prisma
        const order = await prismadb.order.create({
            data: {
                storeId: params.storeId, // ✅ Corrected params access
                isPaid: false,
                orderItems: {
                    create: productIds.map((productId: string) => ({
                        product: { connect: { id: productId } },
                        quantity: 1, // ✅ Prisma requires quantity
                    })),
                },
            },
        });

        // Create Stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/cart?canceled=1`,
            phone_number_collection: { enabled: true },
            billing_address_collection: 'required',
            metadata: { orderId: order.id }, // ✅ Metadata for tracking
        });

        console.log('Stripe Checkout URL:', session.url);
        return NextResponse.json({ url: session.url }, { headers: corHeaders });

    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
