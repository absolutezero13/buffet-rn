# BUFFET AI — TECH STACK, ARCHITECTURE & REVENUECAT

---

## 1. TECH STACK

### Frontend Framework
- React Native 0.81.4 with Expo 54
- TypeScript 5.9
- Node.js 22.13.1
- Firebase Functions for backend

### Navigation
- @react-navigation/native v7 (static configuration API)
- @react-navigation/native-stack for stack navigators
- @bottom-tabs/react-navigation for native bottom tab navigation

### State Management
- Zustand 5.0.11 — lightweight, hook-based stores

### Networking
- Axios 1.13.4 — HTTP client communicating with a Cloud Run backend
  (https://api-cq6jajwdtq-uc.a.run.app/)

### In-App Purchases / Monetization
- react-native-purchases 9.7.6 (RevenueCat SDK)

### UI & Styling
- expo-linear-gradient for gradient backgrounds
- react-native-reanimated v4 for animations
- @callstack/liquid-glass for glass-morphism effects
- react-native-gifted-charts & react-native-svg for charting
- @lodev09/react-native-true-sheet for bottom sheets
- expo-image for optimised image rendering
- @ronradtke/react-native-markdown-display for rendering AI chat responses

### Local Storage
- @react-native-async-storage/async-storage for persisting user data,
  assets, and preferences

### Other Expo Modules
- expo-splash-screen, expo-asset, expo-linking, expo-system-ui

### Development
- Babel for transpilation
- TypeScript for type checking
- Expo Dev Client for native development builds

---

## 2. ARCHITECTURE

### 2.1 Project Structure

```
src/
├── App.tsx                      Root component — initialises services,
│                                 renders Navigation
├── navigation/
│   ├── index.tsx                Static navigation configuration
│   ├── constants.ts             Route names, storage keys, asset options
│   └── screens/
│       ├── Portfolio/           Asset portfolio list & totals
│       ├── Chat/               AI chat (Gemini-powered)
│       ├── Settings/           User preferences
│       ├── AssetDetail/        Single-asset view with price charts
│       ├── Welcome/            Onboarding welcome screen
│       ├── Loading/            Splash / loading screen
│       └── Paywall/            Subscription paywall modal
├── components/                 Reusable UI (Button, IconButton, GlassCard,
│                                AssetCard, ChatMessage, TextInput, etc.)
├── store/                      Zustand stores
│   ├── useUserStore.ts         Onboarding & initialisation state
│   ├── useSubscriptionStore.ts Premium subscription flag
│   ├── useUserAssets.ts        User's portfolio assets
│   ├── useCurrencyStore.ts     Selected display currency & rates
│   └── useWeightUnitStore.ts   Weight-unit preferences (oz / g)
├── services/
│   ├── api.ts                  Base Axios client & market-data API calls
│   ├── assetApi.ts             CRUD operations for user assets
│   ├── chatApi.ts              AI chat endpoint (Gemini)
│   ├── revenueCatService.ts    RevenueCat integration
│   └── types.ts                Shared TypeScript interfaces
├── theme/                      Colours, spacing, typography tokens
├── hooks/                      Custom React hooks
└── assets/                     Images and icons
```

### 2.2 Navigation Architecture

The app uses React Navigation v7 with the static configuration API.
Two separate stacks are defined:

**OnboardingStack** (shown when user has not onboarded)
```
Welcome  →  Loading  →  Paywall (modal)
```

**AppStack** (shown after onboarding)
```
MainTabs  →  AssetDetail  |  Paywall (modal)
```

**MainTabs** (native bottom tabs)
```
Portfolio  |  AI Chat  |  Settings
```

The root `<Navigation>` component reads `useUserStore` to decide which
stack to render. Until the store's `isInitialized` flag is true the
component renders nothing, keeping the native splash screen visible.

### 2.3 State Management

Each Zustand store is a small, focused module:

- **useUserStore** — tracks whether the user has completed onboarding and
  whether the app has finished initialising.
- **useSubscriptionStore** — holds a single `isSubscribed` boolean, updated
  by RevenueCat after purchase verification.
- **useUserAssets** — maintains the list of portfolio assets with current
  prices; persisted to AsyncStorage.
- **useCurrencyStore** — stores the user's preferred currency and cached
  exchange rates.
- **useWeightUnitStore** — stores the preferred unit for precious metals.

### 2.4 Data Flow

1. App.tsx calls `initApp()` on mount.
2. `assetApi.getUserAssets()` loads saved assets from AsyncStorage and
   fetches live prices from the backend.
3. User state is restored from AsyncStorage → `useUserStore`.
4. `revenueCatService.initialize()` configures the Purchases SDK and
   checks the user's entitlement status → `useSubscriptionStore`.
5. The splash screen hides and the appropriate navigation stack renders.

### 2.5 Backend Services

The app communicates with a Firebase Functions backend that proxies
several third-party APIs:

| Endpoint | Purpose |
|----------|---------|
| /stock-price | Current stock price (Alpaca) |
| /stock-quote | Full stock bar data (Alpaca) |
| /stock-quotes | Batch stock quotes (Yahoo Finance) |
| /stock-history | Historical stock prices (Yahoo Finance) |
| /crypto-price | Current crypto price (CoinGecko) |
| /crypto-history | Historical crypto prices (CoinGecko) |
| /commodity-price | Current commodity price (Yahoo Finance) |
| /commodity-history | Historical commodity prices (Yahoo Finance) |
| /currency-rate | Fiat currency exchange rates (exchangeratesapi.io) |
| /search-symbol | Stock / ETF symbol search (Yahoo Finance) |
| /search-crypto | Cryptocurrency search (CoinGecko) |
| /chat | AI chat (Google Gemini) |

---

## 3. REVENUECAT IMPLEMENTATION

### 3.1 Overview

RevenueCat is used to manage the app's subscription offering,
"Buffet AI Pro". The integration lives in a single service file
(`src/services/revenueCatService.ts`) and interacts with Zustand
state via `useSubscriptionStore`.

### 3.2 Configuration

- **SDK:** react-native-purchases 9.7.6
- **Entitlement identifier:** "Buffet AI Pro"

### 3.3 Service API (revenueCatService)

**initialize()**

Called once at app startup in App.tsx.
- Configures the Purchases SDK with the platform API key.
- Fetches the current CustomerInfo from RevenueCat.
- Checks whether the "Buffet AI Pro" entitlement is active.
- Updates `useSubscriptionStore.isSubscribed` accordingly.

**getOfferings()**

Fetches available subscription packages from RevenueCat and returns
the current offering. Used by the Paywall screen to display pricing.

**purchase(pkg)**

Initiates a purchase flow for the given PurchasesPackage.
- On success, reads the returned CustomerInfo and updates the
  subscription store.
- If the product was already purchased (PRODUCT_ALREADY_PURCHASED_ERROR),
  it gracefully re-fetches CustomerInfo and updates the store rather
  than throwing an error.

**restorePurchases()**

Calls Purchases.restorePurchases() for users who need to recover
their subscription on a new device or after a reinstall, then
updates the subscription store.

### 3.4 Subscription State

`useSubscriptionStore` exposes:
- `isSubscribed: boolean`
- `setIsSubscribed(value: boolean): void`

The helper function `updateSubscriptionStatus(customerInfo)` is called
by every RevenueCat operation. It checks whether the "Buffet AI Pro"
entitlement exists in `customerInfo.entitlements.active` and writes
the result to the store.

### 3.5 Paywall Screen

Located at `src/navigation/screens/Paywall/index.tsx`.

- Displays premium features: AI chatbot, historical charts,
  personalised insights, unlimited portfolio tracking.
- Loads the first available package from RevenueCat offerings and
  shows its price (e.g. "Subscribe for $X.XX/month").
- "Subscribe" button triggers `revenueCatService.purchase(pkg)`.
- "Restore Purchases" link triggers `revenueCatService.restorePurchases()`.
- A close button allows dismissal:
  - During onboarding: marks the user as onboarded (free tier).
  - In-app: navigates back.

### 3.6 Feature Gating

Premium features (primarily the AI Chat) check
`useSubscriptionStore.isSubscribed` before granting access. If the
user is not subscribed, they are directed to the Paywall modal.
