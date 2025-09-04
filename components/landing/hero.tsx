"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, TrendingUp, Award } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Master <span className="text-indigo-600">Statistics</span> & {" "}
            <span className="text-purple-600">Maths</span> Revision
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
            Premium revision resources designed to help you excel in your exams. 
            Created by experts, trusted by thousands of students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/resources"
              className="inline-flex items-center px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Browse Resources
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <BookOpen className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">500+ Resources</h3>
              <p className="text-gray-600">Comprehensive revision materials covering all topics</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <TrendingUp className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Proven Results</h3>
              <p className="text-gray-600">95% of students improve their grades</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="font-semibold text-lg mb-2">Expert Created</h3>
              <p className="text-gray-600">Written by experienced educators and examiners</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
