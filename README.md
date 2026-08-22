# 🌍 GlobeTrotter

## Empowering Personalized Travel Planning

> **GlobeTrotter** is a full-stack travel planning platform designed to
> make multi-city trip planning simple, structured, collaborative, and
> budget-aware.

GlobeTrotter lets travelers create personalized trips, organize
destinations into an itinerary, add activities, estimate expenses,
visualize plans on a calendar, and share public itineraries with the
community.

Built as a hackathon project around the **GlobeTrotter --- Empowering
Personalized Travel Planning** problem statement.

------------------------------------------------------------------------

## ✨ Why GlobeTrotter?

Planning a multi-city trip usually means switching between maps, notes,
spreadsheets, calendars, activity websites, and budget calculators.

GlobeTrotter brings those planning activities into one workflow:

``` text
Discover
   ↓
Create Trip
   ↓
Add Destinations
   ↓
Build Itinerary
   ↓
Add Activities
   ↓
Track Budget
   ↓
Visualize Calendar
   ↓
Share Trip
```

The goal is not simply to store a travel plan, but to give users a
complete view of **where they are going, what they are doing, when they
are doing it, and how much the trip is expected to cost**.

------------------------------------------------------------------------

## 🎯 Problem Statement

The hackathon asks teams to build a complete travel planning application
where users can:

-   Create customized multi-city itineraries
-   Assign travel dates, activities, and budgets
-   Discover destinations and activities through search
-   Receive cost breakdowns and visual calendar views
-   Share travel plans publicly or with friends
-   Store and retrieve user-specific travel data
-   Provide a responsive interface that adapts to the user's trip flow

The required product experience covers authentication, dashboard, trip
creation, trip management, itinerary building, itinerary visualization,
city discovery, activity discovery, budget analysis, calendar/timeline
views, public sharing, user settings, and optional
administration/analytics.

------------------------------------------------------------------------

## 🚀 Core Features

## 🔐 Authentication & User Management

-   User registration
-   User login
-   JWT-based authentication
-   HTTP-only authentication cookies
-   Protected application routes
-   User profile management
-   Avatar support

------------------------------------------------------------------------

## 🏠 Dashboard

The dashboard acts as the user's travel command center.

It provides:

-   Welcome/personalized experience
-   Upcoming trips
-   Recent trips
-   Quick access to trip planning
-   Travel statistics
-   Budget highlights
-   Destination discovery

------------------------------------------------------------------------

## 🧳 Trip Management

Users can:

-   Create trips
-   Edit trips
-   Delete trips
-   Duplicate trips
-   Set trip start and end dates
-   Add trip descriptions
-   Add cover images
-   Configure trip visibility
-   View trip summaries

Each trip becomes the foundation for the itinerary-building workflow.

------------------------------------------------------------------------

## 🗺️ Multi-City Itinerary Builder

The itinerary builder is the core of GlobeTrotter.

Users can:

-   Add destinations/stops
-   Assign travel dates
-   Organize multiple cities
-   Add activities to individual stops
-   Edit activities
-   Remove activities
-   Reorder itinerary stops
-   View day-by-day plans
-   Track activity costs

The frontend uses drag-and-drop interactions to make itinerary ordering
intuitive.

------------------------------------------------------------------------

## 🌆 City Discovery

Users can discover destinations using the city catalog.

City information can include:

-   City name
-   Country
-   Region
-   Description
-   Image
-   Cost information
-   Popularity/discovery metadata

The intended MVP experience allows users to search/filter destinations
and add a selected city to a trip.

------------------------------------------------------------------------

## 🎯 Activity Discovery

The activity catalog allows travelers to discover things to do at their
destinations.

Activities can contain:

-   Activity title/name
-   Description
-   Category
-   City association
-   Cost
-   Duration
-   Image

The itinerary workflow allows activities to be added to individual stops
and included in the trip plan.

------------------------------------------------------------------------

## 💰 Budget & Cost Tracking

GlobeTrotter provides a budget-oriented view of a trip.

Users can see:

-   Estimated total trip cost
-   Activity expenses
-   Budget summaries
-   Cost distribution
-   Average cost/day
-   Spending by destination
-   Spending by category

The frontend uses chart visualizations to make financial information
easier to understand.

Recommended budget categories for the MVP include:

``` text
Transport
Accommodation
Activities
Meals
Other
```

------------------------------------------------------------------------

## 📅 Calendar & Timeline

Travel plans can be visualized through a calendar interface.

The calendar supports:

-   Trip dates
-   Activity dates
-   Activity time slots
-   Month view
-   Week/time-grid view
-   Timeline-style planning
-   Interactive event viewing

This transforms the itinerary from a static list into a time-based
travel schedule.

------------------------------------------------------------------------

## 🌍 Public Trips & Community

Travelers can make trips public and share them with others.

The community experience supports:

-   Public itineraries
-   Discovering shared trips
-   Viewing public trip details
-   Likes
-   Comments
-   Views
-   Trip reuse/copy workflows

The goal is to turn individual trip planning into a source of travel
inspiration for the wider community.

------------------------------------------------------------------------

## 🔗 Trip Sharing

A public itinerary can be shared through a public URL.

The intended sharing flow is:

``` text
Private Trip
     ↓
Make Public
     ↓
Generate/View Public Trip
     ↓
Copy Link
     ↓
Share With Others
```

Public trip views are designed to be read-only for visitors.

------------------------------------------------------------------------

## 👤 Profile & Settings

Users can manage:

-   Name
-   Email
-   Avatar
-   Preferences
-   Language/currency preferences
-   Saved destinations
-   Account settings

------------------------------------------------------------------------

## 📊 Admin & Analytics

The project also includes an optional administration layer.

Admin functionality can include:

-   Demo data seeding
-   User/trip analytics
-   Popular cities
-   Popular activities
-   Usage statistics
-   Content management

Admin analytics is considered an optional feature for the hackathon MVP.

------------------------------------------------------------------------

## 🧩 Product Flow

The primary user journey is:

``` text
┌───────────────┐
│ Login / Signup│
└───────┬───────┘
        ↓
┌───────────────┐
│   Dashboard   │
└───────┬───────┘
        ↓
┌───────────────┐
│  Create Trip  │
└───────┬───────┘
        ↓
┌────────────────────┐
│ Itinerary Builder  │
└─────────┬──────────┘
          ↓
     Add City/Stop
          ↓
     Assign Dates
          ↓
     Add Activities
          ↓
     Reorder Stops
          ↓
┌────────────────────┐
│ Budget Calculation │
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Calendar / Timeline│
└─────────┬──────────┘
          ↓
┌────────────────────┐
│ Public / Share Trip│
└────────────────────┘
```

------------------------------------------------------------------------

## 🏗️ System Architecture

GlobeTrotter follows a client-server architecture.

``` text
                         ┌──────────────────────┐
                         │      User / Browser  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                    ┌─────────────────────────────┐
                    │ React + Vite Frontend       │
                    │                             │
                    │ Pages                       │
                    │ Components                  │
                    │ Zustand State               │
                    │ API Client                  │
                    │ Calendar / Charts / DnD     │
                    └──────────────┬──────────────┘
                                   │ HTTP / JSON
                                   ▼
                    ┌─────────────────────────────┐
                    │ Node.js + Express API       │
                    │                             │
                    │ Routes                      │
                    │ Controllers                 │
                    │ Middleware                  │
                    │ Authentication              │
                    │ Validation / Errors          │
                    └──────────────┬──────────────┘
                                   │
                    ┌──────────────┴──────────────┐
                    ▼                             ▼
          ┌──────────────────┐          ┌──────────────────┐
          │ MongoDB/Mongoose │          │ Cloudinary       │
          │ Application Data │          │ Image Storage    │
          └──────────────────┘          └──────────────────┘
```

------------------------------------------------------------------------

## 🛠️ Tech Stack

## Frontend

  Technology        Purpose
  ----------------- -------------------------------------
  React             UI framework
  Vite              Frontend build tool/dev server
  React Router      Client-side routing
  Zustand           Global/client state
  Axios             API communication
  React Hook Form   Form handling
  React Hot Toast   User feedback
  Lucide React      Icons
  Framer Motion     UI animations
  @dnd-kit          Drag-and-drop itinerary ordering
  Recharts          Budget/data visualization
  FullCalendar      Calendar and timeline visualization
  date-fns          Date utilities
  Vanilla CSS       Project styling/design system

## Backend

  Technology          Purpose
  ------------------- ----------------------------
  Node.js             Runtime
  Express             REST API framework
  Mongoose            MongoDB ODM
  MongoDB             Application persistence
  JWT                 Authentication
  bcryptjs            Password hashing
  HTTP-only cookies   Authentication transport
  Multer              File uploads
  Cloudinary          Image storage
  Helmet              HTTP security headers
  CORS                Cross-origin configuration
  Morgan              HTTP request logging
  Nodemon             Development server

------------------------------------------------------------------------

## 📁 Project Structure

``` text
GlobeTrotter/
│
├── client/
│   │
│   ├── public/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   ├── itinerary/
│   │   │   ├── trips/
│   │   │   ├── cities/
│   │   │   ├── community/
│   │   │   └── ...
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── trips/
│   │   │   ├── cities/
│   │   │   ├── calendar/
│   │   │   ├── community/
│   │   │   ├── profile/
│   │   │   └── admin/
│   │   │
│   │   ├── store/
│   │   │   └── Zustand stores
│   │   │
│   │   ├── lib/
│   │   │   ├── api.js
│   │   │   └── helper utilities
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   │
│   ├── src/
│   │   ├── config/
│   │   │   ├── database configuration
│   │   │   └── Cloudinary configuration
│   │   │
│   │   ├── controllers/
│   │   │
│   │   ├── middleware/
│   │   │   ├── authentication
│   │   │   └── error handling
│   │   │
│   │   ├── models/
│   │   │   ├── User
│   │   │   ├── Trip
│   │   │   ├── City
│   │   │   └── Activity
│   │   │
│   │   └── routes/
│   │
│   ├── index.js
│   ├── seed.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

------------------------------------------------------------------------

## 🖥️ Frontend Pages

The frontend is organized around the complete travel-planning lifecycle.

  Page                Purpose
  ------------------- ---------------------------------------
  Login               User authentication
  Register            Account creation
  Dashboard           Travel overview and quick actions
  My Trips            Manage user's trips
  Create Trip         Start a new trip
  Trip Detail         View trip summary
  Itinerary Builder   Build multi-city itinerary
  Cities              Discover destinations
  Calendar            Visualize travel schedule
  Community           Discover public trips
  Profile             Manage user settings
  Admin               Optional administration and analytics

------------------------------------------------------------------------

## 🔌 API Overview

The frontend communicates with the Express backend through the API
layer.

Base URL:

``` text
http://localhost:5000/api
```

## Authentication

``` http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

## Trips

``` http
POST   /api/trips
GET    /api/trips
GET    /api/trips/:id
PUT    /api/trips/:id
DELETE /api/trips/:id
POST   /api/trips/:id/stops
```

## Cities

``` http
GET /api/cities
```

## Activities

``` http
GET /api/activities
```

## Administration

``` http
POST /api/admin/seed
GET  /api/admin/analytics
```

For complete request/response contracts, use the project's Postman
collection/documentation.

------------------------------------------------------------------------

## 🗃️ Data Model

The current application models the following core entities:

``` text
User
 │
 └── owns ──► Trip
                │
                ├── contains ──► Stops
                │                  │
                │                  └── contains ──► Activities
                │
                └── tracks ──► Budget
```

## User

``` text
User
├── name
├── email
├── passwordHash
├── role
└── avatar
```

## Trip

``` text
Trip
├── title
├── owner
├── start/end dates
├── stops
├── activities
└── budget
```

## City

``` text
City
├── name
├── country
├── image
└── description
```

## Activity

``` text
Activity
├── title
├── cityRef
├── cost
├── duration
└── image
```

------------------------------------------------------------------------

## ⚙️ Local Development

## Prerequisites

Install:

-   Node.js 18+
-   npm
-   MongoDB Atlas or local MongoDB
-   Cloudinary account if image upload functionality is required

------------------------------------------------------------------------

## 1. Clone the repository

``` bash
git clone https://github.com/dhruv2311-dot/GlobeTrotter.git
cd GlobeTrotter
```

------------------------------------------------------------------------

## 2. Configure the backend

``` bash
cd server
cp .env.example .env
```

Configure:

``` env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

CLIENT_URL=http://localhost:5173
```

Install dependencies:

``` bash
npm install
```

Start development server:

``` bash
npm run dev
```

------------------------------------------------------------------------

## 3. Configure the frontend

Open another terminal:

``` bash
cd client
npm install
```

Create:

``` text
client/.env
```

Add:

``` env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

``` bash
npm run dev
```

------------------------------------------------------------------------

## 4. Open the application

Frontend:

``` text
http://localhost:5173
```

Backend:

``` text
http://localhost:5000/api
```

------------------------------------------------------------------------

## 🌱 Seed Demo Data

The application includes an admin-driven demo data seeding flow.

After starting both servers:

1.  Register a user.
2.  Give the user the `admin` role in the database.
3.  Open:

``` text
http://localhost:5173/admin
```

4.  Use the **Seed Sample Data** action.

The backend also exposes:

``` http
POST /api/admin/seed
```

This can be used to populate sample cities and activities.

------------------------------------------------------------------------

## 🔐 Environment Variables

## Backend

``` env
PORT=5000
MONGO_URI=
JWT_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

CLIENT_URL=http://localhost:5173
```

## Frontend

``` env
VITE_API_URL=http://localhost:5000/api
```

> Never commit real secrets, database credentials, JWT secrets, or
> Cloudinary credentials to Git.

------------------------------------------------------------------------

## 🧪 Testing & Verification

The current repository does not ship with a complete automated test
suite.

For the hackathon MVP, the recommended verification flow is an
end-to-end manual test:

``` text
1. Register
2. Login
3. Open Dashboard
4. Create a trip
5. Add multiple cities/stops
6. Assign dates
7. Add activities
8. Reorder stops
9. Verify budget calculations
10. Open calendar
11. Make trip public
12. Open public trip
13. Copy/share trip
14. Verify community listing
15. Test mobile responsiveness
16. Test logout/login persistence
```

Before submission, also run:

``` bash
cd client
npm run lint
npm run build
```

and verify that the production frontend builds successfully.

------------------------------------------------------------------------

## 🎯 Hackathon MVP Scope

The MVP focuses on a complete, demonstrable travel-planning journey.

## Must Have

-   Authentication
-   Dashboard
-   Create Trip
-   My Trips
-   Multi-city itinerary
-   Destination/stops
-   Travel dates
-   Activities
-   Activity costs
-   Budget summary
-   Calendar/timeline
-   Public itinerary
-   Sharing

## Strong Enhancements

-   Searchable city catalog
-   Add city directly to a trip
-   Dedicated activity search/filtering
-   Copy public trip
-   Community discovery
-   Responsive mobile UI
-   Loading/empty/error states
-   Budget category visualization

## Optional

-   Admin analytics
-   Advanced profile settings
-   Extended community interactions

------------------------------------------------------------------------

## 🏆 Hackathon Demo Story

A strong demonstration should follow one continuous story instead of
jumping between unrelated screens.

### Step 1 --- Authentication

Create/login as a traveler.

### Step 2 --- Dashboard

Show the personalized travel dashboard.

### Step 3 --- Create Trip

Create a trip such as:

``` text
European Summer Escape
12 Sep 2026 → 25 Sep 2026
```

### Step 4 --- Build the itinerary

Add:

``` text
Paris
Rome
Barcelona
```

Assign travel dates.

### Step 5 --- Add activities

Example:

``` text
Paris
├── Louvre Museum
└── Food Tour

Rome
├── Colosseum
└── Vatican Museums

Barcelona
├── Sagrada Família
└── Gothic Quarter
```

### Step 6 --- Show budget

Demonstrate:

``` text
Transport
Accommodation
Activities
Meals
Other
```

and the calculated total.

### Step 7 --- Show calendar

Switch from list/itinerary view to calendar/timeline.

### Step 8 --- Share

Make the trip public and open the public itinerary.

### Step 9 --- Community

Show how another user can discover and reuse the itinerary.

This single journey demonstrates almost the entire problem statement.

------------------------------------------------------------------------

## 📐 Design Principles

GlobeTrotter follows these product principles:

### 1. Planning first

Every screen should help the user move toward a complete trip.

### 2. Progressive disclosure

Do not overwhelm users with every travel option at once. Reveal details
as the itinerary grows.

### 3. Visual planning

Dates, cities, activities, and costs should be visually understandable.

### 4. Action-oriented UI

Primary actions should always be obvious:

``` text
Plan Trip
Add Stop
Add Activity
Save
Share
Copy Trip
```

### 5. Responsive by default

The experience should remain usable across desktop, tablet, and mobile
screens.

------------------------------------------------------------------------

## 🔄 Frontend / Backend Responsibilities

## Frontend

Responsible for:

-   User interface
-   Client-side routing
-   Form validation
-   Loading states
-   Error states
-   Toast notifications
-   Itinerary interactions
-   Drag-and-drop
-   Calendar visualization
-   Budget visualization
-   Search/filter UX
-   Responsive design
-   Public trip presentation

## Backend

Responsible for:

-   Authentication
-   Authorization
-   API endpoints
-   Database persistence
-   Trip data
-   City/activity data
-   Budget persistence/calculation
-   Image upload handling
-   Public trip access
-   Community data
-   Admin functionality

------------------------------------------------------------------------

## 🚀 Deployment

## Frontend

Recommended platforms:

-   Vercel
-   Netlify

Configure:

``` env
VITE_API_URL=https://your-backend-domain/api
```

Build:

``` bash
npm run build
```

------------------------------------------------------------------------

## Backend

Possible platforms:

-   Render
-   Railway
-   DigitalOcean
-   Heroku-compatible hosting

Configure all required environment variables and start with:

``` bash
npm start
```

------------------------------------------------------------------------

## Database

Current implementation:

``` text
MongoDB Atlas
```

Configure:

``` env
MONGO_URI=your_connection_string
```

------------------------------------------------------------------------

## 🔒 Security Considerations

The application includes several security-oriented practices:

-   Password hashing with bcrypt
-   JWT authentication
-   HTTP-only authentication cookies
-   Protected routes
-   Role-based admin access
-   Helmet security middleware
-   CORS configuration
-   Environment-based secrets
-   No credentials committed to source control

------------------------------------------------------------------------

## 📊 Current Feature Map

  -----------------------------------------------------------------------
  Area                    Feature                 Status
  ----------------------- ----------------------- -----------------------
  Authentication          Register                ✅

  Authentication          Login                   ✅

  Authentication          Protected routes        ✅

  Trips                   Create                  ✅

  Trips                   Edit                    ✅

  Trips                   Delete                  ✅

  Trips                   Duplicate               ✅

  Itinerary               Multi-city stops        ✅

  Itinerary               Activities              ✅

  Itinerary               Drag & drop             ✅

  Discovery               City catalog            ✅

  Discovery               Activity catalog        ✅

  Budget                  Cost tracking           ✅

  Visualization           Charts                  ✅

  Visualization           Calendar                ✅

  Community               Public trips            ✅

  Community               Likes/comments/views    ✅

  Images                  Cloudinary uploads      ✅

  Admin                   Seed data               ✅

  Admin                   Analytics               ✅

  Hackathon               Relational DB           ⚠️ Requires backend
                          requirement             alignment
  -----------------------------------------------------------------------

> Status reflects the current repository architecture and should be
> updated as the hackathon MVP evolves.

------------------------------------------------------------------------

## 🛣️ Future Roadmap

After the MVP, GlobeTrotter can evolve into a more intelligent travel
platform.

### Phase 2

-   AI-generated itineraries
-   Smart destination recommendations
-   Budget optimization
-   Travel-time optimization
-   Weather-aware planning
-   Map-based itinerary visualization

### Phase 3

-   Hotel and stay integration
-   Flight/transport integration
-   Booking integrations
-   Real-time travel updates
-   Collaborative trip editing
-   Friend invitations
-   Notifications

### Phase 4

-   Personalized recommendation engine
-   Travel preference learning
-   Multi-currency optimization
-   Offline itinerary access
-   Mobile application

------------------------------------------------------------------------

## 🤝 Team Collaboration

A clean team workflow is recommended:

``` text
                    GlobeTrotter
                         │
              ┌──────────┴──────────┐
              │                     │
          Frontend               Backend
              │                     │
        React + Vite          Node + Express
        UI/UX                  API
        State                  Auth
        Calendar               Database
        Charts                 Business Logic
        Itinerary UX           Uploads
```

Frontend and backend should agree on API request/response contracts
before implementing dependent features.

------------------------------------------------------------------------

## 🌟 What Makes GlobeTrotter Different?

GlobeTrotter is built around the idea that travel planning should not be
a collection of disconnected tools.

Instead, the platform connects:

``` text
DESTINATION
     +
DATES
     +
ACTIVITIES
     +
BUDGET
     +
CALENDAR
     +
SHARING
```

into one continuous planning experience.

The user does not simply create a list of places.

They create a **complete, time-aware, cost-aware travel journey**.

------------------------------------------------------------------------

## 📚 Project Documentation

-   Repository: https://github.com/dhruv2311-dot/GlobeTrotter
-   API Documentation:
    https://documenter.getpostman.com/view/39189509/2sBXinGAMV
-   Frontend: `client/`
-   Backend: `server/`

------------------------------------------------------------------------

## 📄 License

MIT License.

------------------------------------------------------------------------

## ❤️ Built for the Hackathon

**GlobeTrotter**\
*Empowering Personalized Travel Planning*

Built with React, Node.js, Express, MongoDB, and a focus on turning
complex multi-city travel planning into a simple, visual, and shareable
experience.
