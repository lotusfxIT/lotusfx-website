# Cleanup summary

## Removed (not needed for the live site)

These folders were removed to keep the repo small and tidy:

| Folder | Why removed |
|--------|-------------|
| **Anthony** | Unrelated project / old work |
| **Old Lotus Website Live Now** | Old site; not used by this Next.js app |
| **Lotus logos** | Source logos; the app uses **public/images/** only |
| **new logos** | Same; assets are in **public/images/** |
| **partner images** | Same; **public/images/partners/** has what the app uses |
| **read me** | Old docs; keep only the guides you need (see below) |
| **backend** | Not used by this Next.js app |

**Important:** The app uses **public/** (including **public/images/** and **public/content/**). Those were not touched.

---

## Optional: remove redundant root .md files

You have many setup/guide .md files in the project root. These are **safe to delete** if you don’t need them (you can keep any you still use):

**Suggested to keep:**
- `DEPLOY.md` – hosting, domain, OAuth
- `GIT_AND_VERCEL_STEP_BY_STEP.md` – first-time Git → Vercel
- `GET_REFRESH_TOKEN.md` or `GET_GOOGLE_OAUTH_CREDENTIALS.md` – if you still need to get Google tokens
- `env.example` or `env.local.template` – reference for env vars

**Optional to delete (one-time setup / old):**
- `API_TEST_COMMANDS.md`
- `CREATE_ENV_LOCAL.md`
- `DEPLOYMENT_CHECKLIST.md`
- `EXCHANGE_RATE_API_SETUP.md`, `EXCHANGE_RATE_AUTH_SETUP.md`, `EXCHANGE_RATE_REST_LOGIN.md`
- `GOOGLE_MAPS_API_SETUP.md`, `GOOGLE_MAPS_QUICK_FIX.md`
- `GOOGLE_MY_BUSINESS_PRODUCTION_GUIDE.md`
- `LOCAL_TESTING_GUIDE.md`
- `NEXT_STEPS.md`
- `PRODUCTION_DEPLOYMENT_CHECKLIST.md`, `PRODUCTION_SETUP_GUIDE.md`
- `SETUP_ENV_LOCAL.md`, `SETUP_SERVER_TOKENS.md`
- `TROUBLESHOOTING_FETCH_ERROR.md`

You can delete them from File Explorer or with:
```powershell
cd "C:\Users\ASH\Desktop\1A-Ash-Dev\lotus Z website\Website running 1609\New Website"
# Example: del API_TEST_COMMANDS.md
```

---

## After cleanup

Run `git add -A` then `git commit -m "Remove unused folders and optional docs"` and push. Your repo will be smaller and easier to deploy.
