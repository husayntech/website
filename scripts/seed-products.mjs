// ============================================
// Seed script: Insert hardcoded products into Supabase
// Run: node scripts/seed-products.mjs
// ============================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://nnnmcmiihkgjivwkvmet.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ubm1jbWlpaGtnaml2d2t2bWV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk2MDg0NDUsImV4cCI6MjA5NTE4NDQ0NX0.o2KDePXGODPDz1CAo9dfJd1Pb6OcVtSvO5W1omXsJSo';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [
  {
    name: 'Raw Honey',
    price: '₦5,000 / bottle',
    price_raw: 5000,
    category: 'Honey',
    image_url: './image/honey.jpg',
    description: 'Pure, unprocessed raw honey with powerful healing properties as mentioned in the Qur\'an.',
    features: '100% natural & unprocessed, Kills unwanted yeast & bacteria, Improves digestion & immunity, 500ml glass bottle'
  },
  {
    name: 'Ginger Root',
    price: '₦3,500 / pack',
    price_raw: 3500,
    category: 'Spice',
    image_url: './image/ginger.jpg',
    description: 'Premium dried ginger root, known for its powerful anti-inflammatory and digestive benefits.',
    features: 'Aids digestion & reduces nausea, Fights flu & common cold, Rich in antioxidants, 250g pack'
  },
  {
    name: 'Coconut Oil',
    price: '₦4,500 / jar',
    price_raw: 4500,
    category: 'Oil',
    image_url: './image/coconut.jpg',
    description: 'Pure virgin coconut oil, packed with essential vitamins and minerals for health and beauty.',
    features: 'Highly nutritious & rich in fiber, Great for cooking & skincare, Boosts metabolism, 500ml jar'
  },
  {
    name: 'Black Seed Oil',
    price: '₦6,000 / bottle',
    price_raw: 6000,
    category: 'Oil',
    image_url: './image/black-seed-oil.jpg',
    description: 'Cold-pressed black seed (Nigella Sativa) oil — "the remedy for everything but death" as taught by the Prophet (S.A.W).',
    features: 'Supports immune system, Anti-inflammatory properties, Promotes healthy skin & hair, 250ml bottle'
  },
  {
    name: 'Herbal Tea Blend',
    price: '₦3,000 / pack',
    price_raw: 3000,
    category: 'Tea',
    image_url: './image/herbal-tea.jpg',
    description: 'A soothing blend of prophetic herbs including ginger, honey, and natural spices for daily wellness.',
    features: 'All-natural ingredients, Calming & restorative, Caffeine-free, 20 tea bags'
  },
  {
    name: 'Honey & Ginger Mix',
    price: '₦7,000 / combo',
    price_raw: 7000,
    category: 'Honey',
    image_url: './image/honey-ginger-mix.jpg',
    description: 'A powerful combination of raw honey and ginger extract — our most popular remedy for colds and flu.',
    features: 'Double the healing power, Soothes sore throat, Boosts immune system, 500ml bottle'
  }
];

async function seed() {
  console.log('Seeding products...');

  // First check if products already exist
  const { data: existing, error: checkError } = await supabase
    .from('products')
    .select('name');

  if (checkError) {
    console.error('Error checking existing products:', checkError.message);
    process.exit(1);
  }

  const existingNames = new Set((existing || []).map(p => p.name));
  const toInsert = products.filter(p => !existingNames.has(p.name));

  if (toInsert.length === 0) {
    console.log('All products already exist in the database. Nothing to seed.');
    process.exit(0);
  }

  console.log(`Inserting ${toInsert.length} new products...`);

  const { data, error } = await supabase
    .from('products')
    .insert(toInsert)
    .select();

  if (error) {
    console.error('Error seeding products:', error.message);
    process.exit(1);
  }

  console.log(`✅ Successfully seeded ${data.length} products:`);
  data.forEach(p => console.log(`   - ${p.name} (${p.price})`));
}

seed();
