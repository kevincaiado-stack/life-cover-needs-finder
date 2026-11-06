const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const html = fs.readFileSync(require('node:path').join(__dirname, '..', 'needs-finder.html'), 'utf8');
const start = html.indexOf('function rwY(');
const end = html.indexOf('function renderMeter(', start);
assert.ok(start >= 0 && end > start, 'Milestone 38 functions exist');
const source = html.slice(start, end);
const elements = { rwBox: { hidden: false, innerHTML: '' } };
const context = { Math, $: id => elements[id], tx: x => x, fmt: (s, ...args) => s.replace(/\{(\d+)\}/g, (_, i) => String(args[Number(i)])), rs: n => String(n) };
vm.createContext(context);
vm.runInContext(source, context);
const { rwY, renderRw } = context;

test('M38 formula: savings + cover - loans divided by monthly expenses', () => {
  const r = rwY(40, 60, 0, 200000, 300000, 500000, 120000);
  assert.equal(r.net, 600000);
  assert.equal(r.mon, 10000);
  assert.equal(r.mo, 60);
  assert.equal(r.y, 5);
});
test('M38 uses annual expenses converted to monthly and never counts income value A', () => {
  assert.equal(rwY(40, 60, 99999999, 0, 120000, 0, 120000).mo, 12);
});
test('M38 rejects missing age or zero annual expenses', () => {
  assert.equal(rwY(0, 60, 0, 0, 100, 0, 12000), null);
  assert.equal(rwY(40, 60, 0, 0, 100, 0, 0), null);
});
test('M38 negative resources are capped at zero months', () => {
  const r = rwY(40, 60, 0, 300000, 100000, 0, 120000);
  assert.equal(r.net, -200000);
  assert.equal(r.mo, 0);
  assert.equal(r.y, 0);
});
test('M38 exact zero resources are described without saying loans exceed resources', () => {
  renderRw(40, 60, 0, 100000, 100000, 0, 120000);
  assert.doesNotMatch(elements.rwBox.innerHTML, /loans are more than/i);
});
test('M38 short positive runway is displayed in months, not 0.0 years', () => {
  renderRw(40, 60, 0, 0, 5000, 0, 120000);
  assert.match(elements.rwBox.innerHTML, /month/i);
  assert.doesNotMatch(elements.rwBox.innerHTML, /about 0 years/i);
});
test('M38 under one month displays a meaningful positive duration', () => {
  renderRw(40, 60, 0, 0, 1000, 0, 120000);
  assert.match(elements.rwBox.innerHTML, /less than one month/i);
});
test('M38 standard multi-year runway preserves years display', () => {
  renderRw(40, 60, 0, 0, 600000, 0, 120000);
  assert.match(elements.rwBox.innerHTML, /about 5 years/i);
});
