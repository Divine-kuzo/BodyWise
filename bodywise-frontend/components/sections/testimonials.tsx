import Image from "next/image";
import { SectionHeading } from "@/components/ui/section-heading";
import { TESTIMONIALS } from "@/lib/data";

export function TestimonialsSection() {
  return (
    <section
      id="community"
      className="rounded-[36px] bg-[#fffdfb] px-6 py-20 shadow-[0_35px_90px_-70px_rgba(58,34,24,0.6)] sm:px-10 lg:px-16"
    >
      <SectionHeading
        eyebrow="What Our Community Says"
        title="Real stories from African youth who found confidence and support through BodyWise."
        align="center"
        className="mb-14"
      />
      <div className="grid gap-10 lg:grid-cols-3">
        {TESTIMONIALS.map((testimonial) => (
          <div
            key={testimonial.name}
            className="flex h-full flex-col gap-6 rounded-3xl bg-[#f9f5f2] p-8 shadow-[0_30px_80px_-65px_rgba(58,34,24,0.7)]"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full border-2 border-white shadow-[0_12px_30px_-20px_rgba(58,34,24,0.7)]">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[#3a2218]">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-[#80685b]">{testimonial.location}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[#d6b28f]">
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <span key={index}>★</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-[#604d43]">
              “{testimonial.quote}”
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}


