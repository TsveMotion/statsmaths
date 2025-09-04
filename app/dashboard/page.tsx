"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { 
  BookOpen, 
  Download, 
  ShoppingCart, 
  Clock, 
  FileText, 
  User,
  CreditCard,
  Package,
  TrendingUp,
  Award
} from "lucide-react";
import toast from "react-hot-toast";

interface Purchase {
  id: string;
  resourceId: string;
  createdAt: string;
  resource: {
    id: string;
    title: string;
    description: string;
    category: string;
    fileUrl?: string;
    price: number;
  };
}

interface DashboardStats {
  totalPurchases: number;
  totalSpent: number;
  recentPurchases: Purchase[];
  recommendedResources: any[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPurchases: 0,
    totalSpent: 0,
    recentPurchases: [],
    recommendedResources: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      // Fetch user purchases
      const purchasesRes = await fetch("/api/user/purchases");
      if (purchasesRes.ok) {
        const purchasesData = await purchasesRes.json();
        setPurchases(purchasesData);
        
        // Calculate stats
        const totalSpent = purchasesData.reduce((sum: number, p: Purchase) => 
          sum + p.resource.price, 0
        );
        
        setStats({
          totalPurchases: purchasesData.length,
          totalSpent: totalSpent,
          recentPurchases: purchasesData.slice(0, 3),
          recommendedResources: []
        });
      }

      // Fetch recommended resources
      const recommendedRes = await fetch("/api/resources/recommended");
      if (recommendedRes.ok) {
        const recommendedData = await recommendedRes.json();
        setStats(prev => ({
          ...prev,
          recommendedResources: recommendedData
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (resourceId: string, title: string) => {
    try {
      const response = await fetch(`/api/download/${resourceId}`);
      if (!response.ok) {
        throw new Error("Download failed");
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast.success("Download started!");
    } catch (error) {
      toast.error("Failed to download resource");
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Welcome back, {session?.user?.name || "Student"}!
                </h1>
                <p className="mt-2 text-gray-600">
                  Track your progress and access your revision materials
                </p>
              </div>
              <div className="hidden md:block">
                <div className="flex items-center space-x-2">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Resources</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPurchases}</p>
                </div>
                <Package className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Invested</p>
                  <p className="text-2xl font-bold text-gray-900">£{stats.totalSpent.toFixed(2)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Study Streak</p>
                  <p className="text-2xl font-bold text-gray-900">7 days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Achievement</p>
                  <p className="text-2xl font-bold text-gray-900">Rising Star</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Resources Section */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                  My Resources
                </h2>
                
                {purchases.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">No resources yet</p>
                    <button
                      onClick={() => router.push("/resources")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Browse Resources
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">{purchase.resource.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{purchase.resource.description}</p>
                            <div className="flex items-center mt-2 space-x-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                {purchase.resource.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                Purchased {new Date(purchase.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          {purchase.resource.fileUrl && (
                            <button
                              onClick={() => handleDownload(purchase.resource.id, purchase.resource.title)}
                              className="ml-4 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Recent Activity */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  Recent Activity
                </h2>
                {stats.recentPurchases.length === 0 ? (
                  <p className="text-gray-600 text-sm">No recent activity</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentPurchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-2 w-2 bg-green-400 rounded-full mt-1.5"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 truncate">
                            {purchase.resource.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(purchase.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Resources */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-indigo-600" />
                  Recommended for You
                </h2>
                {stats.recommendedResources.length === 0 ? (
                  <p className="text-gray-600 text-sm">No recommendations available</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recommendedResources.slice(0, 3).map((resource: any) => (
                      <div key={resource.id} className="border-b pb-3 last:border-0">
                        <h4 className="font-medium text-sm text-gray-900">{resource.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-sm font-bold text-gray-900">£{resource.price}</span>
                          <button
                            onClick={() => router.push(`/resources/${resource.id}`)}
                            className="text-xs text-indigo-600 hover:text-indigo-700"
                          >
                            View →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-2">
                  <button
                    onClick={() => router.push("/resources")}
                    className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    Browse All Resources
                  </button>
                  <button
                    onClick={() => router.push("/profile")}
                    className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
