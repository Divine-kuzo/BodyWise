'use client';

import { useEffect, useState } from 'react';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { Button } from '@/components/ui/button';
import { adminNav } from '@/lib/navigation';

interface BlogArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  tags: string[];
  thumbnail_url: string | null;
  approval_status: string;
  created_at: string;
  author_name: string;
  author_specialization?: string;
  institution_name?: string;
}

export default function AdminBlogsPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  useEffect(() => {
    fetchPendingArticles();
  }, []);

  const fetchPendingArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog/approve');
      if (!response.ok) throw new Error('Failed to fetch articles');
      const result = await response.json();
      setArticles(result.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    if (!confirm('Are you sure you want to approve this article?')) return;

    try {
      setActionLoading(id);
      const response = await fetch('/api/blog/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: id, action: 'approve' }),
      });

      if (!response.ok) throw new Error('Failed to approve article');
      alert('Article approved successfully!');
      fetchPendingArticles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    try {
      setActionLoading(id);
      const response = await fetch('/api/blog/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ article_id: id, action: 'reject', rejection_reason: reason }),
      });

      if (!response.ok) throw new Error('Failed to reject article');
      alert('Article rejected');
      fetchPendingArticles();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/#{1,6}\s/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  };

  return (
    <DashboardShell
      title="Blog & Article Management"
      subtitle="Review and approve educational content from healthcare professionals"
      breadcrumbs={[{ label: 'Admin' }, { label: 'Blogs' }]}
      navItems={adminNav}
    >
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#523329] border-t-transparent"></div>
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-3xl border border-[#e6d8ce] bg-white p-12 text-center">
          <p className="text-lg font-semibold text-[#3a2218]">No pending articles</p>
          <p className="mt-2 text-sm text-[#6a4a3a]">All articles have been reviewed</p>
        </div>
      ) : (
        <div className="space-y-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="mb-2 text-xl font-semibold text-[#3a2218]">{article.title}</h3>
                  <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-[#80685b]">
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#f0d5b8]/80 px-3 py-1 font-semibold text-[#6a4a3a]">
                      {article.category}
                    </span>
                    {article.tags && article.tags.length > 0 && (
                      <>
                        {article.tags.map((tag: string, index: number) => (
                          <span
                            key={index}
                            className="rounded-full bg-[#f9f0e6] px-3 py-1 text-xs text-[#6a4a3a]"
                          >
                            #{tag}
                          </span>
                        ))}
                      </>
                    )}
                  </div>
                  <div className="mb-3 text-sm text-[#6a4a3a]">
                    <p>
                      <strong>Author:</strong> {article.author_name}
                      {article.author_specialization && ` • ${article.author_specialization}`}
                      {article.institution_name && ` • ${article.institution_name}`}
                    </p>
                    <p className="mt-1 text-xs text-[#a1897c]">
                      Submitted: {new Date(article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4 rounded-2xl bg-[#f9f0e6] p-4">
                <p className="text-sm text-[#6a4a3a]">{getExcerpt(article.content)}</p>
              </div>

              {article.thumbnail_url && (
                <div className="mb-4">
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    className="h-48 w-full rounded-2xl object-cover"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => handleApprove(article.id)}
                  disabled={actionLoading === article.id}
                  variant="primary"
                  className="flex-1"
                >
                  {actionLoading === article.id ? 'Processing...' : 'Approve & Publish'}
                </Button>
                <Button
                  onClick={() => handleReject(article.id)}
                  disabled={actionLoading === article.id}
                  className="flex-1 bg-red-500 hover:bg-red-600"
                >
                  Reject
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardShell>
  );
}
