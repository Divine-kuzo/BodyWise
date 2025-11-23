"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { SectionHeading } from "@/components/ui/section-heading";
import { Chip } from "@/components/ui/chip";
import { RiArrowRightUpLine } from "react-icons/ri";

interface BlogArticle {
  id: number;
  title: string;
  content: string;
  category: string;
  thumbnail_url?: string;
  created_at: string;
}

export function EducationHubSection() {
  const [activeTag, setActiveTag] = useState<string>("All");
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog?limit=6');
      const result = await response.json();
      
      if (result.success && result.data && Array.isArray(result.data)) {
        setArticles(result.data);
        const uniqueCategories = Array.from(new Set(result.data.map((a: BlogArticle) => a.category)));
        setCategories(['All', ...uniqueCategories] as string[]);
      } else {
        setArticles([]);
        setCategories(['All']);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
      setArticles([]);
      setCategories(['All']);
    } finally {
      setLoading(false);
    }
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    const plainText = content.replace(/<[^>]*>/g, '').replace(/#{1,6}\s/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  };

  const filteredResources = useMemo(() => {
    if (activeTag === "All") return articles;
    return articles.filter((article) => article.category === activeTag);
  }, [activeTag, articles]);

  return (
    <section
      id="education"
      className="rounded-[36px] bg-[#f9f5f2] px-6 py-20 shadow-[0_35px_90px_-70px_rgba(58,34,24,0.65)] sm:px-10 lg:px-14"
    >
      <SectionHeading
        eyebrow="Education & Awareness Hub"
        title="Culturally relevant resources to help you make informed decisions about your body and mental health."
        align="center"
        className="mb-12"
      />
      <div className="flex flex-wrap items-center justify-center gap-4">
        {categories.map((tag) => (
          <Chip
            key={tag}
            active={activeTag === tag}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </Chip>
        ))}
      </div>
      <div className="mt-14 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-[#80685b]">Loading articles...</p>
          </div>
        ) : filteredResources.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-[#80685b]">No articles available yet.</p>
          </div>
        ) : (
          filteredResources.map((article) => (
            <article
              key={article.id}
              className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_35px_100px_-75px_rgba(58,34,24,0.75)]"
            >
              <div className="relative h-52 w-full">
                <Image
                  src={article.thumbnail_url || "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=900&q=80"}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-5 px-7 pb-8 pt-7">
                <span className="inline-flex w-max rounded-full bg-[#f0d5b8]/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#6a4a3a]">
                  {article.category}
                </span>
                <h3 className="text-lg font-semibold text-[#3a2218]">
                  {article.title}
                </h3>
                <p className="text-sm text-[#80685b]">{getExcerpt(article.content)}</p>
                <Link
                  href={`/education/${article.id}`}
                  className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#6a4a3a] transition hover:text-[#3a2218]"
                >
                  Read More
                  <RiArrowRightUpLine className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}


