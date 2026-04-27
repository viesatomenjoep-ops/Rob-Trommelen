const https = require('https');

async function testVercel() {
  const res = await fetch('https://equivest-platform.vercel.app/api/debug-property?id=test');
  console.log('API STATUS:', res.status);
  const text = await res.text();
  console.log('API RESP:', text.substring(0, 100));
}
testVercel();
