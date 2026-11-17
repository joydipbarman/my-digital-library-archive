# My Digital Library

A simple personal digital library you can host for free on **GitHub Pages**. No build step, no framework, no database. Everything is driven by one file: `books.json`.

## Features

- Search by title, author, category, description or tag
- Filter by category and sort by title, author, year or date added
- Grid and list views
- Light and dark mode (remembers your choice)
- Auto-generated covers when you don't supply an image
- Works with PDFs and files stored in the repo, or links to anywhere on the web

## Repository layout

```
.
├── index.html     # page structure
├── style.css      # styling
├── script.js      # search, filter, sort, rendering
├── books.json     # YOUR LIBRARY DATA (edit this)
├── .nojekyll      # tells GitHub Pages to serve files as-is
├── books/         # put your PDFs / EPUBs here
└── covers/        # optional cover images
```

## Deploy on GitHub Pages

1. Upload all these files to your repository (for example `my-digital-library-archive`).
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`, then click **Save**.
5. After a minute your site will be live at:
   `https://<your-username>.github.io/<repository-name>/`

## Add a book

Open `books.json` and add an entry:

```json
{
  "title": "Book Title",
  "author": "Author Name",
  "year": 2020,
  "category": "Science",
  "format": "PDF",
  "description": "One or two lines about the book.",
  "tags": ["physics", "reference"],
  "url": "books/book-title.pdf",
  "cover": "covers/book-title.jpg",
  "added": "2026-11-17"
}
```

| Field | Required | Notes |
|-------|----------|-------|
| `title` | yes | Shown on the card |
| `author` | no | |
| `year` | no | Number; used for sorting |
| `category` | no | Used to build the category filter automatically |
| `format` | no | PDF, EPUB, Article, Link… |
| `description` | no | Short summary |
| `tags` | no | List of words; clicking a tag searches for it |
| `url` | yes | Relative path (`books/file.pdf`) or full `https://` link |
| `cover` | no | Image path or URL; leave `""` for a generated cover |
| `added` | no | `YYYY-MM-DD`; used for "Recently added" sort |

Keep the JSON valid: commas between entries, no trailing comma after the last one. You can check it at https://jsonlint.com.

## Run locally

Browsers block `fetch()` on `file://` pages, so serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Copyright note

Only host files you have the right to share. For copyrighted books, keep the library private or link to legal sources (publisher, Project Gutenberg, Internet Archive, your institution) instead of uploading the files.

## Limits to know

- GitHub recommends repositories stay under about 1 GB, and single files must be under 100 MB.
- GitHub Pages sites are public, even if the repo has few visitors. Don't upload anything private.
