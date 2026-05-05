# 🚀 Deployment Guide: Hostel Complaint Platform

Your code is 100% ready for deployment! This guide will walk you through hosting your application for free using **Render** (for the database and server) and **Vercel** (for the frontend).

---

## Step 1: Push Your Code to GitHub
Before deploying, you need to push your local code to a GitHub repository.
1. Open your terminal in the project root (`f:\hostal-complaint-platform-mern-project`).
2. Run the following commands:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Ready for deployment"
   ```
3. Go to [GitHub](https://github.com/new), create a new repository, and follow the instructions to push your code.

---

## Step 2: Deploy Database & Server (Render)

We will use [Render](https://render.com) to host both your PostgreSQL database and your Node.js backend.

### A. Set up the PostgreSQL Database
1. Create an account on Render and click **New +** > **PostgreSQL**.
2. Name your database (e.g., `hostel-db`), choose the free instance type, and click **Create Database**.
3. Once created, copy the **Internal Database URL** (we'll use this for the backend).

### B. Deploy the Node.js Server
1. Click **New +** > **Web Service**.
2. Connect your GitHub account and select your repository.
3. Configure the service:
   - **Name:** `hostel-api` (or similar)
   - **Root Directory:** `server`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
4. Scroll down to **Environment Variables** and add the following:
   - Key: `DATABASE_URL` | Value: *(Paste the Internal Database URL from Step 2A)*
   - Key: `JWT_SECRET` | Value: `my_super_secret_production_key_123!` (Make this secure!)
5. Click **Create Web Service**.
6. Once deployed, copy your new backend URL (e.g., `https://hostel-api-xyz.onrender.com`). Add `/api` to the end of it for the next step.

---

## Step 3: Deploy Frontend (Vercel)

We will use [Vercel](https://vercel.com) to host your React application because it is lightning-fast and perfectly optimized for Vite.

1. Create an account on Vercel and click **Add New** > **Project**.
2. Connect your GitHub account and import your repository.
3. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** Edit this and select `client`.
4. Open the **Environment Variables** section and add:
   - Key: `VITE_API_URL`
   - Value: *(Paste your backend URL from Step 2B, ending in `/api`)*. Example: `https://hostel-api-xyz.onrender.com/api`
5. Click **Deploy**.
6. Wait for the build to finish. Vercel will provide you with a live URL (e.g., `https://hostel-platform.vercel.app`).

---

## Step 4: Seed Production Data

Since this is a brand new database, it will be completely empty! You need to run your seed scripts one time against the production database to create your Admin, Warden, and test student accounts.

1. Go back to your Render Dashboard and open your PostgreSQL database settings.
2. Copy the **External Database URL**.
3. On your local computer, open the `server/.env` file.
4. Temporarily replace your local `DATABASE_URL` with the **External Database URL** from Render.
5. In your terminal, run the seed scripts:
   ```bash
   cd server
   node seedRooms.js
   node seedStudents.js
   node seed.js
   ```
6. Change your `server/.env` file back to your local connection string.

---

🎉 **Congratulations!** Your application is now live on the internet! You can visit your Vercel URL to log in.
