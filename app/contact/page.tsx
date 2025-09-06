"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, Building, Globe } from "lucide-react";
import toast from "react-hot-toast";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setLoading(false);
    }, 1000);
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-xl text-indigo-100 max-w-3xl">
            Have questions about our resources? We're here to help you succeed in your learning journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="md:col-span-1">
            <h2 className="text-2xl font-bold text-black mb-6">Contact Information</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-indigo-600 mt-1 mr-3" />
                <div>
                  <p className="font-semibold">Email</p>
                  <p className="text-black">support@statmandavies.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-6 w-6 text-indigo-600 mt-1 mr-3" />
                <div>
                  <p className="font-semibold">Phone</p>
                  <p className="text-black">+44 20 1234 5678</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin className="h-6 w-6 text-indigo-600 mt-1 mr-3" />
                <div>
                  <p className="font-semibold">Office</p>
                  <p className="text-black">London, United Kingdom</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-indigo-600 mt-1 mr-3" />
                <div>
                  <p className="font-semibold">Business Hours</p>
                  <p className="text-black">Mon-Fri: 9:00 AM - 6:00 PM GMT</p>
                  <p className="text-black">Sat-Sun: 10:00 AM - 4:00 PM GMT</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="mt-12 p-6 bg-indigo-50 rounded-lg">
              <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-700">FAQ</a>
                </li>
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-700">Support Center</a>
                </li>
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-700">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="h-8 w-8 text-indigo-600 mr-3" />
                <h2 className="text-2xl font-bold text-black">Send us a Message</h2>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}
