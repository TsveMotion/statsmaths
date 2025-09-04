"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { ShoppingBag, Lock } from "lucide-react";
import toast from "react-hot-toast";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function CheckoutPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else {
      fetchResource();
    }
  }, [status, router]);

  const fetchResource = async () => {
    try {
      const response = await fetch(`/api/resources/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setResource(data);
      }
    } catch (error) {
      console.error("Error fetching resource:", error);
    }
  };

  const handleCheckout = async () => {
    setLoading(true);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resourceId: params.id }),
      });

      if (response.ok) {
        const { sessionId } = await response.json();
        const stripe = await stripePromise;
        
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({ sessionId });
          
          if (error) {
            toast.error("Checkout failed. Please try again.");
          }
        }
      } else {
        toast.error("Failed to create checkout session");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
          
          <div className="border-b pb-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{resource.title}</h2>
            <p className="text-gray-600 mb-4">{resource.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Category: {resource.category}</span>
              <span className="text-2xl font-bold text-gray-900">£{resource.price.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              <Lock className="h-5 w-5 text-indigo-600 mr-2" />
              <span className="font-semibold text-gray-900">Secure Payment</span>
            </div>
            <p className="text-sm text-gray-600">
              Your payment information is encrypted and secure. We use Stripe for payment processing.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">What you'll get:</h3>
            <ul className="list-disc list-inside text-gray-600 space-y-1">
              <li>Instant download access</li>
              <li>Lifetime access to the resource</li>
              <li>Free updates if available</li>
              <li>Email support</li>
            </ul>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingBag className="h-5 w-5 mr-2" />
            {loading ? "Processing..." : "Proceed to Payment"}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            By completing this purchase, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
