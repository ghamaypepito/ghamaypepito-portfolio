# Deploying to Cloudflare Pages

Everything below is one-time setup except step 5, which is every deploy.

---

## 1. Create the Pages project

The repo is already wired for it — `wrangler.toml` sets
`pages_build_output_dir = "dist"`.

**Option A — connect the GitHub repo (recommended).**
Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git →
pick `ghamaypepito/ghamaypepito-portfolio`, then:

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Build command | `npm run build:fast` |
| Build output directory | `dist` |
| Node version | `22` (add env var `NODE_VERSION=22`) |

Every push to `main` then deploys automatically, and pull requests get preview
URLs.

**Option B — deploy from this machine.**

```bash
npx wrangler login
npm run build
npx wrangler pages deploy dist --project-name=ghamaypepito-portfolio
```

---

## 2. Connect the contact form to an inbox

Until this is done the form returns a clear 503 and tells the visitor to email
directly — it never silently swallows an enquiry.

1. Create a free account at [resend.com](https://resend.com) (3,000 emails/month).
2. Create an API key.
3. Add it as a **secret** — never commit it:

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name=ghamaypepito-portfolio
```

Or: dashboard → the Pages project → Settings → Environment variables → add
`RESEND_API_KEY` as an **encrypted** variable, for both Production and Preview.

4. Verify `ghamaypepito.com` in Resend (Domains → Add), then set:

```
CONTACT_FROM = Portfolio <hello@ghamaypepito.com>
CONTACT_TO   = ghamaypepito@gmail.com
```

Until the domain is verified, leave `CONTACT_FROM` as the default
`onboarding@resend.dev`, which works immediately but can land in spam.

### Optional — rate limiting

The Worker throttles to 5 submissions per IP per hour when a KV namespace is
bound. Without it, the honeypot and validation still apply.

```bash
npx wrangler kv namespace create ghamaypepito-ratelimit
```

Then uncomment the `[[kv_namespaces]]` block in `wrangler.toml` and paste the
returned id.

---

## 3. Point the domain at it

In the Pages project → Custom domains → Set up a custom domain:

- add `ghamaypepito.com`
- add `www.ghamaypepito.com`

If the domain's nameservers are already Cloudflare's, records are created for
you. If not, move the domain into Cloudflare first (Add a site → follow the
nameserver instructions at the current registrar), or add the CNAME Cloudflare
shows you at your existing DNS host.

Then set a redirect so only one hostname is canonical. Rules → Redirect Rules:

| Field | Value |
| --- | --- |
| When | Hostname equals `www.ghamaypepito.com` |
| Then | Dynamic redirect to `concat("https://ghamaypepito.com", http.request.uri.path)`, 301 |

The site's `<link rel="canonical">` already points at the apex.

---

## 4. Recommended Cloudflare settings

| Setting | Value | Why |
| --- | --- | --- |
| SSL/TLS mode | Full (strict) | Pages serves valid certs |
| Always Use HTTPS | On | |
| Automatic HTTPS Rewrites | On | |
| Brotli | On | |
| Early Hints | On | Helps the preloaded fonts |
| Auto Minify | **Off** | The build already minifies; double-minifying risks breakage |
| Rocket Loader | **Off** | It reorders scripts and breaks island hydration |
| Email Obfuscation | **Off** | It rewrites the `mailto:` links |

Rocket Loader and Auto Minify being off matters — leaving them on is the most
common way an Astro islands site breaks in production.

---

## 5. Every deploy

With Git integration, just push:

```bash
git push origin main
```

Manually:

```bash
npm run build && npm run deploy
```

---

## 6. After the first deploy — verify

```bash
node scripts/verify.mjs https://ghamaypepito.com
```

Then by hand:

- [ ] Submit the contact form and confirm the email arrives
- [ ] Check the OG card at [opengraph.xyz](https://www.opengraph.xyz/)
- [ ] Validate the structured data at [validator.schema.org](https://validator.schema.org/)
- [ ] Submit `https://ghamaypepito.com/sitemap-index.xml` in Google Search Console
- [ ] Run Lighthouse on the live URL, not on localhost

---

## Rolling back

Pages keeps every deployment. Dashboard → the project → Deployments → find the
last good one → **Rollback**. It is instant and needs no rebuild.
