🏋️ ERND - Progressive Workout Tracker (MVP)
ERND is my first full-stack mobile-style fitness web app designed to help users track and log their workouts in detail. It includes features like user authentication, wokrout logging, history tracking, and more. This app provides an intuitive, clean, and responsive interface for fitness enthusiasts looking for a simple way to track their workouts.

VISIT ERND: https://ernd.app

🛠️ Tech Stack
Frontend: 
  HTML, CSS, JavaScript
  Responsive design for mobile-first experience

Backend: 
  C# with ASP.NET Core (Razor Pages)
  Authentication using ASP.NET Core Identity

Database: 
  SQLite for persistent data storage
  Entity Framework Core for Object-Relational Mapping

Authentication: 
  ASP.NET Identity for secure user registration, login, and session management

Deployment: 
  Render for hosting the app and API

✅ Core Features
User Authentication: Secure user registration, login, and session management with ASP.NET Core Identity

User Dashboard (Future): Personalized dashboard with a welcome message and access to workout history

Start New Workout: Select from predefined exercises to begin a workout session

Workout Logging:
  Log sets, reps, and weights
  Track time duration for each workout
  Option to Add notes for each workout session (Future)

Workout History: View previously logged workouts with details such as sets, reps, weights, and notes

📈 Development Timeline (Step-by-Step)

✅ Phase 1: Project Setup + User Authentication
Set up ASP.NET Razor Pages project in Visual Studio Code

Integrated ASP.NET Identity for user registration, login, and secure sesssion management

Scaffolded authenticated pages and tested login/logout flow

✅ Phase 2: User Dashboard & Routing
Redirect logged-in users to the Home page after login

Show a welcome message using User.Identity.Name (greeting the user by their account name)

Provide links or buttons to navigate to key pages: Start Workout, Workout History, and Settings

✅ Phase 3: Start New Workout UI
Designed a scrollable modal with predefined exercises for users to select from

Enabled users to choose multiple exercises for their workout session

Prepared workout session data and redirected users to the workout session modal

✅ Phase 4: Exercise Logging Page
Dynamically generate input fields for logging sets, reps, and weights

Allowed users to edit, add, and remove exercises before final submission

✅ Phase 5: Saving and Viewing Workout History
Use EF Core to persist workout sessions and exercises

Displayed previous workouts with detailed logs and metrics

🧠 Project Goals
Demonstrate full-stack development using modern C# and Razor Pages technologies

Professional Growth & Learning:
  Technical:
    Developed full-stack web application skills with front-end and back-end development with JavaScript, C#, ASP.NET Core, SQLite (Development), and PostgreSQL (Production)
    Gained hands-on exerience implementing user authentication and session management with ASP.NET Identity
    Integrated client-side logic with RESTful API calls to sync workout data between local storage and the server
    Gained skills in Cross-platform UI design
    Designed and managed database models with Entity Framework Core for storing wokrout data and user sessions
    Strengthened version control skills using Git and GitHub for managing project code
  Non-Technical:
    Project Management skills by planning, structuring, and executing an MVP
    Problem-solving 
    Clear Communication and Documentation skills through clear project descriptions and code comments
  

🔜 Post-MVP / Future Enhancements
Custom Workout Plans: Allow users to create their own exercises and personalized workout plans

TRAINER & TRAINEE: Create a system for coaches/trainers to build full workout plans where trainees can sign up and keep up with their coach's plan

PWA (Progressive Web App): Convert the app into a fully functional Progressive Web App for offline usage

💬 Feedback & Goals

I’m open to any feedback on architecture, design, or usability from more experienced developers.
