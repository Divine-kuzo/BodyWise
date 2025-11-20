// Navigation configurations for different dashboard types

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  match?: "exact" | "startswith";
}

export const adminNav = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "dashboard",
  },
  {
    label: "Members",
    href: "/admin/users",
    icon: "team",
  },
  {
    label: "Institutions",
    href: "/admin/institutions",
    icon: "institution",
  },
  {
    label: "Blogs & Articles",
    href: "/admin/blogs",
    icon: "blogs",
  },
  {
    label: "Testimonials",
    href: "/admin/testimonials",
    icon: "testimonials",
  },
  {
    label: "Performance Logs",
    href: "/admin/logs",
    icon: "performance",
  },
];

export const doctorNav = [
  {
    label: "Dashboard",
    href: "/doctor",
    icon: "dashboard",
  },
  {
    label: "My Profile",
    href: "/doctor/profile",
    icon: "user",
  },
  {
    label: "Patients",
    href: "/doctor/patients",
    icon: "doctor",
  },
  {
    label: "Schedule",
    href: "/doctor/schedule",
    icon: "schedule",
  },
];

export const institutionNav = [
  {
    label: "Dashboard",
    href: "/institution",
    icon: "dashboard",
  },
  {
    label: "Doctors",
    href: "/institution/doctors",
    icon: "doctor",
  },
  {
    label: "Documents",
    href: "/institution/documents",
    icon: "docs",
  },
];

export const userNav = [
  {
    label: "Dashboard",
    href: "/user",
    icon: "dashboard",
  },
  {
    label: "Find Doctors",
    href: "/user/doctors",
    icon: "doctor",
  },
  {
    label: "AI Health Coach",
    href: "/user/chat",
    icon: "chat",
  },
  {
    label: "Community",
    href: "/user/community",
    icon: "community",
  },
];
