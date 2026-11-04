# StudioSpace

StudioSpace is a full-stack marketplace where creators discover, compare and book photo studios, film stages, podcast lounges and music suites by the hour — and where hosts can list and manage their own spaces.

## Live Site

| Service | URL |
| --- | --- |
| **Frontend** | https://studiospace-vert.vercel.app |
| **Backend API** | https://studiospace-backend-chi.vercel.app |
| **Frontend repository** | https://github.com/Md-sihab11/studioSpace |
| **Backend repository** | https://github.com/Md-sihab11/studioSpace-Backend |

### Examiner Test Credentials

| Field | Value |
| --- | --- |
| Email | `examiner@studiospace.dev` |
| Password | `Examiner123` |

The account is a normal user, so it can browse studios, create a listing, edit/delete its own listing and make or cancel bookings. Sign in at **https://studiospace-vert.vercel.app/login**.

## Features

- **Curated home page** — Swiper hero carousel, live featured studios, category shortcuts and a four-step “how it works” section.
- **Explore & search** — browse every listing, filter by category through the URL (`/studios?category=Film%20Stage`), search by name/location/amenity, clear filters, and see dedicated loading, empty and error states.
- **Studio details** — image gallery, amenities, capacity, location, hourly rate, security deposit, host details, sample reviews and a booking panel.
- **Authentication** — email/password and Google sign-in via BetterAuth, HTTPOnly session cookies, and short-lived JWTs issued by the `/api/auth/token` endpoint.
- **Host dashboard** — create, edit and delete listings; ownership is checked in the UI *and* on the server. Cover and gallery images upload to imgbb, with a direct image-URL fallback.
- **Hourly booking** — pick a date, start time and duration; see the calculated total; cancel a pending booking from “My Bookings”. Overlapping reservations for the same studio and day are rejected with HTTP `409`.
- **Private routes** — `/dashboard`, `/my-listings`, `/my-bookings`, `/profile`, `/add-studio` and `/studios/edit/:id` redirect signed-out visitors to login and return them afterwards.
- **Responsive UI + theme toggle** — mobile navigation, adaptive grids, accessible dialogs, and a persisted light/dark theme with no flash on load.
- **Toast notifications** — Sonner success/error messages for auth, CRUD, uploads and booking actions (no browser `alert()` calls).
- **Custom 404 / empty states** — friendly not-found pages for missing studios and empty dashboard lists.

## Tech Stack

**Frontend**

- Next.js 16 (App Router, Turbopack, Cache Components) and React 19
- TypeScript
- Tailwind CSS 4 with shadcn-style components
- BetterAuth (email/password + Google OAuth, JWT plugin)
- Swiper, lucide-react, Sonner, date-fns
- imgbb for image hosting

**Backend**

- Node.js + Express 5
- MongoDB Atlas with the official `mongodb` driver
- `jose` for remote JWKS verification of BetterAuth JWTs
- Deployed as a Vercel serverless function (also runs on Render as a normal Express server)

## How the Required Challenges Were Solved

1. **HTTPOnly JWT authentication** — BetterAuth stores the session in an HTTPOnly cookie. The client asks `/api/auth/token` for a signed JWT and sends it as `Authorization: Bearer <token>`. The Express API verifies that token against `${BETTER_AUTH_URL}/api/auth/jwks` with `jose`, including issuer and audience checks. Protected endpoints never trust an email or owner name supplied by the browser.
2. **Double-booking prevention** — `POST /add-booking` loads all `Pending`/`Confirmed` bookings for the same studio and date, converts `HH:mm` times to minutes and rejects any overlapping interval with HTTP `409`. The UI surfaces the server message.
3. **Theme toggle** — a tiny inline script applies the saved theme before hydration, the toggle updates `localStorage` and the `dark` class, and both the navbar and dashboard share the same `studiospace_theme` key.

## Local Setup

### Prerequisites

- Node.js 20 or newer
- A MongoDB Atlas database (or any MongoDB connection string)
- An imgbb API key for image uploads (optional — you can paste image URLs instead)

### 1. Backend

```bash
git clone https://github.com/Md-sihab11/studioSpace-Backend.git
cd studioSpace-Backend
npm install
```

Create `.env` from `.env.example`:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
BETTER_AUTH_URL=http://localhost:3000
```

Start the API:

```bash
npm run dev     # nodemon
# or
npm start       # node index.js
```

The API runs at `http://localhost:8000`. Check it with `GET http://localhost:8000/studios`.

### 2. Frontend

```bash
git clone https://github.com/Md-sihab11/studioSpace.git
cd studioSpace
npm install
```

Create `.env.local` from `.env.example`:

```env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-long-random-string
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_IMGBB_API_KEY=your-imgbb-key
```

Optional Google sign-in:

```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

For Google OAuth, add this authorized redirect URI in Google Cloud Console:

```
http://localhost:3000/api/auth/callback/google
```

Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

> `BETTER_AUTH_URL` on the backend **must** match the origin serving the frontend, because that is where BetterAuth publishes its JWKS keys. When deploying, set it to `https://studiospace-vert.vercel.app` (or your own domain) and redeploy the backend.

## Environment Variables

| Variable | App | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | Frontend | Express API base URL |
| `BETTER_AUTH_URL` | Both | Public frontend origin used by BetterAuth and JWT verification |
| `BETTER_AUTH_SECRET` | Frontend | BetterAuth signing secret |
| `MONGODB_URI` | Both | MongoDB Atlas connection string |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Frontend | Optional Google OAuth |
| `NEXT_PUBLIC_IMGBB_API_KEY` | Frontend | imgbb cover/gallery uploads |
| `PORT` | Backend | Local Express port (default `8000`) |

Secrets are never committed; only `.env.example` files are tracked.

## API Overview

| Method | Endpoint | Auth | Description |
| --- | --- | --- | --- |
| `GET` | `/studios` | Public | List studios (`?limit=6&sort=rating` supported) |
| `GET` | `/studios/:id` | Public | Single studio |
| `POST` | `/add-studio` | JWT | Create a listing (owner taken from token) |
| `PUT` | `/update-studio/:id` | JWT | Update own listing |
| `DELETE` | `/delete-studio/:id` | JWT | Delete own listing |
| `GET` | `/my-listings/:email` | JWT | Own listings only |
| `POST` | `/add-booking` | JWT | Create booking; rejects overlaps with `409` |
| `GET` | `/my-bookings/:email` | JWT | Own bookings only |
| `PATCH` | `/cancel-booking/:id` | JWT | Cancel own pending booking |
| `PATCH` | `/booking-status/:id` | JWT | Guest or host updates booking status |

## Scripts

| Command | Location | Description |
| --- | --- | --- |
| `npm run dev` | Frontend | Start Next.js in development |
| `npm run build` | Frontend | Production build |
| `npm start` | Frontend | Start the production server |
| `npm run lint` | Frontend | Run ESLint |
| `npm run dev` | Backend | Start Express with nodemon |
| `npm start` | Backend | Start Express with Node |

## Notes

- The home page asks the API for `?limit=6&sort=rating`; the client also sorts by rating and creation date before rendering.
- Legacy seed documents may use `imageUrl` while new listings use `image`; both the API and UI normalize the field.
- Image uploads require `NEXT_PUBLIC_IMGBB_API_KEY`. Without a key the form explains the configuration issue and still accepts a direct HTTPS image URL.
