# Penny Planner

A warm, hopeful single-page calculator that helps people with credit card debt see three clear ways to pay it off. No accounts, no sign-up, no backend — just numbers, a plan, and Penny the pixel budgie cheering you on.

**Live idea:** enter income, debts, and living costs, then click **CRACK THE NUT**.

## What you get

- **Avalanche** — put leftover money on the highest-interest debt first (usually the card)
- **Snowball** — clear the smallest balance first for a quick win
- **Safety Net** — pay the card while tucking a slice into savings

Each card shows a plain-English to-do list, months to debt-free, extra interest along the way, and a freedom date. Hover (or tap) the **i** next to a strategy name for a short explanation.

Interest rates are optional. If you leave them blank, typical UK rates are used (22% cards, 10% other debts).

## Run locally

You need [Node.js](https://nodejs.org/) 18 or newer.

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173/`).

```bash
npm run build    # production build
npm run preview  # preview the production build
npm run lint     # lint
```

## Tech

- React + Vite
- Tailwind CSS
- Everything runs in the browser — no database, no login

## Deploy

This app is set up for Vercel’s free tier. Connect the GitHub repo and use the default Vite settings (`npm run build`, output folder `dist`).

## Disclaimer

Penny Planner is a simple calculator for illustration only. It is not financial advice, and we are not offering financial advice. Check figures with a qualified adviser if you need personal guidance.

## Licence

Free and open source.
