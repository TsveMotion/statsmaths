import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-bold text-gray-900">Admin</span>
              <span className="text-sm text-gray-500">StatManDavies</span>
            </div>
            <nav className="flex items-center space-x-6 text-sm">
              <Link href="/admin" className="text-gray-700 hover:text-indigo-600">
                Overview
              </Link>
              <Link href="/admin/resources" className="text-gray-700 hover:text-indigo-600">
                Resources
              </Link>
              <Link href="/admin/users" className="text-gray-700 hover:text-indigo-600">
                Users
              </Link>
              <Link href="/admin/purchases" className="text-gray-700 hover:text-indigo-600">
                Purchases
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</div>
    </section>
  );
}
