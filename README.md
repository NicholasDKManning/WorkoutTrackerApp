🏋️ ERND – Web-Based Workout Tracker (MVP)
ERND is a full-stack web application I’m building to grow as an application developer. The goal is to create a mobile-style fitness app where users can log in, track workouts in detail, and view their workout history — all through a clean, responsive web interface.

This is a long-term learning project, but the Minimum Viable Product (MVP) is being built in under two weeks to allow for user testing and feedback. All work is done step by step using web resources, with a focus on building a portfolio-worthy full-stack application.

🛠️ Tech Stack
Frontend: HTML, CSS, JavaScript

Backend: C# with ASP.NET Core (Razor Pages)

Database: SQLite + Entity Framework Core

Authentication: ASP.NET Identity

Deployment: Planned (Azure, Render, or Vercel + API backend)

✅ Core Features
User Authentication – Register/Login with secure sessions

User Dashboard – View welcome message and workout history

Start New Workout – Choose from a list of predefined exercises

Workout Logging –

Log sets, reps, weights, personal records

Track time durations

Add notes for each workout session

Workout History – View previously logged workouts with details

📈 Development Timeline (Step-by-Step)

✅ Phase 1: Project Setup + User Authentication
Set up ASP.NET Razor Pages project in Visual Studio

Integrate ASP.NET Identity for secure user registration and login

Scaffold auth pages and test login/logout flow

📺 Video:
ASP.NET Identity Basics – IAmTimCorey

✅ Phase 2: User Dashboard & Routing
Redirect logged-in users to a /Dashboard page

Show a welcome message using User.Identity.Name

Create buttons: Start Workout, View History

📺 Video:
Razor Pages Routing – Kudvenkat

✅ Phase 3: Start New Workout UI
Display a modal/popup with a scrollable list of exercises

Allow user to select multiple exercises to start a session

Prepare a new workout session and redirect to logging page

📺 Video:
Razor Pages Forms – Raw Coding

✅ Phase 4: Exercise Logging Page
Dynamically generate input fields for:

Sets, reps, weights

Time durations (e.g. timed exercises or rest)

PR checkboxes or flags

Notes field for overall workout

Allow editing and removing of exercises before submitting

📺 Video:
EF Core Forms and Nested Models – IAmTimCorey

✅ Phase 5: Saving and Viewing Workout History
Use EF Core to persist:

Workout sessions

Associated exercises and logs

Notes and metrics

Display all previous workouts for the logged-in user

Allow users to click into each workout to view detailed logs

📺 Video:
EF Core with Relationships – Tim Corey

🧠 Project Goals
Show full-stack capability using a modern C# + Razor stack

Learn form handling, state management, and data relationships

Gain real-world experience with user authentication and data persistence

Produce a real, working app that users (including recruiters/interviewers) can interact with

🔜 Post-MVP / Future Enhancements
Build a custom workout plan feature

Add progress tracking dashboards or visual graphs

Add timer + stopwatch functionality

Convert into a PWA (progressive web app)

Build an API backend for native mobile apps

💬 Feedback & Goals

I’m open to any feedback on architecture, design, or usability from more experienced developers.
