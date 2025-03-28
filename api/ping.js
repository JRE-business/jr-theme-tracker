export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { domain, theme, email } = req.body;
  if (!domain || !theme) {
    return res.status(400).json({ message: 'Missing domain or theme' });
  }

  const existing = globalThis.pingLog || new Set();
  if (existing.has(domain)) {
    return res.status(200).json({ message: 'Already logged' });
  }

  existing.add(domain);
  globalThis.pingLog = existing;

  try {
    await fetch('https://maker.ifttt.com/trigger/theme_used/with/key/hIvR_bGh1Pvf5xUfVbk-JJ9TCtAHtDWQHJp_ceMD2IA', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        value1: domain,
        value2: theme,
        value3: email
      })
    });
  } catch (err) {
    console.error('Ping failed:', err);
  }

  return res.status(200).json({ message: 'Ping logged successfully' });
}