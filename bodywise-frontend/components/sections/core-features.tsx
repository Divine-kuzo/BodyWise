import Image from "next/image";
import Link from "next/link";
import { CORE_FEATURES } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { buttonVariants } from "@/components/ui/button";

export function CoreFeaturesSection() {
  return (
    <section
      id="features"
      className="rounded-[36px] bg-[#f9f0e6] px-8 py-20 shadow-[0_45px_100px_-70px_rgba(58,34,24,0.7)] sm:px-12 lg:px-16"
    >
      <SectionHeading
        eyebrow="Our Core Features"
        title="Empowering you with AI-driven insights, expert support, and culturally relevant education."
        align="center"
        className="mb-14"
      />
      <div className="grid gap-10 lg:grid-cols-3">
        {CORE_FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_35px_80px_-65px_rgba(58,34,24,0.75)]"
          >
            <div className="relative h-56 w-full">
              <Image
                src={feature.image}
                alt={feature.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-5 px-8 pb-8 pt-7">
              <h3 className="text-lg font-semibold text-[#3a2218]">
                {feature.title}
              </h3>
              <p className="text-sm text-[#80685b]">{feature.description}</p>
              <div className="mt-auto">
                <Link
                  href={feature.href}
                  className={buttonVariants({ variant: "secondary" })}
                >
                  {feature.cta}
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}


