(function () {
  const listings = Array.isArray(window.LIVE_LISTINGS) ? window.LIVE_LISTINGS : [];
  const villageFilter = document.getElementById('villageFilter');
  const statusFilter = document.getElementById('statusFilter');
  const searchInput = document.getElementById('searchInput');
  const listingGrid = document.getElementById('listingGrid');
  const matchCount = document.getElementById('matchCount');
  const avgPrice = document.getElementById('avgPrice');
  const avgLot = document.getElementById('avgLot');
  const resultsText = document.getElementById('resultsText');

  const money = n => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n || 0);
  const num = n => new Intl.NumberFormat('en-US').format(n || 0);

  function populateVillages() {
    const villages = [...new Set(listings.map(x => x.village).filter(Boolean))].sort();
    villages.forEach(v => {
      const opt = document.createElement('option');
      opt.value = v;
      opt.textContent = v;
      villageFilter.appendChild(opt);
    });
  }

  function getFiltered() {
    const village = villageFilter.value.trim().toLowerCase();
    const status = statusFilter.value.trim().toLowerCase();
    const query = searchInput.value.trim().toLowerCase();

    return listings.filter(item => {
      const matchesVillage = !village || item.village.toLowerCase() === village;
      const matchesStatus = !status || item.status.toLowerCase() === status;
      const haystack = `${item.address} ${item.village}`.toLowerCase();
      const matchesSearch = !query || haystack.includes(query);
      return matchesVillage && matchesStatus && matchesSearch;
    });
  }

  function render() {
    const filtered = getFiltered();
    matchCount.textContent = num(filtered.length);
    resultsText.textContent = `Showing ${filtered.length} ${filtered.length === 1 ? 'home' : 'homes'}`;
    avgPrice.textContent = filtered.length ? money(filtered.reduce((a, b) => a + b.price, 0) / filtered.length) : '$0';
    avgLot.textContent = filtered.length ? `${num(Math.round(filtered.reduce((a, b) => a + b.lotSize, 0) / filtered.length))} sf` : '0 sf';

    if (!filtered.length) {
      listingGrid.innerHTML = '<div class="empty">No homes match the current filters.</div>';
      return;
    }

    listingGrid.innerHTML = filtered.map(item => `
      <article class="card">
        <div class="card-media">
          <img src="${item.photo}" alt="Photo of ${item.address}">
          <div class="status-pill">${item.status}</div>
        </div>
        <div class="card-body">
          <div class="price-row">
            <div class="price">${money(item.price)}</div>
            <div class="village">${item.village}</div>
          </div>
          <div class="address">${item.address}</div>
          <div class="meta">
            <div><strong>${item.beds}</strong><span>Beds</span></div>
            <div><strong>${item.baths}</strong><span>Baths</span></div>
            <div><strong>${num(item.sqft)}</strong><span>Sq Ft</span></div>
          </div>
          <div class="submeta">
            <span>Lot: ${num(item.lotSize)} sf</span>
            <span>${item.mlsSource}</span>
          </div>
          <div class="attribution">
            <strong>${item.listingFirm}</strong><br>
            ${item.listingAgent} • ${item.attributionContact}
          </div>
          <div class="card-actions">
            <a class="btn btn-primary" href="${item.detailUrl}" target="_blank" rel="noopener noreferrer">View Listing</a>
            <a class="btn btn-secondary" href="#top">Save Note</a>
          </div>
        </div>
      </article>
    `).join('');
  }

  populateVillages();
  render();
  [villageFilter, statusFilter].forEach(el => el.addEventListener('change', render));
  searchInput.addEventListener('input', render);
})();
