# Reach Inbox Web Application

## Description

This project implements a web application that integrates with Gmail API for fetching and sending emails asynchronously. It utilizes BullMQ for job scheduling and Gemini for generating email replies. This assignment focuses on integrating third-party APIs, implementing OAuth authentication, and managing asynchronous tasks using BullMQ.

### Features

- **Backend (Node.js):**

  - OAuth2 authentication with Google.
  - Endpoints for fetching unread Gmail emails and sending replies.
  - Integration with BullMQ for asynchronous email processing.

- **Frontend (React):**

  - Google OAuth integration for user authentication.
  - Display of fetched emails and ability to send replies.
  - Seamless integration with asynchronous email processing using BullMQ.

- **Additional Features:**
  - Job queue monitoring and error handling with BullMQ.
  - Real-time updates and notifications for email tasks.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/hari-bot/reach-inbox-assignment.git
   cd reach-inbox-assignment
   ```

2. **Set up environment variables:**

   Create a `.env` file in the backend directory with the following variables:

   ```env
   PORT=5000
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URL=http://localhost:5000/auth/google/callback
   REDIS_URL=redis://localhost:6379
   GEMINI_API_KEY = your_gemini_api_key
   ```

   - `PORT`: Port number for the Node.js server.
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`: OAuth credentials for Google authentication.
   - `GOOGLE_REDIRECT_URL`: Redirect URL after Google authentication.
   - `REDIS_URL`: Redis connection URL for BullMQ job queue.
   - `GEMINI_API_KEY` : API key for Gemini AI services.

3. **Start Redis server:**

   Ensure Redis server is installed and running locally. If not installed, download and install from [Redis Downloads](https://redis.io/download).

4. **Run the server:**

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   The server should start at `http://localhost:5000`.

5. **Run the client (React frontend):**

   Open a new terminal tab/window:

   ```bash
   cd client
   npm install
   npm start
   ```

   The React app should now be running on `http://localhost:3000`.

## Usage

1. **Authentication:**

   - Navigate to `http://localhost:3000`.
   - Click on the "Login with Google" button to authenticate via Google OAuth.

2. **Email Operations:**

   - View fetched unread Gmail emails.
   - Generate and send replies using OpenAI for email content analysis and response generation.

## API Endpoints

### `/auth`

- `GET /auth/google`: Initiates Google OAuth authentication.

### `/api/emails`

- `GET /api/emails/gmails`: Retrieves unread Gmail emails.

- `POST /api/generate/gmail`: Generates an email reply using OpenAI.

- `POST /api/send/gmail`: Queues and sends an email reply using BullMQ.

## Technologies Used

- Node.js
- Express.js
- React
- Google OAuth
- Gmail API
- BullMQ
- Redis
- Axios (for HTTP requests)
- JavaScript (ES6+)
