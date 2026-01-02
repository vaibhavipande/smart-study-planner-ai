# 📚 Smart Study Planner

A full-stack web application built with **Next.js**, **MongoDB**, and **NextAuth** that helps students create personalized, AI-powered study plans. Features user authentication, database persistence, and an intelligent study plan generator.

## 🚀 Features

### Core Features
- ✅ **User Authentication** - Secure signup and login with NextAuth
- ✅ **Database Integration** - MongoDB with Mongoose for data persistence
- ✅ **AI-Powered Study Plans** - Real OpenAI GPT-4 integration with smart fallback
- ✅ **User Dashboard** - Track and manage all your study plans
- ✅ **Progress Tracking** - Mark steps as complete and track overall progress
- ✅ **Study Statistics** - View analytics and insights on your learning journey
- ✅ **Plan Management** - Create, view, and delete study plans
- ✅ **Detailed Plan View** - Interactive step-by-step study plans with progress tracking

### AI Features
- 🤖 **OpenAI GPT-4 Integration** - Generate intelligent, personalized study plans
- 📝 **Smart Fallback** - Works without API key using intelligent mock generation
- 🎯 **Customizable Plans** - Set difficulty level, duration, and daily study hours
- 📊 **Time Estimation** - Get estimated hours for each study plan
- 🧠 **Adaptive Learning** - Plans adapt to beginner, intermediate, or advanced levels

### UI/UX Features
- 🎨 **Modern UI** - Beautiful, responsive design with Tailwind CSS
- 🌙 **Dark Mode** - Full dark mode support
- 📱 **Mobile Responsive** - Works perfectly on all devices
- ⚡ **Fast Loading** - Optimized performance with loading states
- ✨ **Smooth Animations** - Polished user experience

### Technical Features
- 🔒 **Type Safety** - Full TypeScript support
- 🛡️ **Error Handling** - Comprehensive error handling and validation
- 🔐 **Security** - Password hashing, input validation, and secure sessions
- 📈 **Progress Analytics** - Real-time progress tracking and statistics

## 🛠 Tech Stack

### Frontend
- **Next.js 16** (App Router)
- **React 19**
- **TypeScript**
- **Tailwind CSS 4**

### Backend
- **Next.js API Routes**
- **NextAuth** (Authentication)
- **Mongoose** (MongoDB ODM)

### Database
- **MongoDB** (with connection pooling)

### Security
- **bcrypt** (Password hashing)
- **JWT** (Session management)

## 📋 Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-study-planner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_SECRET=your-secret-key
   NEXTAUTH_URL=http://localhost:3000
   ```
   
   See [ENV_SETUP.md](./ENV_SETUP.md) for detailed instructions.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
smart-study-planner/
├── src/
│   ├── app/
│   │   ├── api/              # API routes
│   │   │   ├── auth/         # NextAuth configuration
│   │   │   ├── signup/       # User registration
│   │   │   ├── generate-plan/# Study plan generation
│   │   │   └── test-db/      # Database test endpoint
│   │   ├── dashboard/        # Protected dashboard
│   │   ├── login/            # Login page
│   │   ├── signup/           # Signup page
│   │   └── page.tsx          # Home page
│   ├── lib/
│   │   ├── db.ts            # Database connection
│   │   ├── auth.ts          # Auth utilities
│   │   └── ai/              # AI plan generator
│   ├── models/              # Mongoose models
│   │   ├── User.ts
│   │   └── StudyPlan.ts
│   └── types/               # TypeScript definitions
├── public/                  # Static assets
└── package.json
```

## 🔐 Authentication

The app uses NextAuth with credentials provider:
- Secure password hashing with bcrypt
- JWT-based sessions
- Protected routes
- Automatic session management

## 🗄️ Database Models

### User
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `createdAt` / `updatedAt` - Timestamps

### StudyPlan
- `userId` - Reference to User
- `topic` - Study topic
- `title` - Plan title
- `duration` - Plan duration
- `steps` - Array of study steps
- `source` - Plan source (e.g., "mock-ai")
- `createdAt` / `updatedAt` - Timestamps

## 🚦 API Routes

### Authentication
- `POST /api/signup` - Create a new user account
- `POST /api/auth/[...nextauth]` - NextAuth authentication endpoints

### Study Plans
- `POST /api/generate-plan` - Generate a new AI-powered study plan
  ```json
  {
    "topic": "React",
    "dailyHours": 2,
    "difficulty": "intermediate",
    "duration": 8
  }
  ```
- `GET /api/study-plans` - Get all study plans for the current user
- `GET /api/study-plans/[id]` - Get a specific study plan
- `PATCH /api/study-plans/[id]` - Update study plan progress
  ```json
  {
    "stepIndex": 0,
    "completed": true,
    "notes": "Optional notes"
  }
  ```
- `DELETE /api/study-plans/[id]` - Delete a study plan

### Utilities
- `GET /api/test-db` - Test database connection

## 🎨 Features in Detail

### AI-Powered Study Plan Generation
- **Enter any topic** - React, Machine Learning, Big Data, Java, JavaScript, or any subject
- **Customize your plan** - Set difficulty (beginner/intermediate/advanced), duration (weeks), and daily study hours
- **Intelligent generation** - Uses OpenAI GPT-4 for detailed, structured learning paths
- **Smart fallback** - Works without API key using intelligent mock generation
- **Time estimates** - Get estimated total hours for your study plan
- **Auto-save** - Plans are automatically saved to your account

### User Dashboard
- **Overview statistics** - See total plans, completed plans, in-progress plans, and average progress
- **Plan management** - View all your study plans in a beautiful grid layout
- **Quick actions** - Generate new plans or manage existing ones
- **Progress tracking** - Visual progress bars and completion status

### Study Plan Details
- **Step-by-step view** - Interactive list of all study steps
- **Progress tracking** - Mark individual steps as complete
- **Completion dates** - See when you completed each step
- **Visual feedback** - Completed steps are highlighted in green
- **Delete functionality** - Remove plans you no longer need

### Progress Analytics
- **Overall progress** - Percentage completion for each plan
- **Step tracking** - See how many steps you've completed
- **Statistics dashboard** - View your learning statistics at a glance

## 🔒 Security Features

- Password validation (minimum 6 characters)
- Email validation
- Password hashing with bcrypt (12 rounds)
- Protected API routes
- Secure session management
- Input sanitization

## 🧪 Testing

Test database connection:
```bash
curl http://localhost:3000/api/test-db
```

## 📝 Environment Variables

See [ENV_SETUP.md](./ENV_SETUP.md) for complete environment variable setup instructions.

## 🚀 Deployment

1. Set up MongoDB Atlas (or use your MongoDB instance)
2. Configure environment variables in your hosting platform
3. Build the project: `npm run build`
4. Start the production server: `npm start`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

---

Built with ❤️ using Next.js and MongoDB












