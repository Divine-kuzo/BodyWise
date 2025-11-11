import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { communityStories } from "@/lib/dashboard-data";
import { TESTIMONIALS } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { userNav } from "@/lib/navigation";

export default function UserCommunityPage() {
  return (
    <DashboardShell
      title="Community stories & reflections"
      subtitle="Read peer experiences, celebrate milestones, and share your own BodyWise journey."
      breadcrumbs={[
        { label: "User", href: "/user" },
        { label: "Community" },
      ]}
      navItems={userNav}
    >
      <section className="rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
        <h3 className="text-sm font-semibold text-[#3a2218]">
          Peer testimonials
        </h3>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <article
              key={testimonial.name}
              className="flex flex-col gap-4 rounded-2xl bg-[#f9f0e6] px-4 py-5 text-[#4b3125]"
            >
              <div>
                <p className="text-sm font-semibold">{testimonial.name}</p>
                <p className="text-xs text-[#80685b]">{testimonial.location}</p>
              </div>
              <p className="text-sm text-[#6a4a3a]">“{testimonial.quote}”</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-5 rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <h3 className="text-sm font-semibold text-[#3a2218]">
            Spotlight stories
          </h3>
          <div className="space-y-4">
            {communityStories.map((story) => (
              <article
                key={story.title}
                className="rounded-2xl bg-[#f9f0e6] px-4 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a1897c]">
                  {story.readTime}
                </p>
                <h4 className="mt-2 text-base font-semibold text-[#3a2218]">
                  {story.title}
                </h4>
                <p className="text-sm text-[#6a4a3a]">{story.excerpt}</p>
                <p className="mt-2 text-xs text-[#80685b]">
                  Shared by {story.author}
                </p>
              </article>
            ))}
          </div>
        </div>
        <form className="space-y-4 rounded-3xl border border-[#e6d8ce] bg-white p-6 shadow-[0_30px_80px_-60px_rgba(58,34,24,0.45)]">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-[#3a2218]">
              Share your reflection
            </h3>
            <p className="text-xs text-[#80685b]">
              Your story encourages other African youth navigating their wellness journey.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="story-title" requiredIndicator>
              Title
            </Label>
            <input
              id="story-title"
              className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] shadow-[0_12px_40px_-28px_rgba(58,34,24,0.6)] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#f0d5b8]/80"
              placeholder="What inspired you this week?"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="story" requiredIndicator>
              Story
            </Label>
            <textarea
              id="story"
              rows={6}
              className="w-full rounded-2xl border border-[#e6d8ce] bg-white px-4 py-3 text-sm text-[#3a2218] shadow-[0_12px_40px_-28px_rgba(58,34,24,0.6)] focus:border-[#d6b28f] focus:outline-none focus:ring-2 focus:ring-[#f0d5b8]/80"
              placeholder="Share your journey, breakthroughs, or encouragement for others."
            />
          </div>
          <Button type="submit" variant="secondary" className="w-full">
            Publish to community blog
          </Button>
        </form>
      </section>
    </DashboardShell>
  );
}


