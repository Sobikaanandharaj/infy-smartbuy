# Infy SmartBuy

An e-commerce website built for a hackathon. Browse electronics, sign up, log in, and manage your profile.

## Tech Stack

- **Frontend:** Next.js, React, Tailwind CSS (initial UI generated with v0)
- **Backend / Database:** Supabase (PostgreSQL + Auth)
- **Development:** GitHub Codespaces

## Features

- Product catalog loaded from Supabase
- Search and category browsing
- Cart and wishlist
- User signup and login (Supabase Auth)
- Profile page (name, email, role)
- Logout
- Admin dashboard (in progress)

## Database Tables

`products`, `categories`, `profiles`, `cart_items`, `wishlist`, `orders`, `order_items`

## Run Locally

1. Clone the repo:
   ```
   git clone https://github.com/Sobikaanandharaj/infy-smartbuy.git
   cd infy-smartbuy
   ```
2. Install packages:
   ```
   npm install
   ```
3. Create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
   ```
4. Start the app:
   ```
   npm run dev
   ```
5. Open http://localhost:3000

## Demo Account

- Email: `your_demo_email`
- Password: `your_demo_password`

## Known Limitations

- Admin dashboard is still under development.
- Image warnings in the console do not affect functionality.

## Author

Sobika Anandharaj
