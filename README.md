# SynthFlag — evidence site

Judge-facing research narrative, TEST1 dashboard, architecture diagrams, dataset/source documentation, image/video demo shell and a server-side Nemotron research assistant for TikTok TechJam 2026 Track 5.

## Evidence boundary

- Upstream FeatDistill architecture/checkpoints are credited, not claimed as team-trained.
- SynthFlag contributions are the Track-specific evaluation contract, transformations, data preparation, cached-feature head experiments, resolution routing, integrity verification, error analysis and product.
- TEST1 is a 15,000-image public development diagnostic, not TikTok's hidden test.
- Rejected experiments and proposed branches remain explicitly labelled.

## Run locally

Serve the directory with any static server. Vercel serves the three files under `api/` as serverless functions.

Create local environment variables from `.env.example`; never expose `NVIDIA_API_KEY` to browser JavaScript or commit it.

## Verification

The complete benchmark package is under `downloads/test1/`. `metrics_full.csv`, `integrity.json`, raw predictions and the full report are the authoritative final evidence.
