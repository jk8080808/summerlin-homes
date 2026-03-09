import fs from 'node:fs/promises';

// Replace this sample data with your authorized IDX / MLS / RESO feed.
// Only publish public-display photos and valid detail-page URLs allowed by your license.

const sampleListings = [
  {
    address: '11224 Granite Ridge Dr',
    village: 'The Vistas',
    zip: '89138',
    status: 'For Sale',
    price: 1185000,
    sqft: 3241,
    lot: 6840,
    beds: 4,
    baths: 3.5,
    photo: '',
    detailUrl: 'https://example.com/authorized-listing-detail',
    listingFirm: 'Sample Realty Group',
    listingAgent: 'Jordan Smith',
    attributionContact: '(702) 555-0110',
    mlsSource: 'Sample MLS Feed'
  }
];

async function main() {
  const out = `window.__LISTINGS__ = ${JSON.stringify(sampleListings, null, 2)};
`;
  await fs.writeFile(new URL('../assets/live-data.js', import.meta.url), out, 'utf8');
  console.log('Wrote assets/live-data.js');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
