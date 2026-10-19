# Careers and HR extraction

## Objective

Extract the existing Careers and recruitment HR implementation so the user can implement it in another project. Provide an evidence-backed feature specification, porting guide, original source bundle, and source manifest. Do not modify application behavior or export credentials, databases, CVs, or applicant records.

## Workflow

Use Superpowers and Spec Miner for source analysis, Ponytail for minimal scope, and GSD-style task records. The installed GSD quick workflow requires `.planning/ROADMAP.md`; this checkout has none, so the full workflow is unavailable. Perform the extraction inline and preserve existing uncommitted work.

1. Read all feature entry points, models, access rules, validation, UI, configuration, setup/recovery utilities, and verification scripts. Identify dependencies on the existing website.
2. Write a complete observed feature specification and target-project implementation guide. Package original feature source, selected host integration references, and verification references in a ZIP with SHA-256 manifest. Explain which pieces need adaptation.
3. Verify archive contents and hashes, dependency coverage, secret/data exclusion, source preservation, current TypeScript checks, and available read-only local HTTP behavior. Record results and append to root `STATE.md`.

## Acceptance

- Public Careers, application submission, HR review, staff permissions, private files, CSV, setup, and deployment assumptions are documented with source references.
- Actual behavior and missing features are distinguished; no payroll, employee management, LinkedIn sync, email delivery, or automated pipeline is invented.
- The bundle contains no runtime secrets, recruiting data, or local credential files.
- The live application source remains unchanged.
- Destination project is unknown; this delivery is an extraction kit, not an installation into another project.

## Usage allowance

The five-hour usage allowance is unavailable in the current session. No percentage or active monitoring is claimed.
