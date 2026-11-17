# 📚 Digital Library & E-Book Archive

A static, browser-searchable digital library website designed for **GitHub Pages**—no Git CLI required!

## Folder Structure

```text
digital-library-archive/
├── index.html                  # Main searchable library catalog webpage
├── README.md                   # Repository documentation
├── .nojekyll                   # Ensures GitHub Pages serves all files as-is
├── books/
│   ├── programming/            # Place programming PDFs here (e.g., let-us-c.pdf)
│   └── library-science/        # Place MLIS / Library Science PDFs here
└── code-examples/
    └── chapter-09-strings/     # C programming examples from Chapter 9
```

## How to Upload via GitHub Website (No Git Commands Needed)

1. Extract this ZIP file on your computer.
2. Add your PDF books into `books/programming/` or `books/library-science/`.
3. Open your GitHub repository in your browser and click **Add file -> Upload files**.
4. Drag and drop all the extracted files and folders into the browser window and click **Commit changes**.
5. Go to **Settings -> Pages**, choose your `main` branch and `/ (root)` folder, and click **Save**.
