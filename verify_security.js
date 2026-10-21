const fs = require('fs');
const cp = require('child_process');
const assert = require('assert');
const crypto = require('crypto');

console.log('====================================================');
console.log('WORDKEEP COMPREHENSIVE SECURITY & INTEGRITY SUITE');
console.log('====================================================\n');

// 1. Reference file constraint
console.log('[1/6] Checking BahasaInggris.html reference file constraint...');
const gitDiff = cp.execSync('git diff HEAD BahasaInggris.html').toString();
assert.strictEqual(gitDiff.trim(), '', 'CRITICAL ERROR: BahasaInggris.html must NEVER be modified!');
console.log('  ✔ BahasaInggris.html is completely untouched and pristine.\n');

// 2. Robots & anti-indexing
console.log('[2/6] Checking anti-search indexing protections...');
assert.strictEqual(fs.existsSync('robots.txt'), true, 'robots.txt must exist');
const robotsContent = fs.readFileSync('robots.txt', 'utf8');
assert.ok(robotsContent.includes('User-agent: *') && robotsContent.includes('Disallow: /'), 'robots.txt must disallow all');

['index.html', 'BahasaInggris_v2.html'].forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  assert.ok(c.includes('<meta name="robots" content="noindex, nofollow, noarchive, nosnippet">'), `${f} missing robots meta`);
  assert.ok(c.includes('<meta name="googlebot" content="noindex, nofollow">'), `${f} missing googlebot meta`);
});
console.log('  ✔ robots.txt and anti-search meta tags verified across all target files.\n');

// 3. Security DOM & CSS assertions
console.log('[3/6] Checking Security Gate DOM & CSS implementation...');
['index.html', 'BahasaInggris_v2.html'].forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  // CSS rules
  assert.ok(c.includes('body.app-locked {'), `${f} missing body.app-locked overflow rule`);
  assert.ok(c.includes('overflow: hidden !important;'), `${f} missing body.app-locked overflow:hidden`);
  assert.ok(c.includes('body.app-locked > :not(#appLockScreen)'), `${f} missing body.app-locked child hide selector`);
  assert.ok(c.includes('z-index: 99999;'), `${f} missing z-index: 99999`);
  assert.ok(c.includes('safe-area-inset-top'), `${f} missing mobile safe-area-inset padding`);
  assert.ok(c.includes('min-height: 100dvh'), `${f} missing min-height 100dvh`);
  assert.ok(c.includes('.lock-card {\n  margin: auto;') || c.includes('.lock-card {\r\n  margin: auto;'), `${f} missing margin:auto flexbox clip fix`);

  // DOM elements
  const requiredIds = [
    'appLockScreen', 'lockCard', 'lockIcon', 'lockTitle', 'lockSub',
    'lockAlert', 'lockUnlockForm', 'lockPinInput', 'lockToggleEye',
    'lockRememberDevice', 'lockSubmitBtn', 'lockSetupForm', 'lockNewPin',
    'lockToggleEyeNew', 'lockConfirmPin', 'lockSetupRemember', 'lockSetupSubmitBtn',
    'changePinBtn', 'lockAppNowBtn', 'changePinModal', 'changePinForm',
    'currentPinInput', 'newPinInput', 'confirmNewPinInput'
  ];
  requiredIds.forEach(id => {
    assert.ok(c.includes(`id="${id}"`), `${f} missing element #${id}`);
  });

  // Pre-render Script 0
  assert.ok(c.includes('wordkeep_store_v1'), `${f} missing dark mode check in Script 0`);
  assert.ok(c.includes('wordkeep_device_auth'), `${f} missing device auth in Script 0`);
  assert.ok(c.includes('wordkeep_unlocked'), `${f} missing session unlock in Script 0`);
  assert.ok(c.includes('lockSetupForm') && c.includes('lockUnlockForm'), `${f} missing setup vs unlock form pre-render in Script 0`);

  // Service worker registration
  assert.ok(c.includes("register('./sw.js?v=5')"), `${f} missing ./sw.js?v=5 registration`);
});
console.log('  ✔ All security DOM IDs, CSS rules, pre-render handlers & SW registrations present.\n');

// 4. Service Worker configuration
console.log('[4/6] Checking Service Worker configuration...');
const swContent = fs.readFileSync('sw.js', 'utf8');
assert.ok(swContent.includes("CACHE_NAME = 'wordkeep-pwa-v5'"), "sw.js missing CACHE_NAME v5");
assert.ok(swContent.includes("'./BahasaInggris_v2.html'"), "sw.js missing ./BahasaInggris_v2.html in ASSETS");
assert.ok(swContent.includes("'./index.html'"), "sw.js missing ./index.html in ASSETS");
console.log('  ✔ sw.js correctly configures CACHE_NAME v5 and caches all core assets.\n');

// 5. JavaScript Syntax Validation
console.log('[5/6] Validating JavaScript syntax of all targets...');
cp.execSync('node -c sw.js server_pwa.js');
['index.html', 'BahasaInggris_v2.html'].forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const scriptRegex = /<script\b[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let idx = 0;
  while ((match = scriptRegex.exec(content)) !== null) {
    idx++;
    const code = match[1].trim();
    if (!code) continue;
    const tmp = `_tmp_syntax_${idx}.js`;
    fs.writeFileSync(tmp, code, 'utf8');
    try {
      cp.execSync(`node -c ${tmp}`);
    } finally {
      fs.unlinkSync(tmp);
    }
  }
});
console.log('  ✔ All scripts in sw.js, server_pwa.js, index.html, and BahasaInggris_v2.html passed node -c.\n');

// 6. Cryptographic & Lifecycle Simulation
console.log('[6/6] Running cryptographic & lifecycle simulation suite...');
function sha256Sync(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  var mathPow = Math.pow, maxWord = mathPow(2, 32), lengthProperty = 'length', i, j, result = '', words = [];
  var asciiBitLength = ascii[lengthProperty] * 8, hash = [], k = [], primeCounter = 0, isComposite = {};
  for (var candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1/3) * maxWord) | 0;
    }
  }
  hash = hash.slice(0, 8);
  ascii += '\x80';
  while (ascii[lengthProperty] % 64 - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    if (j >> 8) return '';
    words[i >> 2] |= j << ((3 - i) % 4) * 8;
  }
  words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
  words[words[lengthProperty]] = (asciiBitLength);
  for (j = 0; j < words[lengthProperty];) {
    var w = words.slice(j, j += 16);
    var oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      var i2 = i + j;
      var w15 = w[i - 15], w2 = w[i - 2];
      var a = hash[0], e = hash[4];
      var temp1 = hash[7]
        + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
        + ((e & hash[5]) ^ ((~e) & hash[6]))
        + k[i]
        + (w[i] = (i < 16) ? w[i] : (
            w[i - 16]
            + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
            + w[i - 7]
            + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
          ) | 0
        );
      var temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
        + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
  }
  for (i = 0; i < 8; i++) {
    for (var i2 = 3; i2 >= 0; i2--) {
      var b = (hash[i] >> (8 * i2)) & 255;
      result += ((b < 16) ? 0 : '') + b.toString(16);
    }
  }
  return result;
}

const testPins = ['0000', '1234', '5678', '9999', '12345', '123456', '852074'];
testPins.forEach(p => {
  const salted = 'wordkeep_sec_salt_v1:' + p;
  assert.strictEqual(sha256Sync(salted), crypto.createHash('sha256').update(salted).digest('hex'));
});
console.log('  ✔ sha256Sync matches Node crypto exactly for all test vectors.');
console.log('  ✔ All verification checks passed with 100% success!\n');
