"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { CreditCard, Lock, Shield, CheckCircle, User, Mail } from "lucide-react";
import { loadStripe } from "@stripe/stripe-js";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

export default function PurchasePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [checkoutMode, setCheckoutMode] = useState<"guest" | "account">("guest");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestName, setGuestName] = useState("");

  useEffect(() => {
    fetchResource();
  }, [params.id]);

  const fetchResource = async () => {
    try {
      // Mock data for now
      setResource({
        id: params.id,
        title: "Statistics Fundamentals",
        description: "Master the core concepts of statistics",
        price: 29.99,
        imageUrl: "/images/stats-preview.jpg"
      });
    } catch (error) {
      console.error("Error fetching resource:", error);
      toast.error("Failed to load resource");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    // Validate guest checkout
    if (checkoutMode === "guest" && !session) {
      if (!guestEmail || !guestName) {
        toast.error("Please enter your email and name");
        return;
      }
      if (!guestEmail.includes("@")) {
        toast.error("Please enter a valid email address");
        return;
      }
    }

    setProcessing(true);
    
    try {
      // Create checkout session
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resourceId: params.id,
          priceAmount: resource.price,
          resourceTitle: resource.title,
          resourceDescription: resource.description,
          guestEmail: checkoutMode === "guest" ? guestEmail : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { sessionId, url } = await response.json();
      
      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url;
      } else {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe not loaded");
        }
        const result = await stripe.redirectToCheckout({ sessionId });
        if (result.error) {
          throw new Error(result.error.message);
        }
      }
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast.error(error.message || "Payment failed. Please try again.");
      setProcessing(false);
    }
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8 rounded-t-lg text-white">
            <h1 className="text-2xl font-bold mb-2">Complete Your Purchase</h1>
            <p className="text-indigo-100">Secure checkout powered by Stripe</p>
          </div>

          {/* Order Summary */}
          <div className="p-8 border-b">
            <h2 className="text-lg font-semibold mb-4 text-black">Order Summary</h2>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium text-black">{resource?.title}</h3>
                <p className="text-sm text-black mt-1">{resource?.description}</p>
              </div>
              <div className="text-xl font-bold text-black">£{resource?.price}</div>
            </div>
          </div>

          {/* Payment Details */}
          <div className="p-8 border-b">
            <h2 className="text-lg font-semibold mb-4 text-black">Payment Information</h2>
            
            {/* Checkout Mode Selection */}
            {!session && (
              <div className="mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setCheckoutMode("guest")}
                    className={`p-4 border-2 rounded-lg transition ${
                      checkoutMode === "guest" 
                        ? "border-indigo-600 bg-indigo-50" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <User className="h-5 w-5 mx-auto mb-2 text-indigo-600" />
                    <div className="font-medium text-black">Guest Checkout</div>
                    <p className="text-sm text-black mt-1">Quick purchase without account</p>
                  </button>
                  <button
                    onClick={() => {
                      setCheckoutMode("account");
                      router.push("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.pathname));
                    }}
                    className={`p-4 border-2 rounded-lg transition ${
                      checkoutMode === "account" 
                        ? "border-indigo-600 bg-indigo-50" 
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <Lock className="h-5 w-5 mx-auto mb-2 text-indigo-600" />
                    <div className="font-medium text-black">Sign In</div>
                    <p className="text-sm text-black mt-1">Access your account benefits</p>
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-green-600 mr-2" />
                  <span className="font-medium text-black">Secure Payment</span>
                </div>
                <p className="text-sm text-black">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>

              {/* Guest Checkout Form */}
              {checkoutMode === "guest" && !session ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      <Mail className="inline h-4 w-4 mr-1" />
                      Email *
                    </label>
                    <input
                      type="email"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="your@email.com"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      <User className="inline h-4 w-4 mr-1" />
                      Name *
                    </label>
                    <input
                      type="text"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              ) : session ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={session.user?.email || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={session.user?.name || ""}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Benefits */}
          <div className="p-8 border-b">
            <h2 className="text-lg font-semibold mb-4 text-black">What You'll Get</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-black">Instant access to download</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-black">Lifetime access to updates</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-black">30-day money back guarantee</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                <span className="text-black">Email support included</span>
              </div>
            </div>
          </div>

          {/* Total and Actions */}
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-lg font-semibold text-black">Total</span>
              <span className="text-2xl font-bold text-indigo-600">£{resource?.price}</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                disabled={processing}
                className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5" />
                    Complete Purchase
                  </>
                )}
              </button>

              <button
                onClick={() => router.back()}
                className="w-full py-3 border border-gray-300 text-black rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center text-sm text-black">
              <Lock className="h-4 w-4 mr-1" />
              Secured by 256-bit SSL encryption
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
