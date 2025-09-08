const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();

exports.fetchAndStoreWebPage = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const url = data.url;
  const userId = context.auth.uid;
  const customID = data.customID;

  try {
    // Fetch the web page content
    const response = await fetch(url);
    const content = await response.text();

    // Reference to a new file in Cloud Storage
    const fileRef = admin.storage().bucket().file(`${userId}/${customID}.html`);

    // Upload the fetched content to Cloud Storage
    await fileRef.save(content, {
      metadata: {
        contentType: "text/html",
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error fetching and storing web page:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to fetch and store web page."
    );
  }
});

exports.braveSearch = functions.https.onCall(async (data, context) => {
  const { query } = data;
  
  if (!query) {
    throw new functions.https.HttpsError('invalid-argument', 'Query is required');
  }

  // Get API key from Firebase config with fallback
  const config = functions.config();
  console.log('Full config:', JSON.stringify(config)); // Debug log

  const apiKey = config.brave?.api_key || process.env.BRAVE_SEARCH_API_KEY;
  
  const endpoint = "https://api.search.brave.com/res/v1/web/search";
  const params = new URLSearchParams({ 
    q: query,
    count: 20,
    country: "US",
    search_lang: "en",
    ui_lang: "en-US",
    safesearch: "moderate",
    freshness: "none",
    text_decorations: false,
    spellcheck: true
  });

  try {
    const response = await fetch(`${endpoint}?${params}`, {
      headers: { 
        "Accept": "application/json",
        "X-Subscription-Token": apiKey 
      },
    });

    if (!response.ok) {
      throw new functions.https.HttpsError('internal', `Brave Search API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Brave Search API Error:", error);
    throw new functions.https.HttpsError('internal', 'Search request failed');
  }
});
