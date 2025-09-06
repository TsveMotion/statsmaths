"use client";

import { BookOpen, Target, Users, Award, CheckCircle, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">About StatManDavies</h1>
            <p className="text-xl text-indigo-100 max-w-3xl">
              Empowering students and professionals with comprehensive statistics and mathematics resources
            </p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-black mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-4">
                We believe that everyone deserves access to high-quality educational resources. 
                Our mission is to make statistics and mathematics learning accessible, engaging, 
                and effective for learners at all levels.
              </p>
              <p className="text-lg text-gray-600">
                Through carefully curated content, expert-written materials, and innovative 
                teaching methods, we help students overcome challenges and excel in their studies.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Target className="h-12 w-12 text-indigo-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Focused Learning</h3>
                <p className="text-black">Targeted resources for specific topics</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <BookOpen className="h-12 w-12 text-purple-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Expert Content</h3>
                <p className="text-black">Created by experienced educators</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Users className="h-12 w-12 text-green-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Student Success</h3>
                <p className="text-black">Thousands of satisfied learners</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <Award className="h-12 w-12 text-yellow-600 mb-4" />
                <h3 className="font-semibold text-lg mb-2">Quality Assured</h3>
                <p className="text-black">Peer-reviewed and tested materials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-black mb-12">Our Impact</h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-indigo-600">10,000+</div>
                <div className="text-gray-600 mt-2">Students Helped</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600">500+</div>
                <div className="text-gray-600 mt-2">Resources Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-600">95%</div>
                <div className="text-gray-600 mt-2">Success Rate</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-600">4.8/5</div>
                <div className="text-gray-600 mt-2">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-center text-black mb-12">Meet the Founder</h2>
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-4xl font-bold">
              SD
            </div>
            <h3 className="text-2xl font-semibold mb-2">StatMan Davies</h3>
            <p className="text-indigo-600 mb-4">Founder & Lead Educator</p>
            <p className="text-lg text-gray-600">
              With over 10 years of experience in teaching statistics and mathematics, 
              StatMan Davies founded this platform to help students worldwide achieve 
              their academic goals. Passionate about making complex concepts simple and 
              accessible to everyone.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
