"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { BookOpen, User, LogOut, ShoppingCart } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-indigo-600" />
            <span className="font-bold text-xl text-gray-900">StatsMaths</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link href="/resources" className="text-gray-700 hover:text-indigo-600">
              Resources
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-indigo-600">
              About
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-indigo-600">
              Contact
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {session ? (
              <>
                {session.user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="text-gray-700 hover:text-indigo-600"
                  >
                    Admin
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
                >
                  <User className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
