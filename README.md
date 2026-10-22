# Wuthering Waves Team Builder

A high-performance single-page application engineered for theorycrafting, rotation sequencing, Outro buff synergy calculation, and min-max build optimization in *Wuthering Waves*. 

The application evaluates combat roles, damage categories, concerto generation velocities, and field-time requirements to help players craft optimal compositions or discover verified meta teams suited to their unlocked roster.

---

## About the Project

*Wuthering Waves* combat revolves around the Concerto system: characters switch in and out to trigger paired Intro and Outro skills. Sub-optimal rotations often cause buff overwrites, severe on-field time starvation, or an absence of party sustain.

This project was built to give players the same transparent, component-level overview found in hardware configurators like PCPartPicker. Users can toggle their owned character inventory, assign resonators across standard combat slots (Main DPS, Sub-DPS, Support), inspect full Outro amplification transfers, and review recommended equipment matrices (weapons, echo sets, and skill priorities).

### Key Features
* **Real-Time Synergy Engine**: Dynamically matches Outro buffs (such as Heavy Attack Deepen, Basic Attack Deepen, or Elemental Deepen) to the incoming character's primary damage source and element.
* **Rotation Viability Analysis**: Automatically flags field-time conflicts when multiple high-uptime characters share a team without quickswap synergy, and warns if no sustain unit is assigned.
* **Verified Meta Team Templates**: One-click party loading for top-tier compositions (Jiyan Hypercarry, Camellya Hypercarry, Xiangli Yao Electro Burst, Jinhsi Skill Nuke, Changli Quickswap, and Hsin Unison Core) with instant availability indicators based on your roster.
* **Build Recommendations & Specifications**: PCPartPicker-style inspection cards detailing top 3 weapons (5★, 4★, and 3★ Blue options), 5-piece Echo Sonata sets, primary stat distributions (4-3-3-1-1), substat priority queues, and target skill investment levels.
* **Compact, Collapsible Interface**: Clean dark-gaming dashboard with collapsible panels to keep the workspace organized on mobile, tablet, and desktop viewports.
* **Local Storage Persistence**: Owned inventory selections remain stored locally across sessions with zero login requirement.

---

## Data Extensibility & Updating

The project architecture isolates game data from UI rendering so that community members, theorycrafters, and maintainers can update resonator stats, echo sets, and new characters as game patches arrive.

### Updating Characters
Resonator statistics and recommendations reside in [`src/data/resonators.json`](./src/data/resonators.json). To add or update a resonator:
1. Append an entry conforming to the `Resonator` interface in [`src/types/resonator.ts`](./src/types/resonator.ts).
2. Specify Outro buff details, concerto velocity (`Fast` | `Standard` | `Slow`), field time needs (`High` | `Medium` | `Low`), optimal weapons, and echo builds.
3. Run the automated test suite to ensure schema integrity:
   ```bash
   npm test
   ```

### Updating Meta Teams
Verified meta teams reside in [`src/data/metaTeams.json`](./src/data/metaTeams.json). Add new compositions by providing the three resonator slot identifiers, rotation sequence, description, strengths, and weaknesses.

---

## Local Development & Build

### Prerequisites
* Node.js 18+ (tested on Node v22)
* npm 9+

### Installation
```bash
git clone https://github.com/bretomart/wuwa-team-builder.git
cd wuwa-team-builder
npm install
```

### Development Server
```bash
npm run dev
```

### Running Tests
Execute the unit and integration test suite powered by Vitest:
```bash
npm test
```

### Production Build
Compile TypeScript and generate optimized client assets:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## License

This project is open-source under the MIT License. Game assets and terminology are property of Kuro Games.
