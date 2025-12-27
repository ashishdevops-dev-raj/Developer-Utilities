# Developer Utilities - Privacy-First Developer Tools

A comprehensive collection of 14+ developer utility tools built with pure HTML, CSS, and Vanilla JavaScript. All processing happens client-side, ensuring complete privacy and offline functionality.

## Features

- 🔒 **Privacy-First**: All processing happens in your browser. No data is sent to servers.
- 🌙 **Dark Modern UI**: Beautiful dark theme with smooth animations
- 📱 **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- 🔍 **Search Functionality**: Quickly find tools with instant search
- ♿ **Accessible**: Built with accessibility in mind (ARIA labels, keyboard navigation)
- ⚡ **Fast & Lightweight**: No frameworks, no external dependencies
- 🔄 **Offline Support**: Works without internet connection

## Tools Included

1. **Base64 Encoder/Decoder** - Encode and decode Base64 strings
2. **JSON Formatter** - Format, validate, and minify JSON
3. **XML Formatter** - Format and validate XML documents
4. **SQL Formatter** - Beautify SQL queries
5. **Image Compressor** - Compress images (JPEG, PNG, WebP)
6. **URL Encoder/Decoder** - Encode and decode URL components
7. **Hash Generator** - Generate SHA-1, SHA-256, SHA-512 hashes
8. **UUID Generator** - Generate UUIDs (v4)
9. **JWT Decoder** - Decode JSON Web Tokens
10. **Color Picker & Converter** - Pick colors and convert between formats
11. **Regex Tester** - Test regular expressions with live matching
12. **Text Diff** - Compare two texts and highlight differences
13. **QR Code Generator** - Generate QR codes from text/URLs
14. **Timestamp Converter** - Convert between Unix timestamps and dates

## Getting Started

1. Clone or download this repository
2. Open `index.html` in your web browser
3. No build process or installation required!

## Project Structure

```
.
├── index.html              # Main page
├── styles/
│   ├── main.css           # Main styles and theme
│   └── tool.css           # Shared tool page styles
├── js/
│   ├── main.js            # Main application logic
│   ├── feedback.js        # Feedback form handling
│   └── tool-*.js          # Individual tool implementations
├── tools/
│   └── *.html             # Individual tool pages
└── README.md
```

## Feedback Integration

The app includes a feedback system that can integrate with Google Sheets via Google Apps Script.

### Setup Google Apps Script Integration

1. Create a new Google Apps Script project
2. Copy the code from `google-apps-script.js` (see below)
3. Deploy as a web app with execute permissions for "Anyone"
4. Copy the web app URL
5. Update `FEEDBACK_API_URL` in `js/feedback.js`

### Google Apps Script Code

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    sheet.appendRow([
      new Date(),
      data.type,
      data.message,
      data.email,
      data.userAgent,
      data.url
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({success: true}))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({success: false, error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Browser Compatibility

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Initial load: < 50KB (all files)
- No external dependencies
- Fast search with debouncing
- Efficient DOM manipulation

## Security

- XSS protection with HTML escaping
- No eval() or dangerous operations
- Client-side only processing
- No tracking or analytics

## Accessibility

- ARIA labels on interactive elements
- Keyboard navigation support
- Focus indicators
- Screen reader friendly
- Reduced motion support

## Contributing

This is a client-side only project. To add a new tool:

1. Create `tools/your-tool.html`
2. Create `js/tool-your-tool.js`
3. Add tool configuration to `js/main.js`
4. Follow existing patterns and styles

## License

MIT License - Feel free to use and modify as needed.

## Credits

Built with ❤️ using pure web technologies.

