# TreeScan — Full Deployment & Setup Guide

This guide covers everything required to take your local TreeScan repository and deploy it forcefully as a scalable Progressive Web App (PWA) with live AI orchestration.

---

## Step 1: Create Your Database (Supabase)

Supabase handles your PostgreSQL database, secure Row Level Security (RLS) policies, and handles user authentication securely without heavy backend code.

1. Go to [Supabase.com](https://supabase.com) and click **"Start your project"**. Create a new organization and project.
2. In the Supabase dashboard navigation, go to **Database > SQL Editor**.
3. Create a **New Query**, paste the following block of code exactly, and hit **Run**:

```sql
-- Create Profiles table
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  full_name text,
  updated_at timestamp with time zone,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Scans table (Saves diagnostic history)
CREATE TABLE public.scans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  plant_name text NOT NULL,
  scientific_name text,
  status text NOT NULL CHECK (status IN ('healthy', 'warning', 'critical')),
  confidence integer,
  health_score integer,
  problems jsonb DEFAULT '[]'::jsonb,
  treatment_steps jsonb DEFAULT '[]'::jsonb,
  water_schedule text,
  sunlight_needs text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create Garden table (For saved/favorite plants)
CREATE TABLE public.garden (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  scan_id uuid REFERENCES public.scans(id) ON DELETE CASCADE NOT NULL,
  nickname text,
  added_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable standard RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.garden ENABLE ROW LEVEL SECURITY;

-- Apply Select policies (Users can only read their OWN data)
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can view own scans" ON scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own garden" ON garden FOR SELECT USING (auth.uid() = user_id);

-- Apply Insert policies (Users can only create their OWN data)
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own scans" ON scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can insert own garden" ON garden FOR INSERT WITH CHECK (auth.uid() = user_id);
```

4. Go to **Storage** and click **Create Bucket**.
5. Name the bucket exactly: `scan-images` and mark it as **Public**.
6. Set standard policies in the bucket to allow authenticated users to *Insert* and *Select* objects.

---

## Step 2: Configure Authentication

1. Under the Supabase dashboard, go to **Authentication > Providers**.
2. **Email & Password:** Enable "Email Signup" and then scroll down and toggle "Confirm email" to OFF. This allows instant signups for your hackathon demo.

---

## Step 3: Get Your AI API Keys

We need two keys. One visual identifier (Plant.id) and one LLM (Gemini).

1. **Plant.id:** Create an account at [Plant.id](https://plant.id/). Copy your raw API Access Token (this is your `PLANT_ID_KEY`).
2. **Google Gemini:** Go to [Google AI Studio](https://aistudio.google.com/app/apikey). Generate a new API key (this is your `GEMINI_KEY`).

---

## Step 4: Deploy the Deno Edge Function

Your React app never talks to the AI directly for security. It talks to your secure Supabase Edge Function, which runs the APIs in the cloud.

1. Open a new terminal inside your local `/TreeScan` folder.
2. Install the Supabase CLI if you haven't (usually `npm i -g supabase`).
3. Connect your terminal to your cloud project:
   ```bash
   supabase link --project-ref [YOUR_SUPABASE_PROJECT_ID]
   ```
4. Securely upload the API keys to the server vault:
   ```bash
   supabase secrets set PLANT_ID_KEY="paste_plant_key"
   supabase secrets set GEMINI_KEY="paste_gemini_key"
   ```
5. Deploy the `analyze-plant` function:
   ```bash
   supabase functions deploy analyze-plant
   ```

---

## Step 5: Update Your Environment Variables

Your Frontend needs to know WHERE to send its data.

1. Go back to your Supabase Dashboard -> **Settings -> API**.
2. Find the `Project URL` and `anon public` key.
3. In your local `/TreeScan` folder, create a file titled exactly `.env` and paste them:

```env
VITE_SUPABASE_URL=YOUR_PROJECT_URL_HERE
VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY_HERE
```

Make sure not to commit the `.env` file to github (it's already in `.gitignore`!).

---

## Step 6: Host the Live Application on Vercel

1. Push your final code (including the `vercel.json` routing rules we built) up to a GitHub repository.
2. Go to [Vercel.com](https://vercel.com) and create an account.
3. Click **Add New Project**, link your GitHub account, and select the TreeScan repository.
4. In the Vercel configuration screen, expand the **Environment Variables** menu.
5. Add your exact `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` as production environment variables.
6. Click **Deploy**.

Vercel will install dependencies, build the PWA, compress your scripts, and hand you a blazing-fast URL instantly. That's it, you're globally live!
