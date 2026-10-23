# Falcontechworld Website

A responsive React + TypeScript + Vite website for Falcontechworld IT infrastructure, CCTV/security, enterprise Wi-Fi, networking, IT support, and maintenance services.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, use `Copy-Item .env.example .env` instead of `cp`.

## Scripts

- `npm run dev` — start the Vite development server
- `npm run build` — type-check and create the production build
- `npm run lint` — run ESLint
- `npm run preview` — preview the production build locally

## Environment configuration

`VITE_API_BASE_URL` is the Django REST Framework API base URL, for example `http://127.0.0.1:8000/api/v1`.

`VITE_WHATSAPP_NUMBER` is optional. Provide the verified business WhatsApp number including country code as digits only (for example, the country code followed by the number, without +, spaces, or punctuation). Leave blank until confirmed. The WhatsApp button is hidden when no number is configured.

`VITE_SITE_URL` is an optional canonical website origin. Do not put secrets, private keys, or credentials in any `VITE_` variable: browser code can read them.

## Pages

- `/` Home
- `/about` About
- `/services` Services overview
- `/services/cctv-security`
- `/services/enterprise-wifi`
- `/services/network-infrastructure`
- `/services/it-support`
- `/services/amc`
- `/industries`
- `/contact`
- `/request-quote`
- `/privacy-policy`
- `/terms`
- Any unknown path displays a custom 404 page.

The hosting platform must rewrite unknown page requests to `index.html` for client-side routes to work after refresh.

## Django REST Framework integration contract

These are proposed endpoints, not a claim that a backend already exists:

- `GET /services/`
- `GET /services/{slug}/`
- `GET /faqs/`
- `POST /contact/`
- `POST /quote-requests/`

The frontend API layer centralizes requests, JSON headers, a 15-second timeout, and recoverable error handling. Contact and quote forms do not fake success: they show a success state only when the configured endpoint returns a successful HTTP response. When no API base URL is configured or the server is unavailable, the form shows an error and preserves the entered values.

### Contact payload

```json
{
  "name": "Example Name",
  "company_name": "Example Company",
  "email": "contact@example.com",
  "phone": "0000000000",
  "message": "We need enterprise networking support."
}
```

### Quote request payload

```json
{
  "name": "Example Name",
  "company_name": "Example Company",
  "email": "contact@example.com",
  "phone": "0000000000",
  "service": "network-infrastructure",
  "project_type": "new-installation",
  "project_location": "Example Location",
  "estimated_budget": "",
  "requirements": "We require a network installation.",
  "preferred_contact_method": "email",
  "consent": true
}
```

Suggested success response: HTTP 201 with a JSON object such as `{"id": "request-id", "message": "Received"}`. Error responses should use appropriate HTTP status codes and preferably provide a `detail` string or field-level validation errors. The current frontend displays general errors; extend field-level mapping when the backend response contract is finalized.

### Backend setup checklist

1. Enable CORS for the frontend origin in Django; do not use wildcard origins in production.
2. Validate all submitted data server-side, including email, phone, consent, maximum lengths, and allowed service/project values.
3. Add rate limiting, spam protection, request size limits, and monitoring to public POST endpoints.
4. Use HTTPS in production.
5. If cookie-based authentication is added later, configure CSRF protections deliberately. Public forms currently do not require login.
6. Configure server-side logging and retention in line with the approved privacy policy.
7. Keep secrets only on the server, never in Vite environment variables.

## Before production launch

- Supply and verify the official Falcontechworld logo and replace the CSS-built wordmark with the original asset.
- Confirm official business email, phone, WhatsApp number, address, business hours, and company-specific facts.
- Replace the Unsplash demonstration photography with licensed/approved company imagery if needed.
- Review privacy policy and terms with the business/legal adviser.
- Configure the production API URL and test CORS, server-side validation, and successful form submissions.
- Configure SPA fallback rewrites, canonical domain, sitemap, robots policy, and a production favicon.
- Run `npm run build` and `npm run lint` in the target environment.

## Notes

Service and industry descriptions are editable website content. Company-specific metrics, certifications, client references, service guarantees, and response-time commitments have intentionally not been invented. React Hook Form and Zod are included as dependencies for future field-schema integration; current form validation is implemented directly and should be consolidated into shared Zod schemas as the backend contract is finalized.
