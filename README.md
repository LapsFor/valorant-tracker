# 🎯 V-TRACKER TERMINAL | Valorant Stats SPA

An interactive Single Page Application (SPA) for tracking Valorant player statistics. This project allows you to search for players, view their Ranked Rating (RR) history, and explore detailed post-match scoreboards without reloading the page.

## 🚀 Key Features

- **Quick Profile Search:** Displays current rank, RR (Ranked Rating), total Elo, and account level.
- **Match History:** Shows recent games with color-coded win/loss/draw indicators and MMR changes.
- **Detailed Match Statistics:** Dynamically generates an in-game style Scoreboard for both teams (Attackers & Defenders).
- **Advanced Analytics:** Calculates **ACS** (Average Combat Score), **K/D Ratio**, Kill/Death difference (+/-), and **HS%** (Headshot percentage) on the fly from raw API data.
- **Cross-Navigation:** Click on any player in the match scoreboard to instantly load their profile and match history (infinite SPA navigation).

## 🛠 Tech Stack

- **Frontend:** HTML5, CSS3 (Custom Styles), Bootstrap 5
- **Logic:** Vanilla JavaScript (ES6+), Async/Await, Fetch API, Event Delegation
- **Architecture:** SPA (UI state management via DOM manipulation without page reloads)
- **API:** [HenrikDev Valorant REST API](https://github.com/Henrik-3/unofficial-valorant-api) (Endpoints: `/v1/account`, `/v1/mmr-history/`, `/v2/match/`)

## 💡 Implementation Highlights
The project implements the **Event Delegation** pattern to optimize DOM event listeners. Global handlers capture clicks on dynamically generated match cards and player rows, preventing memory leaks and duplicate API requests. Advanced combat statistics (like ACS and HS%) are not provided directly by the API but are mathematically computed on the client side.

## ⚙️ How to Run
The project consists entirely of frontend files. To run it locally:
1. Clone the repository: `git clone https://github.com/LapsFor/valorant-tracker.git`
2. Open the `index.html` file in any modern web browser.
*(Note: Using a local development server like Live Server in VS Code is recommended for proper API fetching).*

---
**Developer:** Denys Tkachenko ([@LapsFor](https://github.com/LapsFor))
