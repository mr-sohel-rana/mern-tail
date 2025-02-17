const app = require("./app"); // Import the app from app.js
const PORT =5001; // Set the port, default to 5004

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
