"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Search, Filter, ShoppingCart, Eye } from "lucide-react";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

interface Resource {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  featured: boolean;
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    filterResources();
  }, [searchQuery, selectedCategory, resources]);

  const fetchResources = async () => {
    try {
      const response = await fetch("/api/resources");
      if (response.ok) {
        const data = await response.json();
        setResources(data);
        setFilteredResources(data);
      }
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterResources = () => {
    let filtered = resources;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(r => r.category === selectedCategory);
    }

    if (searchQuery) {
      filtered = filtered.filter(r => 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredResources(filtered);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-black mb-4">All Resources</h1>
            <p className="text-xl text-black">Browse our complete collection of revision materials</p>
          </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search resources..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 h-5 w-5" />
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="all">All Categories</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Statistics">Statistics</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-black">No resources found matching your criteria.</p>
              </div>
            ) : (
              filteredResources.map((resource) => (
                <div key={resource.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <span className="inline-block px-3 py-1 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-full">
                        {resource.category}
                      </span>
                      {resource.featured && (
                        <span className="text-xs font-semibold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {resource.title}
                    </h3>
                    
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    <div className="text-2xl font-bold text-gray-900 mb-4">
                      {formatPrice(resource.price)}
                    </div>
                    
                    <div className="flex gap-3">
                      <Link
                        href={`/resources/${resource.id}/preview`}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition-colors">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Link>
                      <Link
                        href={`/resources/${resource.id}/purchase`}
                        className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Buy Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
    <Footer />
  </>
  );
}
