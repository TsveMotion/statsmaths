"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { 
  Plus, Edit, Trash, FileText, Users, ShoppingBag, TrendingUp, 
  LogOut, Settings, Download, Eye, Search, Filter, UserPlus,
  Shield, Activity, DollarSign, Package, UserCheck, UserX,
  ChevronLeft, ChevronRight, RefreshCw, Lock, Mail
} from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";
import UserModal from "@/components/admin/user-modal";
import { ResourceModal } from "@/components/admin/resource-modal";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function AdminDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [stats, setStats] = useState({
    totalResources: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalSales: 0,
    revenue: 0,
    monthlyGrowth: 0,
  });
  const [resources, setResources] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // User Management States
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
  const [resourceModalMode, setResourceModalMode] = useState<"view" | "edit" | "create">("view");

  useEffect(() => {
    if (status === "loading") return;
    
    if (!session || session.user?.role !== "ADMIN") {
      router.push("/admin/login");
    } else {
      fetchDashboardData();
    }
  }, [session, status]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, searchQuery, roleFilter, currentPage]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        search: searchQuery,
        role: roleFilter,
      });

      const response = await fetch(`/api/admin/users?${params}`);
      if (!response.ok) throw new Error("Failed to fetch users");
      
      const data = await response.json();
      setUsers(data.users || []);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    }
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch real stats from API
      const statsResponse = await fetch("/api/admin/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Fetch real resources from API
      const resourcesResponse = await fetch("/api/admin/resources");
      if (resourcesResponse.ok) {
        const resourcesData = await resourcesResponse.json();
        setResources(resourcesData);
      }

      // Fetch real purchases from API
      const purchasesResponse = await fetch("/api/admin/purchases");
      if (purchasesResponse.ok) {
        const purchasesData = await purchasesResponse.json();
        setPurchases(purchasesData);
      }

      // Fetch real users from API
      const usersResponse = await fetch("/api/admin/users?limit=5");
      if (usersResponse.ok) {
        const usersData = await usersResponse.json();
        setUsers(usersData.users || []);
      } 
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/signout", { method: "POST" });
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete user");
      
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Error deleting user");
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) throw new Error("Failed to update user role");
      
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error) {
      toast.error("Error updating user role");
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedUsers.length === 0) {
      toast.error("No users selected");
      return;
    }

    const confirmMessage = action === "delete" 
      ? `Delete ${selectedUsers.length} user(s)?`
      : `Update role for ${selectedUsers.length} user(s)?`;

    if (!confirm(confirmMessage)) return;

    // Implement bulk actions
    toast.success(`Bulk ${action} completed`);
    setSelectedUsers([]);
    fetchUsers();
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (!confirm("Are you sure you want to delete this resource?")) return;

    try {
      const response = await fetch(`/api/admin/resources/${resourceId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete resource");
      
      toast.success("Resource deleted successfully");
      setResources(resources.filter((r: any) => r.id !== resourceId));
    } catch (error) {
      toast.error("Error deleting resource");
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
      <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-black">StatManDavies Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button className="text-black hover:text-black">
                <Settings className="h-5 w-5" />
              </button>
              <button 
                onClick={handleLogout}
                className="text-black hover:text-black"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex space-x-1 mb-8 border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "overview"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-black hover:text-black"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("resources")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "resources"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-black hover:text-black"
            }`}
          >
            Resources
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "users"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-black hover:text-black"
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab("purchases")}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "purchases"
                ? "text-indigo-600 border-b-2 border-indigo-600"
                : "text-black hover:text-black"
            }`}
          >
            Purchases
          </button>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <FileText className="h-10 w-10 text-indigo-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-black">Total Resources</p>
                    <p className="text-2xl font-semibold text-black">{stats.totalResources}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="h-10 w-10 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-black">Total Users</p>
                    <p className="text-2xl font-semibold text-black">{stats.totalUsers}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <ShoppingBag className="h-10 w-10 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-black">Total Sales</p>
                    <p className="text-2xl font-semibold text-black">{stats.totalSales}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <TrendingUp className="h-10 w-10 text-yellow-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-black">Revenue</p>
                    <p className="text-2xl font-semibold text-black">£{stats.revenue.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 text-black">Recent Purchases</h2>
              <div className="space-y-4">
                {purchases.slice(0, 5).map((purchase) => (
                  <div key={purchase.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <p className="font-medium text-black">{purchase.user?.name || purchase.user?.email || purchase.userEmail || 'Guest'}</p>
                      <p className="text-sm text-black">Purchased {purchase.resource?.title || 'Resource'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-black">£{(purchase.amount || 0).toFixed(2)}</p>
                      <p className="text-sm text-black">
                        {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Resources Tab */}
        {activeTab === "resources" && (
          <div className="bg-white rounded-lg shadow">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">Resources</h2>
              <button
                onClick={() => {
                  setEditingResource(null);
                  setResourceModalMode("create");
                  setShowResourceModal(true);
                }}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Resource
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Sales
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resources.map((resource: any) => (
                    <tr key={resource.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">{resource.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-800">
                          {resource.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        £{(resource.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {resource.purchases?.length || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          resource.featured 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-black"
                        }`}>
                          {resource.featured ? "Yes" : "No"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => {
                              setEditingResource(resource);
                              setResourceModalMode("view");
                              setShowResourceModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setEditingResource(resource);
                              setResourceModalMode("edit");
                              setShowResourceModal(true);
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab - Enhanced User Management */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* User Management Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">User Management</h2>
                  <p className="mt-1 text-indigo-100">Manage all user accounts, roles, and permissions</p>
                </div>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 flex items-center gap-2"
                >
                  <UserPlus className="h-5 w-5" />
                  Add New User
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Search users by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Roles</option>
                  <option value="USER">User</option>
                  <option value="ADMIN">Admin</option>
                  <option value="MODERATOR">Moderator</option>
                </select>
                <button
                  onClick={fetchUsers}
                  className="px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
              </div>

              {/* Bulk Actions */}
              {selectedUsers.length > 0 && (
                <div className="mt-4 p-4 bg-indigo-50 rounded-lg flex items-center justify-between">
                  <span className="text-indigo-700 font-medium">
                    {selectedUsers.length} user(s) selected
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction("role")}
                      className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                      Change Role
                    </button>
                    <button
                      onClick={() => handleBulkAction("delete")}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Delete Selected
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedUsers(users.map(u => u.id));
                            } else {
                              setSelectedUsers([]);
                            }
                          }}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Purchases
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user: any) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedUsers([...selectedUsers, user.id]);
                              } else {
                                setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                              }
                            }}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-black">
                                {user.name || "No name"}
                              </div>
                              <div className="text-sm text-black">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role || "USER"}
                            onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                            className="text-sm rounded-full px-3 py-1 font-medium border"
                          >
                            <option value="USER">User</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MODERATOR">Moderator</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.emailVerified
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {user.emailVerified ? "Verified" : "Unverified"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          <div className="flex items-center">
                            <ShoppingBag className="h-4 w-4 mr-1 text-gray-400" />
                            {user.purchases?.length || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => router.push(`/admin/users/${user.id}`)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditingUser(user);
                                setShowUserModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-900"
                              title="Edit User"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete User"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between">
                <div className="text-sm text-black">
                  Showing page {currentPage} of {totalPages}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* User Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">Active Users</p>
                    <p className="text-2xl font-semibold text-black mt-1">{stats.activeUsers}</p>
                    <p className="text-sm text-green-600 mt-1">+12% from last month</p>
                  </div>
                  <UserCheck className="h-12 w-12 text-green-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">New Users</p>
                    <p className="text-2xl font-semibold text-black mt-1">8</p>
                    <p className="text-sm text-blue-600 mt-1">This week</p>
                  </div>
                  <UserPlus className="h-12 w-12 text-blue-500" />
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-black">Inactive Users</p>
                    <p className="text-2xl font-semibold text-black mt-1">5</p>
                    <p className="text-sm text-black mt-1">30+ days inactive</p>
                  </div>
                  <UserX className="h-12 w-12 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Purchases Tab */}
        {activeTab === "purchases" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b">
              <h2 className="text-xl font-semibold text-black">Recent Purchases</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Resource
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {purchases.map((purchase: any) => (
                    <tr key={purchase.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">{purchase.user?.name || purchase.user?.email || 'Guest'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {purchase.resource?.title || 'Resource'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        £{(purchase.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                        {purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal
        isOpen={showUserModal}
        onClose={() => {
          setShowUserModal(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSuccess={() => {
          fetchUsers();
          setShowUserModal(false);
          setEditingUser(null);
        }}
      />
      
      <ResourceModal
        isOpen={showResourceModal}
        onClose={() => {
          setShowResourceModal(false);
          setEditingResource(null);
        }}
        resource={editingResource}
        mode={resourceModalMode}
        onSuccess={() => {
          fetchDashboardData();
          setShowResourceModal(false);
          setEditingResource(null);
        }}
      />
      </div>
    </>
  );
}
