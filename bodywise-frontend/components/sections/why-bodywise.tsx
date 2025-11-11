import { WHY_BODYWISE } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";

const iconShapes = ["⦿", "▲", "⌾"];

export function WhyBodyWiseSection() {
  return (
    <section
      id="why"
      className="rounded-[36px] bg-[#f9f5f2] px-8 py-20 shadow-[0_35px_80px_-60px_rgba(58,34,24,0.6)] sm:px-12 lg:px-16"
    >
      <SectionHeading
        eyebrow="Why BodyWise Africa?"
        title="Addressing body pressure, misinformation, and lack of accessible mental health support for African youth."
        description=""
        align="center"
        className="mb-14"
      />
      <div className="grid gap-10 md:grid-cols-3">
        {WHY_BODYWISE.map((item, index) => (
          <div
            key={item.title}
            className="space-y-5 rounded-3xl bg-white p-8 shadow-[0_25px_65px_-55px_rgba(58,34,24,0.7)]"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#f0d5b8] text-lg font-semibold text-[#3a2218]">
              {iconShapes[index]}
            </span>
            <h3 className="text-lg font-semibold text-[#3a2218]">
              {item.title}
            </h3>
            <p className="text-sm text-[#80685b]">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}


