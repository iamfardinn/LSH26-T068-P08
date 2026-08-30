#  GPA Engine — SSC Result Processing & Verification

> **Built in one sitting. Zero backend. Zero nonsense.**
> Drop a JSON marks file, get instant GPA calculations, rule traces, and a full verification dashboard — right in your browser.

 **Live Demo:** [gpaengine.netlify.app](https://gpaengine.netlify.app/)

---

##  What is this?

During our hackathon window, we built a **fully client-side SSC result processing engine** that eliminates the manual spreadsheet nightmare schools face every exam cycle.

The engine ingests a structured JSON marks file, fires every student through the official SSC grading rules (R-10, R-11, R-12, R-13, R-29), and spits out:

-  GPA & letter grades for every student
-  A step-by-step rule trace per subject
-  A dedicated verification queue for edge cases that need human eyes
-  Class-level analytics — pass rates, grade distributions, subject failure heatmaps
-  Printable individual marksheets

**No server. No database. No install. Just open `index.html`.**

---

##  Features at a Glance

| Feature | Details |
|---|---|
|  Data ingestion | File upload, drag-and-drop, or built-in dataset |
|  Grading engine | R-10, R-11, R-12, R-13, R-29 fully implemented |
|  Rule tracer | Every mark shows exactly which rule decided its GP |
|  Verification queue | Flags absent marks, practical failures, optional ≤ 2.0, bad data |
|  Data integrity | 4 input-guard rules (D-1 to D-4) catch silent bad data |
|  Student search | Filter by name/ID, class, pass/fail, grade, verification flag |
|  Class analytics | Pass rates, grade distribution, subject-level failure analysis |
|  JSON validator | Paste-and-check before importing any dataset |
|  Marksheet print | Per-student printable result sheet |
|  Responsive | Works on desktop and mobile |

---

## 🗂️ Project Structure

```text
.
├── index.html                      ← entire app (UI + logic, self-contained)
├── P08_school_results_public.json  ← main test dataset
├── P08_edge_cases.json             ← adversarial / boundary test cases
├── all_edge_cases_test.json        ← extended edge case suite
├── evaluation-manifest.json        ← hackathon evaluation metadata
├── build.js                        ← copies files to dist/ for deployment
├── netlify.toml                    ← Netlify build config
├── EVENT.md                        ← event start record
├── README.md
└── LICENSE.md
```

The app is a **single self-contained HTML file** — UI, styles, grading logic, and rendering all live in `index.html`. Intentional: zero build tooling required to run it.

---

## ⚡ Getting Started

### Option A — Just open it

```bash
git clone https://github.com/iamfardinn/LSH26-T068-P08.git
cd LSH26-T068-P08
# open index.html in your browser — that's it
```

### Option B — Build for deployment

```bash
npm run build   # copies everything into dist/
```

Then deploy `dist/` to any static host (Netlify, GitHub Pages, etc.)

### Loading data

From the load screen:
-  Choose a `.json` marks file
-  Drag and drop a JSON file
-   Hit **Use built-in dataset** for an instant demo

---

##  Input Format

```json
{
  "cases": [
    {
      "case_id": "PUB-01",
      "subjects": [
        { "code": "BAN", "name": "Bangla", "practical": false },
        { "code": "PHY", "name": "Physics", "practical": true }
      ],
      "compulsory": ["BAN", "ENG", "MAT", "PHY", "CHE", "BIO"],
      "students": [
        {
          "id": "S001",
          "name": "Rahim",
          "class": "10A",
          "optional": "HIS",
          "marks": {
            "BAN": 75,
            "PHY": { "theory": 52, "practical": 19 },
            "BIO": "AB"
          }
        }
      ]
    }
  ]
}
```

- **Theory-only subject** → single number: `"BAN": 75`
- **Practical subject** → object: `"PHY": { "theory": 52, "practical": 19 }`
- **Absent** → string: `"BIO": "AB"`

---

## 📏 Grading Rules Implemented

### R-10 — Subject Grade Point

| Marks | GP | Grade |
|---:|---:|:---:|
| 80–100 | 5.0 | A+ |
| 70–79 | 4.0 | A |
| 60–69 | 3.5 | A- |
| 50–59 | 3.0 | B |
| 40–49 | 2.0 | C |
| 33–39 | 1.0 | D |
| Below 33 | 0.0 | F |

### R-11 — Practical Subjects

- Theory ≥ **25/75** and Practical ≥ **8/25** — both must pass independently
- Total mark = `theory + practical`, mapped through R-10
- If **either component fails** → GP 0.0 (the would-have-been GP is still shown for reference)

### R-12 — Absence

- `"AB"` → GP 0.0
- Absent **compulsory** subject → overall result is **F**
- Absent **optional** subject → contributes 0, flagged for verification

### R-13 — Optional Subject & GPA

```
optional contribution = max(0, optional GP − 2.0)
raw GPA = (sum of compulsory GPs + optional contribution) / 6
final GPA = min(raw GPA, 5.0)
```

If any compulsory subject fails → final GPA is forced to **0.00**, grade to **F**.

### R-29 — Verification Queue

A student is flagged when:
- Optional GP ≤ 2.0
- Practical component failed
- Absent mark present
- Data integrity problem detected

---

## 🛡️ Data Integrity Guards

| Rule | Trigger | Action |
|---|---|---|
| D-1 | Mark missing | GP 0.0, flagged; compulsory missing → fail |
| D-2 | Wrong data type | GP 0.0, flagged |
| D-3 | Out-of-range mark | Clamped to legal range, flagged |
| D-4 | Unknown subject code | Ignored for grading, flagged |

Valid ranges — Theory: `0–75`, Practical: `0–25`, Theory-only: `0–100`.

---

## 🖥️ UI Walkthrough

| Section | What it does |
|---|---|
| **Overview** | High-level stats, pass rate, grade distribution charts |
| **Students** | Full result table with search, filter, and per-student rule trace |
| **Verification** | Office queue — Optional ≤ 2.0 / Practical fail / Absent / Data problem |
| **Class Summary** | Per-class pass rates, grade breakdown, subject failure analysis |
| **Validate File** | Paste JSON, check for errors before importing |
| **Marksheet** | Print individual student result |

---

##  Test Datasets

| File | Purpose |
|---|---|
| `P08_school_results_public.json` | Full realistic dataset for normal processing |
| `P08_edge_cases.json` | Boundary values — GP cutoffs, practical thresholds, absences, bad data |
| `all_edge_cases_test.json` | Extended adversarial suite |

---

## 🤝 Contribution

### Team

| Name | Role |
|---|---|
| **Fahim Abrar Fardin** | Project setup, grading engine architecture, data integrity rules, deployment & build pipeline |
| **Md Muaz** | Grading logic refinement, edge case testing, UI functionality improvements |

### Get involved

```bash
git clone https://github.com/iamfardinn/LSH26-T068-P08.git
cd LSH26-T068-P08
# open index.html — no install needed
```

- 🐛 **Bug reports** — open an issue with a minimal JSON repro case
- 🧪 **New edge cases** — add entries to `P08_edge_cases.json` with expected behavior
- 🎨 **UI improvements** — all styles are in the `<style>` block of `index.html`
- 📏 **New grading rules** — implement additional SSC rules and document them here
- 🌐 **i18n** — Bangla support would be a great addition

PRs welcome — fork, branch (`feat/your-feature`), and open a pull request with a clear description.

---

## 🌐 Browser Compatibility

Works on any modern browser — Chrome, Edge, Firefox, Safari. Uses the standard FileReader API for local file loading.

## 🔒 Privacy

All processing happens **in your browser**. No student data leaves your machine unless you're on a hosted deployment. If you deploy this for real institutional use, review your data-protection obligations.

## 📝 License

MIT — see [`LICENSE.md`](LICENSE.md).

## ⚠️ Disclaimer

This tool is a result-processing aid, not a replacement for official examination board systems. All final results must be reviewed and approved by the responsible authority before publication.


