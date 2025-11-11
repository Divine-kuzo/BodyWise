"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EDUCATION_RESOURCES, EDUCATION_TAGS } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { Chip } from "@/components/ui/chip";
import { RiArrowRightUpLine } from "react-icons/ri";

export function EducationHubSection() {
  const [activeTag, setActiveTag] = useState<string>("All");

  const filteredResources = useMemo(() => {
    if (activeTag === "All") return EDUCATION_RESOURCES;
    return EDUCATION_RESOURCES.filter((resource) => resource.tag === activeTag);
  }, [activeTag]);

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
        {EDUCATION_TAGS.map((tag) => (
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
        {filteredResources.map((resource) => (
          <article
            key={resource.title}
            className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_35px_100px_-75px_rgba(58,34,24,0.75)]"
          >
            <div className="relative h-52 w-full">
              <Image
                src={resource.image}
                alt={resource.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-5 px-7 pb-8 pt-7">
              <span className="inline-flex w-max rounded-full bg-[#f0d5b8]/70 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#6a4a3a]">
                {resource.tag}
              </span>
              <h3 className="text-lg font-semibold text-[#3a2218]">
                {resource.title}
              </h3>
              <p className="text-sm text-[#80685b]">{resource.summary}</p>
              <Link
                href={resource.href}
                className="mt-auto inline-flex items-center gap-2 text-sm font-semibold text-[#6a4a3a] transition hover:text-[#3a2218]"
              >
                Read More
                <RiArrowRightUpLine className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}


