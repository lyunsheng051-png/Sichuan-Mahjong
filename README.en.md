# Shangzhuo · Sichuan Mahjong Trainer

<img src="assets/branding/icon-preview.png" alt="Shangzhuo app icon with jade mahjong tiles and a three-dot face" width="96" height="96" />

**Turn knowing the rules into recognizing the play.** Focused drills for beginners learning Sichuan Mahjong with a missing suit.

[简体中文](README.md) · [English](README.en.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-326849)](LICENSE)
![Vue 3](https://img.shields.io/badge/Vue-3-42b883)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6)
![Capacitor 8](https://img.shields.io/badge/Capacitor-8-119eff)

Know the rules, but miss a peng or kong opportunity, or fail to notice that your hand is ready? Shangzhuo breaks these skills into short exercises: make your own judgment, then compare it with the answer and a complete hand breakdown.

Built with **Vue 3, Vite, and TypeScript**, with no account, backend, or database required. Desktop, portrait mobile, and landscape mobile layouts are available, alongside a Capacitor Android project.

> Build an offline landscape APK with GitHub Actions without installing a local Android toolchain. Android-device testing has not been completed. The application UI is Chinese; this repository provides bilingual READMEs, not an English UI switch.

## Contents

- [Screenshots](#screenshots)
- [Features](#features)
- [Getting started](#getting-started)
- [Suggested practice](#suggested-practice)
- [Rules and scope](#rules-and-scope)
- [Android landscape version](#android-landscape-version)
- [Data and privacy](#data-and-privacy)
- [Project structure](#project-structure)
- [Contributing](#contributing)
- [Credits and license](#credits-and-license)

## Screenshots

These images show the running web application with demonstration practice records. Landscape images are browser previews, not Android-device screenshots.

### Practice dashboard

Choose a focused drill and review your unassisted practice statistics.

![Practice dashboard and training statistics](docs/images/dashboard.jpg)

### Landscape mobile practice

Keep the full hand on the left and choose answers from a suit-specific grid on the right. Switching suits preserves your selections; the submit button stays at the bottom.

![Waiting-tile practice in an 844 by 390 landscape viewport](docs/images/landscape-training.jpg)

### Winning-hand breakdown

After submitting, inspect each winning tile and one complete, valid decomposition of the hand.

![Waiting tiles and a decomposition into four groups and a pair](docs/images/winning-hand-explanation.jpg)

## Features

| Module | Exercise |
| --- | --- |
| Hand snapshot | Study a hand for 4, 8, or 12 seconds, then recall tile types held as pairs or triplets |
| Peng / kong reactions | Practice with the hand visible or hidden; identify peng, direct exposed kong, or neither |
| Waiting-tile detective | Find every winning tile for a 13-tile hand; includes hands that are not ready and post-answer breakdowns |
| Discard to get ready | Find all discards from a 14-tile hand that leave it ready, then inspect the waits |
| Exchange three | Select three tiles of one suit and regroup after a simulated replacement; no exchange is graded as uniquely optimal |
| Hand lab | Enter 13 or 14 concealed tiles without declared melds to inspect wins, waits, and ready-making discards |
| Practice history | Retain the latest 300 attempts, distinguish assisted answers, filter records, and retry the original hand |

History defaults to 10 records per page, with 20 and 50 available. The dashboard reports accuracy for up to the latest 20 unassisted answers in each recognition drill. Using a hint or revealing a hidden hand marks the answer as assisted; exchange legality is excluded from overall unassisted recognition accuracy.

## Getting started

### Requirements

- **Node.js 22.12 or newer**, using npm.
- A modern browser. The web version does not require Java, Android Studio, or the Android SDK.

### Install and run

```sh
git clone https://github.com/lyunsheng051-png/Sichuan-Mahjong.git
cd Sichuan-Mahjong
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://127.0.0.1:5173/`. If the port is occupied, use the actual URL shown in the terminal.

### Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run typecheck` | Check Vue and TypeScript types |
| `npm run android:open` | Open the native project in Android Studio |
| `npm run android:sync` | Compile web assets and synchronize the Android project |
| `npm run android:apk` | Check the native toolchain, compile assets, and attempt a debug APK build |

Routine frontend validation uses only `npm run typecheck`. Android synchronization and packaging also compile web assets and are separate from type checking. Cloud packaging runs through a manually triggered workflow.

## Suggested practice

1. **Recall first.** Start with a 12-second snapshot. Remember pairs and triplets rather than all 13 individual tiles.
2. **Reconnect your attention.** Practice calls with the hand visible, then hide it once recognition becomes reliable.
3. **Read the whole structure.** Identify complete groups, the pair, and incomplete groups before selecting waits; compare your reasoning with the breakdown.
4. **Check before discarding.** Ask: “After discarding this tile, what am I waiting for?” “Not ready yet” is a valid answer.
5. **Move to physical tiles.** Set out a hand, write down your answer, check it in the lab, then try a slow game with friends or family.

Use 15–20 minutes as a starting session length. Prioritize accuracy before shortening observation time. Drill accuracy and repetition counts do not establish real-game mastery. See the [training design](docs/training-design.md) for the full path and suggested milestones; that supporting document is currently in Chinese.

## Rules and scope

### Exercise rules

- 108 tiles: ranks 1–9 in characters, bamboo, and dots, with four copies of each tile.
- Exchange three tiles of one suit, then declare a suit to eliminate (*dingque*). Discard that suit first; it cannot be used for a call or a win.
- No chi calls. Call exercises cover **peng and direct exposed kong** only, not concealed kongs, added kongs, winning-call priority, or strategic value.
- A standard win uses four groups and one pair. Seven pairs can be toggled; four identical tiles may count as two pairs.
- Wait detection checks the whole hand and excludes an impossible fifth copy of a tile already held four times.

### Not implemented

- Full four-player games, online matchmaking, or the complete blood-battle game flow.
- Fan scoring, caps, passed-win restrictions, end-of-round ready-hand checks, missing-suit penalties, or kong-related settlement rules.
- Live-tile counts based on discards and other visible tiles, or defensive recommendations.
- The full four-player exchange procedure or optimal exchange scoring.
- An English UI, cross-device synchronization, automatic record migration, or built-in import and export.

Generated exercises and the hand lab currently use concealed hands without declared melds. Local table rules vary; agree on them before playing with others.

## Android landscape version

The repository includes a Capacitor 8 native project, app icon, and launch-screen configuration. The main activity requests `sensorLandscape` for either landscape direction on phones. Some tablets, foldables, and multi-window environments may let the operating system decide the orientation.

The web layout has been checked in 740×360 and 844×390 browser viewports. Hints and settings open in a dialog that pauses the study countdown. Long explanations scroll inside the right panel while the next-question button stays at the bottom.

**Verified build:** [2026-10-22 · v0.1.0](https://github.com/lyunsheng051-png/Sichuan-Mahjong/actions/runs/39722626363) passed the cloud native build, APK signature verification, and certificate comparison against the persistent signing key. Android-device testing has not been completed.

**Cloud build:** open the [Android APK workflow](https://github.com/lyunsheng051-png/Sichuan-Mahjong/actions/workflows/android-apk.yml), select **Run workflow**, then download `shangzhuo-android-0.1.0-…` from the successful run’s **Artifacts**. Extract the ZIP and transfer the APK to your phone to install it. Artifacts expire after seven days; rerun the workflow to create a new download.

The workflow uses Ubuntu, JDK 21, and Android SDK Platform 36. It checks types, compiles the offline assets, verifies the APK signature, and includes a SHA256 checksum. The signing key is stored in a repository Secret and is excluded from source code and downloadable artifacts. Android-device testing has not been completed. See the [Android guide](docs/android.md) for setup, installation, and signed updates; that supporting guide is currently in Chinese.

## Data and privacy

- Training does not call remote services. The logic and tile graphics are provided locally with the project.
- Settings and the latest 300 attempts are saved in the current browser or WebView using `localStorage`.
- Different browsers, access addresses, and the native app have separate data stores; records do not synchronize automatically.
- Clearing site data, clearing app data, or uninstalling the app removes the corresponding records.
- README badges use an external service and are not application runtime dependencies.

## Project structure

```text
.
├── android/                 Native project, orientation, and app icons
├── docs/
│   ├── images/              Actual screenshots shared by both READMEs
│   ├── android.md           Native setup and packaging guide
│   └── training-design.md   Learning goals, rules, and progression
├── public/tiles/            Tile SVGs, tile back, and original license
├── scripts/                 Android synchronization and APK packaging
├── src/
│   ├── api/                 Local persistence adapter
│   ├── components/          Tiles, pickers, pagination, and shared UI
│   ├── composables/         Training state and progress
│   ├── config/              Drill definitions and defaults
│   ├── layouts/             Application shell
│   ├── router/              Page routing
│   ├── services/            Hand solving and question generation
│   ├── styles/              Theme, responsive, and landscape styles
│   ├── types/               Hand, rule, question, and record types
│   └── views/               Page views
└── capacitor.config.ts      Native container configuration
```

## Contributing

Report bugs or discuss improvements in [Issues](https://github.com/lyunsheng051-png/Sichuan-Mahjong/issues), or submit a [Pull Request](https://github.com/lyunsheng051-png/Sichuan-Mahjong/pulls).

- **Rule reports:** include the full hand, missing suit, seven-pairs setting, expected and actual results, and relevant local table rules.
- **UI reports:** include the browser or device, orientation, viewport size, and reproduction steps. Screenshots help locate the problem.
- **Code changes:** follow the existing module structure and run `npm run typecheck` for routine frontend validation. Do not commit generated APKs, SDKs, machine-specific paths, or signing keys.
- **Documentation changes:** keep both READMEs aligned. Use actual screenshots and distinguish browser previews from device captures.

For changes to rules, teaching approach, or substantial interaction flows, consider opening an issue first to discuss the intended behavior and scope.

## Credits and license

- Tile graphics are reused from [FluffyStuff / riichi-mahjong-tiles](https://github.com/FluffyStuff/riichi-mahjong-tiles) under the original public-domain / CC0 dedication. The original license and pinned source revision are retained.
- [luxinghong / sichuan-mahjong-analyzer](https://github.com/luxinghong/sichuan-mahjong-analyzer) was consulted for feature research; its source code was not copied.
- Application code is released under the [MIT License](LICENSE). Asset licensing is documented separately in the [third-party notices](THIRD_PARTY_NOTICES.md), currently in Chinese.
- The new app icon was created with the built-in image-generation tool. See the [branding notes](assets/branding/README.md) for the source, Android variants, and generation prompt; this artwork is documented separately from the third-party tile graphics.
