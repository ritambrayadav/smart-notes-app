1. Tech Stack
   Frontend
   Framework: Next.js

Language: TypeScript

State Management: Redux with Thunk middleware

Routing: Next.js file-based routing

Authentication:

Email/password-based login and signup

Authentication token managed via HTTP-only cookies

Styling: Tailwind CSS

UI Architecture: Modular component-based (NoteCard, NotesGrid, SearchInput, etc.)

Backend
Runtime: Node.js

Framework: Express.js

Database: DynamoDB (via Dynamoose ODM)

Authentication:

Custom JWT-based authentication using secure HTTP-only cookies
AI tools: Hugging face and compromise lib.
2. Features
   ✅ User Authentication
   Signup with name, email, and password

Login with email and password

Logout and session management using cookies

📝 Notes Functionality
Create, update, and delete notes

AI-generated summaries for notes

Smart tag suggestions using compromise keyword extraction

Search notes by content and title

Add/remove custom tags manually

Pagination for large note lists

Onboarding flow for new users

🎨 UI/UX
Fully responsive and clean UI using Tailwind CSS

Smooth layout and modern visual design with:

Rounded corners, soft shadows, tag pills, etc.

Organized dashboard with reusable UI components

3. Notes
   Ensure the backend for BE is up before launching the frontend(cd backend" -> "npm run dev").
   Start frontend using command using "cd frontend" -> "npm run dev" command
