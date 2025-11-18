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

**Privacy-Preserving Design:**
- Messages processed in real-time only
- No database storage
- Server-side API key security
- Session-based conversations only
- Automatic timeout after inactivity

#### Frequently Asked Questions

**Q: Can anyone see my chat messages?**  
A: No. Messages are not saved anywhere and are only processed temporarily to generate responses.

**Q: What happens to my conversation history?**  
A: There is no conversation history. Each chat session is independent and temporary.

**Q: Is the AI monitored or reviewed by staff?**  
A: No. Conversations are not monitored, logged, or reviewed by anyone.

**Q: Can I download my chat history?**  
A: Since conversations aren't saved, there's nothing to download.

**Q: How does this differ from professional consultations?**  
A: AI provides general guidance and support. Professional consultations offer personalized care, diagnosis, and treatment plans.

**Q: What if I need immediate help?**  
A: For emergencies, always contact:
- Emergency Services: 911
- Crisis Hotline: 988 (Suicide & Crisis Lifeline)
- Campus Security/Counseling (if on campus)

### Educational Resources

Access wellness and mental health resources:

1. **Browse Articles**
   ```
   Dashboard >>> Education
   ```

2. **Article Topics**
   - Body positivity and self-acceptance
   - Mental wellness strategies
   - Stress management techniques
   - Healthy lifestyle tips
   - Student wellness guides
   - Nutrition and fitness advice

3. **Read & Learn**
   - Click on any article to read full content
   - Articles created by verified health professionals
   - Evidence-based information from trusted sources
   - View publication dates and author information

> **Note**: Educational content is stored in the `articles` table. Only articles that have been approved by institutional admins and marked as published will appear in the education section.

### Inviting Friends

Share consultation access:

1. **Select Consultation**
2. Click "Invite Friend"
3. Enter friend's email
4. They receive invitation link
5. Both can join the session

### Profile Management

Update your information:

```
Dashboard >>> Profile Settings
```

**Editable Fields:**
- Username
- Email
- Phone number
- Profile picture
- Emergency contact

---

## Health Professional Guide

### Dashboard Overview

Your professional dashboard includes:
- Today's consultations
- Weekly schedule overview
- Patient statistics
- Performance metrics

### Setting Up Your Profile

1. **Complete Profile**
   ```
   Dashboard → Profile
   ```

2. **Add Information**
   - Professional title
   - Specializations
   - Qualifications/certifications
   - Bio (max 500 characters)
   - Profile photo
   - Years of experience

3. **Professional Details**
   - License number
   - Professional associations
   - Languages spoken
   - Therapeutic approaches

### Managing Availability

#### Set Weekly Schedule

1. **Configure Schedule**
   ```
   Dashboard >>> Schedule >>> Availability
   ```

2. **Set Working Days**
   - Select days of the week
   - Set start time (e.g., 09:00)
   - Set end time (e.g., 17:00)

3. **Configure Slots**
   - Consultation duration (30, 45, or 60 min)
   - Break between sessions
   - Maximum daily consultations

4. **Save Changes**
   - Slots generated automatically
   - Students can now book

#### Block Specific Times

1. Go to Schedule Calendar
2. Click time slot to block
3. Select "Mark Unavailable"
4. Add reason (optional)

#### View Bookings

```
Dashboard >>> Schedule >>> Bookings
```

**Information Shown:**
- Patient name
- Date and time
- Consultation status
- Patient notes
- Meeting link

### Managing Consultations

#### Before Consultation

1. **Review Patient Notes**
   - Check consultation reason
   - Review any previous sessions
   - Prepare materials if needed

2. **Receive Reminders**
   - Email 24 hours before
   - Email 1 hour before
   - Desktop notification (if enabled)

#### During Consultation

1. **Join Meeting**
   ```
   Dashboard >> Today's Sessions >>> Join
   ```

2. **Video Call Features**
   - Screen sharing
   - Text chat backup
   - Recording (with consent)
   - Whiteboard

3. **Take Notes**
   - Use consultation notes section
   - Private notes (not shared with patient)
   - Recommendations for follow-up

#### After Consultation

1. **Update Status**
   - Mark as completed
   - Add session summary
   - Recommend follow-up if needed

2. **View Patient Feedback**
   - Check reviews
   - Respond to feedback
   - Track ratings

### Patient Management

#### View Patient List

```
Dashboard >>> Patients
```

**Patient Information:**
- Name and contact
- Total consultations
- Last session date
- Consultation history

#### Consultation History

1. Click on patient name
2. View all past sessions
3. Review notes and outcomes
4. Track progress over time

### Performance Metrics

Track your performance:

```
Dashboard >>> Analytics
```

**Metrics Include:**
- Total consultations
- Average rating
- Response time
- Completion rate
- Peak booking times
- Patient retention

### Notifications

Manage notification preferences:

```
Dashboard >>> Settings >>> Notifications
```

**Options:**
- Email notifications (24h, 1h reminders)
- New booking alerts
- Cancellation notifications
- Review notifications

---

## Institution Admin Guide

### Dashboard Overview

Institution dashboard shows:
- Active health professionals
- Total students served
- Upcoming sessions
- System usage

### Managing Health Professionals

#### Onboard New Professional

1. **Add Professional**
   ```
   Dashboard >>> Doctors >>> Add Doctor
   ```

2. **Enter Details**
   - Email address
   - Name
   - Specialization
   - Employment status

3. **Send Invitation**
   - System sends setup email
   - Professional completes profile
   - You approve activation

#### View Professional List

```
Dashboard >>> Doctors
```

**Actions Available:**
- View profile
- View schedule
- View consultations
- Suspend/activate account

### Institution Settings

Configure your institution:

```
Dashboard >>> Institution Settings
```

**Settings:**
- Institution name
- Location
- Contact information
- Logo upload
- Working hours
- Policies

### Viewing Reports

Access institutional reports:

```
Dashboard >>> Reports
```

**Available Reports:**
- Monthly consultation statistics
- Professional utilization
- Student engagement
- Peak usage times
- Satisfaction scores

### Document Management

Manage institutional documents:

```
Dashboard >>> Documents
```

**Document Types:**
- Policies and procedures
- Consent forms
- Privacy policy
- Terms of service

---

## System Admin Guide

### Dashboard Overview

System admin dashboard includes:
- Platform health metrics
- Active users
- System performance
- Content moderation queue

### User Management

#### View All Users

```
Admin Dashboard >>> Users
```

**User Actions:**
- View details
- Edit information
- Suspend account
- Delete user (careful!)
- Reset password

#### User Roles

- **Patient** - Standard user
- **Health Professional** - Service provider
- **Institution Admin** - Facility manager
- **System Admin** - Platform administrator

### Institution Management

#### Add Institution

```
Admin Dashboard >>> Institutions >>> Add New
```

**Required Information:**
- Institution name
- Type (University, College, etc.)
- Location
- Contact person
- Email and phone

#### Verify Institution

1. Review submitted details
2. Check credentials
3. Approve or request changes
4. Institution becomes active

### Content Moderation

#### Approve Blog Posts

```
Admin Dashboard >>> Content >>> Blogs >>> Pending
```

1. Review article content
2. Check for appropriateness
3. Approve or reject
4. Provide feedback if rejected

#### Approve Testimonials

```
Admin Dashboard >>> Content >>> Testimonials >>> Pending
```

1. Read testimonial
2. Verify authenticity
3. Approve for public display
4. Feature best testimonials

### System Monitoring

#### Performance Metrics

```
Admin Dashboard >>> System >>> Performance
```

**Metrics:**
- Response time
- Database performance
- API latency
- Error rates

#### Activity Logs

```
Admin Dashboard >>> Activity Logs
```

**Log Information:**
- User actions
- System events
- Error logs
- Security events

### Analytics

View platform-wide analytics:

```
Admin Dashboard >>> Analytics
```

**Data Points:**
- Total users by type
- Daily active users
- Consultation trends
- Growth metrics
- Geographic distribution

---

## Features Reference

### Email Notifications

Automatic email notifications for:

**For Patients:**
- Booking confirmation
- 24-hour reminder
- 1-hour reminder
- Cancellation notice
- Review request

**For Professionals:**
- New booking alert
- 24-hour reminder
- 1-hour reminder
- Cancellation notice
- Review received

### Video Conferencing

**Powered by Jitsi Meet:**
- No downloads required
- Browser-based
- End-to-end encryption
- Screen sharing
- Recording capability
- Mobile support

**Requirements:**
- Modern web browser
- Stable internet connection
- Camera and microphone
- Quiet environment

### Review System

**Rating Scale:**
- ⭐⭐⭐⭐⭐ Excellent
- ⭐⭐⭐⭐ Very Good
- ⭐⭐⭐ Good
- ⭐⭐ Fair
- ⭐ Poor

**Review Guidelines:**
- Be honest and constructive
- Focus on experience
- Respect privacy
- No personal attacks
- Helpful to other users

---

## FAQ

### General Questions

**Q: Is BodyWise free to use?**
A: Yes.

**Q: Is my data secure?**
A: Yes, we use industry-standard encryption and comply with data protection regulations.

**Q: Can I use BodyWise on mobile?**
A: Yes, the platform is fully responsive and works on mobile browsers.

### Booking Questions

**Q: How far in advance can I book?**
A: Up to 30 days in advance.

**Q: Can I book multiple consultations?**
A: Yes, but maximum 2 per day.

**Q: What if I need to cancel?**
A: Cancel through your dashboard. Try to give 24 hours notice.

**Q: Can I reschedule instead of cancelling?**
A: Yes, cancel and book a new time slot.

### Consultation Questions

**Q: How long are consultations?**
A: Typically 30-60 minutes, set by the professional.

**Q: What if I'm late?**
A: Join as soon as possible. Session may be shortened.

**Q: Can I record the session?**
A: Only with explicit consent from the professional.

**Q: What if technical issues occur?**
A: Contact support immediately. We can reschedule.

### Privacy Questions

**Q: Are consultations confidential?**
A: Yes, bound by patient confidentiality.

### Technical Questions

**Q: Which browsers are supported?**
A: Chrome, Firefox, Safari, Edge (latest versions).

**Q: Do I need to install anything?**
A: No, everything works in your browser.

**Q: What internet speed do I need?**
A: Minimum 1 Mbps, recommended 3 Mbps or higher.

---

## Getting Help

### Support Channels

- **Email**: p.dusenge@alustudent.com
- **Live Chat**: Available in app (Mon-Fri, 9 AM - 5 PM)
- **Documentation**: [docs](../docs/)
- **Bug Reports**: [GitHub Issues](https://github.com/Divine-kuzo/BodyWise/issues)

### Emergency Support

For urgent mental health crises:
- Call your local emergency services
- Contact campus security
- Use crisis hotlines in your area

BodyWise is for scheduled support, not emergency intervention.

---

## Appendix

### Browser Requirements

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
---

For technical documentation, see [API Documentation](./API_DOCUMENTATION.md).
