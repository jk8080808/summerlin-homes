const fallbackListings = [
  {
    address: '11224 Granite Ridge Dr', village: 'The Vistas', zip: '89138', status: 'For Sale',
    price: 1185000, sqft: 3241, lot: 6840, beds: 4, baths: 3.5,
    photo: '', detailUrl: '#', listingFirm: 'Sample Realty Group', listingAgent: 'Jordan Smith',
    attributionContact: '(702) 555-0110', mlsSource: 'Sample MLS Feed'
  },
  {
    address: '502 Paseo Crest Ct', village: 'The Paseos', zip: '89138', status: 'Under Contract',
    price: 1249000, sqft: 3388, lot: 7200, beds: 5, baths: 4,
    photo: '', detailUrl: '#', listingFirm: 'Desert Canyon Properties', listingAgent: 'Avery Cole',
    attributionContact: '(702) 555-0175', mlsSource: 'Sample MLS Feed'
  },
  {
    address: '4432 Amber Valley Ave', village: 'Stonebridge', zip: '89138', status: 'For Sale',
    price: 899000, sqft: 2754, lot: 6100, beds: 4, baths: 3,
    photo: '', detailUrl: '#', listingFirm: 'Summerlin Residential', listingAgent: 'Taylor Reed',
    attributionContact: '(702) 555-0133', mlsSource: 'Sample MLS Feed'
  }
];

const listings = window.__LISTINGS__ || fallbackListings;

const els = {
  grid: document.getElementById('listingGrid'),
  count: document.getElementById('countActive'),
  label: document.getElementById('resultsLabel'),
  search: document.getElementById('search'),
  status: document.getElementById('status'),
  village: document.getElementById('village'),
  sort: document.getElementById('sort')
};

function currency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"]/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
}

function buildVillageOptions() {
  [...new Set(listings.map(l => l.village).filter(Boolean))].sort().forEach(v => {
    const option = document.createElement('option');
    option.value = v;
    option.textContent = v;
    els.village.appendChild(option);
  });
}

function renderCard(l) {
  const image = l.photo ? `<img src="${escapeHtml(l.photo)}" alt="${escapeHtml(l.address)}" />` : '<div class="property-icon" aria-hidden="true"></div>';
  const detailLink = l.detailUrl && l.detailUrl !== '#'
    ? `<a class="btn btn-primary card-link" href="${escapeHtml(l.detailUrl)}" target="_blank" rel="noopener noreferrer">View Listing</a>`
    : `<span class="btn btn-primary card-link disabled">Authorized link pending</span>`;

  return `
    <article class="card">
      <div class="card-media">
        <div class="badge-row">
          <span class="badge">${escapeHtml(l.status)}</span>
          <span class="badge">${escapeHtml(l.village)}</span>
        </div>
        ${image}
      </div>
      <div class="card-body">
        <h3>${escapeHtml(l.address)}</h3>
        <div class="meta">${escapeHtml(l.zip)}</div>
        <div class="price">${currency(l.price)}</div>
        <div class="submeta">${l.beds} bd • ${l.baths} ba • ${l.sqft.toLocaleString()} sq ft</div>
        <div class="submeta">Lot ${l.lot.toLocaleString()} sq ft</div>
        <div class="attribution">
          <div><strong>Listing firm:</strong> ${escapeHtml(l.listingFirm || 'TBD')}</div>
          <div><strong>Agent:</strong> ${escapeHtml(l.listingAgent || 'TBD')}</div>
          <div><strong>Contact:</strong> ${escapeHtml(l.attributionContact || 'TBD')}</div>
          <div><strong>Source:</strong> ${escapeHtml(l.mlsSource || 'Authorized feed required')}</div>
        </div>
        <div class="card-actions">${detailLink}</div>
      </div>
    </article>
  `;
}

function render() {
  const q = els.search.value.trim().toLowerCase();
  const status = els.status.value;
  const village = els.village.value;
  const sort = els.sort.value;

  let rows = listings.filter(l => {
    const matchesQuery = !q || `${l.address} ${l.village} ${l.zip}`.toLowerCase().includes(q);
    const matchesStatus = status === 'all' || l.status === status;
    const matchesVillage = village === 'all' || l.village === village;
    return matchesQuery && matchesStatus && matchesVillage;
  });

  rows.sort((a, b) => {
    if (sort === 'priceAsc') return a.price - b.price;
    if (sort === 'priceDesc') return b.price - a.price;
    if (sort === 'sqftDesc') return b.sqft - a.sqft;
    if (sort === 'lotDesc') return b.lot - a.lot;
    return 0;
  });

  els.count.textContent = rows.length;
  els.label.textContent = `Showing ${rows.length} ${rows.length === 1 ? 'home' : 'homes'}`;
  els.grid.innerHTML = rows.map(renderCard).join('');
}

buildVillageOptions();
render();
['input', 'change'].forEach(evt => {
  els.search.addEventListener(evt, render);
  els.status.addEventListener(evt, render);
  els.village.addEventListener(evt, render);
  els.sort.addEventListener(evt, render);
});
