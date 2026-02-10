# Deployment Guide

This document describes how to deploy the AI Resume Interviewer project.

## Overview

| Part        | Where it deploys      | Notes                                      |
|------------|------------------------|--------------------------------------------|
| **Frontend** | Firebase Hosting       | Angular SPA; configured in this repo       |
| **Backend**  | Your own host          | Node.js + Express + MongoDB + Socket.IO   |

Firebase Hosting serves only static files. The API and WebSockets must run on a separate server (e.g. Cloud Run, Railway, Render, or a VPS).

---

## Deploying the Frontend to Firebase

### Prerequisites

- Node.js 18+
- A [Firebase](https://console.firebase.google.com/) account

### 1. Install Firebase CLI

```bash
npm install -g firebase-tools
```

### 2. Log in and select a project

```bash
firebase login
```

Create a new project in the [Firebase Console](https://console.firebase.google.com/) or use an existing one. Then link it:

```bash
firebase use your-firebase-project-id
```

Or edit `.firebaserc` and set the `default` project ID to your project.

### 3. Set the production API URL

The frontend must know where your backend is running.

Edit **`frontend/src/environments/environment.prod.ts`**:

```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-backend-url.com'   // Your deployed Node.js API base URL
};
```

Use the full base URL of your API (no trailing slash), e.g. `https://api.myapp.com` or `https://my-backend.run.app`.

### 4. Build and deploy

From the **project root**:

```bash
npm run deploy
```

This will:

1. Install frontend dependencies and run a production Angular build.
2. Deploy the output to Firebase Hosting.

Or run step by step:

```bash
npm run build:frontend
firebase deploy
```

### 5. Result

- **Hosting URL:** `https://<your-project-id>.web.app`
- Optional: add a [custom domain](https://firebase.google.com/docs/hosting/custom-domain) in the Firebase Console.

---

## Backend deployment (reference)

The backend is not deployed by Firebase. You need to run it somewhere that supports Node.js, MongoDB, and WebSockets.

- **Environment variables:** Use the same variables as in `.env` (see README), with production values:
  - `MONGODB_URI` – production MongoDB (e.g. Atlas)
  - `JWT_SECRET` – strong secret
  - `OPENAI_API_KEY` – your OpenAI key
  - `FRONTEND_URL` – your Firebase Hosting URL (e.g. `https://<project-id>.web.app`) for CORS and Socket.IO

- **Docker:** A `Dockerfile` and `docker-compose.yml` exist in the repo for containerized deployment.

- **CORS / Socket.IO:** Ensure your backend allows the Firebase Hosting origin in CORS and Socket.IO `cors.origin`.

---

## Scripts summary

| Command               | Description                                  |
|-----------------------|----------------------------------------------|
| `npm run build:frontend` | Install frontend deps + production build     |
| `npm run deploy:firebase` | Build frontend + `firebase deploy`          |
| `npm run deploy`        | Same as `deploy:firebase`                    |

---

## Troubleshooting

- **Build fails:** Run `npm ci` and `npm run build` inside `frontend/` and fix any Angular/build errors first.
- **Blank page or wrong route:** Hosting rewrites are in `firebase.json`; all routes should serve `index.html`. Clear cache and hard refresh.
- **API/Socket errors in browser:** Check `environment.prod.ts` `apiUrl`, backend CORS, and that `FRONTEND_URL` on the server matches your Firebase Hosting URL.
