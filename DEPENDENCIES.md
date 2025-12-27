# Project Dependencies & Data Sources

## Overview

This is a **privacy-first, client-side-only** developer utility web app. It has **minimal external dependencies** and works mostly offline.

---

## External Dependencies

### 1. QR Code Generator API (Optional - Requires Internet)

**Service**: QR Server API  
**URL**: `https://api.qrserver.com/v1/create-qr-code/`  
**Used in**: `js/tool-qr-generator.js`

**Details**:
- Used to generate QR code images
- **Requires internet connection** to work
- Data is sent to the API (text/URL only)
- If offline, QR code generation will fail with an error message

**Alternative**: For fully offline operation, you could implement client-side QR code generation using a library like `qrcode.js` (would require adding a library)

**Privacy Note**: The text/URL you want to encode is sent to the external API. For sensitive data, consider implementing client-side QR generation.

---

### 2. Google Apps Script (Optional - For Feedback)

**Service**: Google Apps Script Web App  
**URL**: Configurable in `js/feedback.js` (default: not configured)  
**Used in**: `js/feedback.js`

**Details**:
- **Completely optional** - feedback system works without it
- If not configured, feedback is stored locally in `localStorage`
- If configured, feedback is sent to your Google Sheet via Apps Script
- See `google-apps-script.js` for setup instructions

**Privacy Note**: Only sends feedback data if you configure it. By default, everything stays local.

---

## No External Dependencies

### ✅ What's NOT Required:

1. **No npm packages** - No `package.json`, no `node_modules`
2. **No CDN libraries** - No jQuery, React, Vue, or other frameworks
3. **No external CSS frameworks** - All styles are custom
4. **No external fonts** - Uses system fonts
5. **No external images** - All icons are inline SVG data URIs
6. **No build tools** - No webpack, babel, or bundlers
7. **No server-side code** - Pure client-side JavaScript

---

## Browser APIs Used (Built-in, No Installation)

These are native browser APIs that don't require any installation:

1. **Web Crypto API** (`crypto.subtle`) - For hash generation (SHA-1, SHA-256, SHA-512)
2. **FileReader API** - For reading files (Base64, Image Compressor)
3. **Canvas API** - For image compression
4. **Clipboard API** (`navigator.clipboard`) - For copy functionality
5. **localStorage** - For storing feedback queue (if API not configured)
6. **DOMParser** - For XML parsing
7. **Fetch API** - For QR code generation and feedback submission

**Note**: All these APIs are built into modern browsers. No installation needed.

---

## Data Flow

### Input Data (User Provided)
- ✅ All processing happens **client-side**
- ✅ No data is sent to servers (except QR code API and optional feedback)
- ✅ Data never leaves the browser for most tools

### Output Data
- ✅ All results are generated **locally**
- ✅ Copy to clipboard uses browser APIs
- ✅ Downloads use blob URLs (no server upload)

---

## Offline Capability

### ✅ Fully Offline Tools (14/15 tools):
1. Base64 Encoder/Decoder
2. JSON Formatter
3. XML Formatter
4. SQL Formatter
5. Image Compressor
6. URL Encoder/Decoder
7. Hash Generator
8. UUID Generator
9. JWT Decoder
10. Color Picker & Converter
11. Regex Tester
12. Text Diff
13. Timestamp Converter
14. Delimiter Converter

### ⚠️ Requires Internet (1/15 tools):
1. **QR Code Generator** - Needs `api.qrserver.com`

---

## Installation Requirements

### ✅ None!

This project requires:
- **Zero installation**
- **Zero build process**
- **Zero dependencies**
- Just open `index.html` in a browser

### Browser Requirements:
- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- Web Crypto API support (for hash generation)
- Canvas API support (for image compression)

---

## File Structure (No Dependencies)

```
AUTOOO/
├── index.html              # Main page
├── styles/                 # CSS files (no external CSS)
│   ├── main.css
│   └── tool.css
├── js/                     # JavaScript files (no external JS)
│   ├── main.js
│   ├── utils.js
│   ├── feedback.js
│   └── tool-*.js          # Individual tool scripts
├── tools/                  # Tool HTML pages
│   └── *.html
└── Documentation files
```

**No**:
- `node_modules/`
- `package.json`
- `package-lock.json`
- `.env` files
- Build configuration files

---

## Summary

| Dependency Type | Count | Required? |
|----------------|-------|-----------|
| npm packages | 0 | ❌ No |
| CDN libraries | 0 | ❌ No |
| External APIs | 1 | ⚠️ Optional (QR Code) |
| Browser APIs | 7 | ✅ Yes (built-in) |
| External images | 0 | ❌ No |
| External fonts | 0 | ❌ No |

**Total External Dependencies**: **1** (QR Code API - optional, requires internet)

**Privacy Impact**: Minimal - only QR code text is sent externally (and optional feedback if configured)

---

## Making It Fully Offline

To make the QR Code Generator work offline:

1. **Option 1**: Use a client-side QR code library
   - Add `qrcode.js` library (would add ~50KB)
   - Modify `js/tool-qr-generator.js` to use the library
   - No internet required

2. **Option 2**: Keep current implementation
   - Works when online
   - Shows error when offline
   - Users can use other tools offline

---

## Privacy Guarantee

✅ **14 out of 15 tools work completely offline**  
✅ **No tracking, no analytics, no data collection**  
✅ **All processing happens in your browser**  
⚠️ **Only QR Code Generator sends data externally** (the text you want to encode)

---

## Conclusion

This project is **99% dependency-free**. The only external dependency is the optional QR code API, which requires internet connection. All other tools work completely offline with zero external dependencies.

