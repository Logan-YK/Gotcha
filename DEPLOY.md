# Deploying Gotcha to GitHub Pages

## Prerequisites
- A GitHub account (https://github.com)
- Git installed on your computer
- Node.js installed (you already have this)

## Step-by-Step Guide

### 1. Create a GitHub Repository

1. Go to https://github.com/new
2. Name the repository **Gotcha** (must match exactly, case-sensitive)
3. Keep it Public
4. Do NOT check "Add a README" or any other options
5. Click "Create repository"

### 2. Initialize Git and Push

Open a terminal in the `d:\Desktop\Gotcha` folder and run these commands one by one:

```bash
git init
git add .
git commit -m "Initial commit - Gotcha PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Gotcha.git
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 3. Deploy to GitHub Pages

Run this single command:

```bash
npm run deploy
```

This builds the app and publishes the `dist` folder to a `gh-pages` branch automatically.

### 4. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/YOUR_USERNAME/Gotcha`
2. Click **Settings** (tab at the top)
3. In the left sidebar, click **Pages**
4. Under "Source", select **Deploy from a branch**
5. Under "Branch", select **gh-pages** and **/ (root)**
6. Click **Save**
7. Wait 1-2 minutes

### 5. Access Your PWA

Your app will be live at:
```
https://YOUR_USERNAME.github.io/Gotcha/
```

### 6. Add to iPhone Home Screen

1. Open the URL above in Safari on your iPhone
2. Tap the **Share** button (square with arrow pointing up)
3. Scroll down and tap **Add to Home Screen**
4. The app will appear on your home screen with the dumbbell icon
5. It will open full-screen like a native app!

## Updating the App

Whenever you make changes, just run:

```bash
npm run deploy
```

The update will go live in 1-2 minutes.

## Important Note

If you rename the repository to something other than "Gotcha", you must update the `base` property in `vite.config.js` to match:

```js
base: '/your-repo-name/',
```

Then re-deploy with `npm run deploy`.
