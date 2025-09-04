"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Eye } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
}

export function FeaturedProducts() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedResources();
  }, []);

  const fetchFeaturedResources = async () => {
    try {
      const response = await fetch("/api/resources/featured");
      if (response.ok) {
        const data = await response.json();
        setResources(data);
      }
    } catch (error) {
      console.error("Error fetching featured resources:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for development
  const mockResources = [
    {
      id: "1",
      title: "A-Level Statistics Complete Revision Pack",
      description: "Comprehensive revision materials for A-Level Statistics including practice questions and detailed solutions.",
      price: 29.99,
      category: "Statistics"
    },
    {
      id: "2",
      title: "GCSE Maths Foundation Toolkit",
      description: "Everything you need to ace your GCSE Maths Foundation exam with confidence.",
      price: 19.99,
      category: "Mathematics"
    },
    {
      id: "3",
      title: "Advanced Calculus Mastery Guide",
      description: "Master calculus concepts with step-by-step explanations and worked examples.",
      price: 34.99,
      category: "Mathematics"
    }
  ];

  const displayResources = resources.length > 0 ? resources : mockResources;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Revision Packs
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hand-picked resources to help you succeed in your exams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayResources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                    {resource.category}
                  </span>
                  <span className="text-2xl font-bold text-gray-900">
                    {formatPrice(resource.price)}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {resource.title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {resource.description}
                </p>
                
                <div className="flex gap-3">
                  <Link
                    href={`/resources/${resource.id}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Link>
                  <Link
                    href={`/checkout/${resource.id}`}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Buy Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/resources"
            className="inline-flex items-center px-6 py-3 text-lg font-semibold text-indigo-600 hover:text-indigo-700"
          >
            View All Resources
            <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
