# BUFFET AI — PRODUCT OVERVIEW

## Problem, Target Audience & Monetization Strategy

---

## 1. THE PROBLEM

Personal investing has become increasingly accessible through commission-free
brokerages and the rise of cryptocurrency exchanges, yet the tools available
to everyday investors remain fragmented and intimidating. A typical retail
investor faces several pain points:

- **Portfolio fragmentation:** Assets are spread across multiple platforms
  (stock brokers, crypto exchanges, commodity dealers, savings accounts).
  There is no single view of total wealth or performance.

- **Information overload:** Financial news, market data, and analyst opinions
  are abundant but difficult to synthesise. Investors struggle to get
  concise, personalised answers to simple questions like "Should I
  rebalance?" or "How is my portfolio performing this quarter?"

- **Lack of actionable guidance:** Free tools show prices and charts but
  rarely offer context or insight. Professional advisory services are
  expensive and inaccessible for small portfolios.

- **Complexity of financial data:** Reading candlestick charts, understanding
  P/E ratios, and interpreting macro trends requires knowledge that most
  casual investors do not have.

Buffet AI exists to close this gap: a single, intelligent companion that
consolidates portfolio tracking with AI-powered financial guidance in a
clean, approachable mobile experience.

---

## 2. TARGET AUDIENCE

### Primary Audience — Retail Investors (ages 20–45)

These are tech-savvy individuals who have begun investing through apps
like Robinhood, Coinbase, or Trading 212 but lack the expertise or time
to manage a diversified portfolio effectively. They:

- Hold a mix of stocks, ETFs, cryptocurrencies, and possibly precious
  metals or cash reserves.
- Want a unified dashboard to see all holdings in one place.
- Prefer mobile-first experiences with modern, polished interfaces.
- Are comfortable paying a modest subscription for tools that save
  them time and improve their financial decisions.

### Secondary Audience — Beginner Investors

People who are new to investing and want a low-friction way to start
tracking their first assets. The AI chat feature acts as a personal
tutor, answering basic financial questions in plain language without
the jargon of traditional finance tools.

### Geographic Focus

Initially targeting English-speaking markets (US, UK, EU). The app
supports multiple fiat currencies (USD, EUR, GBP) and both imperial
and metric weight units for precious metals, making it adaptable to
a global audience.

---

## 3. MONETIZATION STRATEGY

### 3.1 Revenue Model — Freemium Subscription

Buffet AI follows a freemium model with a single subscription tier:

| FREE TIER | BUFFET AI PRO (paid monthly) |
|-----------|------------------------------|
| Basic portfolio tracking | Everything in Free, plus: |
| Add & view assets | • AI-powered financial chatbot |
| Current price display | • Historical price charts |
| Multi-currency support | • Personalised investment insights |
| | • Unlimited portfolio tracking |

The free tier provides enough value to attract users and demonstrate
the app's quality. The premium tier unlocks features that deliver
ongoing value — particularly the AI chatbot, which becomes more
useful the longer a user invests.

### 3.2 Pricing

Buffet AI Pro is offered as a monthly auto-renewing subscription
managed through the Apple App Store (and Google Play Store when the
Android build is ready). Pricing is set per-market through the
respective store dashboards. The paywall displays the localised
price provided by RevenueCat at runtime (e.g. "$X.XX/month").

### 3.3 Payment Infrastructure

All billing is handled by RevenueCat (react-native-purchases SDK),
which provides:

- **Server-side receipt validation** — Purchases are verified by
  RevenueCat's servers, not on-device, reducing fraud risk.
- **Cross-platform entitlement management** — A single "Buffet AI Pro"
  entitlement controls access regardless of platform.
- **Subscription lifecycle handling** — Renewals, cancellations,
  grace periods, and billing retries are managed automatically.
- **Restore purchases** — Users who reinstall the app or switch
  devices can restore their subscription with one tap.
- **Analytics** — RevenueCat's dashboard provides MRR, churn,
  trial conversion, and cohort data out of the box.

### 3.4 Conversion Strategy

The app is designed to convert free users into subscribers through
natural engagement:

1. **Onboarding paywall** — New users see the paywall during the
   onboarding flow. They may subscribe immediately or dismiss
   it to explore the free tier first.

2. **Feature-gated discovery** — When a free user taps the AI Chat
   tab, they encounter the paywall naturally at the moment of
   highest intent, increasing conversion likelihood.

3. **Value demonstration** — The free portfolio tracker builds daily
   usage habits. Once users rely on the app, the premium AI
   features become a logical upgrade.

4. **Frictionless purchase** — The subscription flow is a single tap
   backed by native App Store / Play Store payment sheets,
   minimising drop-off.

### 3.5 Future Monetization Opportunities

- Annual subscription plan at a discounted rate to improve retention.
- Family or team plans for households managing shared finances.
- Premium data add-ons (real-time streaming quotes, advanced
  technical indicators).
- Affiliate partnerships with brokerages for account referrals.
