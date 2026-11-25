#!/usr/bin/env node
// Deploy the zine auth-email templates to Supabase — the SAFE way.
//
// Reads the 6 subjects + content_paths from supabase/config.toml (the single
// source of truth) and PATCHes ONLY the mailer_subjects_* / mailer_templates_*
// fields on the linked project's auth config. It never sends any other key, so
// SMTP/Mailgun, site_url, the redirect allow-list, OTP length, and every other
// auth setting are left exactly as they are — the thing a full `supabase config
// push` would clobber (see the warning in supabase/config.toml).
//
// Token: SUPABASE_ACCESS_TOKEN from the environment, else from .env.local
// (gitignored). The token is never printed.
//
// Usage:
//   node scripts/deploy-email-templates.mjs            # show diff, then prompt (TTY only)
//   node scripts/deploy-email-templates.mjs --dry-run  # show diff and exit, never writes
//   node scripts/deploy-email-templates.mjs --yes      # apply without prompting (CI / agent)

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = "https://api.supabase.com/v1";

const args = new Set(process.argv.slice(2));
if (args.has("--help") || args.has("-h")) {
  console.log("Usage: node scripts/deploy-email-templates.mjs [--dry-run | --yes]");
  process.exit(0);
}
const dryRun = args.has("--dry-run");
const assumeYes = args.has("--yes") || args.has("-y");

function fail(msg) {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

// ── Minimal TOML read (scoped to our controlled config.toml) ───────────────
function parseValue(v) {
  v = v.trim();
  if (v[0] === '"') {
    const m = v.match(/^"((?:[^"\\]|\\.)*)"/);
    if (m) return m[1].replace(/\\"/g, '"').replace(/\\\\/g, "\\");
  }
  if (v[0] === "'") {
    const m = v.match(/^'([^']*)'/);
    if (m) return m[1];
  }
  return v.replace(/\s+#.*$/, "").trim();
}

function parseConfig(text) {
  const sections = {};
  let projectId = null;
  let section = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const sec = line.match(/^\[([^\]]+)\]/);
    if (sec) {
      section = sec[1].trim();
      sections[section] ??= {};
      continue;
    }
    const kv = line.match(/^([A-Za-z0-9_.]+)\s*=\s*(.*)$/);
    if (!kv) continue;
    if (section === null) {
      if (kv[1] === "project_id") projectId = parseValue(kv[2]);
    } else {
      sections[section][kv[1]] = parseValue(kv[2]);
    }
  }
  const templates = [];
  for (const [name, data] of Object.entries(sections)) {
    const m = name.match(/^auth\.email\.template\.([A-Za-z0-9_]+)$/);
    if (m) templates.push({ type: m[1], subject: data.subject ?? "", content_path: data.content_path });
  }
  return { projectId, templates };
}

function loadToken() {
  const fromEnv = process.env.SUPABASE_ACCESS_TOKEN?.trim();
  if (fromEnv) return { token: fromEnv, source: "environment" };
  try {
    const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
    const m = env.match(/^\s*SUPABASE_ACCESS_TOKEN\s*=\s*(.+?)\s*$/m);
    if (m) return { token: m[1].trim().replace(/^["']|["']$/g, ""), source: ".env.local" };
  } catch {
    /* no .env.local */
  }
  return { token: null, source: null };
}

async function api(method, ref, token, body) {
  const res = await fetch(`${API}/projects/${ref}/config/auth`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "User-Agent": "leaselookout-deploy-email-templates",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) fail(`Management API ${method} ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : {};
}

function ask(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question(question, (a) => {
      rl.close();
      resolve(/^y(es)?$/i.test(a.trim()));
    });
  });
}

// ── Run ────────────────────────────────────────────────────────────────────
const cfg = parseConfig(fs.readFileSync(path.join(ROOT, "supabase/config.toml"), "utf8"));
if (!cfg.projectId) fail("No project_id in supabase/config.toml");
if (cfg.templates.length === 0) fail("No [auth.email.template.*] sections in supabase/config.toml");

const { token, source } = loadToken();
if (!token) fail("No SUPABASE_ACCESS_TOKEN (checked env and .env.local).");

const desired = [];
for (const t of cfg.templates) {
  if (!t.content_path) fail(`template "${t.type}" has no content_path`);
  let html;
  try {
    html = fs.readFileSync(path.resolve(ROOT, t.content_path), "utf8");
  } catch {
    fail(`cannot read ${t.content_path} for template "${t.type}"`);
  }
  desired.push({
    type: t.type,
    subjectKey: `mailer_subjects_${t.type}`,
    bodyKey: `mailer_templates_${t.type}_content`,
    subject: t.subject,
    html,
  });
}

console.log(`Project:  ${cfg.projectId}`);
console.log(`Token:    from ${source} (not shown)`);
console.log(`Templates: ${desired.length} from supabase/config.toml\n`);

const current = await api("GET", cfg.projectId, token);

const changes = {};
for (const d of desired) {
  const subjOld = current[d.subjectKey] ?? "";
  const bodyOld = current[d.bodyKey] ?? "";
  const subjChanged = subjOld !== d.subject;
  const bodyChanged = bodyOld !== d.html;
  if (subjChanged) changes[d.subjectKey] = d.subject;
  if (bodyChanged) changes[d.bodyKey] = d.html;
  console.log(`• ${d.type}`);
  console.log(
    `    subject: ${subjChanged ? `"${subjOld}" → "${d.subject}"` : `"${d.subject}" (unchanged)`}`,
  );
  console.log(
    `    body:    ${bodyChanged ? `${bodyOld.length} → ${d.html.length} chars (CHANGED)` : `${d.html.length} chars (unchanged)`}`,
  );
}

const fieldCount = Object.keys(changes).length;
console.log(`\n${fieldCount} field(s) would change.`);

if (fieldCount === 0) {
  console.log("✓ Supabase is already in sync with the repo. Nothing to do.");
  process.exit(0);
}
if (dryRun) {
  console.log("Dry run — no changes sent.");
  process.exit(0);
}
if (!assumeYes) {
  if (!process.stdin.isTTY) {
    fail("Non-interactive shell. Re-run with --yes to apply, or --dry-run to preview.");
  }
  const ok = await ask(`Apply these ${fieldCount} field update(s) to ${cfg.projectId}? (y/N) `);
  if (!ok) {
    console.log("Aborted — nothing sent.");
    process.exit(0);
  }
}

await api("PATCH", cfg.projectId, token, changes);
console.log(`✓ Applied ${fieldCount} field update(s) to ${cfg.projectId}.`);
