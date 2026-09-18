# Fitosauna landing page

Standalone static version of the Fitosauna home-sauna landing page.

## Structure

- `index.html` — page content and metadata
- `styles.css` — project overrides and responsive fixes
- `original.css` — visual styles retained from the reference page
- `script.js` — FAQ, review expansion, product gallery/model selection, and form placeholder behavior
- `assets/` — local images, SVGs, and videos

## Preview locally

Run a simple static server in this directory, for example:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

## Hosting

Upload the contents of this directory to the target web root. Keep the file and
folder names unchanged so relative asset paths continue to work.

## Form status

The consultation form is intentionally presentation-only. Its submit event is
intercepted in `script.js` until a real form handler is connected.

## Removed from the reference implementation

- WordPress and WooCommerce runtime dependencies
- Product bundle selector
- Cart and payment-method interface
- Analytics, tracking, cookie, chat, and marketing-popup scripts
