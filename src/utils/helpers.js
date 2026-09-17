const TR_MAP = { ç: 'c', ğ: 'g', ı: 'i', ö: 'o', ş: 's', ü: 'u', İ: 'i' }

export const slugify = (text = '') =>
  String(text)
    .replace(/[çğıöşüİ]/gi, (ch) => TR_MAP[ch.toLowerCase()] || TR_MAP[ch] || ch)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

export const genderSlug = (gender) => (gender === 'e' ? 'erkek' : 'kadin')

export const genderLabel = (gender) => (gender === 'e' ? 'Erkek' : 'Kadın')

// shop/:gender/:categoryName/:categoryId
export const categoryPath = (category) =>
  `/shop/${genderSlug(category.gender)}/${slugify(category.code.split(':')[1] || category.title)}/${category.id}`

// shop/:gender/:categoryName/:categoryId/:productNameSlug/:productId
export const productPath = (product, categories = []) => {
  const category = categories.find((item) => item.id === product.category_id)
  const base = category ? categoryPath(category) : `/shop/urun/kategori/${product.category_id}`
  return `${base}/${slugify(product.name)}/${product.id}`
}

export const formatPrice = (value) => `$${Number(value || 0).toFixed(2)}`

export const productImage = (product) =>
  product?.images?.length ? product.images[0].url : '/images/home/product-1.jpg'

// Gravatar accepts SHA-256 hashes of the trimmed, lower-cased email
export const gravatarUrl = async (email = '', size = 64) => {
  const data = new TextEncoder().encode(email.trim().toLowerCase())
  const digest = await crypto.subtle.digest('SHA-256', data)
  const hash = Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=identicon`
}

// Values from the canonical T19 sample image ("Sipariş Özeti"): "Kargo Toplam 29,99" and
// "150 TL ve Üzeri Kargo Bedava (Satıcı Karşılar) -29,99" (repeated in the T20/T21 samples)
export const SHIPPING_PRICE = 29.99
export const FREE_SHIPPING_LIMIT = 150

// T19: products total + shipping - discount = grand total (checked items only)
export const calculateOrderSummary = (cart) => {
  const productsTotal = cart
    .filter((item) => item.checked)
    .reduce((sum, item) => sum + item.product.price * item.count, 0)
  const hasItems = productsTotal > 0
  const shipping = hasItems ? SHIPPING_PRICE : 0
  const discount = hasItems && productsTotal >= FREE_SHIPPING_LIMIT ? SHIPPING_PRICE : 0
  return {
    productsTotal,
    shipping,
    discount,
    grandTotal: productsTotal + shipping - discount,
  }
}

export const maskCardNumber = (cardNo = '') => {
  const digits = String(cardNo)
  return `${digits.slice(0, 4)} **** **** ${digits.slice(-4)}`
}
