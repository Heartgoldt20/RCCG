# GTP member portal

The portal is implemented in `gtp-eindhoven-redesign/app/portal` for the existing Next.js/Vercel application. It uses email/password accounts with Supabase Auth and row-level protected PostgreSQL records. No ChatGPT account is required. The original Sites deployment is unchanged.

## Activation

1. Create a church-owned Supabase project in an appropriate EU region. Review processor terms, access and retention with the church before collecting member data. Portal participation and interests may reveal religious affiliation.
2. Run `supabase/portal.sql` once in the SQL editor. This creates profiles, registrations, signup profile provisioning and owner-only row-level security. For an existing Auth project, backfill profiles for existing users before enabling this portal.
3. Add `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` and `PORTAL_SITE_URL` to the Vercel project environment (see `portal.env.example`). Use the project's publishable/anon key, never a service-role key. Set `PORTAL_SITE_URL` to the deployed canonical origin, including `https://`.
4. In Supabase Auth, enable email/password login and **Confirm email**. Set the minimum password length to 12. Set Site URL to the same origin and allow `https://YOUR_DOMAIN/portal/confirm` as a redirect URL. For a Vercel preview, use a separate preview project/configuration or explicitly allow its exact origin.
5. Set the confirmation email template link to `{{ .SiteURL }}/portal/confirm?token_hash={{ .TokenHash }}&type=email`. Set the password recovery template link to `{{ .SiteURL }}/portal/confirm?token_hash={{ .TokenHash }}&type=recovery`. These are provider email templates, not JSX. Configure a church-owned SMTP service, sender domain and appropriate Auth rate limits; the default provider email service is unsuitable for general public church registration.
6. Redeploy in Vercel with Framework Preset **Next.js**, Root Directory **gtp-eindhoven-redesign**, Build Command **npx next build**. The existing `npm run build` command targets Vinext/Cloudflare, not Vercel.
7. Before inviting members, verify real signup, confirmation, login, reset, profile updates, registrations, cancellation and logout. Use two test users to verify that one cannot read or edit the other's rows through the Supabase API, and that anonymous requests cannot read either table. Reject spoofed IDs and invalid gathering IDs.

## Behaviour

- `/portal`: introduction; `/portal/register`, `/portal/login`, `/portal/forgot-password`, `/portal/reset-password`: account flows.
- `/portal/dashboard`: protected on the server by an Auth-server `getUser()` check; shows own profile and gathering registrations only. Actions also independently check identity, while the database enforces ownership.
- Unconfigured deployments disable account forms and clearly show a contact fallback. No mock or locally stored member account is created.
- Home cell registrations record interest; they do not notify church staff automatically, promise an approved place, or create a dated event booking. Sunday attendance remains open without registration. No schedules are invented: regular gatherings follow the existing Events page.
- Ministry interests are profile preferences, not volunteer roster assignments. No public member directory, admin-role selector, payment processing or new pastoral-record database is introduced.
- Account deletion is handled by a church administrator through Supabase Auth; deletion cascades to the member's profile and registrations. Access/retention and the portal notice require church review before activation. Only essential authentication cookies are used by the portal.

## Validation

`npx tsc --noEmit` and `npx next build` validate the Vercel app. Live account/database checks require the configured Supabase project. Do not report the feature as activated until those checks succeed.
