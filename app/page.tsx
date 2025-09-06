"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BookOpen, TrendingUp, Users, Award, Star, ArrowRight, 
  CheckCircle, Download, Shield, DollarSign, Clock, Zap 
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import toast from "react-hot-toast";

export default function Home() {
  const { data: session } = useSession();
  const [featuredResources, setFeaturedResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedResources();
  }, []);

  const fetchFeaturedResources = async () => {
    try {
      const response = await fetch("/api/resources/featured");
      const data = await response.json();
      setFeaturedResources(data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 text-white">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Master Statistics & Mathematics
                <span className="block text-3xl md:text-5xl mt-2 text-yellow-300">
                  With Expert-Crafted Resources
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
                Join thousands of students achieving academic excellence with our comprehensive study materials
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/resources"
                  className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                >
                  Browse Resources <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-8 py-4 bg-yellow-400 text-gray-900 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition"
                >
                  Start Learning Free
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-indigo-600">10,000+</div>
                <div className="text-black mt-1">Happy Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">500+</div>
                <div className="text-black mt-1">Study Resources</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">4.9/5</div>
                <div className="text-black mt-1">Average Rating</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-yellow-600">95%</div>
                <div className="text-black mt-1">Pass Rate</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Resources */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Best-Selling Resources
              </h2>
              <p className="text-xl text-black max-w-2xl mx-auto">
                Carefully crafted materials to help you excel in your studies
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                {featuredResources.map((resource) => (
                  <div key={resource.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                          {resource.category}
                        </span>
                        {resource.featured && (
                          <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{resource.title}</h3>
                      <p className="text-black mb-4">{resource.description}</p>
                      <div className="text-3xl font-bold text-indigo-600 mb-4">
                        £{resource.price}
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/resources/${resource.id}/preview`}
                          className="flex-1 px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50 text-center"
                        >
                          Preview
                        </Link>
                        <Link
                          href={`/resources/${resource.id}/purchase`}
                          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-center"
                        >
                          Buy Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="text-center mt-12">
              <Link
                href="/resources"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium gap-2"
              >
                View All Resources <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose StatManDavies?
              </h2>
              <p className="text-xl text-black max-w-2xl mx-auto">
                Everything you need to succeed in your academic journey
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Expert Content</h3>
                <p className="text-black">
                  Created by experienced educators with proven track records
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Download className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Instant Access</h3>
                <p className="text-black">
                  Download resources immediately after purchase
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Money Back Guarantee</h3>
                <p className="text-black">
                  30-day refund policy if you're not satisfied
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Quick Learning</h3>
                <p className="text-black">
                  Concise, focused content for efficient studying
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Support</h3>
                <p className="text-black">
                  Join a community of motivated learners
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Proven Results</h3>
                <p className="text-black">
                  95% of students improve their grades
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                What Students Say
              </h2>
              <p className="text-xl text-black max-w-2xl mx-auto">
                Real feedback from real students
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-black mb-4">
                  "The statistics guide helped me go from a C to an A in just one semester. 
                  The explanations are clear and the practice problems are invaluable."
                </p>
                <div className="font-semibold">Sarah Johnson</div>
                <div className="text-sm text-black">University Student</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-black mb-4">
                  "Best investment in my education. The calculus resources are comprehensive 
                  and easy to understand. Highly recommend!"
                </p>
                <div className="font-semibold">Michael Chen</div>
                <div className="text-sm text-black">Engineering Student</div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-black mb-4">
                  "The practice problems and detailed solutions are exactly what I needed. 
                  Worth every penny!"
                </p>
                <div className="font-semibold">Emma Williams</div>
                <div className="text-sm text-black">Mathematics Major</div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Excel in Your Studies?
            </h2>
            <p className="text-xl mb-8 text-indigo-100">
              Join thousands of successful students today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/resources"
                className="px-8 py-4 bg-white text-indigo-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
              >
                Browse All Resources
              </Link>
              <Link
                href="/contact"
                className="px-8 py-4 bg-indigo-500 text-white rounded-lg font-semibold text-lg hover:bg-indigo-400 transition"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
