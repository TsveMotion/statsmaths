"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Eye, Download, ShoppingCart, Star, FileText, Image, Lock, Check } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ResourcePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [resource, setResource] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isPurchased, setIsPurchased] = useState(false);

  useEffect(() => {
    fetchResource();
    if (session?.user?.email) {
      checkPurchaseStatus();
    }
  }, [params.id, session]);

  const fetchResource = async () => {
    try {
      // Mock data for now
      setResource({
        id: params.id,
        title: "Statistics Fundamentals",
        description: "Master the core concepts of statistics with this comprehensive guide. Perfect for students and professionals looking to strengthen their statistical knowledge.",
        category: "Statistics",
        price: 29.99,
        featured: true,
        imageUrl: "/images/stats-preview.jpg",
        pdfUrl: "/pdfs/stats-fundamentals.pdf",
        pages: 150,
        topics: [
          "Descriptive Statistics",
          "Probability Theory",
          "Hypothesis Testing",
          "Regression Analysis",
          "Data Visualization"
        ],
        features: [
          "150+ pages of content",
          "Real-world examples",
          "Practice problems with solutions",
          "Downloadable PDF format",
          "Lifetime access"
        ],
        rating: 4.8,
        reviews: 234,
        purchases: 1250
      });
    } catch (error) {
      console.error("Error fetching resource:", error);
      toast.error("Failed to load resource");
    } finally {
      setLoading(false);
    }
  };

  const checkPurchaseStatus = async () => {
    try {
      const response = await fetch(`/api/resources/${params.id}/check-purchase`);
      if (response.ok) {
        const data = await response.json();
        setIsPurchased(data.purchased);
      }
    } catch (error) {
      console.error("Error checking purchase status:", error);
    }
  };

  const handlePurchase = () => {
    if (!session) {
      router.push("/auth/signin?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }
    router.push(`/resources/${params.id}/purchase`);
  };

  const handleDownload = async () => {
    if (!isPurchased) {
      toast.error("Please purchase this resource first");
      return;
    }
    
    // In production, this would generate a secure download link
    window.open(resource.pdfUrl, "_blank");
    toast.success("Download started!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Resource not found</h2>
          <Link href="/resources" className="text-indigo-600 hover:text-indigo-700 mt-4 inline-block">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Resource Header */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                      {resource.category}
                    </span>
                    {resource.featured && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">{resource.title}</h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="ml-1">{resource.rating} ({resource.reviews} reviews)</span>
                    </div>
                    <span>•</span>
                    <span>{resource.purchases} students enrolled</span>
                  </div>
                </div>
              </div>

              {/* Preview Image */}
              <div className="mb-8 bg-gray-100 rounded-lg overflow-hidden">
                <div className="aspect-video flex items-center justify-center">
                  <Image className="h-24 w-24 text-gray-400" />
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                <p className="text-gray-600 leading-relaxed">{resource.description}</p>
              </div>

              {/* Topics Covered */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Topics Covered</h2>
                <div className="grid md:grid-cols-2 gap-3">
                  {resource.topics.map((topic: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What's Included */}
              <div>
                <h2 className="text-xl font-semibold mb-4">What's Included</h2>
                <div className="space-y-3">
                  {resource.features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-indigo-600 mr-3 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-20">
              {/* Price */}
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900">£{resource.price}</div>
                <p className="text-gray-500 text-sm mt-1">One-time payment</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isPurchased ? (
                  <>
                    <button
                      onClick={handleDownload}
                      className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                    >
                      <Download className="h-5 w-5" />
                      Download PDF
                    </button>
                    <div className="text-center text-sm text-green-600">
                      <Check className="h-4 w-4 inline mr-1" />
                      You own this resource
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handlePurchase}
                      className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-5 w-5" />
                      Buy Now
                    </button>
                    <button
                      className="w-full py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <Eye className="h-5 w-5" />
                      Preview Sample
                    </button>
                  </>
                )}
              </div>

              {/* Features */}
              <div className="mt-6 pt-6 border-t">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <FileText className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">{resource.pages} pages</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Download className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">PDF Download</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Lock className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-600">Lifetime Access</span>
                  </div>
                </div>
              </div>

              {/* Money Back Guarantee */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">30-Day Money Back Guarantee</p>
                <p className="text-xs text-green-600 mt-1">
                  Not satisfied? Get a full refund within 30 days.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
