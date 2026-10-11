import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const { Window } = await import(process.argv[2] || 'happy-dom');
const html = readFileSync('index.html', 'utf8');
const source = readFileSync('app.js', 'utf8');
const THREE = await import(resolve('assets/three.module.js'));
let renders = 0;
const renderers = [];
class RendererStub {
  constructor() { this.size = []; renderers.push(this); }
  setPixelRatio(r) { assert(r <= 1.7); }
  setClearColor() {}
  setSize(w, h) { this.size = [w, h]; }
  render(scene, camera) { renders++; scene.updateMatrixWorld(); camera.updateMatrixWorld(); }
}
const window = new Window({ url: 'https://portfolio.example', settings: { disableCSSFileLoading: true, disableJavaScriptFileLoading: true } });
window.document.write(html);
const document = window.document;
const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
let viewportWidth = 520, viewportHeight = 405;
Object.defineProperties($('#scene-viewport'), { clientWidth: { get: () => viewportWidth }, clientHeight: { get: () => viewportHeight } });
$$('.scene-node').forEach(b => Object.defineProperty(b, 'offsetWidth', { get: () => b.dataset.node === 'experience' ? 130 : 108 }));
window.HTMLCanvasElement.prototype.getContext = function(type) {
  if (type === '2d') return { fillRect() {}, strokeRect() {}, fillText() {} };
  return null;
};
window.__THREE__ = { ...THREE, WebGLRenderer: RendererStub };
let resizeCallback;
window.ResizeObserver = class { constructor(callback) { resizeCallback = callback; } observe() {} };
window.IntersectionObserver = class { constructor(callback) { this.callback = callback; } observe() {} };
window.requestAnimationFrame = () => 1;
window.cancelAnimationFrame = () => {};
window.matchMedia = () => ({ matches: false, addEventListener() {} });
window.navigator.clipboard.writeText = async text => { window.__clipboard = text; };
window.HTMLElement.prototype.focus = window.HTMLElement.prototype.focus;
window.HTMLDialogElement.prototype.showModal = function() { this.setAttribute('open', ''); };
window.HTMLDialogElement.prototype.close = function() { this.removeAttribute('open'); this.dispatchEvent(new window.Event('close')); };
window.eval(source.replace("await import('./assets/three.module.js')", 'globalThis.__THREE__'));
await new Promise(r => setTimeout(r, 20));
assert.equal(document.documentElement.dataset.sceneReady, 'true', 'Three.js scene must initialize');
assert(renders > 0, '3D scene renderer invoked');
const ids = $$('[id]').map(e => e.id);
assert.equal(ids.length, new Set(ids).size, 'No duplicate IDs');
for (const a of $$('a[href^="#"]')) assert(document.getElementById(a.hash.slice(1)), `Anchor ${a.hash} exists`);
for (const e of $$('[src], link[href]')) {
  const path = e.getAttribute('src') || e.getAttribute('href');
  if (path && !path.includes(':')) assert(existsSync(resolve('.', path)), `Asset ${path} exists`);
}
$('.menu-toggle').click(); assert.equal($('.menu-toggle').getAttribute('aria-expanded'), 'true');
$('#navigation a[href="#about"]').click(); assert.equal($('.menu-toggle').getAttribute('aria-expanded'), 'false');
$('[data-filter="ai"]').click(); assert.equal($$('.project-card:not([hidden])').length, 1); assert.equal($('.project-card:not([hidden])').dataset.project, 'flickshub');
$('[data-filter="data"]').click(); assert.equal($('.project-card:not([hidden])').dataset.project, 'powerbi');
$('[data-filter="web"]').click(); assert.equal($$('.project-card:not([hidden])').length, 5);
$('[data-filter="all"]').click(); assert.equal($$('.project-card:not([hidden])').length, 6);
$('[data-skill="analytics"]').click(); assert.equal($('#skill-panel').getAttribute('aria-labelledby'), 'tab-analytics'); assert($('#skill-chips').textContent.includes('Power BI'));
$('[data-skill="analytics"]').focus(); $('.skill-tabs').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Home', bubbles: true })); assert.equal($('#tab-backend').getAttribute('aria-selected'), 'true');
$('[data-node="data"]').click(); assert.equal($('#insight-link').getAttribute('href'), '#skills'); assert.equal($('#tab-database').getAttribute('aria-selected'), 'true');
$('[data-node="experience"]').click(); assert.equal($('#insight-link').getAttribute('href'), '#experience');
for (const button of $$('[data-open]')) {
  button.click(); assert($('#project-dialog').hasAttribute('open')); assert($('#dialog-title').textContent.length > 3); assert($('#dialog-description').textContent.length > 20); assert(existsSync(resolve('.', $('#dialog-image').getAttribute('src'))));
  $('#dialog-close').click(); assert(!$('#project-dialog').hasAttribute('open')); assert(!document.body.classList.contains('dialog-open'));
}
$('#copy-email').click(); await new Promise(r => setTimeout(r, 0)); assert.equal(window.__clipboard, 'dev.fadiii.87@gmail.com');
$('#contact-name').value = 'QA Visitor'; $('#contact-email').value = 'qa@example.com'; $('#contact-message').value = 'A project enquiry & useful details.';
$('#contact-form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
assert(window.location.href.startsWith('mailto:dev.fadiii.87@gmail.com?'));
assert(decodeURIComponent(window.location.href).includes('A project enquiry & useful details.'));
assert($('#form-status').textContent.includes('Review the draft'));
window.location.href = 'https://portfolio.example';
$('#motion-toggle').click(); assert.equal($('#motion-toggle').getAttribute('aria-pressed'), 'true');
$('#motion-toggle').click(); assert.equal($('#motion-toggle').getAttribute('aria-pressed'), 'false');
$('#view-toggle').click(); assert($('#explorer').classList.contains('flat-mode')); assert($('#motion-toggle').disabled);
$('#view-toggle').click(); assert(!$('#explorer').classList.contains('flat-mode')); assert(!$('#motion-toggle').disabled);
for (const [width, height] of [[284,335],[329,370],[344,370],[384,370],[365,380],[472,395],[590,405],[652,435]]) {
  viewportWidth = width; viewportHeight = height; resizeCallback();
  assert.deepEqual(renderers[0].size, [width,height]);
  const labels = $$('.scene-node').map(b => ({ key: b.dataset.node, x: parseFloat(b.style.left), y: parseFloat(b.style.top), w: b.offsetWidth }));
  for (const label of labels) {
    assert(label.x - label.w/2 >= 3, `Node ${label.key} within left edge at ${width}`);
    assert(label.x + label.w/2 <= width - 3, `Node ${label.key} within right edge at ${width}`);
    assert(label.y >= 30 && label.y <= height - 45, `Node ${label.key} within vertical bounds`);
  }
  for (let i=0;i<labels.length;i++) for(let j=i+1;j<labels.length;j++) {
    const a=labels[i], b=labels[j];
    assert(Math.abs(a.x-b.x)>(a.w+b.w)/2 || Math.abs(a.y-b.y)>40, `Nodes ${a.key}/${b.key} overlap at viewport ${width}`);
  }
}
$('#scene-viewport').focus(); $('#scene-viewport').dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
$('#reset-scene').click();
const css = readFileSync('styles.css','utf8');
const stylesheet = new window.CSSStyleSheet(); stylesheet.replaceSync(css);
assert(stylesheet.cssRules.length > 100, 'Stylesheet parses');
assert(css.includes('prefers-reduced-motion:reduce'));
console.log('PASS: content/assets, menu, 4 filters, skill tabs + keyboard, 3D nodes, 6 project dialogs, clipboard, real email draft, motion/flat controls, Three.js geometry and node bounds at 8 responsive scene sizes.');
console.log('LIMIT: DOM and 3D mathematical checks use a renderer stub; GPU rendering and visual desktop/mobile layout remain unverified.');
await window.happyDOM.abort();
const fallbackWindow = new Window({ url: 'https://portfolio.example', settings: { disableCSSFileLoading: true, disableJavaScriptFileLoading: true } });
fallbackWindow.document.write(html);
fallbackWindow.matchMedia = () => ({ matches: true, addEventListener() {} });
fallbackWindow.IntersectionObserver = class { observe() {} };
fallbackWindow.eval(source.replace("await import('./assets/three.module.js')", "(() => { throw new Error('WebGL unavailable'); })()"));
await new Promise(r => setTimeout(r, 20));
assert.equal(fallbackWindow.document.documentElement.dataset.sceneReady, 'fallback');
assert(fallbackWindow.document.querySelector('#explorer').classList.contains('flat-mode'));
assert(fallbackWindow.document.body.classList.contains('motion-paused'));
fallbackWindow.document.querySelector('[data-node="contact"]').click();
assert.equal(fallbackWindow.document.querySelector('#insight-link').getAttribute('href'), '#contact');
console.log('PASS: reduced-motion startup and WebGL-unavailable flat fallback preserve navigation.');
await fallbackWindow.happyDOM.abort();
