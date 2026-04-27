const https = require('https');
const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6Im1yay00MzAyZWMxYjY3MGY0OGE5OGFkNjFkYWRlNGEyM2JlNyJ9...'; // Wait, the token in .env.local is an OIDC token, not a Vercel REST API token. 

// I can't use OIDC token easily for REST API.
