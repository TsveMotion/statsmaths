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
  studyStreak: number;
  achievement: string;
}

interface RecentActivity {
  type: string;
  title: string;
  date: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [userResources, setUserResources] = useState<Purchase[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalPurchases: 0,
    totalSpent: 0,
    studyStreak: 0,
    achievement: "Newcomer"
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;
    if (!session) {
      router.push("/auth/signin");
    } else if (session.user?.role === "ADMIN") {
      // Redirect admin users to admin dashboard
      router.push("/admin/dashboard");
    } else {
      fetchUserData();
    }
  }, [session, status, router]);

  useEffect(() => {
    if (session) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      // Fetch real user data from API
      const response = await fetch("/api/user/purchases");
      if (response.ok) {
        const purchases = await response.json();
        setUserResources(purchases);
        
        // Calculate stats from real data
        const totalSpent = purchases.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);
        setStats({
          totalPurchases: purchases.length,
          totalSpent,
          studyStreak: 7, // This would come from user activity tracking
          achievement: purchases.length > 5 ? "Power Learner" : purchases.length > 0 ? "Rising Star" : "Newcomer"
        });
        
        // Set recent activity from purchases
        const activities = purchases.slice(0, 3).map((p: any) => ({
          type: "purchase",
          title: p.resource?.title || "Resource",
          date: new Date(p.createdAt).toLocaleDateString()
        }));
        setRecentActivity(activities);
      } else {
        // If no purchases, set empty state
        setUserResources([]);
        setStats({
          totalPurchases: 0,
          totalSpent: 0,
          studyStreak: 0,
          achievement: "Newcomer"
        });
        setRecentActivity([]);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Set empty state on error
      setUserResources([]);
      setStats({
        totalPurchases: 0,
        totalSpent: 0,
        studyStreak: 0,
        achievement: "Newcomer"
      });
      setRecentActivity([]);
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
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name || session?.user?.email?.split('@')[0]}!
            </h1>
            <p className="text-indigo-100">
              Track your progress and access your revision materials
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-black">Total Resources</p>
                  <p className="text-2xl font-semibold text-black">{stats.totalPurchases}</p>
                </div>
                <Package className="h-8 w-8 text-indigo-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black">Total Invested</p>
                  <p className="text-2xl font-bold text-black">£{stats.totalSpent.toFixed(2)}</p>
                </div>
                <CreditCard className="h-8 w-8 text-green-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black">Study Streak</p>
                  <p className="text-2xl font-bold text-black">7 days</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-black">Achievement</p>
                  <p className="text-2xl font-bold text-black">Rising Star</p>
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
                <h2 className="text-xl font-bold text-black mb-6 flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-indigo-600" />
                  My Resources
                </h2>
                
                {userResources.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-black mb-4">No resources yet</p>
                    <button
                      onClick={() => router.push("/resources")}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                    >
                      Browse Resources
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userResources.map((purchase: Purchase) => (
                      <div key={purchase.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-black">{purchase.resource.title}</h3>
                            <p className="text-sm text-black">{purchase.resource.category}</p>
                            <p className="text-xs text-black mt-2">
                              Purchased: {new Date(purchase.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <button 
                            onClick={() => handleDownload(purchase.resource.id, purchase.resource.title)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                          >
                            <Download className="h-4 w-4" />
                            Download
                          </button>
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
                <h2 className="text-lg font-bold text-black mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-purple-600" />
                  Recent Activity
                </h2>
                {recentActivity.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4 text-black">Recent Activity</h3>
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium text-black">{activity.title}</h4>
                            <p className="text-sm text-black capitalize">{activity.type}</p>
                            <p className="text-xs text-black mt-1">
                              {activity.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recommended Resources */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-black mb-4 flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2 text-indigo-600" />
                  Recommended for You
                </h2>
                <div className="space-y-3">
                  <div className="border-b pb-3">
                    <h4 className="font-medium text-sm text-black">Linear Algebra Basics</h4>
                    <p className="text-xs text-black mt-1">Essential concepts explained simply</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm font-bold text-black">£24.99</span>
                      <button
                        onClick={() => router.push(`/resources/3`)}
                        className="text-xs text-indigo-600 hover:text-indigo-700">
                        View →
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-bold text-black mb-4">Quick Actions</h2>
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
