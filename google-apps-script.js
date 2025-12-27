/**
 * Google Apps Script for Feedback Integration
 * 
 * Instructions:
 * 1. Create a new Google Apps Script project
 * 2. Paste this code
 * 3. Create a Google Sheet with headers: Timestamp, Type, Message, Email, User Agent, URL
 * 4. Deploy as Web App with execute permissions for "Anyone"
 * 5. Copy the web app URL and update FEEDBACK_API_URL in js/feedback.js
 */

function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Get the active spreadsheet (or specify by ID)
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // If sheet is empty, add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Type', 'Message', 'Email', 'User Agent', 'URL']);
    }
    
    // Append the feedback data
    sheet.appendRow([
      new Date(),
      data.type || 'unknown',
      data.message || '',
      data.email || 'anonymous',
      data.userAgent || '',
      data.url || ''
    ]);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: true,
        message: 'Feedback received'
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        success: false,
        error: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Handle GET requests for testing
function doGet(e) {
  return ContentService
    .createTextOutput('Feedback API is running. Use POST to submit feedback.')
    .setMimeType(ContentService.MimeType.TEXT);
}

