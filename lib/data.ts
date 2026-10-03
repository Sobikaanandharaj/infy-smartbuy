export type Category = 'laptops' | 'smartphones' | 'headphones' | 'accessories'

export const CATEGORIES: { id: Category; label: string; blurb: string; image: string }[] = [
  { id: 'laptops', label: 'Laptops', blurb: 'Ultrabooks, workstations & gaming rigs', image: '/products/macbook-air.png' },
  { id: 'smartphones', label: 'Smartphones', blurb: 'Flagship cameras & all-day batteries', image: '/products/iphone-pro.png' },
  { id: 'headphones', label: 'Headphones', blurb: 'Noise cancelling & true wireless audio', image: '/products/sony-xm5.png' },
  { id: 'accessories', label: 'Accessories', blurb: 'Keyboards, mice, storage & power', image: '/products/mx-master.png' },
]

export type Review = { id: string; author: string; rating: number; date: string; title: string; body: string }

export type Product = {
  id: string
  name: string
  brand: string
  category: Category
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  stock: number
  image: string
  tagline: string
  description: string
  specs: Record<string, string>
  featured?: boolean
  reviews: Review[]
}

export const ORDER_STATUSES = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'] as const
export type OrderStatus = (typeof ORDER_STATUSES)[number]

export type Address = {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export type OrderItem = { productId: string; name: string; image: string; price: number; quantity: number }

export type Order = {
  id: string
  userEmail: string
  customerName: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  status: OrderStatus
  paymentMethod: string
  address: Address
  createdAt: string
}

export type User = {
  id: string
  name: string
  email: string
  password: string
  role: 'customer' | 'admin'
  joinedAt: string
  active: boolean
}

const sharedReviews = (seed: string): Review[] => [
  {
    id: `${seed}-r1`,
    author: 'Aarav S.',
    rating: 5,
    date: '2026-02-14',
    title: 'Worth every rupee',
    body: 'Build quality is outstanding and performance has been flawless for daily work. Delivery was quick and well packed.',
  },
  {
    id: `${seed}-r2`,
    author: 'Priya M.',
    rating: 4,
    date: '2026-01-29',
    title: 'Great, with minor nitpicks',
    body: 'Excellent overall experience. Battery life is solid, though I wish the charger was included in the box.',
  },
  {
    id: `${seed}-r3`,
    author: 'Rohan K.',
    rating: 5,
    date: '2026-01-08',
    title: 'Premium feel',
    body: 'Looks and feels premium. SmartBuy support helped me pick the right configuration via the AI assistant.',
  },
]

export const PRODUCTS: Product[] = [
  {
    id: 'macbook-air-m3',
    name: 'MacBook Air 13" M3',
    brand: 'Apple',
    category: 'laptops',
    price: 104900,
    originalPrice: 114900,
    rating: 4.8,
    reviewCount: 1284,
    stock: 18,
    image: '/products/macbook-air.png',
    tagline: 'Strikingly thin. Remarkably fast.',
    description:
      'The M3-powered MacBook Air delivers blazing performance in a fanless, featherweight design with up to 18 hours of battery life and a brilliant Liquid Retina display.',
    specs: { Processor: 'Apple M3 8-core CPU', Memory: '16GB unified', Storage: '512GB SSD', Display: '13.6" Liquid Retina', Battery: 'Up to 18 hours', Weight: '1.24 kg' },
    featured: true,
    reviews: sharedReviews('mba'),
  },
  {
    id: 'dell-xps-15',
    name: 'XPS 15 OLED',
    brand: 'Dell',
    category: 'laptops',
    price: 189990,
    originalPrice: 219990,
    rating: 4.6,
    reviewCount: 642,
    stock: 7,
    image: '/products/dell-xps.png',
    tagline: 'Creator-grade power with a 3.5K OLED canvas.',
    description:
      'A powerhouse for creators featuring Intel Core Ultra 9, RTX 4070 graphics and a stunning 3.5K OLED touch display in a CNC-machined aluminum chassis.',
    specs: { Processor: 'Intel Core Ultra 9 185H', Graphics: 'NVIDIA RTX 4070 8GB', Memory: '32GB LPDDR5x', Storage: '1TB NVMe SSD', Display: '15.6" 3.5K OLED Touch', Weight: '1.86 kg' },
    featured: true,
    reviews: sharedReviews('xps'),
  },
  {
    id: 'thinkpad-x1-carbon',
    name: 'ThinkPad X1 Carbon Gen 12',
    brand: 'Lenovo',
    category: 'laptops',
    price: 158990,
    originalPrice: 172990,
    rating: 4.5,
    reviewCount: 418,
    stock: 3,
    image: '/products/thinkpad.png',
    tagline: 'The legendary business ultrabook.',
    description:
      'Military-grade durability meets ultralight portability. Best-in-class keyboard, AI-enhanced Intel Core Ultra and enterprise security baked in.',
    specs: { Processor: 'Intel Core Ultra 7 155U', Memory: '32GB LPDDR5x', Storage: '1TB SSD', Display: '14" 2.8K OLED', Security: 'IR camera + fingerprint', Weight: '1.09 kg' },
    reviews: sharedReviews('x1'),
  },
  {
    id: 'rog-zephyrus-g14',
    name: 'ROG Zephyrus G14',
    brand: 'ASUS',
    category: 'laptops',
    price: 164990,
    originalPrice: 199990,
    rating: 4.7,
    reviewCount: 903,
    stock: 11,
    image: '/products/rog-zephyrus.png',
    tagline: 'Compact gaming. Uncompromised.',
    description:
      'A 14-inch gaming beast with Ryzen 9, RTX 4060 and a 120Hz 3K OLED Nebula display, all wrapped in a sleek aluminum shell.',
    specs: { Processor: 'AMD Ryzen 9 8945HS', Graphics: 'NVIDIA RTX 4060 8GB', Memory: '16GB LPDDR5x', Storage: '1TB SSD', Display: '14" 3K OLED 120Hz', Weight: '1.5 kg' },
    featured: true,
    reviews: sharedReviews('rog'),
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro',
    brand: 'Apple',
    category: 'smartphones',
    price: 119900,
    originalPrice: 134900,
    rating: 4.8,
    reviewCount: 3421,
    stock: 24,
    image: '/products/iphone-pro.png',
    tagline: 'Titanium. So strong. So light. So Pro.',
    description:
      'Forged in aerospace-grade titanium with the A17 Pro chip, a customizable Action button and a pro camera system with 5x telephoto.',
    specs: { Chip: 'A17 Pro', Display: '6.1" Super Retina XDR 120Hz', Storage: '256GB', Camera: '48MP Main + 12MP UW + 12MP 3x', Battery: 'Up to 23h video', Port: 'USB-C (USB 3)' },
    featured: true,
    reviews: sharedReviews('ip15'),
  },
  {
    id: 'galaxy-s24-ultra',
    name: 'Galaxy S24 Ultra',
    brand: 'Samsung',
    category: 'smartphones',
    price: 121999,
    originalPrice: 139999,
    rating: 4.7,
    reviewCount: 2210,
    stock: 15,
    image: '/products/galaxy-ultra.png',
    tagline: 'Galaxy AI is here.',
    description:
      'Titanium frame, built-in S Pen, a 200MP camera with 100x Space Zoom and Galaxy AI features for translation, editing and search.',
    specs: { Chip: 'Snapdragon 8 Gen 3 for Galaxy', Display: '6.8" QHD+ Dynamic AMOLED 2X', Storage: '256GB', Camera: '200MP + 50MP 5x + 10MP 3x + 12MP UW', Battery: '5000 mAh', Extras: 'Built-in S Pen' },
    reviews: sharedReviews('s24'),
  },
  {
    id: 'pixel-8-pro',
    name: 'Pixel 8 Pro',
    brand: 'Google',
    category: 'smartphones',
    price: 89999,
    originalPrice: 106999,
    rating: 4.5,
    reviewCount: 987,
    stock: 0,
    image: '/products/pixel-pro.png',
    tagline: 'The all-pro phone engineered by Google.',
    description:
      'Google Tensor G3 brings Magic Editor, Best Take and 7 years of OS updates, paired with a pro-level triple camera and Super Actua display.',
    specs: { Chip: 'Google Tensor G3', Display: '6.7" Super Actua LTPO', Storage: '128GB', Camera: '50MP + 48MP UW + 48MP 5x', Battery: '5050 mAh', Updates: '7 years OS' },
    reviews: sharedReviews('px8'),
  },
  {
    id: 'oneplus-12',
    name: 'OnePlus 12',
    brand: 'OnePlus',
    category: 'smartphones',
    price: 64999,
    originalPrice: 69999,
    rating: 4.6,
    reviewCount: 1530,
    stock: 32,
    image: '/products/oneplus.png',
    tagline: 'Smooth beyond belief.',
    description:
      'Hasselblad-tuned cameras, Snapdragon 8 Gen 3, 80W SUPERVOOC charging and a 2K 120Hz ProXDR display at a flagship-killer price.',
    specs: { Chip: 'Snapdragon 8 Gen 3', Display: '6.82" 2K ProXDR 120Hz', Storage: '256GB / 12GB RAM', Camera: '50MP Hasselblad triple', Battery: '5400 mAh, 80W', Weight: '220 g' },
    reviews: sharedReviews('op12'),
  },
  {
    id: 'sony-wh-1000xm5',
    name: 'WH-1000XM5',
    brand: 'Sony',
    category: 'headphones',
    price: 26990,
    originalPrice: 34990,
    rating: 4.7,
    reviewCount: 4102,
    stock: 40,
    image: '/products/sony-xm5.png',
    tagline: 'Industry-leading noise cancellation.',
    description:
      'Eight microphones and two processors deliver unmatched noise cancellation, crystal clear calls and 30 hours of battery in an ultra-comfortable design.',
    specs: { Type: 'Over-ear, wireless', ANC: 'Dual processor, 8 mics', Battery: '30 hours', Charging: '3 min = 3 hours', Codecs: 'LDAC, AAC, SBC', Weight: '250 g' },
    featured: true,
    reviews: sharedReviews('xm5'),
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro (2nd gen)',
    brand: 'Apple',
    category: 'headphones',
    price: 20900,
    originalPrice: 24900,
    rating: 4.8,
    reviewCount: 5230,
    stock: 4,
    image: '/products/airpods-pro.png',
    tagline: 'Adaptive Audio. Now playing.',
    description:
      'Up to 2x more Active Noise Cancellation, Adaptive Audio, Personalized Spatial Audio and a USB-C MagSafe case with speaker and lanyard loop.',
    specs: { Type: 'In-ear, true wireless', Chip: 'Apple H2', ANC: 'Adaptive', Battery: '6h (30h with case)', Case: 'USB-C MagSafe', Resistance: 'IP54' },
    reviews: sharedReviews('app2'),
  },
  {
    id: 'bose-qc-ultra',
    name: 'QuietComfort Ultra',
    brand: 'Bose',
    category: 'headphones',
    price: 35900,
    originalPrice: 39900,
    rating: 4.6,
    reviewCount: 812,
    stock: 9,
    image: '/products/bose-qc.png',
    tagline: 'Immersive audio. World-class quiet.',
    description:
      'Bose Immersive Audio brings spatialized sound to any content, combined with world-class noise cancellation and luxurious comfort.',
    specs: { Type: 'Over-ear, wireless', ANC: 'CustomTune', Battery: '24 hours', Audio: 'Bose Immersive Audio', Codecs: 'aptX Adaptive, AAC', Weight: '254 g' },
    reviews: sharedReviews('bqc'),
  },
  {
    id: 'jbl-tour-pro',
    name: 'Tour Pro 2',
    brand: 'JBL',
    category: 'headphones',
    price: 14999,
    originalPrice: 24999,
    rating: 4.3,
    reviewCount: 640,
    stock: 22,
    image: '/products/jbl-buds.png',
    tagline: 'True adaptive noise cancelling earbuds.',
    description:
      'Featuring JBL Pro Sound, true adaptive ANC and a smart charging case with a built-in touchscreen for controls on the go.',
    specs: { Type: 'In-ear, true wireless', ANC: 'True Adaptive', Battery: '10h (40h with case)', Case: '1.45" smart touch display', Resistance: 'IP54', Mics: '6 mics' },
    reviews: sharedReviews('jbl'),
  },
  {
    id: 'mx-master-3s',
    name: 'MX Master 3S',
    brand: 'Logitech',
    category: 'accessories',
    price: 9495,
    originalPrice: 10995,
    rating: 4.8,
    reviewCount: 2870,
    stock: 56,
    image: '/products/mx-master.png',
    tagline: 'Precision you can feel.',
    description:
      'An iconic performance mouse with 8K DPI tracking on any surface, quiet clicks and MagSpeed electromagnetic scrolling.',
    specs: { Sensor: '8000 DPI Darkfield', Buttons: '7 programmable', Battery: '70 days on full charge', Connectivity: 'Bluetooth + Logi Bolt', 'Multi-device': 'Up to 3', Weight: '141 g' },
    reviews: sharedReviews('mx'),
  },
  {
    id: 'keychron-k2',
    name: 'K2 Pro Mechanical Keyboard',
    brand: 'Keychron',
    category: 'accessories',
    price: 8999,
    originalPrice: 11499,
    rating: 4.6,
    reviewCount: 1104,
    stock: 2,
    image: '/products/keyboard.png',
    tagline: 'Wireless 75% mechanical with hot-swap.',
    description:
      'A compact 75% layout with hot-swappable switches, QMK/VIA support, Mac and Windows compatibility and a premium aluminum frame.',
    specs: { Layout: '75% (84 keys)', Switches: 'Gateron Brown, hot-swap', Connectivity: 'Bluetooth 5.1 / USB-C', Backlight: 'RGB', Battery: '4000 mAh', Firmware: 'QMK / VIA' },
    reviews: sharedReviews('k2'),
  },
  {
    id: 'samsung-t7-ssd',
    name: 'T7 Shield Portable SSD 2TB',
    brand: 'Samsung',
    category: 'accessories',
    price: 13499,
    originalPrice: 19999,
    rating: 4.7,
    reviewCount: 3311,
    stock: 28,
    image: '/products/ssd.png',
    tagline: 'Rugged speed that fits your pocket.',
    description:
      'Transfer speeds up to 1,050 MB/s with IP65 dust and water resistance and drop protection up to 3 meters.',
    specs: { Capacity: '2TB', Speed: 'Up to 1,050 MB/s', Interface: 'USB 3.2 Gen 2 (USB-C)', Durability: 'IP65, 3m drop', Encryption: 'AES 256-bit', Weight: '98 g' },
    featured: true,
    reviews: sharedReviews('t7'),
  },
  {
    id: 'anker-65w-gan',
    name: 'Prime 65W GaN Charger',
    brand: 'Anker',
    category: 'accessories',
    price: 3999,
    originalPrice: 5999,
    rating: 4.5,
    reviewCount: 1789,
    stock: 64,
    image: '/products/charger.png',
    tagline: 'One charger for laptop, phone and more.',
    description:
      'A compact GaN charger that powers a laptop and phone simultaneously with intelligent power distribution and a braided USB-C cable.',
    specs: { Output: '65W max', Ports: '2x USB-C', Technology: 'GaN II', Cable: '1.5m braided USB-C', Safety: 'ActiveShield 2.0', Weight: '112 g' },
    reviews: sharedReviews('anker'),
  },
]

export const SEED_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@infy.com', password: 'admin123', role: 'admin', joinedAt: '2025-06-01', active: true },
  { id: 'u2', name: 'Ananya Rao', email: 'user@infy.com', password: 'user123', role: 'customer', joinedAt: '2025-09-12', active: true },
  { id: 'u3', name: 'Vikram Mehta', email: 'vikram@example.com', password: 'pass123', role: 'customer', joinedAt: '2025-11-03', active: true },
  { id: 'u4', name: 'Sneha Iyer', email: 'sneha@example.com', password: 'pass123', role: 'customer', joinedAt: '2026-01-20', active: true },
  { id: 'u5', name: 'Karan Patel', email: 'karan@example.com', password: 'pass123', role: 'customer', joinedAt: '2026-02-08', active: false },
]

const demoAddress: Address = {
  fullName: 'Ananya Rao',
  phone: '9876543210',
  line1: '42, Electronic City Phase 1',
  city: 'Bengaluru',
  state: 'Karnataka',
  pincode: '560100',
}

function seedOrder(
  id: string,
  user: User,
  items: [string, number][],
  status: OrderStatus,
  createdAt: string,
  paymentMethod = 'UPI',
): Order {
  const orderItems = items.map(([pid, quantity]) => {
    const p = PRODUCTS.find((x) => x.id === pid)!
    return { productId: p.id, name: `${p.brand} ${p.name}`, image: p.image, price: p.price, quantity }
  })
  const subtotal = orderItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= 999 ? 0 : 99
  const tax = Math.round(subtotal * 0.18)
  return {
    id,
    userEmail: user.email,
    customerName: user.name,
    items: orderItems,
    subtotal,
    shipping,
    tax,
    total: subtotal + shipping + tax,
    status,
    paymentMethod,
    address: { ...demoAddress, fullName: user.name },
    createdAt,
  }
}

export const SEED_ORDERS: Order[] = [
  seedOrder('SB-10428', SEED_USERS[1], [['sony-wh-1000xm5', 1], ['anker-65w-gan', 1]], 'Delivered', '2026-02-18T10:24:00Z'),
  seedOrder('SB-10433', SEED_USERS[2], [['rog-zephyrus-g14', 1]], 'Shipped', '2026-03-02T14:05:00Z', 'Credit Card'),
  seedOrder('SB-10437', SEED_USERS[3], [['iphone-15-pro', 1], ['airpods-pro-2', 1]], 'Processing', '2026-03-06T09:41:00Z'),
  seedOrder('SB-10440', SEED_USERS[1], [['mx-master-3s', 1], ['keychron-k2', 1]], 'Confirmed', '2026-03-08T18:12:00Z', 'Net Banking'),
  seedOrder('SB-10442', SEED_USERS[4], [['samsung-t7-ssd', 2]], 'Pending', '2026-03-09T21:30:00Z', 'Cash on Delivery'),
]

export const LOW_STOCK_THRESHOLD = 5
