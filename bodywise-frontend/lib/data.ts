export const HERO_STATS = [
  { label: "Active Users", value: "50K+" },
  { label: "Verified Professionals", value: "200+" },
  { label: "Satisfaction Rate", value: "98%" },
] as const;

export const WHY_BODYWISE = [
  {
    title: "Body Pressure & Unrealistic Standards",
    description:
      "Social media and cultural expectations create harmful body image issues among African youth.",
  },
  {
    title: "Misinformation & Unsafe Practices",
    description:
      "Lack of credible information leads to dangerous body modification attempts and health risks.",
  },
  {
    title: "Limited Access to Mental Health Support",
    description:
      "Stigma and lack of affordable professional help prevent youth from seeking guidance.",
  },
] as const;

export const CORE_FEATURES = [
  {
    title: "AI Body Assessment",
    description:
      "Get personalized body composition analysis with AI-powered insights. Understand your BMI, body fat percentage, and receive tailored lifestyle recommendations.",
    cta: "Start Assessment",
    href: "/login",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Verified Psychologist Network",
    description:
      "Connect with licensed mental health professionals and wellness coaches. Book confidential consultations via chat or video for personalized support.",
    cta: "Find a Professional",
    href: "/login",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Education & Awareness Hub",
    description:
      "Access culturally relevant articles, videos, and real stories about body image, mental health, and safe wellness practices. Learn at your own pace.",
    cta: "Explore Resources",
    href: "/login",
    image:
      "https://images.unsplash.com/photo-1573497491208-6b1acb260507?auto=format&fit=crop&w=900&q=80",
  },
] as const;

export const EDUCATION_TAGS = [
  "All",
  "Body Image",
  "Mental Health",
  "Safe Practices",
  "Real Stories",
] as const;

export const EDUCATION_RESOURCES = [
  {
    tag: "Body Image",
    title: "Understanding Body Positivity in African Culture",
    summary:
      "Explore how traditional African values celebrate diverse body types and how to embrace your natural beauty.",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1100&q=80",
    href: "/education",
  },
  {
    tag: "Mental Health",
    title: "Breaking the Stigma: Mental Health in Africa",
    summary:
      "Learn why seeking mental health support is a sign of strength, not weakness, and how to start the conversation.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1100&q=80",
    href: "/education",
  },
  {
    tag: "Safe Practices",
    title: "The Truth About Body Enhancement Products",
    summary:
      "Understand the risks of unregulated products and discover safe, evidence-based alternatives for body wellness.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1100&q=80",
    href: "/education",
  },
  {
    tag: "Real Stories",
    title: "Amara’s Story",
    summary:
      "How community support and culturally aware counseling helped Amara gain confidence and embrace her identity.",
    image:
      "https://images.unsplash.com/photo-1504593811423-6dd665756598?auto=format&fit=crop&w=1100&q=80",
    href: "/education",
  },
  {
    tag: "Body Image",
    title: "Body Confidence for Young Men",
    summary:
      "Practical tools for young men to navigate body expectations while honoring their cultural backgrounds.",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1100&q=80",
    href: "/education",
  },
  {
    tag: "Mental Health",
    title: "Community-Based Healing Practices",
    summary:
      "Blending traditional support systems with modern therapy approaches to create accessible mental wellness pathways.",
    image:
      "https://images.unsplash.com/photo-1551292831-023188e78222?auto=format&fit=crop&w=1100&q=80",
    href: "/education",
  },
] as const;

export const TESTIMONIALS = [
  {
    name: "Amara O.",
    location: "Lagos, Nigeria",
    quote:
      "BodyWise helped me understand my body better without judgment. The AI assessment was eye-opening, and connecting with a psychologist changed my life. I finally feel confident in my own skin.",
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    name: "Kwame A.",
    location: "Accra, Ghana",
    quote:
      "As a young man dealing with body image pressure, I felt alone. BodyWise gave me access to resources and professionals who understood my cultural context. I highly recommend it!",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
  {
    name: "Zainab M.",
    location: "Nairobi, Kenya",
    quote:
      "The education hub is incredible! I learned so much about healthy body practices and mental wellness. BodyWise is exactly what African youth need right now.",
    avatar:
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=256&q=80",
    rating: 5,
  },
] as const;

export const JOIN_ROLES = [
  {
    key: "user",
    title: "Individual",
    description:
      "Track body goals, access AI-driven assessments, and connect with culturally aware wellness experts.",
    perks: [
      "Personalized care plans tailored to your body journey",
      "Direct chat with verified psychologists and nutritionists",
      "Curated learning paths built for African youth",
    ],
    href: "/signup?role=user",
    cta: "Sign up as an Individual",
  },
  {
    key: "institution",
    title: "Institution",
    description:
      "Support your community with BodyWise resources for schools, universities, and wellness organizations.",
    perks: [
      "Dedicated dashboards for community outcomes",
      "Virtual workshops from mental health professionals",
      "Co-branded programs for ongoing body confidence education",
    ],
    href: "/signup?role=institution",
    cta: "Partner with BodyWise",
  },
] as const;


