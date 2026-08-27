# Penny Planner - Product Requirements Document

## What This App Does

Penny Planner is a single-page web app that helps people with credit card debt figure out the best way to pay it off. No accounts, no sign-ups, no dashboards. Just input numbers, get three clear strategies, and see exactly when you'll be debt-free.

Think of it like a warm, hopeful calculator with a pixel-art budgie (Penny) cheering you on.

---

## The One-Page Layout

Users see one page with these sections from top to bottom:

### 1. Header (Top)
- Pixel budgie (🐦) with mood states: Happy (default), Thinking (calculating), Dancing (debt-free)
- Title: "Penny Planner" in pixel font
- Subtitle: "Let's crack this nut!"
- Progress bar: "Debt Freedom: 0%" that fills as debt decreases

### 2. Input Section
Four warm-styled input fields:
- 💰 Monthly Income (after tax)
- 💳 Credit Card Debt
- 📊 Other Debts (loans, buy-now-pay-later, etc.)
- 🏠 Living Costs (rent, food, bills, transport)

Each input has a £ symbol, soft warm border, and gentle glow. Encouraging text below: "Every penny counts toward your freedom!"

### 3. Calculate Button
Single button labeled "🌰 CRACK THE NUT 🌰" with warm orange/gold gradient. On click: sparkles appear, label briefly shows "💥 CRACKED!", then reverts. Soft pulsing animation to draw attention.

### 4. Results Cards (Three Strategies)
Three cards appear after calculation:

**Card 1: Avalanche** (❄️ blue theme)
- Pay minimums on everything, then throw ALL extra money at highest interest debt first (credit card at 22%)
- Shows: Months to debt-free, Interest saved (£), Freedom date
- Hopeful message: "You're closer than you think!"

**Card 2: Snowball** (🌱 green theme)
- Pay minimums on everything, then throw ALL extra money at smallest balance first
- Shows: Months to debt-free, Interest saved (£), Freedom date
- Hopeful message: "Small wins lead to big victories!"

**Card 3: Safety Net** (🛡️ gold theme)
- Split extra money: 70% to credit card, 30% into savings
- Shows: Debt remaining after 12 months, Savings accumulated, Freedom date
- Hopeful message: "Smart planning pays off!"

### 5. Footer
Simple footer: "🎮 Penny Planner • Free & Open Source"

---

## The Maths Behind It

### Inputs
- Monthly salary (after tax) → `salary`
- Total credit card debt → `ccDebt`
- Other balances → `otherDebt`
- Monthly living expenses → `expenses`

### Fixed Assumptions
- Credit card interest: 22% per year
- Other debt interest: 10% per year
- Minimum payment: 2% of balance or £5 (whichever is higher)

### Step 1: Calculate Available Money
extraMoney = salary - expenses

If `extraMoney` is negative → show warning.

### Step 2: Calculate Minimum Payments
ccMinimum = MAX(ccDebt × 0.02, 5)
otherMinimum = MAX(otherDebt × 0.02, 5)
totalMinimums = ccMinimum + otherMinimum

**Example:**
- ccDebt = £5,000 → ccMinimum = £100 (5,000 × 0.02)
- otherDebt = £200 → otherMinimum = £5 (200 × 0.02 = £4, but min is £5)

### Step 3: Calculate Extra Available
availableExtra = extraMoney - totalMinimums

If `availableExtra` is negative → only pay minimums.

### Strategy 1: Avalanche (Highest Interest First)
All extra money goes to the highest interest debt (credit card at 22%).

Each month:
1. Add monthly interest
2. Pay minimums on both debts
3. Put ALL `availableExtra` toward credit card
4. Once credit card is £0, redirect all extra to other debt
5. Count months until both debts are £0

### Strategy 2: Snowball (Smallest Balance First)
All extra money goes to the smallest balance first.

### Strategy 3: Safety Net (70/30 Split)
Split extra money to build savings while paying debt.

Each month for 12 months:
1. Add monthly interest
2. Pay minimum payment on credit card
3. Split `availableExtra`: 70% → credit card, 30% → savings
4. Repeat for 12 months

### Freedom Date Calculation
freedomDate = today's date + months

- months = 0 → "🎉 You're already debt-free!"
- months = 14 → month + year label

---

## Design Style

**Warm, Hopeful, Game-like Aesthetic:**
- Background: Warm cream to soft gold gradient
- Colors: Gold (#FFD166), Orange (#FF8C42), Warm brown (#8B7355)
- Card gradients: Blue (#4A90D9), Green (#66BB6A), Gold (#FFB74D)
- Soft rounded corners (8px), gentle shadows
- Pixel font for numbers and headings
- Clean rounded font for labels and body text
- No harsh black borders—use warm browns instead
- Gentle animations throughout

---

## Penny the Budgie (The Mascot)

A pixel-art budgie in the header with three moods:
- **Happy** (🐦) - default, gentle bounce animation
- **Thinking** (🤔) - appears for 1.5 seconds while calculating
- **Dancing** (🎉) - celebrates when all debt is gone

Small text label below shows current mood: "Happy", "Thinking...", or "Dancing!"

---

## User Flow

1. User opens page → sees Penny (happy) + 4 inputs
2. User types in their numbers
3. User clicks "🌰 CRACK THE NUT 🌰"
4. Penny switches to "Thinking" for 1.5 seconds
5. Three strategy cards appear with clear numbers
6. If debt reaches zero, Penny dances and celebrates

**That's it.** No multiple pages. No login. No dashboard.

---

## Edge Cases

| Situation | What Happens |
|-----------|--------------|
| All inputs are zero | Shows: "🌱 No debt to crack—add numbers to start!" in gold text |
| Expenses exceed salary | Shows: "💪 Spending more than earning—let's cut back!" in orange text |
| Debt is zero | Shows: "🎉 AMAZING! You're debt-free!" with Penny dancing |
| Negative numbers | Not allowed (minimum value is 0) |

---

## Technical Requirements

- **Framework:** React with Vite
- **Styling:** Tailwind CSS + custom warm theme
- **No backend:** Everything runs in browser
- **Hosting:** Vercel (free tier)
- **Responsive:** Works on mobile, tablet, desktop
- **Fonts:** Pixel font for numbers, clean font for body

---

## What We're NOT Building

- ❌ No user accounts or profiles
- ❌ No database or saving data
- ❌ No payment or monetisation
- ❌ No email signups
- ❌ No multiple pages or navigation
- ❌ No AI or automation
- ❌ No coin game (removed)

Just one page, four inputs, three strategies, and Penny.
