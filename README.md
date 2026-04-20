# 👤 Vaccination Citizen — Citizen-Facing Portal

Part of the [Vaccination Management System](https://github.com/IstiakAdil14/automating-the-vaccination-process-hackathon-project-general-users).

Runs on **port 3000** locally. Handles citizen registration, appointment booking, vaccine passport, and AI assistance.

---

## 🚀 Getting Started

```bash
cp .env.example .env.local   # fill in your values
npm install
npm run dev                  # http://localhost:3000
```

---

## ✨ Features

- NID/Birth registration with OTP
- Family member management
- AI-powered appointment booking
- Map-based vaccination center discovery
- QR-based digital vaccine passport
- SMS/Email/In-app smart reminders
- OCR scan for paper vaccine cards
- Side-effect reporting
- AI chatbot (24/7 assistance)
- Bangla / English localization

---

## 🔑 Environment Variables

```env
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
MONGODB_URI=
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=
OPENAI_API_KEY=
```

See `.env.example` for full reference.

---

## 🌍 Localization

Locale files are in `/locales`:
- `en.json` — English
- `bn.json` — Bangla

---

## 🚀 Deployment

Deploy to Vercel as a standalone project. Set all env vars in the Vercel dashboard.

---

## 📄 License

MIT
