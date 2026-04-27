import fs from 'fs'

async function check() {
  const res = await fetch('https://equivest-platform.vercel.app/horses', {
    headers: { Cookie: 'investor_auth=true' }
  })
  const text = await res.text()
  fs.writeFileSync('scratch/dump.html', text)
  console.log("Dumped to scratch/dump.html")
}
check()
