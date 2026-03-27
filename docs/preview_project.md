# Previewing the Project

To preview the project locally in development mode:

```bash
npm run dev
```

The application will be available at `http://localhost:9002` (as configured in `package.json`).

## Key Features to Test

1. **Language Switcher**: Verify that Romanian, English, Hungarian, Italian, German, and Spanish translations work.
2. **Product Catalog**: Check filters (category, stock, status) and search.
3. **Product Detail Page**: Verify the specific details, specifications table, and contact form.
4. **Admin Panel**: Check `/admin/cereri` and other admin routes.

## Local Environment

Ensure you have a `.env` file with the necessary API keys (Gemini, Resend, etc.) before running the project.
