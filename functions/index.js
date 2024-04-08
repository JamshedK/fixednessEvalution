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
