import Link from "next/link";
import { SOCIAL_LINKS } from "@/lib/constants";

const columns = [
  {
    title: "Use cases",
    links: [
      "UI design",
      "UX design",
      "Wireframing",
      "Diagramming",
      "Brainstorming",
      "Online whiteboard",
      "Team collaboration",
    ],
  },
  {
    title: "Explore",
    links: [
      "Design",
      "Prototyping",
      "Development features",
      "Design systems",
      "Collaboration features",
      "Design process",
      "FigJam",
    ],
  },
  {
    title: "Resources",
    links: [
      "Blog",
      "Best practices",
      "Colors",
      "Color wheel",
      "Support",
      "Developers",
      "Resource library",
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#3a2218] via-[#4d2c22] to-[#3a2218] text-[#f5ebe3]">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-16 md:flex-row md:items-start md:justify-between">
        <div className="space-y-6 max-w-xs">
          <div className="flex items-center gap-3 text-lg font-semibold">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold uppercase text-white">
              BW
            </span>
            BodyWise Africa
          </div>
          <div className="flex items-center gap-4 text-sm text-[#f0d5b8]/80">
            {SOCIAL_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="transition hover:text-[#f0d5b8]"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid flex-1 gap-10 md:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title} className="space-y-5">
              <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#f0d5b8]">
                {column.title}
              </h4>
              <ul className="space-y-2 text-sm text-[#f5ebe3]/80">
                {column.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-white transition">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}


