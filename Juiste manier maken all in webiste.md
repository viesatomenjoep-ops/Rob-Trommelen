# De Ultieme Blueprint: Next.js + Supabase All-In-One Website & CMS
*Project: Equivest Platform (Property Template 1)*

Dit document dient als de perfecte blauwdruk voor het opzetten van een hoogwaardige, dynamische website inclusief een op maat gemaakt Content Management Systeem (CMS). We hebben moderne technologieën gecombineerd voor snelheid, veiligheid en een luxe uitstraling.

## 1. De Technologie Stack
- **Framework**: Next.js 15 (App Router) voor razendsnelle Server-Side Rendering (SSR).
- **Styling**: Tailwind CSS gecombineerd met CSS Modules en custom animaties (bijv. de scrollende logo's en glassmorphism).
- **Database & Authenticatie**: Supabase (PostgreSQL). Zorgt voor veilige login en vlotte data-opslag.
- **Media Opslag**: Cloudinary. Perfect voor het hosten van grote afbeeldingen, X-Rays, en PDF documenten (paspoorten, vet checks) zonder de eigen server te belasten.
- **Hosting**: Vercel.

---

## 2. Architectuur & Mappenstructuur
Om de publieke website en het afgeschermde CMS goed te scheiden, gebruiken we de Next.js Route Groups (`(frontend)`):

```text
src/
 ┣ app/
 ┃ ┣ (frontend)/       <-- Alle publieke pagina's (Home, Portfolio, Contact, ROI)
 ┃ ┣ admin/            <-- Het CMS (beveiligd achter login)
 ┃ ┣ actions/          <-- Server Actions (communicatie met Supabase)
 ┃ ┣ globals.css       <-- Tailwind configuratie & Equivest kleuren/animaties
 ┃ ┗ layout.tsx        <-- De hoofd layout met de Quicksand fonts
 ┣ components/         <-- Herbruikbare UI blokken (Navbar, Footer, Calculators)
 ┗ lib/
   ┗ supabase/         <-- Supabase connectie scripts
```

---

## 3. Database & Supabase API Integratie
In plaats van ingewikkelde losse API-endpoints (REST), maken we gebruik van **Next.js Server Actions**. Dit is veel veiliger en sneller.

### Supabase Connectie (`src/lib/supabase/server.ts`)
We gebruiken de officiële `@supabase/ssr` package om cookies te lezen en schrijven. Dit zorgt ervoor dat we op de server (voordat de pagina laadt) al weten of iemand is ingelogd.

### Server Actions (`src/app/actions/property.ts`)
Elke actie (paard toevoegen, updaten of verwijderen) draait direct op de server:
1. Checkt via `supabase.auth.getUser()` of de gebruiker admin rechten heeft.
2. Haalt de data op via de `FormData` (formulieren in het CMS).
3. Slaat de data op in de Supabase `properties` tabel.
4. Roept `revalidatePath('/properties')` aan. Dit is **cruciaal**: het vertelt Vercel dat de cache geleegd moet worden, zodat de nieuwe paarden *direct* zichtbaar zijn op de live website.

### Migraties (`supabase/migrations/`)
Database wijzigingen doen we structureel. Toen we documenten (Keuringen, X-Rays) wilden toevoegen, maakten we een SQL migratiebestand aan:
```sql
ALTER TABLE properties
ADD COLUMN doc_vet_check TEXT,
ADD COLUMN link_fei TEXT;
```
Daarna voerden we `npx supabase db push` uit om dit veilig naar de cloud te sturen.

---

## 4. Media & Documenten Beheer (Cloudinary)
We hebben `next-cloudinary` geïnstalleerd en een custom `CloudinaryUploader` component gebouwd.
Wanneer je in het CMS op "Upload Document" of "Upload Cover" klikt:
1. De uploader opent een beveiligde verbinding met Cloudinary.
2. Het bestand (afbeelding of PDF) wordt geüpload naar Cloudinary.
3. Cloudinary stuurt een directe URL (link) terug.
4. Deze URL wordt op de achtergrond in het onzichtbare `<input type="hidden">` veld gezet, en gaat via de Server Action mee naar Supabase.

Dit voorkomt zware database-loads en garandeert snelle laadtijden op de publieke site.

---

## 5. CMS Systeem (Admin Panel)
Het CMS is de controlekamer. Wat we specifiek hebben gebouwd:
- **Veilige Login**: `src/app/admin/login` checkt in via Supabase. Als het lukt, wordt een beveiligde cookie geplaatst.
- **Layout Beveiliging**: In `src/app/admin/layout.tsx` controleren we bij elke klik of de user bestaat. Zo niet? Directe redirect naar `/admin/login`.
- **Complexe Formulieren**: Het formulier (`src/app/admin/properties/new/page.tsx`) verwerkt niet alleen teksten, maar combineert dit met de Cloudinary uploader en slaat alles asynchroon op via de Server Action.

---

## 6. Frontend: Luxe Design & Functionaliteiten
De publieke website is ontworpen om direct vertrouwen en luxe (High-End Investments) uit te stralen.

- **Branding**: `Quicksand` font voor een zachte, luxe uitstraling, en een specifiek "Equivest" kleurenpalet (`#111111` primary, `#08704D` accent).
- **Interactieve Scroll Logo's (`ScrollLogo.tsx`)**: In de Navbar en Footer luistert een *Client Component* (`useEffect`) naar de `window.scrollY`. Tijdens het scrollen wordt de rotatie berekend, waardoor de logo's vloeiend meedraaien op het tempo van de bezoeker.
- **Complexe Calculators (`SimpleRoiCalculator` & `AdvancedRoiCalculator`)**: Dit zijn zware rekenmodules. Door `"use client"` bovenaan de componenten te zetten, berekenen deze live in de browser van de gebruiker (zonder de server te belasten) de exacte Return on Investment, gebaseerd op de interactieve sliders.
- **Contact & Footer Module**: Dynamische integratie van Google Maps en directe "click-to-chat" WhatsApp linkjes (met een specifiek Amerikaans nummer `+15613010984`) voor directe lead-generatie.

---

## 7. Volgende Projecten: De Workflow
Wanneer je dit als blueprint voor je volgende project gebruikt, volg je deze stappen:
1. Kloon deze repository (`Property-Template-1-all-in`).
2. Maak een nieuw Supabase project aan en draai de migraties (`supabase db push`).
3. Koppel je nieuwe Supabase API-keys (URL & ANON KEY) in je `.env.local` bestand.
4. Maak een nieuw Cloudinary account (of map) en voeg de `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` toe in de `.env`.
5. Pas in `globals.css` het primaire kleurenpalet aan, en je hebt in 5 minuten een volledig operationeel maatwerk CMS met een luxe frontend staan!
