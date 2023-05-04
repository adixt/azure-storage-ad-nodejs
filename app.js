const express = require("express");
const { BlobServiceClient } = require("@azure/storage-blob");
const { QueueServiceClient } = require("@azure/storage-queue");
const { ClientSecretCredential } = require("@azure/identity");

// Set up the credentials
const tenantId = "<your-azure-tenant-id>";
const clientId = "<your-application-client-id>";
const clientSecret = "<your-client-secret>";

const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

// Create a BlobServiceClient or QueueServiceClient instance
const blobAccountUrl = "<your-blob-storage-account-url>";
const queueAccountUrl = "<your-queue-storage-account-url>";

const blobServiceClient = new BlobServiceClient(blobAccountUrl, credential);
const queueServiceClient = new QueueServiceClient(queueAccountUrl, credential);

// Set up the express app
const app = express();
const port = process.env.PORT || 3000;

app.get("/", async (req, res) => {
  try {
    const containerName = "<your-container-name>";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // List blobs in the container
    const blobs = [];
    for await (const blob of containerClient.listBlobsFlat()) {
      blobs.push(blob.name);
    }

    res.send(`
      <h1>Azure Storage AD integration example</h1>
      <h2>Blobs in ${containerName} container:</h2>
      <ul>
        ${blobs.map((blob) => `<li>${blob}</li>`).join("")}
      </ul>
    `);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
