# Setup Instructies: Rob Trommelen Makelaardij Prototype

Aangezien ik geen toegang heb tot jouw wachtwoorden, kun je met deze stappen in je eigen terminal de cloud diensten aanmaken en koppelen. Zodra je dit hebt gedaan, is je project volledig verbonden met de cloud!

**Zorg ervoor dat je terminal in de juiste map staat:**
```bash
cd "/Users/tomvanbiene/Desktop/Perfect blueprint template/Rob Trommelen Prototype"
```

---

### 1. GitHub (Code Opslag)
Laten we je lokale code aan een nieuwe GitHub repository koppelen.

```bash
git init
git add .
git commit -m "Initial commit Rob Trommelen Makelaardij"
gh repo create rob-trommelen-makelaardij --public --source=. --remote=origin
git push -u origin main
```

---

### 2. Supabase (Database & Login)
Ga naar [Supabase.com](https://supabase.com) in je browser en maak een nieuw project aan (bijv. `rob-trommelen-db`). Sla je database wachtwoord goed op!

Vervolgens koppel je dit project lokaal:
```bash
npx supabase login
npx supabase init
```
Link nu je specifieke project (vervang `<PROJECT_ID>` door de ID uit je Supabase URL, bijv. `abcdefghijklmnop`):
```bash
npx supabase link --project-ref <PROJECT_ID>
```

Zodra ik de database bestanden straks heb omgeschreven van 'paarden' naar 'woningen', kun je de structuur naar je cloud pushen met:
```bash
npx supabase db push
```

---

### 3. Cloudinary (Media Hosting)
Ga naar [Cloudinary](https://cloudinary.com/) en maak een account aan (of log in). 
Ga naar je Dashboard en kopieer de volgende gegevens naar een bestand genaamd `.env.local` in de hoofdmap van je project:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="jouw_cloud_name"
NEXT_PUBLIC_CLOUDINARY_API_KEY="jouw_api_key"
CLOUDINARY_API_SECRET="jouw_api_secret"
```

---

### 4. Vercel (Hosting & Live Website)
Zodra je code op GitHub staat, kun je het project makkelijk online zetten via Vercel:

```bash
npx vercel link
npx vercel build
```
*(Kies in het menu om je GitHub repository te linken)*. 
Vergeet niet in het Vercel Dashboard onder **Settings > Environment Variables** je Supabase API keys en Cloudinary keys toe te voegen!

---

💡 **Tip:** Terwijl jij dit doet, ben ik op de achtergrond al bezig om in jouw lokale map alle "horse" gerelateerde bestanden en database-migraties om te schrijven naar "properties/woningen" specifiek voor de makelaardij. Laat me weten zodra je deze stappen hebt doorlopen of als je ergens vastloopt!
