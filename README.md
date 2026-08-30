# Result Engine — SSC Marks Processing & Verification

A browser-based school result processing engine for SSC-style marksheets. The application accepts a JSON marks file, processes every student against the implemented grading rules, calculates GPA and letter grades, and provides a verification queue for results that require manual review.

## Features

- Process a complete JSON marks dataset or a single case.
- Grade compulsory and optional subjects.
- Support theory-only and theory + practical subjects.
- Calculate subject Grade Points (GP), overall GPA, and letter grade.
- Apply the implemented SSC rules **R-10, R-11, R-12, R-13, and R-29**.
- Detect malformed or incomplete marks data before it can be silently graded.
- Show a detailed rule trace for every student and subject.
- Provide a dedicated **Verification** queue for manual checking.
- Search and filter students by name/ID, class, result, grade, and verification flag.
- Show class-level pass rates, grade distribution, and subject failure analysis.
- Validate pasted JSON using the built-in validator.
- Load an adversarial sample to exercise validation/error handling.
- Print an individual student's marksheet.
- Responsive interface for desktop and mobile screens.
- No server or database is required; processing happens in the browser.

## Project Structure

```text
.
├── index.html
├── P08_school_results_public.json
├── P08_edge_cases.json
├── README.md
└── LICENSES.md
```

The application is intentionally implemented as a self-contained HTML file containing the UI, styling, validation, processing logic, and client-side rendering.

## Getting Started

### 1. Clone or download the project

Place the project files in the same directory.

### 2. Open the application

Open:

```text
index.html
```

in a modern web browser.

No build step, package installation, or backend server is required for the basic application.

### 3. Load a dataset

From the load screen, either:

- choose a `.json` marks file,
- drag and drop a JSON file into the upload area, or
- use the built-in dataset when it is available.

The application accepts:

```json
{
  "cases": [
    {
      "case_id": "PUB-01",
      "subjects": [],
      "compulsory": [],
      "students": []
    }
  ]
}
```

It can also process a single case containing `students`, or an array of cases.

## Input Format

Each case contains:

- `case_id`
- `subjects`
- `compulsory`
- `students`

A subject definition contains:

```json
{
  "code": "PHY",
  "name": "Physics",
  "practical": true
}
```

A theory-only subject uses a single numeric mark:

```json
"BAN": 75
```

A practical subject uses:

```json
"PHY": {
  "theory": 52,
  "practical": 19
}
```

An absent subject can be represented by:

```json
"BIO": "AB"
```

The P08 schema uses six compulsory subjects and one declared optional subject for each student. Practical subjects use theory marks out of 75 and practical marks out of 25.

## Grading Rules Implemented

### R-10 — Subject Grade Point

For a normal 100-mark subject:

| Marks | GP | Grade |
|---:|---:|---|
| 80–100 | 5.0 | A+ |
| 70–79 | 4.0 | A |
| 60–69 | 3.5 | A- |
| 50–59 | 3.0 | B |
| 40–49 | 2.0 | C |
| 33–39 | 1.0 | D |
| Below 33 | 0.0 | F |

The same total-mark GP mapping is used after a practical subject's theory and practical components are combined.

### R-11 — Practical Subjects

For a practical subject:

- Theory must be at least **25/75**.
- Practical must be at least **8/25**.
- Both components must pass independently.
- The total mark is `theory + practical`.
- If either component fails, the subject receives **GP 0.0**.

The application also shows what GP the total would have produced if the practical subject had passed.

### R-12 — Absence

`"AB"` is treated as an absent mark:

- GP = 0.0.
- An absent compulsory subject causes the overall result to be **F**.
- An absent optional subject contributes 0 to GPA and is placed on the relevant verification lists.

### R-13 — Optional Subject and GPA

The optional subject receives its normal GP, but only the amount above 2.0 contributes to GPA:

```text
optional contribution = max(0, optional GP - 2.0)
```

The implemented GPA calculation is:

```text
raw GPA = (sum of compulsory GPs + optional contribution) / 6
```

The GPA is capped at 5.0.

If any compulsory subject fails, the student's final GPA becomes `0.00` and the final grade becomes `F`.

### R-29 — Verification Lists

Students are placed in the verification queue when one or more of the following applies:

- optional subject GP ≤ 2.0,
- a practical subject has a failed theory/practical component,
- an absent mark is present,
- a data/integrity problem is detected.

A student can appear on multiple verification lists. Each list is checked independently.

## Data Integrity Rules

The processing path applies input checks so malformed data is not silently treated as a normal mark.

| Rule | Situation | Handling |
|---|---|---|
| D-1 | Required mark is missing | GP 0.0, flagged; compulsory missing data causes failure |
| D-2 | Mark has the wrong data type | GP 0.0, flagged |
| D-3 | Mark is outside its legal range | Clamped to the legal range and flagged |
| D-4 | Unknown/unexpected subject code | Ignored for grading and flagged |

For practical subjects, valid ranges are:

```text
Theory:     0–75
Practical:  0–25
```

For theory-only subjects:

```text
Mark:       0–100
```

## Verification Dashboard

The **Verification** section contains the office checking queue.

The application separates verification into:

- **Optional ≤ 2.0**
- **Practical fail**
- **Absent mark**
- **Data problem**

Selecting a student opens a detailed rule trace showing the marks, calculated GP, applied rule, failures, and GPA calculation.

The dashboard's **Needs Verification** count represents students with at least one verification flag. It is a count of students, not a count of individual flags.

## Validation

The **Validate file** section can be used before importing a dataset.

You can:

1. Paste JSON into the validator.
2. Click **Validate**.
3. Review rejected rows and their exact reasons.
4. Correct the source data.
5. Import the corrected dataset.

The validator also includes an **adversarial sample** for testing malformed input and edge cases.

## Testing

The project includes datasets intended for functional and edge-case testing.

### Public dataset

```text
P08_school_results_public.json
```

Use this to exercise normal student-result processing across multiple students.

### Edge-case dataset

```text
P08_edge_cases.json
```

This dataset is designed to exercise boundary conditions and special branches such as:

- grade-point boundaries,
- pass/fail boundaries,
- practical theory boundaries,
- practical component boundaries,
- optional-subject behavior,
- absence handling,
- malformed data,
- and other verification branches.

When testing, compare the application's displayed rule trace and results with the expected behavior documented by the dataset/test specification.

## UI Sections

### Overview

Displays high-level result statistics and charts.

### Students

Provides:

- complete student result table,
- search,
- class filter,
- pass/fail filter,
- grade filter,
- verification-flag filter,
- student detail/rule trace.

### Verification

Shows the students requiring office/manual review.

### Class Summary

Displays:

- pass rates,
- grade distributions,
- subject-level failure analysis.

### Validate File

Checks JSON input before processing.

### Marksheet

Allows an individual student's result to be prepared for printing.

## Browser Compatibility

Use a modern browser such as:

- Google Chrome
- Microsoft Edge
- Mozilla Firefox
- Safari

The application uses standard browser APIs, including the FileReader API for local JSON file loading.

## Privacy

The core application processes uploaded JSON data in the browser. No project backend or database is required by `index.html`.

If the application is hosted online, users should still consider the privacy implications of loading real student information into a web page and should deploy it according to their institution's data-protection requirements.

## Fonts

The interface uses:

- **Inter**
- **JetBrains Mono**

The page loads these fonts through Google Fonts. See `LICENSES.md` for the third-party licensing notice.

## Limitations

- This is a client-side processing application.
- It does not provide authentication or role-based access control.
- It does not persist student records to a database.
- It does not replace official examination-board result systems.
- The grading behavior is determined by the rules implemented in the current `index.html`.
- Real institutional deployment should include an appropriate review of official rules, data protection, access control, and audit requirements.

## License

This project is released under the MIT License. See [`LICENSES.md`](LICENSES.md).

## Disclaimer

This software is intended as a result-processing and verification aid. Final academic results should be reviewed and approved by the responsible authority before publication.
