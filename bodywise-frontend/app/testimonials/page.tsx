'use client';

import { useEffect, useState } from 'react';
import { RiStarFill } from 'react-icons/ri';

interface Testimonial {
  id: number;
  user_name: string;
  user_type: string;
  user_specialization?: string;
  content: string;
  rating: number;
  is_featured: boolean;
  created_at: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'featured'>('all');

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const url = filter === 'featured' 
        ? '/api/testimonials?featured=true&limit=50'
        : '/api/testimonials?limit=50';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setTestimonials(data.data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case 'patient': return 'Patient';
      case 'health_professional': return 'Health Professional';
      case 'institutional_admin': return 'Institutional Admin';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen bg-[#f5ebe3]">
      {/* Header */}
      <div className="bg-[#523329] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">What Our Users Say</h1>
          <p className="text-xl text-gray-200">
            Real experiences from people who have found support through BodyWise
          </p>
        </div>
      </div>

      {/* Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-[#523329] text-white'
                : 'bg-white text-[#523329] hover:bg-gray-100'
            }`}
          >
            All Testimonials
          </button>
          <button
            onClick={() => setFilter('featured')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              filter === 'featured'
                ? 'bg-[#523329] text-white'
                : 'bg-white text-[#523329] hover:bg-gray-100'
            }`}
          >
            Featured
          </button>
        </div>

        {/* Testimonials Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#523329] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading testimonials...</p>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No testimonials found.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow ${
                  testimonial.is_featured ? 'ring-2 ring-[#f0d5b8]' : ''
                }`}
              >
                {testimonial.is_featured && (
                  <div className="mb-3">
                    <span className="inline-block bg-[#f0d5b8] text-[#523329] text-xs font-semibold px-3 py-1 rounded-full">
                      Featured
                    </span>
                  </div>
                )}

                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex gap-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <RiStarFill
                        key={i}
                        className={`w-5 h-5 ${
                          i < testimonial.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Content */}
                <p className="text-gray-700 mb-4 leading-relaxed">
                  {testimonial.content}
                </p>

                {/* Author Info */}
                <div className="border-t border-gray-200 pt-4">
                  <p className="font-semibold text-[#523329]">
                    {testimonial.user_name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getUserTypeLabel(testimonial.user_type)}
                    {testimonial.user_specialization && (
                      <> • {testimonial.user_specialization}</>
                    )}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatDate(testimonial.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-[#523329] text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Share Your Experience</h2>
          <p className="text-xl text-gray-200 mb-6">
            Have you used BodyWise? We would love to hear about your journey.
          </p>
          <a
            href="/login"
            className="inline-block bg-[#f0d5b8] text-[#523329] px-8 py-3 rounded-lg font-semibold hover:bg-[#e0c5a8] transition-colors"
          >
            Sign In to Share Your Story
          </a>
        </div>
      </div>
    </div>
  );
}
