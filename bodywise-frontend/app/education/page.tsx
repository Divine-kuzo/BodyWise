'use client';

import { useEffect, useState } from 'react';
import { RiCalendarLine, RiEyeLine, RiPriceTag3Line, RiUserLine } from 'react-icons/ri';
import { useRouter } from 'next/navigation';

interface BlogArticle {
  id: number;
  title: string;
  content: string;
  author_name: string;
  author_type: string;
  author_specialization?: string;
  institution_name?: string;
  category: string;
  tags: string[];
  thumbnail_url?: string;
  views_count: number;
  created_at: string;
}

export default function EducationPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [categories, setCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory, currentPage]);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const response = await fetch(`/api/blog?page=${currentPage}&limit=9${categoryParam}`);
      const data = await response.json();
      
      if (data.success) {
        setArticles(data.data);
        setTotalPages(data.pagination.totalPages);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(data.data.map((article: BlogArticle) => article.category).filter(Boolean))] as string[];
        setCategories(uniqueCategories);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
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

  const getExcerpt = (content: string, maxLength: number = 200) => {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/#{1,6}\s/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  };

  const handleArticleClick = (id: number) => {
    router.push(`/education/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#f5ebe3]">
      {/* Header */}
      <div className="bg-[#523329] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Educational Resources</h1>
          <p className="text-xl text-gray-200">
            Expert insights on mental health, wellness, and personal growth from our healthcare professionals
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setCurrentPage(1);
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-[#523329] text-white'
                : 'bg-white text-[#523329] hover:bg-gray-100'
            }`}
          >
            All Articles
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-[#523329] text-white'
                  : 'bg-white text-[#523329] hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#523329] mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No articles found.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => handleArticleClick(article.id)}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow cursor-pointer"
                >
                  {/* Thumbnail or placeholder */}
                  <div className="h-48 bg-gradient-to-br from-[#523329] to-[#f0d5b8] flex items-center justify-center">
                    {article.thumbnail_url ? (
                      <img
                        src={article.thumbnail_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-white text-6xl font-bold opacity-20">
                        {article.title.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    {/* Category Badge */}
                    {article.category && (
                      <span className="inline-block bg-[#f0d5b8] text-[#523329] text-xs font-semibold px-3 py-1 rounded-full mb-3">
                        {article.category}
                      </span>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-[#523329] mb-2 line-clamp-2 hover:text-[#6b4a3d]">
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {getExcerpt(article.content)}
                    </p>

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                          >
                            <RiPriceTag3Line className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Author & Meta */}
                    <div className="border-t border-gray-200 pt-4 space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <RiUserLine className="w-4 h-4" />
                        <span className="font-medium">{article.author_name}</span>
                        {article.author_specialization && (
                          <span className="text-xs text-gray-500">
                            • {article.author_specialization}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <RiCalendarLine className="w-3 h-3" />
                          {formatDate(article.created_at)}
                        </div>
                        <div className="flex items-center gap-1">
                          <RiEyeLine className="w-3 h-3" />
                          {article.views_count} views
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white text-[#523329] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-4 py-2 bg-[#523329] text-white rounded-lg font-medium">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg bg-white text-[#523329] font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
