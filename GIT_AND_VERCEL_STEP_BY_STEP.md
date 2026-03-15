# Complete step-by-step: Git → GitHub → Vercel (first time)

Follow these steps in order. You’ll go from “no Git” to a live website.

---

## Part 1: Install Git

1. **Download Git for Windows**  
   - Go to: https://git-scm.com/download/win  
   - Download runs (e.g. "Click here to download").

2. **Run the installer**  
   - Use default options (Next, Next).  
   - Where it asks “Choosing the default editor”, you can leave **Nano** or pick **Notepad**.  
   - Finish the install.

3. **Check it’s installed**  
   - Open **Command Prompt** or **PowerShell**:  
     - Press `Win + R`, type `cmd`, press Enter.  
     - Or search “Command Prompt” or “PowerShell” in the Start menu.  
   - Type:
     ```bash
     git --version
     ```
   - You should see something like `git version 2.43.0`. If you see “not recognized”, close the window, open a **new** Command Prompt and try again.

---

## Part 2: Create a GitHub account and a new repository

1. **Sign up on GitHub** (if you don’t have an account)  
   - Go to: https://github.com  
   - Click **Sign up**.  
   - Enter email, password, username. Verify your email if asked.

2. **Create a new repository (repo)**  
   - Log in to GitHub.  
   - Click the **+** (top right) → **New repository**.  
   - **Repository name:** e.g. `lotusfx-website` (no spaces).  
   - **Description:** optional, e.g. “Lotus FX website”.  
   - Choose **Public**.  
   - **Do not** check “Add a README file” (we already have a project).  
   - Click **Create repository**.

3. **Copy the repo URL**  
   - On the new repo page you’ll see something like:
     - `https://github.com/YOUR_USERNAME/lotusfx-website.git`  
   - Copy that URL (you’ll use it in Part 4). Replace `YOUR_USERNAME` with your real GitHub username.

---

## Part 3: Prepare your project folder (what to push)

Your website code should be in one folder, e.g.:

- `C:\Users\ASH\Desktop\1A-Ash-Dev\lotus Z website\Website running 1609\New Website`

We will use Git **only in this “New Website” folder** (not the whole “Website running 1609” folder). So all commands below are run **inside** the `New Website` folder.

**Check:**  
- This folder should contain: `app`, `components`, `package.json`, `next.config.js`, etc.  
- It should **not** be the folder that contains “New Website” as a subfolder.

---

## Part 4: Open terminal in your project folder

1. **Open File Explorer** and go to:
   ```
   C:\Users\ASH\Desktop\1A-Ash-Dev\lotus Z website\Website running 1609\New Website
   ```

2. **Open terminal here**  
   - In the address bar at the top, click once and type:
     ```
     cmd
     ```
     then press **Enter**.  
   - A black Command Prompt window opens **in that folder**.  
   - You should see a path ending with `...\New Website>`.

   **Alternative:**  
   - In File Explorer, **Shift + Right‑click** inside the folder → **Open PowerShell window here** (or “Open in Terminal” if you have it).

---

## Part 5: Check .gitignore (so we don’t upload junk)

Your project already has a **`.gitignore`** file so Git won’t upload `node_modules`, `.next`, or env files.

- **Just confirm** the file exists in the `New Website` folder. If it does, skip to Part 6.
- If you ever add a plain **`.env`** file (for secrets), make sure `.gitignore` contains a line with just `.env` so it’s never committed. Your current `.gitignore` already ignores `.env` and `.env*.local`.

---

## Part 6: Run Git commands (one by one)

In the same Command Prompt (or PowerShell) where the path ends with `New Website`, run each command **one at a time**. Wait for each to finish before typing the next.

> **Don’t type the backticks.** In the guide, commands are shown in code blocks. Type **only the line that looks like a command** (e.g. `git config ...`). Do **not** type the line that says "bash" in backticks or the closing backticks — those are just document formatting. If you type them, Windows will say "is not recognized".

**Step 6.1 – Tell Git who you are (only needed once per PC):**

```bash
git config --global user.email "your-email@example.com"
```

Replace `your-email@example.com` with the **same email** you use on GitHub.

```bash
git config --global user.name "Your Name"
```

Replace `Your Name` with your name (e.g. “Ash”).

---

**Step 6.2 – Start Git in this folder:**

```bash
git init
```

You should see: `Initialized empty Git repository in ...`

---

**Step 6.3 – Add all files:**

```bash
git add .
```

No message is normal. A dot (`.`) means “current folder”.

---

**Step 6.4 – Save a first “snapshot” (commit):**

```bash
git commit -m "Initial commit - Lotus FX website"
```

You might see a lot of lines; that’s fine. At the end you should see something like `1 file changed` or `XX files changed`.

If you get an error like “Please tell me who you are”, go back to Step 6.1 and run the two `git config` lines again.

---

**Step 6.5 – Name the main branch (optional but recommended):**

```bash
git branch -M main
```

---

**Step 6.6 – Connect to GitHub (use YOUR repo URL):**

Replace the URL with the one you copied in Part 2 (e.g. `https://github.com/YOUR_USERNAME/lotusfx-website.git`):

```bash
git remote add origin https://github.com/YOUR_USERNAME/lotusfx-website.git
```

If you get “remote origin already exists”, run:

```bash
git remote set-url origin https://github.com/YOUR_USERNAME/lotusfx-website.git
```

(again with your real URL).

---

**Step 6.7 – Push to GitHub:**

```bash
git push -u origin main
```

- **First time:** A window may open asking you to log in to GitHub (browser or “Sign in with browser”). Do that.  
- If it asks for **username**: your GitHub username.  
- If it asks for **password**: use a **Personal Access Token**, not your GitHub password.  
  - To create one: GitHub → your profile (top right) → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**.  
  - Give it a name (e.g. “Vercel deploy”), choose **Expiration**, check **repo**. Generate, then **copy the token** and paste it when Git asks for password.

When it works you’ll see something like: `Writing objects: 100% ... done` and branch `main` set to track `origin/main`.

---

**Check on GitHub:**  
Open your repo in the browser (`https://github.com/YOUR_USERNAME/lotusfx-website`). You should see all your project files (app, components, package.json, etc.). You’re done with Git for now.

---

## Part 7: Deploy on Vercel

1. Go to **https://vercel.com** and log in (or sign up with the same GitHub account).

2. Click **“Add New…”** → **“Project”**.

3. You’ll see **“Import Git Repository”**. Find **lotusfx-website** (or your repo name) and click **Import**.

4. **Configure Project:**  
   - **Root Directory:** Click **Edit**. Set it to **`New Website`** only if your repo root is the folder *above* “New Website” (e.g. you pushed “Website running 1609” and “New Website” is inside it).  
   - If you ran all Git commands **inside** the `New Website` folder and the repo only contains the website files, leave Root Directory **blank**.  
   - **Framework Preset:** Next.js (should be auto-detected).  
   - **Build Command:** leave default (`npm run build` or `next build`).  
   - **Output Directory:** leave default.  
   - Don’t add env vars yet; we’ll do that after the first deploy.

5. Click **Deploy**.  
   - Wait a few minutes.  
   - When it’s done you’ll get a link like: `https://lotusfx-website-xxxx.vercel.app`.

6. **Add environment variables:**  
   - Open your project on Vercel → **Settings** → **Environment Variables**.  
   - Add each variable (Production and Preview if you use previews):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | (from Google Cloud Console) |
   | `GOOGLE_CLIENT_SECRET` | (from Google Cloud Console) |
   | `GOOGLE_REFRESH_TOKEN` | (from your one-time /auth flow) |
   | `NEXT_PUBLIC_SITE_URL` | `https://your-actual-vercel-url.vercel.app` |

   Save each one. Then go to **Deployments** → click **…** on the latest deployment → **Redeploy** so the new env vars are used.

7. Open your site URL and test: home page, locations, one location detail.

---

## Part 8: Later – when you change code and want to update the live site

1. Open Command Prompt in the **same** project folder (`New Website`).
2. Run:

   ```bash
   git add .
   git commit -m "Short description of what you changed"
   git push
   ```

3. Vercel will automatically build and deploy the new version (usually within 1–2 minutes).

---

## Quick reference – Git commands you’ll use most

| What you want | Commands |
|----------------|----------|
| Save and push latest changes | `git add .` → `git commit -m "message"` → `git push` |
| See status of files | `git status` |
| See which folder Git is using | Make sure the path in the terminal ends with `New Website` |

---

## If something goes wrong

- **“fatal: not a git repository”**  
  You’re not in the folder where you ran `git init`. Use File Explorer to go to `New Website`, then in the address bar type `cmd` and press Enter, and run the command again.

- **“Permission denied” or “Authentication failed” on push**  
  Use a GitHub **Personal Access Token** as the password (see Step 6.7).

- **Vercel build fails**  
  Check the build log on Vercel. Often it’s a missing env var or wrong **Root Directory**. Set **Root Directory** to the folder that contains `package.json` and `app`.

- **Site works but locations/details don’t**  
  Make sure `GOOGLE_REFRESH_TOKEN` (and the other Google env vars) are set in Vercel and you redeployed after adding them.

You’re done when: (1) GitHub shows your files, and (2) Vercel shows a green deployment and your site loads at the Vercel URL.
