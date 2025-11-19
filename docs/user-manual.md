# BodyWise User Manual

Here's a complete guide to using the BodyWise mental health platform.

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Patient Guide](#patient-guide)
4. [Health Professional Guide](#health-professional-guide)
5. [Institution Admin Guide](#institution-admin-guide)
6. [System Admin Guide](#system-admin-guide)
7. [Features Reference](#features-reference)
8. [FAQ](#faq)

---

## Introduction

### What is BodyWise?

BodyWise is a comprehensive mental health platform that connects students with qualified mental health professionals. It provides:

- Easy appointment booking
- Secure video consultations
- Educational resources
- Community testimonials
- Institutional support management

### Who Can Use BodyWise?

- **Students/Patients** - Book consultations with health professionals
- **Health Professionals** - Manage schedules and provide consultations
- **Institution Admins** - Manage institutional health services
- **System Admins** - Oversee platform operations

---

## Getting Started

### Creating an Account

1. **Navigate to Signup**
   - Go to [http://localhost:3000/signup](http://localhost:3000/signup)
   - Select your user type

2. **Choose User Type**
   - **Patient** - For students seeking support
   - **Health Professional** - For mental health practitioners
   - **Institution Admin** - For institutional managers

3. **Fill Registration Form**
   - Enter required information
   - Create a strong password
   - Accept terms and conditions

4. **Verify Email**
   - Check your email for verification link
   - Click to verify your account

### Logging In

1. Go to [http://localhost:3000/login](http://localhost:3000/login)
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to your dashboard

### Forgot Password?

1. Click "Forgot Password?" on login page
2. Enter your email address
3. Check email for reset link
4. Create new password

---

## Patient Guide

### Dashboard Overview

Your patient dashboard shows:
- Upcoming consultations
- Recent activity
- Quick access to book appointments
- Educational resources

### Finding a Health Professional

1. **Browse Professionals**
   ```
   Dashboard >>> Find Doctors
   ```

2. **Filter Options**
   - Specialization (e.g., Anxiety, Depression)
   - Availability
   - Rating
   - Institution

3. **View Profile**
   - Click on any professional to see:
     - Bio and qualifications
     - Specializations
     - Years of experience
     - Patient reviews
     - Average rating

### Booking a Consultation

1. **Select Professional**
   - Find your preferred health professional
   - Click "Book Appointment"

2. **Choose Time Slot**
   - View available slots
   - Select date and time
   - Maximum 2 consultations per day

3. **Confirm Booking**
   - Review details
   - Add consultation notes (optional)
   - Click "Confirm Booking"

4. **Receive Confirmation**
   - Email confirmation sent immediately
   - Calendar invite included
   - Jitsi meeting link provided

### Managing Consultations

#### View Your Consultations
```
Dashboard >>> My Consultations
```

**Consultation Statuses:**
- **Pending** - Awaiting confirmation
- **Confirmed** - Scheduled and confirmed
- **Completed** - Session finished
- **Cancelled** - Cancelled by either party

#### Join Video Call

1. **Access Meeting**
   - Go to consultation details
   - Click "Join Meeting" 15 minutes before
   - Ensure camera and microphone work

2. **During Consultation**
   - Professional will join at scheduled time
   - Use chat if audio issues occur
   - Session lasts scheduled duration

#### Cancel Consultation

1. Go to consultation details
2. Click "Cancel Consultation"
3. Provide reason (helps improve service)
4. Confirm cancellation

> **Note**: Cancel at least 24 hours in advance when possible

### Leaving Reviews

After a completed consultation:

1. **Navigate to Consultation**
   ```
   My Consultations → Select Completed Session
   ```

2. **Write Review**
   - Rate 1-5 stars
   - Write detailed feedback
   - Be respectful and constructive

3. **Submit Review**
   - Reviews help other students
   - Professionals can respond

### AI Health Coach Chat

**Access Your Private AI Health Coach:**

```
Dashboard >>> AI Chat
```

#### Privacy First: Your Conversations Are PRIVATE

**Important Privacy Notice:**

BodyWise's AI Health Coach is designed with your privacy as the top priority:

 **Zero Data Persistence**
- Your messages are **NOT saved** to any database
- Conversations are completely **ephemeral** (temporary)
- No chat history is stored or logged
- No conversation tracking or analytics

 **Complete Privacy**
- Each conversation is private and isolated
- No data shared with third parties
- No user profiling or behavioral tracking
- Messages disappear when you close the chat

 **What This Means for You**
- Feel free to discuss sensitive topics openly
- Your conversations remain confidential
- No permanent record of what you share
- Start fresh every time you visit

> **You'll see this notice in the chat:**  
> "Your messages are NOT saved. This is a temporary, private conversation."

#### How to Use AI Chat

1. **Start a Conversation**
   - Navigate to AI Chat from your dashboard
   - Read the privacy notice
   - Type your message in the chat box
   - Press Enter or click Send

2. **What You Can Ask**
   - General health and wellness questions
   - Mental health support and guidance
   - Body positivity and self-esteem
   - Stress management techniques
   - Study and lifestyle tips
   - Nutrition and exercise advice
   - Sleep hygiene recommendations

3. **AI Capabilities**
   - Provides evidence-based guidance
   - Culturally sensitive responses
   - Non-judgmental support
   - Real-time streaming responses
   - Markdown formatting (bold, lists, etc.)

#### Important Limitations

**The AI Chat is NOT a replacement for professional care:**

- **Emergency Situations**: If you're in crisis, contact emergency services (911) or crisis hotline immediately
- **Medical Diagnosis**: AI cannot diagnose medical conditions
- **Prescriptions**: Cannot prescribe medications
- **Professional Care**: For ongoing mental health concerns, book a consultation with our licensed professionals

**When AI Will Refer You:**
- Suicidal thoughts or self-harm ideation
- Severe mental health crises
- Medical emergencies
- Situations requiring professional intervention

#### Best Practices

 **Do:**
- Ask general health and wellness questions
- Seek advice on managing stress or anxiety
- Request study tips and lifestyle guidance
- Explore body positivity topics
- Discuss concerns openly (remember: no data saved!)

 **Don't:**
- Share personal identifying information (though not saved, best practice)
- Rely solely on AI for serious mental health issues
- Use instead of scheduled professional consultations
- Expect medical diagnosis or prescriptions

#### Technical Information

**Powered by Advanced AI:**
- Uses Groq API with state-of-the-art language models
- Default model: Llama 3.3 (70 billion parameters)
- Real-time streaming responses (200-500ms)
- Supports up to 8,192 tokens per conversation
