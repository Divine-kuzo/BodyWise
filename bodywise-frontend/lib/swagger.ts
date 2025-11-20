/**
 * @swagger
 * components:
 *   securitySchemes:
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: token
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         email:
 *           type: string
 *           format: email
 *         role:
 *           type: string
 *           enum: [patient, health_professional, institutional_admin, system_admin]
 *         is_verified:
 *           type: boolean
 *         is_active:
 *           type: boolean
 *     Patient:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_id:
 *           type: integer
 *         username:
 *           type: string
 *         full_name:
 *           type: string
 *         date_of_birth:
 *           type: string
 *           format: date
 *         gender:
 *           type: string
 *         phone:
 *           type: string
 *     HealthProfessional:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         full_name:
 *           type: string
 *         specialization:
 *           type: string
 *         bio:
 *           type: string
 *         years_of_experience:
 *           type: integer
 *         phone:
 *           type: string
 *         average_rating:
 *           type: number
 *           format: float
 *         total_reviews:
 *           type: integer
 *         institution_name:
 *           type: string
 *     Consultation:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         patient_id:
 *           type: integer
 *         professional_id:
 *           type: integer
 *         scheduled_date:
 *           type: string
 *           format: date
 *         scheduled_time:
 *           type: string
 *           format: time
 *         duration_minutes:
 *           type: integer
 *           default: 30
 *         meeting_link:
 *           type: string
 *         status:
 *           type: string
 *           enum: [scheduled, completed, cancelled, no_show]
 *     TimeSlot:
 *       type: object
 *       properties:
 *         start_time:
 *           type: string
 *           example: "09:00"
 *         end_time:
 *           type: string
 *           example: "09:30"
 *         is_booked:
 *           type: boolean
 *     AvailabilitySchedule:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         professional_id:
 *           type: integer
 *         day_of_week:
 *           type: integer
 *           minimum: 0
 *           maximum: 6
 *           description: "0=Sunday, 1=Monday, ..., 6=Saturday"
 *         start_time:
 *           type: string
 *           example: "09:00"
 *         end_time:
 *           type: string
 *           example: "17:00"
 *         is_available:
 *           type: boolean
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *     BlogArticle:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         author_type:
 *           type: string
 *           enum: [health_professional, institutional_admin]
 *         author_name:
 *           type: string
 *         category:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         thumbnail_url:
 *           type: string
 *         approval_status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         views_count:
 *           type: integer
 *         created_at:
 *           type: string
 *     Testimonial:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         user_name:
 *           type: string
 *         content:
 *           type: string
 *         rating:
 *           type: integer
 *           minimum: 1
 *           maximum: 5
 *         approval_status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *         is_featured:
 *           type: boolean
 *         created_at:
 *           type: string
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags: [Authentication]
 *     summary: User login
 *     description: Authenticate user and receive JWT token in cookie
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: patient1@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 token:
 *                   type: string
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags: [Authentication]
 *     summary: User registration
 *     description: Register a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               role:
 *                 type: string
 *                 enum: [patient, health_professional, institutional_admin]
 *               full_name:
 *                 type: string
 *               username:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input or email already exists
 */

/**
 * @swagger
 * /api/patient/doctors:
 *   get:
 *     tags: [Patient]
 *     summary: Get all active doctors
 *     description: Retrieve list of all active health professionals
 *     responses:
 *       200:
 *         description: List of doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HealthProfessional'
 */

/**
 * @swagger
 * /api/patient/available-slots:
 *   get:
 *     tags: [Patient]
 *     summary: Get available time slots
 *     description: Get available 30-minute time slots for a specific doctor on a specific date
 *     parameters:
 *       - in: query
 *         name: professional_id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Health professional ID
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Date in YYYY-MM-DD format
 *         example: "2025-11-14"
 *     responses:
 *       200:
 *         description: Available time slots
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/TimeSlot'
 *       400:
 *         description: Missing required parameters
 */

/**
 * @swagger
 * /api/patient/consultations:
 *   post:
 *     tags: [Patient]
 *     summary: Book a consultation
 *     description: Create a new consultation appointment (max 2 per day per patient)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - professional_id
 *               - scheduled_date
 *               - scheduled_time
 *             properties:
 *               professional_id:
 *                 type: integer
 *               scheduled_date:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-14"
 *               scheduled_time:
 *                 type: string
 *                 example: "10:00"
 *     responses:
 *       201:
 *         description: Consultation booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 consultation:
 *                   $ref: '#/components/schemas/Consultation'
 *       403:
 *         description: Unauthorized - Patient access required
 *       409:
 *         description: Conflict - Time slot already booked or daily limit reached
 *   get:
 *     tags: [Patient]
 *     summary: Get patient consultations
 *     description: Retrieve all consultations for the logged-in patient
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled, no_show]
 *         description: Filter by status
 *     responses:
 *       200:
 *         description: List of consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consultations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Consultation'
 */

/**
 * @swagger
 * /api/professional/consultations:
 *   get:
 *     tags: [Professional]
 *     summary: Get doctor consultations
 *     description: Retrieve all consultations for the logged-in health professional
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [scheduled, completed, cancelled, no_show]
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 consultations:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Consultation'
 *       403:
 *         description: Unauthorized - Health professionals only
 */

/**
 * @swagger
 * /api/doctor/schedule:
 *   get:
 *     tags: [Doctor Schedule]
 *     summary: Get doctor schedules
 *     description: Retrieve all availability schedules for the logged-in doctor
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schedules
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 schedules:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AvailabilitySchedule'
 *   post:
 *     tags: [Doctor Schedule]
 *     summary: Create availability schedule
 *     description: Add a new availability schedule for the doctor
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - day_of_week
 *               - start_time
 *               - end_time
 *             properties:
 *               day_of_week:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 6
 *                 description: "0=Sunday, 1=Monday, ..., 6=Saturday"
 *               start_time:
 *                 type: string
 *                 example: "09:00"
 *               end_time:
 *                 type: string
 *                 example: "17:00"
 *     responses:
 *       201:
 *         description: Schedule created successfully
 *       400:
 *         description: Invalid input or time conflict
 *   delete:
 *     tags: [Doctor Schedule]
 *     summary: Delete availability schedule
 *     description: Remove an availability schedule
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Schedule ID
 *     responses:
 *       200:
 *         description: Schedule deleted successfully
 *       404:
 *         description: Schedule not found
 */

/**
 * @swagger
 * /api/cron/email-reminders:
 *   post:
 *     tags: [Cron Jobs]
 *     summary: Trigger email reminders
 *     description: Manually trigger email reminder checks (24h and 1h reminders)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reminders processed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 reminders24h:
 *                   type: integer
 *                 reminders1h:
 *                   type: integer
 *       401:
 *         description: Unauthorized - Invalid CRON_SECRET
 *   get:
 *     tags: [Cron Jobs]
 *     summary: Trigger email reminders (GET)
 *     description: Alternative GET endpoint for cron services
 *     parameters:
 *       - in: query
 *         name: secret
 *         required: true
 *         schema:
 *           type: string
 *         description: CRON_SECRET value
 *     responses:
 *       200:
 *         description: Reminders processed
 */

/**
 * @swagger
 * /api/professional/profile:
 *   get:
 *     tags: [Professional]
 *     summary: Get professional profile
 *     description: Retrieve the logged-in professional's profile
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Professional profile
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 full_name:
 *                   type: string
 *                 specialization:
 *                   type: string
 *                 bio:
 *                   type: string
 *                 years_of_experience:
 *                   type: integer
 *                 phone:
 *                   type: string
 *                 average_rating:
 *                   type: number
 *                 total_reviews:
 *                   type: integer
 *                 institution_id:
 *                   type: integer
 *                 institution_name:
 *                   type: string
 *   put:
 *     tags: [Professional]
 *     summary: Update professional profile
 *     description: Update the logged-in professional's profile information
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               specialization:
 *                 type: string
 *               bio:
 *                 type: string
 *               years_of_experience:
 *                 type: integer
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 */

/**
 * @swagger
 * /api/chat:
 *   post:
 *     tags: [Chat]
 *     summary: AI-powered chat
 *     description: Send messages to BodyWise AI assistant for mental health support and guidance. Returns streaming text response.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - messages
 *             properties:
 *               messages:
 *                 type: array
 *                 description: Array of chat messages in conversation history
 *                 items:
 *                   type: object
 *                   properties:
 *                     role:
 *                       type: string
 *                       enum: [user, assistant, system]
 *                       description: Message sender role
 *                     content:
 *                       type: string
 *                       description: Message text content
 *                 example:
 *                   - role: "user"
 *                     content: "I've been feeling anxious lately. What can I do?"
 *               modelId:
 *                 type: string
 *                 description: Optional AI model selection (defaults to system default model)
 *                 example: "gpt-4"
 *     responses:
 *       200:
 *         description: Streaming text response from AI
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               description: AI-generated response stream
 *               example: "I understand you're feeling anxious. Here are some strategies that might help..."
 *       500:
 *         description: Chat processing error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to process chat request. Please try again."
 */

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     tags: [Users]
 *     summary: Get current user profile
 *     description: Retrieve the logged-in user's profile information based on their role
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                     profile:
 *                       type: object
 *                       description: Role-specific profile data
 *       401:
 *         description: Unauthorized
 *   put:
 *     tags: [Users]
 *     summary: Update user profile
 *     description: Update the logged-in user's profile information
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: For patients only
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       409:
 *         description: Username already taken
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Admin]
 *     summary: Get all users
 *     description: Retrieve all users with pagination and role filtering (System Admin only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [patient, health_professional, institutional_admin, system_admin]
 *         description: Filter by user role
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 counts:
 *                   type: object
 *                   properties:
 *                     patient:
 *                       type: integer
 *                     health_professional:
 *                       type: integer
 *                     institutional_admin:
 *                       type: integer
 *                     system_admin:
 *                       type: integer
 *       403:
 *         description: Unauthorized - System Admin access required
 */

/**
 * @swagger
 * /api/admin/analytics:
 *   get:
 *     tags: [Admin]
 *     summary: Get platform analytics
 *     description: Retrieve comprehensive analytics including user growth, registrations, and consultation statistics
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: integer
 *           default: 30
 *         description: Number of days for growth data
 *     responses:
 *       200:
 *         description: Analytics data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     userCounts:
 *                       type: object
 *                       properties:
 *                         patients:
 *                           type: integer
 *                         health_professionals:
 *                           type: integer
 *                         institutional_admins:
 *                           type: integer
 *                         system_admins:
 *                           type: integer
 *                     growthData:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           date:
 *                             type: string
 *                           role:
 *                             type: string
 *                           count:
 *                             type: integer
 *                     activeUsers:
 *                       type: integer
 *                       description: Users active in last 7 days
 *                     consultationStats:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         scheduled:
 *                           type: integer
 *                         completed:
 *                           type: integer
 *                         cancelled:
 *                           type: integer
 *       403:
 *         description: Unauthorized - System Admin access required
 */

/**
 * @swagger
 * /api/admin/performance:
 *   get:
 *     tags: [Admin]
 *     summary: Get system performance metrics
 *     description: Retrieve comprehensive system performance data including CPU, memory, disk, and database metrics
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance metrics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     cpu:
 *                       type: object
 *                       properties:
 *                         usage:
 *                           type: number
 *                         cores:
 *                           type: integer
 *                     memory:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         used:
 *                           type: integer
 *                         free:
 *                           type: integer
 *                         percent:
 *                           type: number
 *                     disk:
 *                       type: object
 *                       properties:
 *                         total:
 *                           type: integer
 *                         used:
 *                           type: integer
 *                         free:
 *                           type: integer
 *                         percent:
 *                           type: number
 *                     database:
 *                       type: object
 *                       properties:
 *                         size:
 *                           type: integer
 *                         sizeFormatted:
 *                           type: string
 *                         tableCounts:
 *                           type: object
 *                     server:
 *                       type: object
 *                       properties:
 *                         platform:
 *                           type: string
 *                         hostname:
 *                           type: string
 *                         uptime:
 *                           type: number
 *                         nodeVersion:
 *                           type: string
 *       403:
 *         description: Unauthorized - System Admin access required
 *   post:
 *     tags: [Admin]
 *     summary: Run system diagnostics
 *     description: Execute system health checks and diagnostics
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Diagnostics completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 diagnostics:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       check:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [passed, failed, warning]
 *                       message:
 *                         type: string
 *       403:
 *         description: Unauthorized - System Admin access required
 */

/**
 * @swagger
 * /api/admin/activity:
 *   get:
 *     tags: [Admin]
 *     summary: Get activity logs
 *     description: Retrieve system activity logs with pagination and filtering
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by activity type
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: integer
 *         description: Filter by user ID
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       activity_type:
 *                         type: string
 *                       details:
 *                         type: string
 *                       created_at:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       403:
 *         description: Unauthorized - System Admin access required
 */

/**
 * @swagger
 * /api/admin/admins:
 *   get:
 *     tags: [Admin]
 *     summary: Get all system admins
 *     description: Retrieve list of all system administrators
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System admins retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       full_name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       created_at:
 *                         type: string
 *       403:
 *         description: Unauthorized - System Admin access required
 *   post:
 *     tags: [Admin]
 *     summary: Create system admin
 *     description: Create a new system administrator account
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - full_name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *               full_name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: System admin created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid input
 *       409:
 *         description: Email already registered
 *       403:
 *         description: Unauthorized - System Admin access required
 */

/**
 * @swagger
 * /api/admin/institutions:
 *   get:
 *     tags: [Admin]
 *     summary: Get institutions
 *     description: Retrieve institutions with optional status filtering
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, verified, rejected]
 *           default: pending
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: Institutions retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       bio:
 *                         type: string
 *                       location:
 *                         type: string
 *                       verification_status:
 *                         type: string
 *                       certificate_url:
 *                         type: string
 *                       admin_name:
 *                         type: string
 *                       admin_email:
 *                         type: string
 *                       created_at:
 *                         type: string
 *       403:
 *         description: Unauthorized - System Admin access required
 */

/**
 * @swagger
 * /api/blog:
 *   get:
 *     tags: [Blog]
 *     summary: Get all approved blogs
 *     description: Retrieve published educational content (public access - no authentication required)
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogArticle'
 *                 pagination:
 *                   type: object
 *   post:
 *     tags: [Blog]
 *     summary: Create a new blog
 *     description: Submit a blog for approval (health professionals and institutional admins only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnail_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog submitted for approval
 *       403:
 *         description: Unauthorized - Only health professionals and institutional admins can create blogs
 */

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     tags: [Blog]
 *     summary: Get a single blog
 *     description: Retrieve a specific blog by ID (public access for approved blogs)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/BlogArticle'
 *       404:
 *         description: Blog not found
 *   put:
 *     tags: [Blog]
 *     summary: Update a blog
 *     description: Update own blog (only if pending or rejected)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnail_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated successfully
 *       403:
 *         description: Unauthorized or cannot update approved blogs
 *   delete:
 *     tags: [Blog]
 *     summary: Delete a blog
 *     description: Delete own blog
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/blog/my-blogs:
 *   get:
 *     tags: [Blog]
 *     summary: Get current user's blogs
 *     description: Retrieve all blogs created by the logged-in user
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogArticle'
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/blog/approve:
 *   get:
 *     tags: [Blog]
 *     summary: Get blogs pending approval
 *     description: Retrieve blogs awaiting approval (institutional admins see their professionals' blogs, system admins see institutional admins' blogs)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogArticle'
 *       403:
 *         description: Unauthorized - Admin access required
 *   post:
 *     tags: [Blog]
 *     summary: Approve or reject a blog
 *     description: Approve or reject a blog submission
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blog_id
 *               - action
 *             properties:
 *               blog_id:
 *                 type: integer
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *               rejection_reason:
 *                 type: string
 *                 description: Required if action is reject
 *     responses:
 *       200:
 *         description: Blog approved or rejected successfully
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     tags: [Testimonials]
 *     summary: Get all approved testimonials
 *     description: Retrieve approved user testimonials (public access - no authentication required)
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter featured testimonials only
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Testimonial'
 *   post:
 *     tags: [Testimonials]
 *     summary: Create a testimonial
 *     description: Submit a testimonial for approval (authenticated users only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Testimonial submitted for approval
 *       409:
 *         description: User already has a testimonial
 */

/**
 * @swagger
 * /api/testimonials/my-testimonial:
 *   get:
 *     tags: [Testimonials]
 *     summary: Get current user's testimonial
 *     description: Retrieve the logged-in user's testimonial
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's testimonial retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Testimonial'
 *   put:
 *     tags: [Testimonials]
 *     summary: Update user's testimonial
 *     description: Update own testimonial (only if pending or rejected)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Testimonial updated successfully
 *       400:
 *         description: Cannot update approved testimonials
 *   delete:
 *     tags: [Testimonials]
 *     summary: Delete user's testimonial
 *     description: Delete own testimonial
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
 */

/**
 * @swagger
 * /api/testimonials/approve:
 *   get:
 *     tags: [Testimonials]
 *     summary: Get testimonials pending approval
 *     description: Retrieve testimonials awaiting approval (System Admin only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Testimonial'
 *       403:
 *         description: Unauthorized - System Admin access required
 *   post:
 *     tags: [Testimonials]
 *     summary: Approve, reject, or feature a testimonial
 *     description: Manage testimonial approval and featured status (System Admin only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testimonial_id
 *               - action
 *             properties:
 *               testimonial_id:
 *                 type: integer
 *               action:
 *                 type: string
 *                 enum: [approve, reject, feature]
 *               rejection_reason:
 *                 type: string
 *                 description: Required if action is reject
 *               is_featured:
 *                 type: boolean
 *                 description: Required if action is feature
 *     responses:
 *       200:
 *         description: Testimonial managed successfully
 *       403:
 *         description: Unauthorized - System Admin access required
 */

/**
 * @swagger
 * /api/blog:
 *   get:
 *     tags: [Blog]
 *     summary: Get all approved blogs (public)
 *     description: Retrieve all approved and published educational content. No authentication required.
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogArticle'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *   post:
 *     tags: [Blog]
 *     summary: Create a new blog
 *     description: Create educational content (health professionals and institutional admins only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnail_url:
 *                 type: string
 *     responses:
 *       201:
 *         description: Blog submitted for approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     approval_status:
 *                       type: string
 *       403:
 *         description: Only health professionals and institutional admins can create blogs
 */

/**
 * @swagger
 * /api/blog/{id}:
 *   get:
 *     tags: [Blog]
 *     summary: Get single blog by ID (public)
 *     description: Retrieve a specific blog article. View count is incremented for approved articles.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Blog retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/BlogArticle'
 *       404:
 *         description: Blog not found
 *   put:
 *     tags: [Blog]
 *     summary: Update own blog
 *     description: Update blog if it is pending or rejected (author only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               category:
 *                 type: string
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *               thumbnail_url:
 *                 type: string
 *     responses:
 *       200:
 *         description: Blog updated and resubmitted for approval
 *       400:
 *         description: Cannot update approved blogs
 *       403:
 *         description: Can only update own blogs
 *   delete:
 *     tags: [Blog]
 *     summary: Delete own blog
 *     description: Delete a blog article (author only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Blog deleted successfully
 *       403:
 *         description: Can only delete own blogs
 */

/**
 * @swagger
 * /api/blog/my-blogs:
 *   get:
 *     tags: [Blog]
 *     summary: Get current user's blogs
 *     description: Retrieve all blogs created by the logged-in user
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogArticle'
 *       403:
 *         description: Only health professionals and institutional admins can have blogs
 */

/**
 * @swagger
 * /api/blog/approve:
 *   get:
 *     tags: [Blog]
 *     summary: Get pending blogs for approval
 *     description: Institutional admins see health professionals' blogs, system admins see institutional admins' blogs
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending blogs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/BlogArticle'
 *       403:
 *         description: Unauthorized - Admin access required
 *   post:
 *     tags: [Blog]
 *     summary: Approve or reject a blog
 *     description: Approve or reject blogs based on role and institution
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - blog_id
 *               - action
 *             properties:
 *               blog_id:
 *                 type: integer
 *               action:
 *                 type: string
 *                 enum: [approve, reject]
 *               rejection_reason:
 *                 type: string
 *                 description: Required if action is reject
 *     responses:
 *       200:
 *         description: Blog approved or rejected successfully
 *       400:
 *         description: Invalid input or rejection reason required
 *       403:
 *         description: Unauthorized
 */

/**
 * @swagger
 * /api/testimonials:
 *   get:
 *     tags: [Testimonials]
 *     summary: Get all approved testimonials (public)
 *     description: Retrieve approved testimonials. No authentication required.
 *     parameters:
 *       - in: query
 *         name: featured
 *         schema:
 *           type: boolean
 *         description: Filter for featured testimonials only
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Testimonial'
 *   post:
 *     tags: [Testimonials]
 *     summary: Submit a testimonial
 *     description: Create a new testimonial (one per user, any authenticated user)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       201:
 *         description: Testimonial submitted for approval
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     approval_status:
 *                       type: string
 *       409:
 *         description: User already has a testimonial
 */

/**
 * @swagger
 * /api/testimonials/my-testimonial:
 *   get:
 *     tags: [Testimonials]
 *     summary: Get current user's testimonial
 *     description: Retrieve the logged-in user's testimonial if it exists
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Testimonial retrieved successfully (or null if none exists)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   oneOf:
 *                     - $ref: '#/components/schemas/Testimonial'
 *                     - type: "null"
 *   put:
 *     tags: [Testimonials]
 *     summary: Update own testimonial
 *     description: Update testimonial if pending or rejected
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *     responses:
 *       200:
 *         description: Testimonial updated and resubmitted for approval
 *       400:
 *         description: Cannot update approved testimonials
 *   delete:
 *     tags: [Testimonials]
 *     summary: Delete own testimonial
 *     description: Delete the user's testimonial
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Testimonial deleted successfully
 *       404:
 *         description: No testimonial found to delete
 */

/**
 * @swagger
 * /api/testimonials/approve:
 *   get:
 *     tags: [Testimonials]
 *     summary: Get testimonials for approval
 *     description: Get testimonials by approval status (system admin only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *     responses:
 *       200:
 *         description: Testimonials retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Testimonial'
 *       403:
 *         description: Unauthorized - System Admin access required
 *   post:
 *     tags: [Testimonials]
 *     summary: Approve, reject, or feature testimonials
 *     description: Manage testimonial approval status and featured flag (system admin only)
 *     security:
 *       - cookieAuth: []
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - testimonial_id
 *               - action
 *             properties:
 *               testimonial_id:
 *                 type: integer
 *               action:
 *                 type: string
 *                 enum: [approve, reject, feature]
 *               rejection_reason:
 *                 type: string
 *                 description: Required if action is reject
 *               is_featured:
 *                 type: boolean
 *                 description: Required if action is feature
 *     responses:
 *       200:
 *         description: Action completed successfully
 *       400:
 *         description: Invalid input or missing required fields
 *       403:
 *         description: Unauthorized - System Admin access required
 */

export {};
