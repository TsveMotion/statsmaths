import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-08-27.basil",
});

export async function POST(request: NextRequest) {
  try {
    const { resourceId, priceAmount, resourceTitle, resourceDescription, guestEmail } = await request.json();
    
    // Get session if exists (for logged-in users)
    const session = await getServerSession(authOptions);
    const customerEmail = session?.user?.email || guestEmail;

    // Create checkout session for both guest and logged-in users
    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "gbp",
            product_data: {
              name: resourceTitle || `Resource ${resourceId}`,
              description: resourceDescription || "Educational revision material",
            },
            unit_amount: Math.round(priceAmount * 100), // Convert to pence
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}&resource_id=${resourceId}`,
      cancel_url: `${process.env.NEXTAUTH_URL}/resources/${resourceId}/purchase`,
      customer_email: customerEmail,
      metadata: {
        resourceId,
        userId: session?.user?.id || 'guest',
      },
      // Allow promotion codes
      allow_promotion_codes: true,
    });

    return NextResponse.json({ 
      sessionId: checkoutSession.id,
      url: checkoutSession.url 
    });
  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
