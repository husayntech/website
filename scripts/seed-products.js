// Seed script: Insert hardcoded products into Supabase using native fetch
// Run: node scripts/seed-products.js

const SUPABASE_URL = 'https://nnnmcmiihkgjivwkvmet.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ubm1jbWlpaGtnaml2d2t2bWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDg0NDUsImV4cCI6MjA5NTE4NDQ0NX0.o2KDePXGODPDz1CAo9dfJd1Pb6OcVtSvO5W1omXsJSo';

const products = [
  // ============ EXISTING PRODUCTS (enhanced descriptions) ============
  {
    name: 'Raw Honey',
    price: 'N5,000 / bottle',
    priceRaw: '5000',
    category: 'Honey',
    image_url: './image/honey.jpg',
    description: "Pure, unprocessed raw honey — praised in the Qur'an for its healing power. Harvested directly from the hive, our honey retains all its natural enzymes, vitamins, and antibacterial properties. A daily spoonful strengthens your immune system, soothes sore throats, and provides natural, sustained energy.",
    features: '100% natural & unprocessed, Rich in antibacterial enzymes, Boosts immune system naturally, Soothes sore throats & coughs, Natural energy source, 500ml glass bottle'
  },
  {
    name: 'Ginger Root',
    price: 'N3,500 / pack',
    priceRaw: '3500',
    category: 'Spice',
    image_url: './image/ginger.jpg',
    description: 'Premium sun-dried ginger root, treasured for centuries in traditional medicine for its powerful anti-inflammatory and digestive benefits. Brew into a warming, healing tea that fights colds, eases nausea, and revitalizes your body from within.',
    features: 'Powerful anti-inflammatory, Aids digestion & reduces nausea, Fights flu & common cold symptoms, Rich in antioxidants & gingerol, 100% natural sun-dried, 250g pack'
  },
  {
    name: 'Coconut Oil',
    price: 'N4,500 / jar',
    priceRaw: '4500',
    category: 'Oil',
    image_url: './image/coconut.webp',
    description: 'Pure virgin coconut oil, cold-pressed from fresh coconuts to preserve every nutrient. Packed with essential fatty acids, vitamins, and minerals, this versatile oil is a must-have for cooking, skincare, haircare, and overall wellness.',
    features: 'Cold-pressed virgin quality, Rich in healthy MCT fats, Great for cooking & baking, Deeply moisturizes skin & hair, Boosts metabolism & energy, 500ml glass jar'
  },
  {
    name: 'Black Seed Oil',
    price: 'N6,000 / bottle',
    priceRaw: '6000',
    category: 'Oil',
    image_url: './image/black-seed-oil.jpg',
    description: 'Cold-pressed black seed (Nigella Sativa) oil — the Prophet Muhammad (S.A.W) described it as "the remedy for everything but death." Packed with thymoquinone, a powerful antioxidant, this golden oil supports your immune system, fights inflammation, and promotes glowing skin.',
    features: 'Remedy for everything but death (Hadith), Rich in thymoquinone antioxidant, Supports immune system function, Powerful anti-inflammatory, Promotes healthy skin & hair, 250ml dark glass bottle'
  },
  {
    name: 'Herbal Tea Blend',
    price: 'N3,000 / pack',
    priceRaw: '3000',
    category: 'Tea',
    image_url: './image/herbal-tea.jpg',
    description: 'A masterfully blended tisane combining prophetic herbs — warming ginger, soothing honey notes, aromatic cinnamon, and natural spices. Each cup delivers a moment of tranquility and supports your daily wellness journey. Caffeine-free.',
    features: 'All-natural prophetic herb blend, Soothing & restorative, Caffeine-free (enjoy anytime), Aids digestion naturally, Rich in warming spices, 20 tea bags per pack'
  },
  {
    name: 'Honey & Ginger Mix',
    price: 'N7,000 / combo',
    priceRaw: '7000',
    category: 'Honey',
    image_url: './image/honey.jpg',
    description: 'Our signature blend — the ultimate synergy of raw honey and concentrated ginger extract. This powerful combination brings together honey natural antibacterial power with ginger anti-inflammatory warmth. Our most popular remedy for colds, flu, and everyday immune support.',
    features: 'Double the healing power (honey + ginger), Soothes sore throat instantly, Boosts immune system naturally, Fights cold & flu symptoms, Rich in antioxidants, 500ml bottle'
  },

  // ============ 6 NEW PRODUCTS ============
  {
    name: 'Premium Dates (Tamar)',
    price: 'N4,500 / pack',
    priceRaw: '4500',
    category: 'Sunnah Foods',
    image_url: './image/dates.jpg',
    description: 'Premium quality dried dates (Tamar) — the beloved fruit of the Prophet Muhammad (S.A.W). Hand-selected for rich, caramel-like sweetness and chewy perfection. Packed with natural energy, fiber, potassium, and magnesium for vitality and digestive health.',
    features: "The Prophet's (S.A.W) favorite fruit, Rich in natural energy & fiber, Packed with potassium & magnesium, Supports digestive health, Perfect for Iftar & daily snacks, 1kg premium pack"
  },
  {
    name: 'Pure Olive Oil (Zaitun)',
    price: 'N8,000 / bottle',
    priceRaw: '8000',
    category: 'Oil',
    image_url: './image/olive-oil.jpg',
    description: 'Extra virgin olive oil from the blessed olive tree mentioned in the Quran. Cold-pressed at peak ripeness to preserve its rich polyphenol content and heart-healthy monounsaturated fats. A staple of prophetic medicine for heart health, glowing skin, and longevity.',
    features: 'Extra virgin cold-pressed, Supports heart & cardiovascular health, Rich in antioxidants & polyphenols, Mentioned in the Quran, Promotes glowing skin, 500ml dark glass bottle'
  },
  {
    name: 'Organic Moringa Powder',
    price: 'N3,500 / pack',
    priceRaw: '3500',
    category: 'Superfoods',
    image_url: './image/moringa.jpg',
    description: 'Natures most nutrient-dense superfood — Moringa oleifera, also known as "The Miracle Tree." 90+ nutrients including more vitamin C than oranges, more calcium than milk, and more iron than spinach. Add to smoothies, teas, or meals for a powerful nutritional boost.',
    features: '90+ nutrients in one superfood, More vitamin C than oranges, More calcium than milk, More iron than spinach, Natural energy & vitality booster, 250g powder pack'
  },
  {
    name: 'Natural Frankincense (Luban)',
    price: 'N5,000 / pack',
    priceRaw: '5000',
    category: 'Resins',
    image_url: './image/frankincense.jpg',
    description: 'Premium grade frankincense resin (Luban) — one of the most treasured aromatic resins in prophetic tradition. Sourced from the Boswellia tree, hand-selected for purity and aromatic potency. Burn to purify your space, uplift your spirit, and create calm, meditative atmosphere.',
    features: 'Premium hand-selected resin, Aromatic & spiritually uplifting, Creates calm meditative atmosphere, Natural air purifier, Supports immune function, 100g pure resin pack'
  },
  {
    name: 'Natural Sidr Leaves Powder',
    price: 'N3,000 / pack',
    priceRaw: '3000',
    category: 'Herbal Care',
    image_url: './image/sidr-powder.jpg',
    description: 'Pure Sidr (Lote Tree) leaf powder — a treasured traditional cleanser mentioned in the Quran. Finely ground from sun-dried Sidr leaves for gentle cleansing, soothing, and nourishing properties. Perfect as a natural hair wash, facial cleanser, or body wash.',
    features: 'Mentioned in the Quran (Sidrat al-Muntaha), Natural gentle cleanser, Nourishes & strengthens hair, Soothes skin conditions, Chemical-free & natural, 200g powder pack'
  },
  {
    name: 'Black Seed Honey Blend',
    price: 'N7,500 / bottle',
    priceRaw: '7500',
    category: 'Honey',
    image_url: './image/honey.jpg',
    description: 'The ultimate prophetic wellness duo — our Raw Honey infused with cold-pressed Black Seed Oil. Combines two of the most revered remedies into one delicious elixir. Honey is a "healing for mankind" and black seed is "the remedy for everything but death." Unmatched immune support.',
    features: 'Double prophetic remedy (honey + black seed), Unmatched immune system support, Natural anti-inflammatory formula, Daily wellness protection, Rich in antioxidants, 500ml bottle'
  }
];

async function seed() {
  console.log('Checking existing products...');

  // Check existing products
  const checkRes = await fetch(SUPABASE_URL + '/rest/v1/products?select=name', {
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY
    }
  });

  if (!checkRes.ok) {
    console.error('Failed to check existing products:', checkRes.status, await checkRes.text());
    process.exit(1);
  }

  const existing = await checkRes.json();
  const existingNames = new Set(existing.map(p => p.name));
  const toInsert = products.filter(p => !existingNames.has(p.name));

  if (toInsert.length === 0) {
    console.log('All 12 products already exist in the database. Nothing to seed.');
    process.exit(0);
  }

  console.log('Inserting ' + toInsert.length + ' new products...');

  const insertRes = await fetch(SUPABASE_URL + '/rest/v1/products', {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': 'Bearer ' + SUPABASE_KEY,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify(toInsert)
  });

  if (!insertRes.ok) {
    const errText = await insertRes.text();
    console.error('Failed to insert products:', insertRes.status, errText);

    // Try without category field if schema has issues
    if (errText.includes('category')) {
      console.log('Retrying without category field...');
      const simplified = toInsert.map(function(p) {
        return { name: p.name, price: p.price, image_url: p.image_url, description: p.description, features: p.features };
      });
      const retryRes = await fetch(SUPABASE_URL + '/rest/v1/products', {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': 'Bearer ' + SUPABASE_KEY,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(simplified)
      });
      if (!retryRes.ok) {
        console.error('Retry also failed:', retryRes.status, await retryRes.text());
        process.exit(1);
      }
      const retryData = await retryRes.json();
      console.log('Successfully seeded ' + retryData.length + ' products (without category):');
      retryData.forEach(function(p) { console.log('   - ' + p.name + ' (' + p.price + ')'); });
      process.exit(0);
    }
    process.exit(1);
  }

  const data = await insertRes.json();
  console.log('Successfully seeded ' + data.length + ' products:');
  data.forEach(function(p) { console.log('   - ' + p.name + ' (' + p.price + ')'); });

  if (existing.length > 0) {
    console.log('   Info: ' + existing.length + ' products already existed and were skipped.');
  }
}

seed().catch(function(err) {
  console.error('Unexpected error:', err);
  process.exit(1);
});
