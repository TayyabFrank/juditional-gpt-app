# ⚖️ JudicialGPT Mobile - Pakistan's Premier AI Judicial Copilot

[![React Native](https://img.shields.io/badge/React_Native-0.76-61DAFB?logo=react&logoColor=black)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-SDK_52-000020?logo=expo&logoColor=white)](https://expo.dev/)
[![Jurisprudence](https://img.shields.io/badge/Jurisprudence-Pakistan_Law_1947--2026-10b981)]()
[![License](https://img.shields.io/badge/License-MIT-amber)]()

**JudicialGPT** is a full-featured **React Native** cross-platform mobile application engineered specifically for Advocates, Judges, Legal Advisors, and Law Researchers in Pakistan. Powered by AI trained on the **Constitution of Pakistan 1973**, Federal Statutes, and 75+ years of binding **Supreme Court (SCMR, PLD SC)** and **High Court (PLD, CLC, YLR, PTD, MLD)** jurisprudence.

---

## 🌟 Key Features

### 🏛️ 1. AI Legal Copilot Workspace
- **Real-Time Statutory Legal Intelligence**: Ask legal questions, cite section numbers, or query procedural laws.
- **Authoritative Citation Extraction**: Automatically extracts and pinpoints verifiable law report citations (e.g., `PLD 2023 SC 145`, `2021 SCMR 980`, `Section 497 Cr.P.C.`).
- **Zero-Downtime Offline Legal Brain**: Built-in intelligent heuristic engine ensuring uninterrupted legal assistance even without active internet or API credentials.
- **Multi-Session Case Management**: Create new chats, switch between past legal inquiries, and maintain organized case research streams.
- **Document & Evidence Analyzer**: Templates for FIRs (S.154 CrPC), Civil Plaints, High Court Writs, and Bail Memos.

### 🗣️ 2. Multilingual Vernacular Legal AI
- Full native support with proper text alignment and RTL rendering:
  - **English** (Federal Statutes & Common Law)
  - **Urdu (اردو)** (قومی زبان)
  - **Balochi (بلوچی)** (صوبائی زبان)
  - **Punjabi (پنجابی)** (صوبائی زبان)
  - **Sindhi (سنڌي)** (صوبائي ٻولي)
- Accurately interprets local court idioms, archaic phrases, Arabic maxims, and Urdu legal terminology.

### ⚖️ 3. Specialized Procedural Toolkits
- **High Court Writ Drafter (Article 199)**: Grounds for Mandamus, Certiorari, Prohibition, Habeas Corpus, and Quo Warranto.
- **Post-Arrest Bail Analyzer (Section 497 Cr.P.C.)**: Evaluation of prohibitory clause exclusions, delay grounds, and cross-version FIRs.
- **Limitation & Vacation Auditor (Limitation Act 1908)**: Section 5 delay condonation analysis, High Court vacation exclusions, and ICA 30-day timelines.
- **Contract Breach & Specific Relief (Contract Act 1872 & Specific Relief Act 1877)**: Specific performance of real estate agreements and compensatory damages.
- **Qanun-e-Shahadat Evidence Checker (QSO 1984)**: Admissibility criteria for digital evidence, CCTV footage, and CDRs under Article 164.

### 👤 4. Advocate Credentials & Roles
- Advocate High Court identity card with Bar Council Enrollment number.
- 1-Tap Demo Switcher for:
  - Advocate High Court
  - Judicial Officer / Justice (Retd.)
  - Corporate Legal Counsel
  - Law Student / Researcher
  - Guest Jurist

---

## 📱 Tech Stack & Architecture

- **Framework**: [React Native](https://reactnative.dev/) (Pure Native Components: `View`, `Text`, `TouchableOpacity`, `TextInput`, `ScrollView`, `FlatList`, `Modal`, `StyleSheet`)
- **Runtime & Tooling**: [Expo SDK 52](https://expo.dev/) (Cross-platform iOS, Android, and Web)
- **Design System**: Curated Dark Judicial Palette (`#090d16` Deep Navy, `#10b981` Emerald Legal, `#f59e0b` Justice Gold)
- **AI Integration**: Google Gemini API + Offline Pakistani Statutory Knowledge Engine
- **State Management**: React Context API (`AuthContext`) + Local Session Service

---

## 📂 Project Structure

```
Judicialgpt/
├── App.js                         # Root entry point with Navigation & AuthProvider
├── app.json                       # Expo mobile app configuration & metadata
├── package.json                   # Mobile dependencies and launch scripts
├── babel.config.js                # Babel configuration for Expo / React Native
└── src/
    ├── theme/
    │   └── colors.js              # Dark judicial theme & color tokens
    ├── context/
    │   └── AuthContext.js         # Mobile auth state & role management
    ├── navigation/
    │   └── AppNavigator.js        # Bottom Tab Navigator & Stack routing
    ├── components/
    │   ├── Header.js              # Native mobile top bar with scales emblem
    │   ├── CitationChip.js        # Statutory citation badges (PLD, SCMR)
    │   ├── QuickPromptPill.js     # Rapid legal inquiry pill buttons
    │   ├── DocumentModal.js       # Case brief & FIR attachment modal
    │   └── LanguageSelectorModal.js # 5-Language regional legal switcher
    ├── screens/
    │   ├── Home/HomeScreen.js     # Hero, Vernacular AI & Law Metrics
    │   ├── Assistant/AssistantScreen.js # AI Chat Copilot Workspace
    │   ├── AiTools/AiToolsScreen.js # 6 Specialized Legal Toolkits
    │   ├── Features/FeaturesScreen.js # 2.4M+ Case Law & 4-Step Workflow
    │   ├── Profile/ProfileScreen.js # Advocate Bar Card & Role Switcher
    │   └── Auth/
    │       ├── LoginScreen.js     # Sign In with 1-Tap Demo Advocate
    │       ├── SignupScreen.js    # Bar Enrollment Registration
    │       └── ForgotPasswordScreen.js # Credentials recovery
    └── services/
        ├── geminiService.js       # Gemini API client & offline statutory heuristics
        └── chatService.js         # Chat sessions and message persistence
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/your-username/judicialgpt.git
   cd judicialgpt
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

---

## 📱 Running on Devices

### On Physical Phone (Fastest)
1. Install **Expo Go** from [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent) (Android) or [Apple App Store](https://apps.apple.com/app/expo-go/id982107442) (iOS).
2. Scan the QR code displayed in the terminal.

### On Web Browser
```bash
npm run web
```
Open `http://localhost:8081` in your browser and toggle mobile device preview (`Ctrl+Shift+M`).

### On Android Emulator
```bash
npm run android
```

---

## ⚖️ Disclaimer

JudicialGPT is designed as an assistive legal intelligence tool for legal practitioners, researchers, and students. It does not constitute formal legal advice or substitute for representation by an enrolled Advocate of the High Court or Supreme Court of Pakistan.

---

## 📄 License
This project is licensed under the MIT License.
