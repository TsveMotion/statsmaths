"use client";

import { useState, useEffect } from "react";
import { X, Upload, FileText, Image as ImageIcon, Save, Eye } from "lucide-react";
import toast from "react-hot-toast";

interface Resource {
  id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  pages?: number;
  featured: boolean;
  pdfUrl?: string;
  imageUrl?: string;
}

interface ResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource?: Resource | null;
  mode: "view" | "edit" | "create";
  onSuccess?: () => void;
}

export function ResourceModal({ isOpen, onClose, resource, mode, onSuccess }: ResourceModalProps) {
  const [formData, setFormData] = useState<Resource>({
    title: "",
    description: "",
    category: "Statistics",
    price: 0,
    pages: 0,
    featured: false,
  });
  const [loading, setLoading] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (resource && (mode === "edit" || mode === "view")) {
      setFormData(resource);
    } else if (mode === "create") {
      setFormData({
        title: "",
        description: "",
        category: "Statistics",
        price: 0,
        pages: 0,
        featured: false,
      });
    }
  }, [resource, mode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "view") return;

    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("price", formData.price.toString());
      formDataToSend.append("pages", (formData.pages || 0).toString());
      formDataToSend.append("featured", formData.featured.toString());

      if (pdfFile) {
        formDataToSend.append("pdf", pdfFile);
      }
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const url = mode === "create" ? "/api/admin/resources" : `/api/admin/resources/${resource?.id}`;
      const method = mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to save resource");
      }

      toast.success(`Resource ${mode === "create" ? "created" : "updated"} successfully`);
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error("Failed to save resource");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "pdf" | "image") => {
    const file = e.target.files?.[0];
    if (file) {
      if (type === "pdf") {
        setPdfFile(file);
      } else {
        setImageFile(file);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-black">
            {mode === "create" && "Add New Resource"}
            {mode === "edit" && "Edit Resource"}
            {mode === "view" && "View Resource"}
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Basic Information */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-black mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  required
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  required
                  disabled={mode === "view"}
                >
                  <option value="Statistics">Statistics</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Probability">Probability</option>
                  <option value="Calculus">Calculus</option>
                  <option value="Linear Algebra">Linear Algebra</option>
                  <option value="Data Science">Data Science</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-black mb-2">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                required
                disabled={mode === "view"}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Price (£) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  required
                  disabled={mode === "view"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-2">
                  Pages
                </label>
                <input
                  type="number"
                  value={formData.pages || ""}
                  onChange={(e) => setFormData({ ...formData, pages: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                  disabled={mode === "view"}
                />
              </div>

              <div className="flex items-center mt-6">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  disabled={mode === "view"}
                />
                <label htmlFor="featured" className="ml-2 text-sm text-black">
                  Featured Resource
                </label>
              </div>
            </div>
          </div>

          {/* Files */}
          {mode !== "view" && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-black mb-4">Files</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PDF Upload */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    PDF File *
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-sm text-black mb-2">
                      {pdfFile ? pdfFile.name : "Click to upload PDF"}
                    </div>
                    <div className="text-xs text-black">Max file size: 50MB</div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => handleFileChange(e, "pdf")}
                      className="hidden"
                      id="pdf-upload"
                    />
                    <label
                      htmlFor="pdf-upload"
                      className="mt-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-black mb-2">
                    Cover Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-sm text-black mb-2">
                      {imageFile ? imageFile.name : "Click to upload image"}
                    </div>
                    <div className="text-xs text-black">JPG, PNG, GIF up to 10MB</div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "image")}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="mt-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 cursor-pointer"
                    >
                      Choose File
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* View Mode - Show existing files */}
          {mode === "view" && (
            <div className="mb-6">
              <h3 className="text-lg font-medium text-black mb-4">Files</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {formData.pdfUrl && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">PDF File</label>
                    <a
                      href={formData.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 text-black"
                    >
                      <FileText className="h-5 w-5 mr-2" />
                      View PDF
                    </a>
                  </div>
                )}
                {formData.imageUrl && (
                  <div>
                    <label className="block text-sm font-medium text-black mb-2">Cover Image</label>
                    <img
                      src={formData.imageUrl}
                      alt="Cover"
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-black rounded-lg hover:bg-gray-50"
            >
              {mode === "view" ? "Close" : "Cancel"}
            </button>
            {mode !== "view" && (
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {mode === "create" ? "Create Resource" : "Save Changes"}
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
