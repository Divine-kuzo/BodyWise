--create testimonials for all users

-- patient testimonials
INSERT INTO testimonials (user_id, user_type, content, rating, approval_status, approved_by, approved_at, is_featured, created_at) VALUES
(2, 'patient', 'BodyWise has been a lifeline for me during difficult times. The platform makes it so easy to connect with qualified mental health professionals. The video consultations are seamless, and the AI chat feature provides helpful guidance between sessions. I especially appreciate the reminder system that helps me stay on track with my appointments.', 5, 'approved', 1, datetime('now', '-15 days'), 1, datetime('now', '-20 days')),

(6, 'patient', 'As an ALU student, managing my mental health while keeping up with academics was challenging. BodyWise connected me with Dr. Marie Uwase, who has been incredibly supportive. The scheduling system is flexible and works perfectly with my busy schedule. The platform has truly made mental healthcare accessible and stigma-free.', 5, 'approved', 1, datetime('now', '-12 days'), 1, datetime('now', '-18 days')),

(7, 'patient', 'I was hesitant about online therapy at first, but BodyWise exceeded all my expectations. The doctors are professional, empathetic, and genuinely care about their patients. The educational content on the platform has helped me understand my mental health better. I feel more empowered and in control of my wellbeing now.', 5, 'approved', 1, datetime('now', '-10 days'), 0, datetime('now', '-16 days')),

(8, 'patient', 'The AI chat feature is amazing! It provides immediate support and coping strategies whenever I need them. Combined with regular sessions with my therapist, I have seen significant improvements in managing my anxiety. The platform is user-friendly and the reminder emails ensure I never miss an appointment.', 4, 'approved', 1, datetime('now', '-8 days'), 1, datetime('now', '-14 days')),

(10, 'patient', 'BodyWise has revolutionized how I approach mental healthcare. The ability to book appointments at my convenience and access educational resources has been game-changing. The doctors are highly qualified and create a safe, judgment-free space. I recommend this platform to anyone seeking mental health support.', 5, 'approved', 1, datetime('now', '-5 days'), 0, datetime('now', '-11 days'));

-- health professional testimonials
INSERT INTO testimonials (user_id, user_type, content, rating, approval_status, approved_by, approved_at, is_featured, created_at) VALUES
(4, 'health_professional', 'As a clinical psychologist, BodyWise has transformed how I deliver care to my patients. The platform streamlines scheduling, consultation management, and follow-ups. The automated email reminders significantly reduce no-shows, and the video conferencing integration is reliable. It is a comprehensive solution that allows me to focus on what matters most - helping my patients heal.', 5, 'approved', 1, datetime('now', '-7 days'), 1, datetime('now', '-13 days')),

(9, 'health_professional', 'BodyWise is an exceptional platform for healthcare professionals. The admin dashboard provides clear visibility into my schedule, patient history, and upcoming appointments. The approval workflow for educational content ensures quality while allowing me to share valuable insights with the community. The technical infrastructure is solid and the support team is responsive.', 5, 'approved', 1, datetime('now', '-4 days'), 0, datetime('now', '-9 days'));

-- educational blogs from ALU health professionals

-- blogs by Dr. Marie Uwase (Clinical Psychology)
INSERT INTO articles (
  title, content, author_type, author_id, institution_id, 
  category, tags, thumbnail_url, approval_status, is_published, 
  approved_by, approved_at, views_count, created_at, updated_at
) VALUES
(
  'Understanding Anxiety: A Clinical Perspective',
  'Anxiety is one of the most common mental health challenges affecting students and young professionals today. As a clinical psychologist at African Leadership University, I have witnessed firsthand how anxiety can impact academic performance, relationships, and overall wellbeing.

## What is Anxiety?

Anxiety is our body''s natural response to stress - a feeling of fear or apprehension about what is to come. While some anxiety is normal and can even be beneficial, excessive anxiety can be debilitating.

## Common Symptoms

- Persistent worry or fear
- Difficulty concentrating
- Restlessness or feeling on edge
- Rapid heartbeat or breathing
- Sleep disturbances
- Muscle tension

## Effective Coping Strategies

### 1. Grounding Techniques
When anxiety strikes, try the 5-4-3-2-1 technique: Identify 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste. This brings you back to the present moment.

### 2. Breathing Exercises
Practice deep breathing: Inhale for 4 counts, hold for 4, exhale for 6. This activates your parasympathetic nervous system, promoting calm.

### 3. Regular Physical Activity
Exercise releases endorphins and reduces stress hormones. Even a 20-minute walk can make a significant difference.

### 4. Maintain a Routine
Consistency in sleep, meals, and daily activities provides structure and reduces uncertainty, which often fuels anxiety.

## When to Seek Professional Help

If anxiety interferes with daily activities, relationships, or academic/work performance for more than two weeks, it is time to consult a mental health professional. There is no shame in seeking help - it is a sign of strength and self-awareness.

At BodyWise, we provide accessible, confidential support tailored to your needs. Remember, mental health is just as important as physical health.',
  'health_professional',
  1,
  1,
  'Mental Health',
  '["anxiety", "mental health", "coping strategies", "wellness", "student health"]',
  NULL,
  'approved',
  1,
  1,
  datetime('now', '-25 days'),
  342,
  datetime('now', '-30 days'),
  datetime('now', '-25 days')
),
(
  'Breaking the Stigma: Why Mental Health Matters in Africa',
  'Mental health remains one of the most stigmatized health topics in African communities. Cultural beliefs, misconceptions, and lack of awareness often prevent individuals from seeking help. As mental health professionals, we must actively work to break these barriers.

## The Current Landscape

Africa faces a significant mental health treatment gap. According to WHO, there is less than 1 mental health professional per 100,000 people in many African countries. This scarcity, combined with stigma, creates a crisis.

## Common Misconceptions

### "Mental illness is a spiritual problem"
While spirituality plays an important role in African culture, mental health conditions have biological, psychological, and social components that require professional treatment.

### "Only weak people need therapy"
Seeking help demonstrates strength and self-awareness. The most successful people worldwide prioritize their mental health.

### "Talking about problems makes them worse"
Research consistently shows that talking therapy is highly effective for most mental health conditions.

## Creating Change

### 1. Education
We must educate communities about mental health through accessible platforms like BodyWise, schools, and community centers.

### 2. Language Matters
Using respectful, person-first language reduces stigma. Say "person with depression" rather than "depressed person."

### 3. Sharing Stories
When public figures and community leaders share their mental health journeys, it normalizes seeking help.

### 4. Accessible Services
Platforms like BodyWise make mental health care more accessible, affordable, and convenient, removing many traditional barriers.

## Moving Forward

The future of mental health in Africa is promising. Young people are increasingly open to discussing mental health, technology is making services more accessible, and more African professionals are entering the field.

Remember: Mental health is not a luxury - it is a fundamental human right. If you or someone you know is struggling, reach out. Help is available, and recovery is possible.',
  'health_professional',
  1,
  1,
  'Mental Health Awareness',
  '["stigma", "mental health", "Africa", "cultural perspectives", "awareness"]',
  NULL,
  'approved',
  1,
  1,
  datetime('now', '-20 days'),
  287,
  datetime('now', '-27 days'),
  datetime('now', '-20 days')
),
(
  'Self-Care for Students: Practical Tips for Academic Success',
  'University life is exciting but demanding. Between classes, assignments, social activities, and planning for the future, it is easy to neglect self-care. Here are evidence-based strategies to maintain your mental health while excelling academically.

## The Self-Care Foundation

Self-care is not selfish - it is essential. Think of it as preventive maintenance for your mind and body.

## Physical Self-Care

### Quality Sleep
Aim for 7-9 hours per night. Sleep deprivation impairs memory, concentration, and emotional regulation - all crucial for academic success.

**Tips:**
- Keep a consistent sleep schedule
- Avoid screens 1 hour before bed
- Create a cool, dark sleeping environment

### Nutrition
Your brain needs proper fuel. Eat regular, balanced meals with:
- Complex carbohydrates (whole grains)
- Lean proteins
- Healthy fats (nuts, avocado)
- Plenty of fruits and vegetables

### Physical Activity
Exercise is proven to reduce stress, improve mood, and enhance cognitive function. Find activities you enjoy - dancing, sports, walking, or gym workouts.

## Mental Self-Care

### Time Management
Use the Pomodoro Technique: Work for 25 minutes, break for 5. This prevents burnout and maintains focus.

### Set Boundaries
Learn to say no. You cannot do everything - prioritize what aligns with your goals and values.

### Practice Mindfulness
Even 5 minutes of daily meditation can reduce stress and improve focus. Apps like Headspace or Calm can guide you.

## Emotional Self-Care

### Stay Connected
Maintain relationships with family and friends. Social support is crucial for mental health.

### Express Yourself
Journal, create art, play music - find healthy outlets for emotions.

### Seek Help Early
Do not wait until you are overwhelmed. BodyWise offers accessible support whenever you need it.

## Social Self-Care

### Join Communities
Connect with people who share your interests and values. University clubs and online communities provide belonging.

### Limit Toxic Relationships
Surround yourself with people who support and uplift you.

## Academic Self-Care

### Break Large Tasks
Divide big projects into smaller, manageable steps to reduce overwhelm.

### Celebrate Progress
Acknowledge your achievements, no matter how small.

### Ask for Help
Use office hours, study groups, and tutoring services. Asking for help is a strength, not a weakness.

## Remember

Self-care is personal - what works for others might not work for you. Experiment with different strategies and create a routine that fits your life. Your mental health is the foundation for everything else - protect it.',
  'health_professional',
  1,
  1,
  'Student Wellness',
  '["self-care", "student life", "academic success", "wellness", "mental health"]',
  NULL,
  'approved',
  1,
  1,
  datetime('now', '-15 days'),
  456,
  datetime('now', '-22 days'),
  datetime('now', '-15 days')
);

-- blogs by Dr. Kwame Mensah (General Practice & Wellness)
INSERT INTO articles (
  title, content, author_type, author_id, institution_id,
  category, tags, thumbnail_url, approval_status, is_published,
  approved_by, approved_at, views_count, created_at, updated_at
) VALUES
(
  'The Mind-Body Connection: How Physical Health Affects Mental Wellbeing',
  'As a general practitioner specializing in wellness, I often see how interconnected our physical and mental health truly are. Understanding this connection is key to holistic wellbeing.

## The Bidirectional Relationship

Your mind affects your body, and your body affects your mind. This is not just philosophy - it is backed by extensive scientific research.

## How Physical Health Impacts Mental Health

### 1. Inflammation and Depression
Chronic inflammation in the body has been linked to depression and anxiety. Conditions like obesity, diabetes, and autoimmune disorders can affect mood through inflammatory pathways.

### 2. Gut-Brain Axis
Your gut produces 95% of your body''s serotonin (the "happy hormone"). Poor gut health can directly impact mood, anxiety, and cognitive function.

### 3. Hormonal Balance
Thyroid disorders, vitamin deficiencies (especially D and B12), and hormonal imbalances can present as depression or anxiety.

### 4. Sleep and Mental Health
Poor sleep quality increases risk of mental health issues, while mental health conditions often disrupt sleep - creating a vicious cycle.

## Practical Steps for Holistic Health

### Nutrition for Mental Health

**Brain-Boosting Foods:**
- Omega-3 fatty acids (fish, walnuts)
- Antioxidants (berries, dark chocolate)
- Probiotics (yogurt, fermented foods)
- Complex carbohydrates (whole grains)

**Limit:**
- Excessive caffeine
- Refined sugars
- Processed foods
- Alcohol

### Exercise as Medicine

Physical activity is one of the most effective treatments for mild to moderate depression and anxiety.

**Recommendations:**
- 150 minutes of moderate activity per week
- Include both cardio and strength training
- Find activities you enjoy
- Start small and build consistency

### Sleep Hygiene

**Create a Sleep Sanctuary:**
- Cool, dark, quiet room
- Comfortable mattress and pillows
- No screens in bedroom
- Consistent bedtime routine

### Stress Management

Chronic stress damages both physical and mental health.

**Effective Techniques:**
- Deep breathing exercises
- Progressive muscle relaxation
- Yoga or tai chi
- Time in nature

## When to Seek Help

If you experience:
- Persistent fatigue despite adequate rest
- Unexplained physical symptoms
- Mood changes lasting more than 2 weeks
- Difficulty functioning in daily life

Consult both a medical doctor and mental health professional. At BodyWise, we take a comprehensive approach to your wellbeing.

## The Power of Prevention

Investing in your physical health is investing in your mental health. Small, consistent actions compound over time to create significant positive change.

Remember: You are not separate parts - you are a whole person. Treat yourself accordingly.',
  'health_professional',
  2,
  1,
  'Holistic Health',
  '["mind-body connection", "holistic health", "wellness", "nutrition", "physical health"]',
  NULL,
  'approved',
  1,
  1,
  datetime('now', '-18 days'),
  398,
  datetime('now', '-24 days'),
  datetime('now', '-18 days')
),
(
  'Building Resilience: Strategies for Thriving in Challenging Times',
  'Life inevitably presents challenges - academic pressure, relationship issues, career uncertainty, health concerns. Resilience - our ability to bounce back from adversity - can be developed and strengthened.

## What is Resilience?

Resilience is not about avoiding stress or never feeling overwhelmed. It is about developing skills and resources to navigate difficulties effectively and emerge stronger.

## The Foundations of Resilience

### 1. Strong Relationships
Social connections are the single most important factor in resilience. Humans are social beings - we need each other.

**Action Steps:**
- Invest time in meaningful relationships
- Join communities aligned with your values
- Practice vulnerability - share your struggles
- Offer support to others

### 2. Self-Awareness
Understanding your emotions, triggers, and patterns helps you respond rather than react.

**Develop Self-Awareness:**
- Practice mindfulness meditation
- Keep a journal
- Reflect on your reactions
- Seek feedback from trusted people

### 3. Realistic Optimism
This is not toxic positivity - it is acknowledging challenges while maintaining hope about solutions.

**Cultivate Optimism:**
- Challenge negative self-talk
- Focus on what you can control
- Keep a gratitude journal
- Celebrate small wins

### 4. Purpose and Meaning
Having a sense of purpose provides motivation during difficult times.

**Find Your Purpose:**
- Identify your values
- Set meaningful goals
- Connect your daily actions to larger purpose
- Contribute to something beyond yourself

## Practical Resilience Strategies

### Problem-Focused Coping
When you can influence the situation:
- Break problems into manageable steps
- Gather information and resources
- Take action, even small steps
- Ask for help when needed

### Emotion-Focused Coping
When you cannot change the situation:
- Accept what you cannot control
- Regulate emotions through healthy outlets
- Reframe the situation
- Practice self-compassion

### Stress Management Tools

**Daily Practices:**
- 10 minutes meditation or deep breathing
- Physical activity you enjoy
- Connection with at least one person
- Something creative or playful

**Weekly:**
- Reflection and planning time
- Engage in a hobby
- Quality time with loved ones
- Rest and recovery

### Building a Resilience Toolkit

Create your personal toolkit:
1. **Physical:** Exercise, sleep, nutrition
2. **Mental:** Learning, problem-solving, positive self-talk
3. **Emotional:** Emotional expression, therapy, support groups
4. **Social:** Friends, family, mentors, community
5. **Spiritual:** Meditation, nature, purpose, values

## Growth Through Adversity

Post-traumatic growth is real - many people report positive changes after difficult experiences:
- Greater appreciation for life
- Closer relationships
- Increased personal strength
- New possibilities
- Spiritual development

## Professional Support

Building resilience is easier with guidance. At BodyWise, we provide:
- Individual therapy for processing challenges
- Skills training for stress management
- Support during crisis
- Tools for ongoing growth

## Remember

Resilience is not a trait you either have or do not have - it is a set of skills anyone can develop. Start small, be patient with yourself, and remember that seeking help is a sign of resilience, not weakness.

You are stronger than you think, and you do not have to face challenges alone.',
  'health_professional',
  2,
  1,
  'Mental Health',
  '["resilience", "coping strategies", "personal growth", "stress management", "mental strength"]',
  NULL,
  'approved',
  1,
  1,
  datetime('now', '-12 days'),
  521,
  datetime('now', '-19 days'),
  datetime('now', '-12 days')
),
(
  'Healthy Habits for Busy Professionals: A Practical Guide',
  'As a wellness physician working with young professionals, I understand the challenge of maintaining health while building a career. Here is a realistic, evidence-based approach to staying healthy despite a busy schedule.

## The Reality Check

You do not need hours at the gym or elaborate meal prep. Small, consistent actions yield significant results.

## Nutrition on the Go

### Quick Healthy Meals
- Overnight oats (prep in 5 minutes)
- Whole grain wraps with protein and vegetables
- Greek yogurt with nuts and fruit
- Pre-cut vegetables with hummus

### Smart Eating Out
- Choose grilled over fried
- Start with salad or soup
- Share desserts
- Drink water with meals

### Meal Prep Simplified
Sunday: Cook batch of protein, grains, and roasted vegetables. Mix and match throughout the week.

## Movement Integration

You do not need gym membership to stay active.

### Office Exercises
- Standing desk or regular standing breaks
- Walk during phone calls
- Take stairs
- Desk stretches every hour

### Micro-Workouts
Three 10-minute sessions are as effective as one 30-minute workout.

**Quick Routines:**
- Morning: 10 minutes stretching or yoga
- Lunch: 10 minutes brisk walking
- Evening: 10 minutes bodyweight exercises

### Make Activity Social
- Walking meetings
- Active hobbies with friends
- Join sports leagues
- Weekend hiking or biking

## Stress Management for Professionals

### Set Boundaries
- No emails after certain hours
- Schedule personal time like meetings
- Learn to delegate
- Say no to non-essential commitments

### Quick Stress Reducers
- 4-7-8 breathing (inhale 4, hold 7, exhale 8)
- 5-minute desk meditation
- Listen to calming music
- Step outside for fresh air

### End-of-Day Transition
Create a ritual to separate work and personal time:
- Change clothes
- Short walk
- Brief meditation
- Connect with loved ones

## Sleep Optimization

Quality sleep is non-negotiable for performance and health.

### Sleep Strategies for Busy People
- Consistent wake time (even weekends)
- 90-minute wind-down routine
- Cool, dark bedroom
- No screens 1 hour before bed
- Consider magnesium supplement (consult doctor)

### Power Napping
If sleep-deprived, a 20-minute nap boosts:
- Alertness
- Performance
- Mood
- Memory

Set alarm - do not exceed 30 minutes.

## Mental Health Maintenance

### Weekly Check-In
Spend 15 minutes reflecting:
- What went well?
- What challenges did I face?
- What do I need next week?
- Am I living according to my values?

### Social Connection
Schedule it:
- Weekly catch-up with friend or family
- Monthly social event
- Join professional or hobby groups

### Professional Support
Do not wait until crisis. Regular therapy or coaching:
- Prevents problems
- Optimizes performance
- Provides objective perspective

BodyWise makes it easy with flexible scheduling and virtual sessions.

## The 80/20 Rule

Aim for 80% consistency, not perfection. Life happens - what matters is getting back on track.

## Start Small

Choose ONE habit to focus on for 30 days:
- 20 minutes daily movement
- 7 hours sleep minimum
- One serving vegetables per meal
- 10 minutes daily stress management

Once established, add another.

## Remember

Your health enables everything else - career success, relationships, enjoyment of life. It deserves prioritization, not leftover time.

You cannot pour from an empty cup. Take care of yourself - it is not selfish, it is necessary.',
  'health_professional',
  2,
  1,
  'Wellness',
  '["wellness", "healthy habits", "work-life balance", "busy professionals", "lifestyle"]',
  NULL,
  'approved',
  1,
  1,
  datetime('now', '-8 days'),
  672,
  datetime('now', '-14 days'),
  datetime('now', '-8 days')
);
