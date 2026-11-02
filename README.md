# PASCHAL REALTY — Luxury Real Estate Rental Platform

PASCHAL REALTY is a premier, production-grade luxury real estate platform specializing in renting high-end houses, waterfront villas, sky penthouses, and serviced duplexes in Nigeria (Banana Island, Old Ikoyi, Maitama Abuja, Lekki Phase 1, and Eko Atlantic City).

Designed with a luxury black, gold, and white aesthetic, typography pairing Playfair Display and Plus Jakarta Sans, and an editorial presentation tailored for diplomatic corps, diaspora returnees, and multinational executives.

---

## Key Features

1. **Five Core Pages**:
   - **Home**: High-impact architectural hero, instant multi-criteria search bar (neighborhood, property type, bedrooms), featured luxury rentals, prime location guides, the Paschal distinction, attributable testimonials, and direct concierge inquiry banners.
   - **Properties for Rent**: Comprehensive search, location filtering, interactive price slider (up to ₦150M+), bedroom count selector, furnishing filter, amenity checkboxes, and grid/list view toggles.
   - **Property Details**: High-resolution image gallery with thumbnail ribbon and full-screen lightbox modal, specs breakdown (beds, baths, sqm, parking), verified amenities, security & power protocols, Nigerian tenancy terms, and direct WhatsApp actions.
   - **About Us**: Brand story, 42-point inspection standards, guaranteed 24/7 power infrastructure, and diplomatic security guidelines.
   - **Contact Us**: Direct telephone (+234 902 497 1419), WhatsApp, Lagos & Abuja office locations, responsive inquiry form with real-time feedback, and Nigeria rental FAQ.

2. **Direct WhatsApp Integration**:
   - Connected directly to **`09024971419`**.
   - Floating WhatsApp concierge accessible on all pages.
   - Pre-filled WhatsApp message buttons on every property card and details page referencing the property name, reference code, and location.

3. **Secure Admin Dashboard**:
   - Username: `paschal`
   - Default initial bootstrap password: `PaschalLuxury2025!` (updateable via the Security tab).
   - Server-side authorization using PBKDF2 SHA-512 cryptographic hashing and salted session tokens. No hardcoded passwords in client code.
   - Complete property lifecycle: Upload new properties, edit existing listings, delete properties, and quick-toggle availability status (`Available`, `Under Offer`, `Leased`).
   - Customer Enquiries desk: View, update status, and directly call or WhatsApp prospective tenants.

4. **Supabase Database & Storage Integration**:
   - Dedicated configuration console in Admin settings to connect Supabase via Project URL and Anon/Publishable Key.
   - Live connection testing and status verification.
   - Ready-to-run PostgreSQL schema script for Supabase SQL Editor (`properties`, `enquiries`, and `property-images` bucket).
   - Dual persistence: Works seamlessly out of the box with server-side JSON database storage, with optional live sync to Supabase.

---

## Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React, Motion
- **Backend**: Node.js, Express, tsx
- **Database & Storage**: Server-side persistence with Supabase PostgreSQL and Supabase Storage integration
- **Styling**: Luxury Gold (`#D4AF37`), Deep Obsidian (`#0B0B0C`), Crisp White

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

---

## Supabase Setup (Optional)

1. Create a project at [Supabase](https://supabase.com).
2. Go to **SQL Editor** -> **New query**.
3. Copy the SQL schema from the Admin Dashboard -> **Supabase Database & Storage** tab.
4. Paste and click **Run**.
5. Copy your **Project URL** and **anon public key** from Project Settings -> API.
6. In the Paschal Realty Admin Dashboard, paste the credentials and click **Test & Save Supabase Config**.

---

## Deployment

### Vercel Deployment
1. Push the code to your GitHub repository.
2. Import the repository in [Vercel](https://vercel.com).
3. The included `vercel.json` automatically configures single-page application routing.
4. Add environment variables if desired (`SUPABASE_URL`, `SUPABASE_ANON_KEY`).
5. Click **Deploy**.

---

## License
Private and Confidential © PASCHAL REALTY. All rights reserved.
