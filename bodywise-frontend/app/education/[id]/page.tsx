'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { RiCalendarLine, RiEyeLine, RiPriceTag3Line, RiUserLine, RiArrowLeftLine } from 'react-icons/ri';

interface BlogArticle {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author_type: string;
  author_specialization?: string;
  author_bio?: string;
  institution_name?: string;
  category: string;
  tags: string[];
  thumbnail_url?: string;
  views_count: number;
  created_at: string;
}

export default function ArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticle();
  }, [params.id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/blog/${params.id}`);
      const data = await response.json();
      
      if (data.success) {
        setArticle(data.data);
      } else {
        router.push('/education');
      }
    } catch (error) {
      console.error('Error fetching article:', error);
      router.push('/education');
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

  const formatContent = (content: string) => {
    // Convert markdown-style headers to HTML
    let formatted = content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-[#523329] mt-6 mb-3">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-[#523329] mt-8 mb-4">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-[#523329] mt-8 mb-4">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
      .replace(/\n\n/g, '</p><p class="mb-4">')
      .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2">$1</li>');
    
    return `<p class="mb-4">${formatted}</p>`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5ebe3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#523329] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f5ebe3]">
      {/* Header */}
      <div className="bg-[#523329] text-white py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => router.push('/education')}
            className="flex items-center gap-2 text-gray-200 hover:text-white mb-6"
          >
            <RiArrowLeftLine className="w-4 h-4" />
            Back to Articles
          </button>
          
          {article.category && (
            <span className="inline-block bg-[#f0d5b8] text-[#523329] text-sm font-semibold px-4 py-1 rounded-full mb-4">
              {article.category}
            </span>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-200">
            <div className="flex items-center gap-2">
              <RiUserLine className="w-4 h-4" />
              <span className="font-medium">{article.author_name}</span>
              {article.author_specialization && (
                <span className="text-sm">• {article.author_specialization}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <RiCalendarLine className="w-4 h-4" />
              {formatDate(article.created_at)}
            </div>
            <div className="flex items-center gap-2">
              <RiEyeLine className="w-4 h-4" />
              {article.views_count} views
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-full"
                >
                  <RiPriceTag3Line className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Content */}
          <div 
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatContent(article.content) }}
          />

          {/* Author Bio */}
          {article.author_bio && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-xl font-bold text-[#523329] mb-3">About the Author</h3>
              <div className="bg-[#f5ebe3] rounded-lg p-6">
                <p className="font-semibold text-[#523329] mb-1">{article.author_name}</p>
                {article.author_specialization && (
                  <p className="text-sm text-gray-600 mb-3">{article.author_specialization}</p>
                )}
                {article.institution_name && (
                  <p className="text-sm text-gray-600 mb-3">{article.institution_name}</p>
                )}
                <p className="text-gray-700">{article.author_bio}</p>
              </div>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <div className="bg-[#523329] text-white rounded-lg p-8">
            <h3 className="text-2xl font-bold mb-3">Need Support?</h3>
            <p className="text-gray-200 mb-6">
              Connect with qualified mental health professionals through BodyWise
            </p>
            <a
              href="/login"
              className="inline-block bg-[#f0d5b8] text-[#523329] px-8 py-3 rounded-lg font-semibold hover:bg-[#e0c5a8] transition-colors"
            >
              Get Started Today
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
