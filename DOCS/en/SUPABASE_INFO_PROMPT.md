# Prompt to Gather Supabase Information

I want you to guide me step by step, in a very clear and beginner-friendly way, so I can find the information below in the Supabase dashboard to configure my Next.js web app:

## Information I Need to Retrieve

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` or `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. `DATABASE_URL`
4. confirm whether `Magic Link` is enabled
5. confirm whether the development callback URL is configured
6. tell me exactly which menu to click in the Supabase dashboard

## Context

I am configuring a Next.js app with Supabase Auth and Postgres.
I want to use magic-link login.
I am in a local development environment.
The expected callback is:

`http://localhost:3000/auth/callback`

## What I Want in Your Response

Answer me in Brazilian Portuguese and organize the response like this:

### 1. How to find the Project URL
- say exactly where to click in the dashboard
- explain how to recognize the correct value
- show an example of the expected format

### 2. How to find the correct public key
- explain the difference between `publishable key` and `anon key`, if necessary
- tell me which one I should copy for frontend use
- show the expected format

### 3. How to find `DATABASE_URL`
- say exactly where to click
- explain whether I should use the direct connection or pooled connection
- recommend the best option for Drizzle migrations
- show the expected format

### 4. How to verify whether Magic Link is enabled
- say where the setting lives
- explain what must be enabled
- if there is more than one email-auth option, explain it briefly

### 5. How to configure the callback URL
- say where to click
- tell me exactly which URLs I should register for local development
- if it makes sense, include the production URL too

### 6. Final checklist
At the end, build a simple checklist so I can verify that I got everything right.

## Important Rules

- do not assume I already know the Supabase dashboard
- explain it as if I were doing this for the first time
- be objective, but detailed
- if menu names changed in newer Supabase versions, mention that
- do not invent values; only explain where to find each one
