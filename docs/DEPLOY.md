# Deployment & operations

Live state, everyday commands, and the steps that are still outstanding.

---

## Current state

| Thing | Status |
| --- | --- |
| Site | **Live** at https://ghamaypepito.com |
| Fallback URL | https://ghamaypepito-portfolio.pages.dev |
| Hosting | Cloudflare Pages, project `ghamaypepito-portfolio` |
| Cloudflare account | `ecf338ffbba812b0904be0112777f56d` |
| Zone id | `c88a2d5a29013c448cb05d5d9743a525` |
| Nameservers | `archer.ns.cloudflare.com`, `elle.ns.cloudflare.com` |
| Registrar | GoDaddy (registration only — DNS is on Cloudflare) |
| `www` | Redirects to apex |
| Contact form | **Not connected** — returns 503 until `RESEND_API_KEY` is set |
| Email | Still on A2 Hosting (`85.187.128.49`) |

The previous WordPress site at this domain was replaced. It was backed up first.

---

## Everyday deploy

```bash
npm run build          # typecheck + build
npm run deploy         # wrangler pages deploy dist
```

Or in one step, matching what CI verifies:

```bash
npm run build && npx wrangler pages deploy dist \
  --project-name=ghamaypepito-portfolio --branch main --commit-dirty=true
```

Verify afterwards:

```bash
node scripts/verify.mjs https://ghamaypepito.com
node scripts/check-links.mjs
```

---

## ⚠️ Rules that must not be broken

**1. Mail records stay `DNS only` — forever.**
`mail`, `webmail`, `autodiscover`, `autoconfig`, `cpanel`, `whm`, `webdisk`,
`cpcalendars`, `cpcontacts`, `ftp`.

Cloudflare only proxies HTTP/HTTPS. Turning the orange cloud on for any of
these breaks the service behind it — a proxied `mail` record kills SMTP and
IMAP outright, and `webmail`/`cpanel` run on ports 2096/2087 which do not
proxy either. Cloudflare's import turned all of these on by default; they were
turned off before the nameservers were switched.

**2. Do not cancel A2 hosting yet.** Email still runs there.

**3. In Cloudflare, keep Rocket Loader and Auto Minify OFF.** Both are on by
default and both break Astro island hydration. This is the most common way
this kind of site breaks in production while working perfectly locally.

---

## Outstanding

### A. Connect the contact form (blocks enquiries)

The form returns a clear 503 and tells visitors to email directly, so nothing
is silently lost — but nothing is delivered either.

```bash
npx wrangler pages secret put RESEND_API_KEY --project-name=ghamaypepito-portfolio
```

Paste the key at the prompt, then redeploy. Never commit the key or paste it
into a chat or an issue; if it has been exposed anywhere, rotate it in Resend.

Test afterwards:

```bash
curl -X POST https://ghamaypepito.com/api/contact \
  -H 'content-type: application/json' \
  -d '{"name":"Test","email":"you@example.com","project":"Testing the live contact form end to end."}'
```

A `{"ok":true}` and an email in `ghamaypepito@gmail.com` means it works.

### B. Verify the Resend sending domain (stops mail landing in spam)

Domain `ghamaypepito.com` is already added in Resend (Tokyo region,
return-path `send`). Three DNS records are still needed. Easiest route is
Resend → Domains → **Auto configure**, which writes them into Cloudflare.

Manually, they are:

| Type | Name | Content | Priority |
| --- | --- | --- | --- |
| TXT | `resend._domainkey` | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCyVGV/Up+4CkPy0Xfzu9iHmi+POkGFQOgWYq+R7CbDJFYJYFmQKHvStl98GiYKv+m4/ObNmeorz2Q6k/wAsjXzmRF092RmaMXV4+OVHueT6TfpHEHOqYb4YBvfacI0iGv7+52DmIlUiAsUY4TnHvqcylMJ9xKd1c86L1pE1GTTtQIDAQAB` | — |
| MX | `send` | `feedback-smtp.ap-northeast-1.amazonses.com` | 10 |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` | — |

These live on the `send.` subdomain and `resend._domainkey`, so they do **not**
touch the root SPF or the existing mail setup.

Once verified, set the sender in `wrangler.toml`:

```toml
CONTACT_FROM = "Portfolio <hello@ghamaypepito.com>"
```

### C. Finish or abandon Cloudflare Email Routing

Partially set up: destination `ghamaypepito@gmail.com` is added but **Pending
verification**. Nothing has changed yet — MX still points at A2 and mail flows
normally.

To finish:

1. Click the verification link Cloudflare emailed to `ghamaypepito@gmail.com`
2. Email Routing → Routing rules → set **Catch-all** action to *Send to*
   `ghamaypepito@gmail.com`, and enable it
3. **Only then** Email Routing → enable DNS records

Step 3 replaces the MX record and A2 stops receiving mail. Doing it before
steps 1–2 means mail arrives with nowhere to go.

To abandon instead: delete the pending destination address. Nothing else was
changed, so there is nothing to undo.

**Email Routing is forward-only.** After the switch you receive at Gmail, but
sending *as* `@ghamaypepito.com` needs Gmail's "Send mail as" configured with
an SMTP relay. If you want real two-way mailboxes, Google Workspace or Zoho is
the right tool instead.

### D. GoHighLevel discovery-call calendar

Sub-account **Ghamay Pepito Web Services** (`U0WjaAXSrZWb7f0s885G`) →
Settings → Calendars → **+ New calendar**. Opening the dialog is not enough;
the form has to be filled in and saved.

Suggested: Event calendar, "Discovery Call", 20 minutes, slug
`discovery-call`, Asia/Manila, 15-minute buffer after.

Then set the booking link in `src/content/site.ts`:

```ts
webapp: {
  bookingUrl: 'https://<your-calendar-link>',
```

It currently points at the GoHighLevel portal root as a placeholder, which
works but drops people on the front door instead of a booking slot.

For `book.ghamaypepito.com`, add the CNAME GoHighLevel gives you as a
`DNS only` record in Cloudflare, then set it as the calendar's custom domain.

---

## DNS reference

A full pre-cutover snapshot is in `_gen/dns-snapshot.txt` (untracked). The
records that matter for mail:

```
MX     ghamaypepito.com        0 mail.ghamaypepito.com
TXT    ghamaypepito.com        v=spf1 +a +mx +ip4:85.187.128.49 include:spf.a2hosting.com ~all
TXT    default._domainkey      v=DKIM1; k=rsa; p=…
TXT    _dmarc                  v=DMARC1; p=none; rua=mailto:ghamaypepito@gmail.com; fo=1
A      mail                    85.187.128.49
```

Cloudflare's scan also imported `whm`, `webdisk`, `cpcalendars`, `cpcontacts`
and five cPanel SRV records that a manual migration would have missed.

---

## Rolling back

**The site:** Cloudflare dashboard → the Pages project → Deployments → pick the
last good one → **Rollback**. Instant, no rebuild.

**The domain:** set the nameservers at GoDaddy back to
`ns1.a2hosting.com` … `ns4.a2hosting.com`. Propagation takes a few hours; A2
still holds the original zone.
