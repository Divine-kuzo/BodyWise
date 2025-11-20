// Admin Dashboard Data
// Test admin credentials: a.niyonseng@alustudent.com / admin123

export const adminStats = [
  {
    label: "Total Users",
    value: "12,847",
    trend: "+12%",
    trendLabel: "vs last month",
  },
  {
    label: "Active Institutions",
    value: "47",
    trend: "+8%",
    trendLabel: "new partnerships",
  },
  {
    label: "Total Consultations",
    value: "3,421",
    trend: "+23%",
    trendLabel: "this quarter",
  },
  {
    label: "Platform Uptime",
    value: "99.8%",
    trend: "+0.2%",
    trendLabel: "improved reliability",
  },
];

// System Performance Metrics
export const adminSystemPerformance = [
  {
    label: "Server Uptime",
    value: "99.8%",
    status: "Healthy",
  },
  {
    label: "API Response Time",
    value: "145ms",
    status: "Optimal",
  },
  {
    label: "Database Load",
    value: "42%",
    status: "Normal",
  },
  {
    label: "Active Sessions",
    value: "1,247",
    status: "Peak Hours",
  },
];

// User Growth Analytics by Category
export const adminUserGrowthData = [
  {
    category: "Individual Users (Patients)",
    total: "10,421",
    growth: "+845",
    percentage: 81,
  },
  {
    category: "Health Professionals (Doctors)",
    total: "1,234",
    growth: "+98",
    percentage: 10,
  },
  {
    category: "Institutional Admins",
    total: "847",
    growth: "+67",
    percentage: 7,
  },
  {
    category: "System Administrators",
    total: "345",
    growth: "+12",
    percentage: 2,
  },
];

export const adminUsers = [
  {
    name: "Uwase Aline",
    email: "u.aline@ur.ac.rw",
    location: "Kigali, Rwanda",
    role: "Patient",
    status: "Active",
    joined: "Jan 15, 2025",
  },
  {
    name: "Mugisha Patrick",
    email: "p.mugisha@gmail.com",
    location: "Huye, Rwanda",
    role: "Patient",
    status: "Active",
    joined: "Feb 3, 2025",
  },
  {
    name: "Dr. Igiraneza Grace",
    email: "g.igiraneza@chuk.gov.rw",
    location: "Kigali, Rwanda",
    role: "Doctor",
    status: "Active",
    joined: "Feb 12, 2025",
  },
  {
    name: "Niyonsenga Claude",
    email: "c.niyonsenga@auca.ac.rw",
    location: "Kigali, Rwanda",
    role: "Institution Admin",
    status: "Pending",
    joined: "Mar 8, 2025",
  },
  {
    name: "Umutoni Diane",
    email: "d.umutoni@gmail.com",
    location: "Musanze, Rwanda",
    role: "Patient",
    status: "Active",
    joined: "Mar 22, 2025",
  },
  {
    name: "Dr. Hakizimana Emmanuel",
    email: "e.hakizimana@kfh.rw",
    location: "Kigali, Rwanda",
    role: "Doctor",
    status: "Active",
    joined: "Apr 5, 2025",
  },
  {
    name: "Ishimwe Jean",
    email: "j.ishimwe@gmail.com",
    location: "Rubavu, Rwanda",
    role: "Patient",
    status: "Inactive",
    joined: "Apr 18, 2025",
  },
  {
    name: "Mutesi Sarah",
    email: "s.mutesi@iprc.ac.rw",
    location: "Kigali, Rwanda",
    role: "Institution Admin",
    status: "Active",
    joined: "May 2, 2025",
  },
  {
    name: "Bizimana Eric",
    email: "e.bizimana@gmail.com",
    location: "Nyanza, Rwanda",
    role: "Patient",
    status: "Active",
    joined: "May 16, 2025",
  },
  {
    name: "Uwizeyimana Marie",
    email: "m.uwizeyimana@minisante.gov.rw",
    location: "Kigali, Rwanda",
    role: "System Admin",
    status: "Active",
    joined: "Jun 1, 2025",
  },
];

// Default System Admin for testing
// Credentials: a.niyonseng@alustudent.com / admin123
export const defaultSystemAdmin = {
  name: "Audace Niyonseng",
  email: "a.niyonseng@alustudent.com",
  role: "System Admin",
  permissions: ["all"],
  createdAt: "Jan 1, 2025",
  status: "Active",
};

export const adminLogs = [
  {
    timestamp: "2025-11-12 14:23:15",
    event: "Database backup completed",
    status: "Success",
  },
  {
    timestamp: "2025-11-12 13:45:02",
    event: "New institution onboarded: Kigali University",
    status: "Info",
  },
  {
    timestamp: "2025-11-12 12:18:47",
    event: "API response time optimized",
    status: "Success",
  },
  {
    timestamp: "2025-11-12 11:30:22",
    event: "Security patch deployed",
    status: "Success",
  },
  {
    timestamp: "2025-11-12 10:05:11",
    event: "High traffic detected - scaling up",
    status: "Warning",
  },
  {
    timestamp: "2025-11-12 09:12:33",
    event: "Weekly user analytics generated",
    status: "Success",
  },
  {
    timestamp: "2025-11-12 08:00:00",
    event: "Scheduled maintenance completed",
    status: "Success",
  },
  {
    timestamp: "2025-11-11 23:45:18",
    event: "Email notification queue cleared",
    status: "Success",
  },
  {
    timestamp: "2025-11-11 22:30:55",
    event: "Failed login attempt detected",
    status: "Warning",
  },
  {
    timestamp: "2025-11-11 21:15:42",
    event: "AI chat service restarted",
    status: "Info",
  },
];

// Doctor Dashboard Data
export const doctorStats = [
  {
    label: "Active Patients",
    value: "127",
    trend: "+15",
    trendLabel: "new this month",
  },
  {
    label: "Consultations Today",
    value: "8",
    trend: "2",
    trendLabel: "scheduled",
  },
  {
    label: "Avg Response Time",
    value: "12 min",
    trend: "-3 min",
    trendLabel: "improved",
  },
  {
    label: "Satisfaction Rate",
    value: "4.8/5",
    trend: "+0.2",
    trendLabel: "this quarter",
  },
];

export const doctorPatients = [
  {
    name: "Uwase Aline",
    lastVisit: "Nov 10, 2025",
    condition: "Body Image Counseling",
    status: "In Progress",
    progress: "Week 4/8",
    lastSession: "Nov 10, 2025",
    nextSession: "Nov 17, 2025",
  },
  {
    name: "Mugisha Patrick",
    lastVisit: "Nov 9, 2025",
    condition: "Nutrition Guidance",
    status: "Completed",
    progress: "Completed",
    lastSession: "Nov 9, 2025",
    nextSession: "Follow-up (Dec 1)",
  },
  {
    name: "Umutoni Diane",
    lastVisit: "Nov 8, 2025",
    condition: "Mental Wellness",
    status: "In Progress",
    progress: "Week 2/6",
    lastSession: "Nov 8, 2025",
    nextSession: "Nov 15, 2025",
  },
  {
    name: "Ishimwe Jean",
    lastVisit: "Nov 7, 2025",
    condition: "Self-Esteem Support",
    status: "Scheduled",
    progress: "Initial Assessment",
    lastSession: "Nov 7, 2025",
    nextSession: "Nov 14, 2025",
  },
];

export const doctorSchedule = [
  {
    date: "Today",
    time: "09:00 AM",
    patient: "Uwase Aline",
    type: "Video Call",
    duration: "30 min",
  },
  {
    date: "Today",
    time: "10:30 AM",
    patient: "Mugisha Patrick",
    type: "Chat",
    duration: "45 min",
  },
  {
    date: "Today",
    time: "02:00 PM",
    patient: "Umutoni Diane",
    type: "Video Call",
    duration: "30 min",
  },
  {
    date: "Today",
    time: "04:00 PM",
    patient: "Ishimwe Jean",
    type: "Follow-up",
    duration: "20 min",
  },
];

// Institution Dashboard Data
export const institutionStats = [
  {
    label: "Total Students",
    value: "2,847",
    trend: "+234",
    trendLabel: "enrolled this term",
  },
  {
    label: "Active Doctors",
    value: "12",
    trend: "+3",
    trendLabel: "joined this month",
  },
  {
    label: "Wellness Sessions",
    value: "156",
    trend: "+42",
    trendLabel: "this month",
  },
  {
    label: "Engagement Rate",
    value: "67%",
    trend: "+12%",
    trendLabel: "increased",
  },
];

export const institutionDoctors = [
  {
    name: "Dr. Igiraneza Grace",
    specialty: "Clinical Psychologist",
    patients: "45",
    availability: "Available",
    status: "Active",
    consultations: "128",
  },
  {
    name: "Dr. Hakizimana Emmanuel",
    specialty: "Nutritionist",
    patients: "38",
    availability: "Busy",
    status: "Active",
    consultations: "95",
  },
  {
    name: "Dr. Uwizeyimana Marie",
    specialty: "Wellness Coach",
    patients: "52",
    availability: "Available",
    status: "Active",
    consultations: "156",
  },
  {
    name: "Dr. Nkurunziza Patrick",
    specialty: "Mental Health Counselor",
    patients: "41",
    availability: "Off Duty",
    status: "On Leave",
    consultations: "103",
  },
];

// User Dashboard Data (Patient)
export const userStats = [
  {
    label: "Wellness Score",
    value: "78/100",
    trend: "+5",
    trendLabel: "points this week",
  },
  {
    label: "Active Days",
    value: "12",
    trend: "4",
    trendLabel: "day streak",
  },
  {
    label: "Resources Viewed",
    value: "23",
    trend: "+8",
    trendLabel: "this month",
  },
  {
    label: "Next Appointment",
    value: "Nov 15",
    trend: "3",
    trendLabel: "days away",
  },
];

export const userDoctors = [
  {
    name: "Dr. Igiraneza Grace",
    specialty: "Clinical Psychologist",
    rating: "4.9",
    availability: "Available Today",
    experience: "8 years",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Dr. Hakizimana Emmanuel",
    specialty: "Nutritionist",
    rating: "4.8",
    availability: "Tomorrow at 2 PM",
    experience: "6 years",
    image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=256&q=80",
  },
  {
    name: "Dr. Uwizeyimana Marie",
    specialty: "Wellness Coach",
    rating: "4.9",
    availability: "Available Today",
    experience: "10 years",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80",
  },
];

// Alias for featured doctors in user section
export const featuredDoctors = userDoctors;

// Community stories for user community page
export const communityStories = [
  {
    id: 1,
    author: "Uwase A.",
    location: "Kigali, Rwanda",
    title: "Gukunda Umubiri Wanjye - Learning to Love My Body",
    excerpt: "After years of struggling with body image at university, I finally found peace through BodyWise...",
    content: "Growing up in Rwanda, I always felt pressure to look a certain way. At university, the stress made it worse. BodyWise's AI health coach helped me understand that health isn't about fitting into a certain size, but about feeling strong and confident in my own skin. Now I celebrate my Rwandan beauty.",
    likes: 234,
    comments: 45,
    date: "Nov 8, 2025",
    readTime: "3 min read",
    image: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    author: "Mugisha P.",
    location: "Huye, Rwanda",
    title: "Breaking the Silence: Men's Mental Health in Rwanda",
    excerpt: "As a young Rwandan man, I felt pressure to be 'strong' and never show vulnerability...",
    content: "In our culture, men aren't supposed to show emotion or seek help. But BodyWise gave me a safe, private space to talk about my struggles with body image and mental health. Now I'm helping other young men in Huye understand it's okay to ask for support. Gusaba ubufasha ntabwo ari uburambe.",
    likes: 189,
    comments: 32,
    date: "Nov 5, 2025",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    author: "Umutoni D.",
    location: "Musanze, Rwanda",
    title: "Balancing Social Media and Self-Worth",
    excerpt: "Instagram made me feel like I wasn't enough. BodyWise helped me find balance...",
    content: "Coming from Musanze to study in Kigali, I felt overwhelmed by social media beauty standards. The education resources on BodyWise helped me understand how algorithms affect our self-perception and reconnect with traditional Rwandan values of inner beauty. Now I use social media mindfully and feel proud of who I am.",
    likes: 312,
    comments: 67,
    date: "Nov 1, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=600&q=80",
  },
];

// Pending institutions for admin review
export const pendingInstitutions = [
  {
    id: 1,
    name: "University of Rwanda - College of Medicine and Health Sciences",
    location: "Kigali, Rwanda",
    country: "Rwanda",
    type: "University",
    students: "12,500+",
    contactName: "Dr. Nsanzimana Sabin",
    contactEmail: "s.nsanzimana@ur.ac.rw",
    contactPhone: "+250 788 456 789",
    appliedDate: "Nov 8, 2025",
    submitted: "Nov 8, 2025",
    status: "Pending Review",
    focus: "Mental Health & Wellness",
    summary: "The University of Rwanda is committed to providing comprehensive mental health and wellness services to our diverse student population across all campuses. We aim to partner with BodyWise to enhance our existing programs and provide culturally sensitive support that aligns with Rwanda's health priorities.",
    programs: [
      "Bachelor of Clinical Psychology",
      "Mental Health Awareness Campaigns",
      "Peer Counseling Programs",
      "Student Wellness Seminars",
      "Traditional & Modern Healing Integration",
    ],
    documents: [
      { label: "Business License", status: "Verified" },
      { label: "Tax ID", status: "Verified" },
      { label: "Accreditation Certificate", status: "Verified" },
    ],
  },
  {
    id: 2,
    name: "IPRC Kigali - Integrated Polytechnic Regional Centre",
    location: "Kigali, Rwanda",
    country: "Rwanda",
    type: "Technical College",
    students: "4,800+",
    contactName: "Mukamana Angelique",
    contactEmail: "a.mukamana@iprc.ac.rw",
    contactPhone: "+250 788 234 567",
    appliedDate: "Nov 5, 2025",
    submitted: "Nov 5, 2025",
    status: "Pending Review",
    focus: "Body Positivity & Self-Esteem",
    summary: "IPRC Kigali focuses on technical education and recognizes the importance of mental wellness and positive body image among young professionals. We believe BodyWise aligns with our mission to develop confident, healthy graduates ready for the workforce.",
    programs: [
      "Body Confidence Workshops",
      "Nutrition Education",
      "Sports & Fitness Programs",
      "Stress Management Sessions",
      "Career Counseling with Wellness Focus",
    ],
    documents: [
      { label: "Business License", status: "Verified" },
      { label: "Accreditation Certificate", status: "Verified" },
    ],
  },
  {
    id: 3,
    name: "Adventist University of Central Africa (AUCA)",
    location: "Kigali, Rwanda",
    country: "Rwanda",
    type: "Private University",
    students: "3,500+",
    contactName: "Dr. Mutabazi Jean Claude",
    contactEmail: "jc.mutabazi@auca.ac.rw",
    contactPhone: "+250 788 567 890",
    appliedDate: "Nov 3, 2025",
    submitted: "Nov 3, 2025",
    status: "Under Review",
    focus: "Holistic Student Wellness",
    summary: "AUCA is dedicated to supporting holistic student development including mental, physical, and spiritual wellness. We're seeking to integrate BodyWise services to provide our students with professional mental health support and evidence-based body positivity resources.",
    programs: [
      "Student Health Services",
      "Counseling & Guidance",
      "Wellness Fairs & Health Days",
      "Health Education Campaigns",
      "Community Outreach Programs",
    ],
    documents: [
      { label: "Business License", status: "Verified" },
      { label: "Tax ID", status: "Verified" },
    ],
  },
  {
    id: 4,
    name: "Centre Hospitalier Universitaire de Kigali (CHUK)",
    location: "Kigali, Rwanda",
    country: "Rwanda",
    type: "Teaching Hospital",
    students: "2,100+",
    contactName: "Dr. Ingabire Yvonne",
    contactEmail: "y.ingabire@chuk.gov.rw",
    contactPhone: "+250 788 345 678",
    appliedDate: "Oct 30, 2025",
    submitted: "Oct 30, 2025",
    status: "Pending Review",
    focus: "Clinical Mental Health",
    summary: "CHUK provides comprehensive healthcare and trains medical professionals. We're interested in partnering with BodyWise to expand our mental health and body image support services, ensuring evidence-based, culturally appropriate care for both patients and medical students.",
    programs: [
      "Clinical Mental Health Services",
      "Medical Student Wellness Programs",
      "Health Promotion & Prevention",
      "Psychosocial Support Groups",
      "Community Mental Health Outreach",
    ],
    documents: [
      { label: "Business License", status: "Verified" },
      { label: "Accreditation Certificate", status: "Verified" },
      { label: "Partnership Agreement", status: "Pending" },
    ],
  },
  {
    id: 5,
    name: "Rwanda Polytechnic - IPRC Huye",
    location: "Huye, Rwanda",
    country: "Rwanda",
    type: "Technical College",
    students: "3,200+",
    contactName: "Nkurunziza Patrick",
    contactEmail: "p.nkurunziza@rp.ac.rw",
    contactPhone: "+250 788 678 901",
    appliedDate: "Oct 28, 2025",
    submitted: "Oct 28, 2025",
    status: "Pending Review",
    focus: "Youth Empowerment & Wellness",
    summary: "IPRC Huye serves students in the Southern Province, many from rural backgrounds adapting to campus life. We recognize the unique mental health and body image challenges our students face and seek partnership with BodyWise to provide accessible, culturally relevant support.",
    programs: [
      "Peer Support Networks",
      "Traditional & Modern Wellness Integration",
      "Sports & Recreation Programs",
      "Life Skills Training",
      "Mental Health First Aid",
    ],
    documents: [
      { label: "Business License", status: "Verified" },
      { label: "Accreditation Certificate", status: "Pending" },
      { label: "Tax ID", status: "Verified" },
    ],
  },
];
