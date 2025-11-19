'use client';

import { useEffect, useState } from 'react';
import { RiStarFill } from 'react-icons/ri';
import Link from 'next/link';

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
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ content: '', rating: 5 });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.content.trim()) {
      alert('Please write your testimonial');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit testimonial');
      }

      alert('Thank you! Your testimonial has been submitted and is pending admin approval.');
      setShowSubmitForm(false);
      setFormData({ content: '', rating: 5 });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
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
          <p className="text-xl text-gray-200 mb-6">
            Real experiences from people who have found support through BodyWise
          </p>
          <button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="bg-white text-[#523329] px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            {showSubmitForm ? 'Cancel' : '✨ Share Your Story'}
          </button>
        </div>
      </div>

      {/* Submit Form */}
      {showSubmitForm && (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#e6d8ce]">
            <h2 className="text-2xl font-bold text-[#3a2218] mb-4">Share Your Experience</h2>
            <p className="text-sm text-[#6a4a3a] mb-6">
              Your testimonial will be reviewed by our admin team before being published
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-[#3a2218] mb-2">
                  Your Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="text-2xl transition-colors"
                    >
                      <RiStarFill className={star <= formData.rating ? 'text-yellow-500' : 'text-gray-300'} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#3a2218] mb-2">
                  Your Testimonial
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Share your experience with BodyWise - how has it helped you on your wellness journey?"
                  className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] placeholder:text-[#a1897c] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#d6b28f]/20"
                  rows={6}
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-[#523329] text-white px-6 py-3 rounded-full font-medium hover:bg-[#6a4a3a] transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Submit Testimonial'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSubmitForm(false)}
                  className="px-6 py-3 rounded-full font-medium bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          <div className="flex items-center justify-center py-12">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No testimonials yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className={`bg-white rounded-3xl p-6 shadow-lg ${
                  testimonial.is_featured ? 'border-2 border-yellow-400' : 'border border-[#e6d8ce]'
                }`}
              >
                {testimonial.is_featured && (
                  <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    ⭐ Featured
                  </div>
                )}
                
                <div className="flex items-center gap-2 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <RiStarFill key={i} className="text-yellow-500" />
                  ))}
                </div>

                <p className="text-[#3a2218] mb-4 leading-relaxed">"{testimonial.content}"</p>

                <div className="border-t border-[#e6d8ce] pt-4">
                  <p className="font-semibold text-[#523329]">{testimonial.user_name}</p>
                  <p className="text-sm text-gray-600">
                    {getUserTypeLabel(testimonial.user_type)}
                    {testimonial.user_specialization && ` • ${testimonial.user_specialization}`}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(testimonial.created_at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="bg-[#523329] text-white py-16 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start your wellness journey?</h2>
          <p className="text-xl text-gray-200 mb-8">
            Join thousands who have found support and confidence through BodyWise
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-[#523329] px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </div>
    </div>
  );
}
