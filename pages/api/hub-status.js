/**
 * Shared, unauthenticated status contract read by the personal Hub app
 * (~/hub). Every app in the hub exposes the same {app, url, stats,
 * updatedAt} shape at /api/hub-status so adding a new app to the hub only
 * needs one endpoint here + one config entry there.
 *
 * Grounded has no backend or account system — everything runs client-side
 * with no persisted state, so these stats are static/descriptive rather
 * than live usage numbers.
 */
export default function handler(req, res) {
  res.status(200).json({
    app: 'Grounded',
    url: 'https://grounded-lucwrite.vercel.app',
    stats: [
      { label: 'Techniques', value: 12 },
      { label: 'Symptom filters', value: 4 },
    ],
    updatedAt: new Date().toISOString(),
  });
}
