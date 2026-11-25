# Architecture & Scaling Plan

This document outlines the rationale behind LeaseLookout's current architecture and the plan for mitigating future scaling bottlenecks.

## Current Architecture

LeaseLookout uses a hybrid stack:

- **Next.js (App Router):** Handles the frontend UI, routing, and user experience.
- **Python (Vercel Serverless):** Powers the parser engine (`api/analyze.py`) utilizing `pdfplumber` for highly accurate text extraction.
- **Supabase:** Manages state and blob storage for uploaded PDFs.

### Why This is Optimal for MVP

1. **Language Fit:** Python's ecosystem is vastly superior for unstructured PDF data extraction compared to Node.js. Next.js is best-in-class for frontend UI. This setup leverages the best tool for each specific job.
2. **Bypassing Payload Limits:** Vercel has a strict 4.5MB limit on incoming request bodies for Serverless Functions. By uploading the lease to Supabase Storage first and passing the file URL/ID to the Python engine, the architecture completely sidesteps Vercel's payload restrictions.
3. **Unified Deployment:** Deploying the Python engine inside the `api/` directory allows Vercel to manage the build and deployment alongside the Next.js app, eliminating the need to manage a separate backend service (like Heroku or Fly.io).

## The Scaling Risk: Vercel Python Limitations

While pragmatic, running Python inside a Vercel Serverless Function introduces two main risks for compute-heavy tasks like `pdfplumber` extraction:

1. **Execution Timeouts:**Vercel Hobby tier times out at**10 seconds** (Pro at 60s). Processing a dense, 50-page scanned lease can easily exceed 10 seconds, causing the function to crash mid-extraction.
2. **Cold Starts:** Booting the Python runtime and loading heavy libraries like `pdfplumber` can add 3-5 seconds of latency to the first request.

## Mitigation Plan

If timeouts or cold starts begin impacting the user experience (e.g., failed parsing on large leases), the architecture will be migrated as follows:

1. **Decouple the Python Engine:** Remove `api/analyze.py` from Vercel.
2. **Persistent Background Worker:**Deploy the `engine/` directory as a standalone, long-running service on a platform designed for heavy compute (e.g.,**Fly.io**, **Render**, or **Railway**).
3. **Asynchronous Polling / Webhooks:** Instead of waiting for a synchronous HTTP response from Vercel, the Next.js app will submit an analysis job to the new Python backend and either poll for completion or receive a webhook, allowing for processing times of several minutes if necessary.
