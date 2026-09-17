import { isValidIban, isValidTurkishPhone, PASSWORD_PATTERN, TAX_NO_PATTERN, EMAIL_PATTERN } from '/Users/hakancimen/Desktop/workintech-frontend-final-ecommerce/src/utils/validators.js'
import { slugify, categoryPath, calculateOrderSummary } from '/Users/hakancimen/Desktop/workintech-frontend-final-ecommerce/src/utils/helpers.js'
const cases = [
  ['IBAN valid TR', isValidIban('TR33 0006 1005 1978 6457 8413 26'), true],
  ['IBAN bad checksum', isValidIban('TR330006100519786457841327'), false],
  ['IBAN short TR', isValidIban('TR000000'), false],
  ['IBAN valid DE', isValidIban('DE89370400440532013000'), true],
  ['phone 05XX', isValidTurkishPhone('0555 123 45 67'), true],
  ['phone +90', isValidTurkishPhone('+905551234567'), true],
  ['phone short', isValidTurkishPhone('12345'), false],
  ['tax ok', TAX_NO_PATTERN.test('T1234V123456'), true],
  ['tax bad', TAX_NO_PATTERN.test('T12V3'), false],
  ['pwd ok', PASSWORD_PATTERN.test('QaBuilder!2026'), true],
  ['pwd no special', PASSWORD_PATTERN.test('QaBuilder2026'), false],
  ['pwd short', PASSWORD_PATTERN.test('Qa!1a'), false],
  ['email ok', EMAIL_PATTERN.test('a@b.co'), true],
  ['email bad', EMAIL_PATTERN.test('not-an-email'), false],
  ['slug tr', slugify('Gri Regular Astar Ayakkabı Şık'), 'gri-regular-astar-ayakkabi-sik'],
  ['category path', categoryPath({ id: 9, code: 'e:ayakkabı', title: 'Ayakkabı', gender: 'e' }), '/shop/erkek/ayakkabi/9'],
  ['summary', JSON.stringify(calculateOrderSummary([{ count: 2, checked: true, product: { price: 50 } }, { count: 1, checked: false, product: { price: 999 } }])), JSON.stringify({ productsTotal: 100, shipping: 29.99, discount: 0, grandTotal: 129.99 })],
]
let fail = 0
for (const [name, got, exp] of cases) { const ok = got === exp; if (!ok) fail++; console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${got}`) }
console.log(fail ? `${fail} FAILED` : 'ALL PASS')
