"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { ArrowLeft, Upload, FileText, Image, X, Plus } from "lucide-react";
import toast from "react-hot-toast";

export default function NewResourcePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Statistics",
    price: "",
    featured: false,
    pdfUrl: "",
    imageUrl: "",
    pages: "",
    topics: [""],
    features: [""],
  });

  if (session?.user?.role !== "ADMIN") {
    router.push("/");
    return null;
  }

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file");
      return;
    }

    setUploadingPdf(true);
    
    // In production, this would upload to a cloud storage service
    // For now, we'll simulate an upload
    setTimeout(() => {
      setFormData({ ...formData, pdfUrl: `/uploads/pdfs/${file.name}` });
      toast.success("PDF uploaded successfully!");
      setUploadingPdf(false);
    }, 1500);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    setUploadingImage(true);
    
    // In production, this would upload to a cloud storage service
    // For now, we'll simulate an upload
    setTimeout(() => {
      setFormData({ ...formData, imageUrl: `/uploads/images/${file.name}` });
      toast.success("Image uploaded successfully!");
      setUploadingImage(false);
    }, 1500);
  };

  const addTopic = () => {
    setFormData({ ...formData, topics: [...formData.topics, ""] });
  };

  const removeTopic = (index: number) => {
    const newTopics = formData.topics.filter((_, i) => i !== index);
    setFormData({ ...formData, topics: newTopics });
  };

  const updateTopic = (index: number, value: string) => {
    const newTopics = [...formData.topics];
    newTopics[index] = value;
    setFormData({ ...formData, topics: newTopics });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.pdfUrl) {
      toast.error("Please upload a PDF file");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          pages: parseInt(formData.pages) || 0,
          topics: formData.topics.filter(t => t.trim()),
          features: formData.features.filter(f => f.trim()),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create resource");
      }

      toast.success("Resource created successfully!");
      router.push("/admin/dashboard");
    } catch (error) {
      toast.error("Error creating resource");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/admin/dashboard"
                className="mr-4 text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-xl font-semibold">Add New Resource</h1>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Basic Information</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="e.g., Statistics Fundamentals"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Provide a detailed description of the resource..."
                />
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="Statistics">Statistics</option>
                    <option value="Mathematics">Mathematics</option>
                    <option value="Probability">Probability</option>
                    <option value="Data Science">Data Science</option>
                    <option value="Calculus">Calculus</option>
                    <option value="Linear Algebra">Linear Algebra</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (£) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="29.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pages
                  </label>
                  <input
                    type="number"
                    value={formData.pages}
                    onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="150"
                  />
                </div>
              </div>
            </div>

            {/* File Uploads */}
            <div className="space-y-6">
              <h2 className="text-lg font-medium">Files</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    PDF File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.pdfUrl ? (
                      <div className="space-y-2">
                        <FileText className="h-12 w-12 text-green-500 mx-auto" />
                        <p className="text-sm text-gray-600">PDF uploaded</p>
                        <p className="text-xs text-gray-500 truncate">{formData.pdfUrl}</p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, pdfUrl: "" })}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <FileText className="h-12 w-12 text-gray-400 mx-auto" />
                        <label className="cursor-pointer">
                          <span className="text-indigo-600 hover:text-indigo-700">
                            {uploadingPdf ? "Uploading..." : "Click to upload PDF"}
                          </span>
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handlePdfUpload}
                            disabled={uploadingPdf}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500">Max file size: 50MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    {formData.imageUrl ? (
                      <div className="space-y-2">
                        <Image className="h-12 w-12 text-green-500 mx-auto" />
                        <p className="text-sm text-gray-600">Image uploaded</p>
                        <p className="text-xs text-gray-500 truncate">{formData.imageUrl}</p>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, imageUrl: "" })}
                          className="text-red-600 text-sm hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Image className="h-12 w-12 text-gray-400 mx-auto" />
                        <label className="cursor-pointer">
                          <span className="text-indigo-600 hover:text-indigo-700">
                            {uploadingImage ? "Uploading..." : "Click to upload image"}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            className="hidden"
                          />
                        </label>
                        <p className="text-xs text-gray-500">JPG, PNG, GIF up to 10MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Topics */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Topics Covered</h2>
                <button
                  type="button"
                  onClick={addTopic}
                  className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Topic
                </button>
              </div>
              {formData.topics.map((topic, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., Hypothesis Testing"
                  />
                  {formData.topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-medium">Features</h2>
                <button
                  type="button"
                  onClick={addFeature}
                  className="text-indigo-600 hover:text-indigo-700 text-sm flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Add Feature
                </button>
              </div>
              {formData.features.map((feature, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="e.g., 150+ pages of content"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="featured" className="ml-2 block text-sm text-gray-900">
                Mark as Featured Resource
              </label>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Link
                href="/admin/dashboard"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading || uploadingPdf || uploadingImage}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Creating..." : "Create Resource"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
