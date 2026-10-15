# Contact lead webhook & Google Workspace / Gmail delivery

## 1. Email Delivery (Resend + Direct Google Workspace Gmail SMTP)

`/api/contact` delivers every lead with the subject prefix `[Good'Ai lead]` so Gmail-watching agents and Workspace filters pick it up automatically.

Environment variables supported in Vercel / `.env.local`:
- `CONTACT_TO_EMAIL`: Recipient address(es), comma-separated (e.g. `hello@goodai.au,kevin@goodai.au`). Defaults to `hello@goodai.au`.
- `RESEND_API_KEY`: Sends via Resend (`Good'Ai <mate@goodai.au>`, with automatic fallback to `Good'Ai <onboarding@resend.dev>` if the custom domain returns `403`).
- `GMAIL_USER` + `GMAIL_APP_PASSWORD`: Sends directly through Google Workspace / Gmail (`smtp.gmail.com:465` over implicit TLS). Works alongside Resend or standalone if Resend is unavailable/unverified.
- `GMAIL_TO_EMAIL`: Optional extra Gmail/Workspace recipient address appended to the recipient list.

## 2. Webhook Delivery (`LEAD_WEBHOOK_URL`)

After an enquiry is received, the contact route optionally POSTs JSON to `LEAD_WEBHOOK_URL`. Unset URL means no webhook request. `LEAD_WEBHOOK_SECRET` enables HMAC signing (`X-GoodAi-Signature: sha256=<hex>`). Requests abort after 3 seconds; webhook failures only log a generic message and never change the visitor's response.

Payload (all fields are strings):
- `name`: empty because the current form does not collect a name.
- `email`: contact value when it matches email validation; otherwise empty.
- `phone`: contact value when it is not an email; otherwise empty.
- `message`: selected headaches followed by the note, separated by a newline.
- `source`: always `"contact"`.
- `submittedAt`: ISO 8601 UTC timestamp.

