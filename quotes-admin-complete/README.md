# Quotes Creator Admin Panel — Complete Backend-Matched Version

This admin panel was built against the uploaded Quotes backend.

## Backend routes used

- `/api/categories`
- `/api/subcategories`
- `/api/quotes`
- `/api/stickers`
- `/api/ai/generate`
- `/api/notifications/send`

## Important: complete data

The backend limits:
- Quotes to 100 records per request.
- Subcategories-by-category to 100 records per request.

The admin panel automatically requests every page and combines the records, so the UI can show the **complete database**, not just the first 10/20/100 records.

Current known data from the backend setup:
- Categories are MongoDB categories.
- Subcategories belong to a category through `categoryId`.
- Quotes belong to a category and optionally a subcategory.
- Quote translations are stored in `translations`.
- Quotes support English, Hindi, Spanish, French, German, Arabic, Portuguese and Italian.
- Stickers support `popular`, `emoji`, `shape`, `quote`.

## CRUD

### Categories
Create/Edit/Delete. Creation uses the backend's required image upload through `multipart/form-data`.

### Subcategories
Create/Edit/Delete. Creation uses the backend's required image upload through `multipart/form-data`.

### Quotes
Create/Edit/Delete/View. Category and subcategory are linked, and the subcategory dropdown is filtered to the selected category.

### Stickers
Create/Edit/Delete. Uses the exact sticker API fields.

### AI
Uses the existing `/api/ai/generate` endpoint.

### Notifications
Uses the existing `/api/notifications/send` endpoint. The uploaded backend currently sends its configured notification content; it does not expose a custom title/body/image admin endpoint, so this UI does not invent one.

### Users / Settings
The uploaded backend does not expose an admin list/CRUD endpoint for users or settings. The panel explicitly shows this limitation instead of pretending that data exists.

## Run

```bash
npm install
npm run dev
```

Default API:

```text
http://localhost:5001/api
```

To change it, create `.env`:

```text
VITE_API_URL=http://localhost:5001/api
```

## CORS

The uploaded `src/app.js` already contains:

```js
app.use(cors());
```

so the Vite admin panel can call the backend from localhost.

## One backend detail

`server.js` duplicates some route registration logic while `src/app.js` also registers routes. The admin panel only calls the normal `/api/...` endpoints, so run the backend in the way you already use it and keep one server instance on port 5001.
