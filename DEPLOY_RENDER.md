# 🚀 Deploying Backend to Render

I have prepared your backend for deployment to Render. Follow these simple steps:

## 1. Push to GitHub
Make sure all your latest changes (including the new `render.yaml` and environment variable fixes) are pushed to your GitHub repository.

## 2. Connect to Render
1.  Go to [Render.com](https://dashboard.render.com/) and log in with GitHub.
2.  Click **"New +"** and select **"Blueprint"**.
3.  Connect your GitHub repository (`varsha-pradeep`).
4.  Render will automatically detect the `render.yaml` file and show you the configuration.

## 3. Set Environment Variables
During the setup, Render will ask for the following:
*   **MONGODB_URI**: Copy and paste your MongoDB Atlas connection string:
    `mongodb+srv://suriya003:admin123@cluster0.r6bfjux.mongodb.net/arch-website?retryWrites=true&w=majority&appName=Cluster0`

## 4. Deploy
Click **"Apply"**. Render will now build and start your server.

---

## 5. Connect Frontend (Vercel) to Backend (Render)
Once Render gives you your live URL (e.g., `https://varsha-pradeep-api.onrender.com`):

1.  Go to your **Vercel Dashboard**.
2.  Select your project -> **Settings** -> **Environment Variables**.
3.  Add/Update `VITE_API_URL` with your new Render URL.
4.  **Redeploy** the Vercel project.

### ✅ Verification
*   Visit your Vercel URL.
*   The "Network Error" should be gone.
*   Try adding a slide in the Admin Dashboard; it should now save to the live database!
