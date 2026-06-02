// ============================================
// Update script: Update existing products in Supabase
// with correct image URLs and priceRaw values
// Run: node scripts/update-products.js
// ============================================

const SUPABASE_URL = 'https://nnnmcmiihkgjivwkvmet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ubm1jbWlpaGtnaml2d2t2bWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDg0NDUsImV4cCI6MjA5NTE4NDQ0NX0.o2KDePXGODPDz1CAo9dfJd1Pb6OcVtSvO5W1omXsJSo';

const headers = {
  'apikey': SUPABASE_KEY,
  'Authorization': 'Bearer ' + SUPABASE_KEY,
  'Content-Type': 'application/json',
  'Prefer': 'return=minimal'
};

// Map of product names to their correct image URLs
const productUpdates = {
  'Raw Honey': { image_url: './image/honey.jpg' },
  'Ginger Root': { image_url: './image/ginger.jpg' },
  'Coconut Oil': { image_url: './image/coconut.jpg' },
  'Black Seed Oil': { image_url: './image/black-seed-oil.jpg' },
  'Herbal Tea Blend': { image_url: './image/herbal-tea.jpg' },
  'Honey & Ginger Mix': { image_url: './image/honey-ginger-mix.jpg' },
  'Premium Dates (Tamar)': { image_url: './image/dates.jpg' },
  'Pure Olive Oil (Zaitun)': { image_url: './image/olive-oil.jpg' },
  'Organic Moringa Powder': { image_url: './image/moringa.jpg' },
  'Natural Frankincense (Luban)': { image_url: './image/frankincense.jpg' },
  'Natural Sidr Leaves Powder': { image_url: './image/sidr-powder.jpg' },
  'Black Seed Honey Blend': { image_url: './image/black-seed-honey.jpg' }
};

async function updateProducts() {
  console.log('Fetching existing products...');
  
  const fetchRes = await fetch(SUPABASE_URL + '/rest/v1/products?select=id,name', {
    headers
  });
  
  if (!fetchRes.ok) {
    console.error('Failed to fetch products:', fetchRes.status, await fetchRes.text());
    process.exit(1);
  }
  
  const existingProducts = await fetchRes.json();
  console.log('Found ' + existingProducts.length + ' products in database.');
  
  let updated = 0;
  let skipped = 0;
  
  for (const dbProduct of existingProducts) {
    const updates = productUpdates[dbProduct.name];
    if (!updates) {
      console.log('   Skipping "' + dbProduct.name + '" — no update data');
      skipped++;
      continue;
    }
    
    // Check if already up to date
    const checkRes = await fetch(SUPABASE_URL + '/rest/v1/products?id=eq.' + dbProduct.id + '&select=image_url', { headers });
    const current = await checkRes.json();
    
    if (current[0] && current[0].image_url === updates.image_url) {
      console.log('   Skipping "' + dbProduct.name + '" — already up to date');
      skipped++;
      continue;
    }
    
    // Update the product
    const updateRes = await fetch(SUPABASE_URL + '/rest/v1/products?id=eq.' + dbProduct.id, {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updates)
    });
    
    if (!updateRes.ok) {
      console.error('   Failed to update "' + dbProduct.name + '":', updateRes.status, await updateRes.text());
      continue;
    }
    
    console.log('   ✓ Updated "' + dbProduct.name + '" → ' + updates.image_url + ' (₦' + updates.price_raw + ')');
    updated++;
  }
  
  console.log('\n✅ Complete! ' + updated + ' updated, ' + skipped + ' skipped.');
}

updateProducts().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
