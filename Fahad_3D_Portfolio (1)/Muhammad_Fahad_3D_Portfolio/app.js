const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const motionEnabled = () => !reducedMotion.matches && !document.body.classList.contains('motion-paused');
let toastTimer;
function toast(message) {
  $('#toast').textContent = message;
  $('#toast').classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 3200);
}
function closeMenu() {
  $('#navigation').classList.remove('open');
  $('.menu-toggle').setAttribute('aria-expanded', 'false');
  $('.menu-toggle').setAttribute('aria-label', 'Open navigation');
}
$('.menu-toggle').addEventListener('click', () => {
  const open = $('#navigation').classList.toggle('open');
  $('.menu-toggle').setAttribute('aria-expanded', String(open));
  $('.menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('nav a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.site-header')) closeMenu(); });
matchMedia('(min-width: 961px)').addEventListener('change', closeMenu);
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('nav a').forEach(a => {
        const active = a.hash === `#${entry.target.id}`;
        a.classList.toggle('active', active);
        if (active) a.setAttribute('aria-current', 'location');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
  $$('main section[id]').forEach(section => navObserver.observe(section));
}
$('#year').textContent = String(new Date().getFullYear());

const skillData = {
  backend: { kicker: 'THE ENGINE ROOM', title: 'Backend development', description: 'Secure, scalable applications and connected services.', skills: ['PHP', 'Python', 'Java', 'Flask', 'REST APIs'] },
  frontend: { kicker: 'THE HUMAN INTERFACE', title: 'Frontend development', description: 'Responsive interfaces that make business applications useful.', skills: ['HTML5', 'CSS3', 'Bootstrap', 'JavaScript'] },
  database: { kicker: 'A SOLID FOUNDATION', title: 'Database engineering', description: 'Thoughtful database design and efficient queries for dependable applications.', skills: ['MySQL', 'SQL', 'Database Design', 'Query Optimization'] },
  tools: { kicker: 'BUILD, DEBUG, DELIVER', title: 'Development tools', description: 'A practical workflow for version control and local development.', skills: ['Git', 'GitHub', 'VS Code', 'XAMPP'] },
  analytics: { kicker: 'DATA INTO UNDERSTANDING', title: 'Analytics & reporting', description: 'Useful dashboards and reports, supported by clean, structured data.', skills: ['Power BI', 'Data Cleaning', 'Text Mining', 'Dashboard Development'] }
};
function selectSkill(key, focus = false) {
  const data = skillData[key];
  if (!data) return;
  $$('[data-skill]').forEach(tab => {
    const active = tab.dataset.skill === key;
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focus) tab.focus();
  });
  $('#skill-label').textContent = data.kicker;
  $('#skill-title').textContent = data.title;
  $('#skill-description').textContent = data.description;
  $('#skill-panel').setAttribute('aria-labelledby', `tab-${key}`);
  $('#skill-chips').replaceChildren(...data.skills.map(text => {
    const span = document.createElement('span');
    span.textContent = text;
    return span;
  }));
}
$$('[data-skill]').forEach(tab => tab.addEventListener('click', () => selectSkill(tab.dataset.skill)));
$('.skill-tabs').addEventListener('keydown', e => {
  const tabs = $$('[data-skill]');
  const current = tabs.indexOf(document.activeElement);
  if (current < 0) return;
  let next = current;
  if (['ArrowDown', 'ArrowRight'].includes(e.key)) next = (current + 1) % tabs.length;
  else if (['ArrowUp', 'ArrowLeft'].includes(e.key)) next = (current - 1 + tabs.length) % tabs.length;
  else if (e.key === 'Home') next = 0;
  else if (e.key === 'End') next = tabs.length - 1;
  else return;
  e.preventDefault();
  selectSkill(tabs[next].dataset.skill, true);
});

function filterProjects(filter) {
  let count = 0;
  $$('.project-card').forEach(card => {
    const visible = filter === 'all' || card.dataset.category.split(' ').includes(filter);
    card.hidden = !visible;
    if (visible) count++;
  });
  $$('[data-filter]').forEach(button => {
    const active = button.dataset.filter === filter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#filter-status').textContent = `${count} ${count === 1 ? 'project' : 'projects'} shown.`;
}
$$('[data-filter]').forEach(button => button.addEventListener('click', () => filterProjects(button.dataset.filter)));
const projects = {
  flickshub: { title: 'Flickshub', category: 'AI-Based Multi-Vendor Photography Platform', image: 'flickshub.webp', description: 'A complete multi-vendor photography platform where customers can book photographers, upload images and retrieve matching event photos using a Java-based image matching module. The platform includes Customer, Vendor and Admin portals.', tags: ['PHP', 'Java', 'JavaScript', 'Bootstrap', 'MySQL', 'AI Image Matching'] },
  hospital: { title: 'Hospital Management', category: 'Healthcare / Web Application', image: 'hospital.webp', description: 'A Python Flask based hospital management solution, bringing backend development and database-driven application design to the healthcare domain.', tags: ['Python', 'Flask', 'Healthcare'] },
  event: { title: 'Event Management', category: 'Events / Web Application', image: 'powerbi.webp', description: 'A complete event booking and management system. Event management is also part of my business application development experience at Ovalfox Tech.', tags: ['Event Booking', 'Business Application', 'Event Management'] },
  hotel: { title: 'Hotel Management', category: 'Hospitality / Web Application', image: 'Hotel-Management-System.webp', description: 'A hotel reservation and administration platform. Hotel management is part of the business solutions I built during my work at Ovalfox Tech.', tags: ['Hotel Reservations', 'Administration', 'Business Application'] },
  movers: { title: 'Movers & Packers', category: 'Logistics / Web Application', image: 'movers.webp', description: 'A shipment and logistics management system. Movers & Packers is part of the business application portfolio I developed at Ovalfox Tech.', tags: ['Shipments', 'Logistics', 'Business Application'] },
  powerbi: { title: 'Power BI Dashboards', category: 'Data / Business Intelligence', image: 'power1.webp', description: 'Interactive dashboards, reports and data visualization. My analytics toolkit includes Power BI, data cleaning, text mining and dashboard development.', tags: ['Power BI', 'Data Visualization', 'Reports', 'Dashboards'] }
};
let dialogTrigger;
function openProject(key, trigger) {
  const project = projects[key];
  if (!project) return;
  dialogTrigger = trigger;
  $('#dialog-title').textContent = project.title;
  $('#dialog-category').textContent = project.category;
  $('#dialog-description').textContent = project.description;
  $('#dialog-image').src = `assets/${project.image}`;
  $('#dialog-image').alt = `${project.title} — original portfolio image`;
  $('#dialog-tags').replaceChildren(...project.tags.map(text => {
    const span = document.createElement('span'); span.textContent = text; return span;
  }));
  $('#project-dialog').showModal();
  $('#project-dialog').scrollTop = 0;
  document.body.classList.add('dialog-open');
  $('#dialog-close').focus();
}
$$('[data-open]').forEach(button => button.addEventListener('click', () => openProject(button.dataset.open, button)));
$('#dialog-close').addEventListener('click', () => $('#project-dialog').close());
$('#dialog-contact').addEventListener('click', () => {
  $('#project-dialog').close();
  setTimeout(() => $('#contact-name').focus({ preventScroll: true }), 150);
});
$('#project-dialog').addEventListener('click', e => {
  const rect = $('#project-dialog').getBoundingClientRect();
  if (e.target === $('#project-dialog') && (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom)) $('#project-dialog').close();
});
$('#project-dialog').addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  dialogTrigger?.focus({ preventScroll: true });
});
$$('.project-visual').forEach(visual => {
  visual.addEventListener('pointermove', e => {
    if (!motionEnabled() || e.pointerType === 'touch') return;
    const r = visual.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5;
    const y = (e.clientY - r.top) / r.height - .5;
    $('.tilt', visual).style.transform = `rotateX(${6 - y * 10}deg) rotateY(${-9 + x * 13}deg) rotateZ(-2deg) translateZ(8px)`;
  });
  visual.addEventListener('pointerleave', () => { $('.tilt', visual).style.transform = ''; });
});

$('#copy-email').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText('dev.fadiii.87@gmail.com');
    toast('Email copied to clipboard.');
  } catch {
    toast('Email: dev.fadiii.87@gmail.com');
  }
});
$('#contact-form').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const name = String(data.get('name')).trim();
  const email = String(data.get('email')).trim();
  const message = String(data.get('message')).trim();
  if (!name || !message) {
    $('#form-status').textContent = 'Please add your name and a message.';
    return;
  }
  const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
  const body = encodeURIComponent(`Hello Fahad,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);
  window.location.href = `mailto:dev.fadiii.87@gmail.com?subject=${subject}&body=${body}`;
  $('#form-status').textContent = 'Your email app should open now. Review the draft and send it there. If it does not open, use the email address above.';
});

const nodes = {
  backend: { kicker: '01 / BACKEND DEVELOPMENT', title: 'The engine behind the experience.', text: 'PHP, Python, Java, Flask and REST APIs. Explore the tools behind my applications.', href: '#skills', skill: 'backend' },
  projects: { kicker: '02 / SELECTED PROJECTS', title: 'Ideas, made functional.', text: 'Explore Flickshub, healthcare, events, hospitality, logistics and reporting.', href: '#projects' },
  data: { kicker: '03 / DATABASES & ANALYTICS', title: 'From data to understanding.', text: 'MySQL, SQL, database design and Power BI dashboards. Explore my data toolkit.', href: '#skills', skill: 'database' },
  experience: { kicker: '04 / PROFESSIONAL JOURNEY', title: 'Built through experience.', text: 'Backend development at Ovalfox Tech and CodeDec Technologies.', href: '#experience' },
  contact: { kicker: '05 / LET’S CONNECT', title: 'Let’s build something useful.', text: 'Have a project or an opportunity? Start a conversation with me.', href: '#contact' }
};
let selectedNode = null;
function selectNode(key) {
  const node = nodes[key];
  if (!node) return;
  selectedNode = key;
  $$('.scene-node').forEach(button => {
    const active = button.dataset.node === key;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#insight-kicker').textContent = node.kicker;
  $('#insight-title').textContent = node.title;
  $('#insight-text').textContent = node.text;
  $('#insight-link').href = node.href;
  $('#insight-link').setAttribute('aria-label', `Explore ${key}`);
  $('#scene-hint').textContent = 'Follow the arrow below to explore';
  if (node.skill) selectSkill(node.skill);
  if (key === 'projects') filterProjects('all');
}
$$('.scene-node').forEach(button => {
  button.setAttribute('aria-pressed', 'false');
  button.addEventListener('click', () => selectNode(button.dataset.node));
});
$('#insight-link').addEventListener('click', () => {
  if (selectedNode && nodes[selectedNode].skill) selectSkill(nodes[selectedNode].skill);
});
let sceneControls = null;
let preferredFlat = false;
try { preferredFlat = localStorage.getItem('fahad-flat-view') === 'true'; } catch {}
function setFlat(flat, remember = true) {
  $('#explorer').classList.toggle('flat-mode', flat);
  $('#view-toggle').setAttribute('aria-pressed', String(flat));
  $('#view-toggle').textContent = flat ? '3D view' : 'Flat view';
  $('#rotation-hint').textContent = flat ? 'Choose a node to explore' : 'Drag to rotate · arrow keys work too';
  $('#motion-toggle').disabled = flat;
  $('#reset-scene').disabled = flat;
  sceneControls?.setFlat(flat);
  if (remember) { try { localStorage.setItem('fahad-flat-view', String(flat)); } catch {} }
}
setFlat(preferredFlat, false);
$('#view-toggle').addEventListener('click', () => setFlat(!$('#explorer').classList.contains('flat-mode')));
let paused = reducedMotion.matches;
function applyMotion() {
  document.body.classList.toggle('motion-paused', paused);
  $('#motion-toggle').textContent = paused ? 'Resume motion ▷' : 'Pause motion Ⅱ';
  $('#motion-toggle').setAttribute('aria-pressed', String(paused));
  sceneControls?.setPaused(paused);
  if (paused) $$('.tilt').forEach(frame => frame.style.transform = '');
}
applyMotion();
$('#motion-toggle').addEventListener('click', () => { paused = !paused; applyMotion(); });
reducedMotion.addEventListener('change', e => { paused = e.matches; applyMotion(); });
$('#reset-scene').addEventListener('click', () => sceneControls?.reset());

async function init3D() {
  const THREE = await import('./assets/three.module.js');
  const viewport = $('#scene-viewport');
  const canvas = $('#scene');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
  renderer.setClearColor(0x121515, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
  camera.position.set(0, .5, 9.5);
  camera.lookAt(0, 0, 0);
  scene.add(new THREE.AmbientLight(0xe2ffca, 1.7));
  const light = new THREE.DirectionalLight(0xeaffce, 3.2); light.position.set(3, 5, 4); scene.add(light);
  const rim = new THREE.DirectionalLight(0x8e9dfc, 2.7); rim.position.set(-4, -1, 2); scene.add(rim);
  const green = new THREE.PointLight(0xb9f587, 25, 12); green.position.set(0, 0, 3); scene.add(green);
  const world = new THREE.Group(); scene.add(world);
  const core = new THREE.Group(); world.add(core);
  const dark = new THREE.MeshStandardMaterial({ color: 0x26362a, roughness: .32, metalness: .65 });
  const mint = new THREE.MeshStandardMaterial({ color: 0xb9f587, roughness: .25, metalness: .3, emissive: 0x4b692a, emissiveIntensity: .25 });
  const purple = new THREE.MeshStandardMaterial({ color: 0xb1b5f8, roughness: .25, metalness: .35 });
  const coreGeo = new THREE.IcosahedronGeometry(.94, 0);
  const central = new THREE.Mesh(coreGeo, new THREE.MeshPhysicalMaterial({ color: 0x3e6745, roughness: .2, metalness: .6, clearcoat: 1, clearcoatRoughness: .1 }));
  core.add(central);
  const edges = new THREE.LineSegments(new THREE.EdgesGeometry(coreGeo), new THREE.LineBasicMaterial({ color: 0xb9f587, transparent: true, opacity: .7 })); core.add(edges);
  const inner = new THREE.Mesh(new THREE.OctahedronGeometry(.48, 0), mint); core.add(inner);
  const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0x708658, transparent: true, opacity: .26 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.49, .012, 6, 100), orbitMaterial); ring.rotation.x = .91; ring.rotation.y = -.35; world.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.12, .008, 6, 120), orbitMaterial); ring2.rotation.x = -.55; ring2.rotation.y = .35; world.add(ring2);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(1.12, .025, 8, 100), new THREE.MeshBasicMaterial({ color: 0xb9f587, transparent: true, opacity: .35 })); halo.rotation.x = Math.PI / 2; core.add(halo);
  const positions = {
    backend: new THREE.Vector3(-1.7, 1.18, .3),
    projects: new THREE.Vector3(1.62, 1, -.25),
    data: new THREE.Vector3(1.64, -1.12, .1),
    experience: new THREE.Vector3(-1.48, -1.3, -.15),
    contact: new THREE.Vector3(-2.18, -.02, .4)
  };
  const meshes = [];
  const nodeGroups = {};
  function labelTexture(text) {
    const c = document.createElement('canvas'); c.width = 256; c.height = 256;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#243229'; ctx.fillRect(0, 0, 256, 256);
    ctx.strokeStyle = '#6d8358'; ctx.lineWidth = 3; ctx.strokeRect(12, 12, 232, 232);
    ctx.fillStyle = '#c3f59c'; ctx.font = 'bold 66px monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 128, 135);
    const texture = new THREE.CanvasTexture(c); texture.colorSpace = THREE.SRGBColorSpace; return texture;
  }
  Object.entries(positions).forEach(([key, pos], index) => {
    const group = new THREE.Group(); group.position.copy(pos); world.add(group); nodeGroups[key] = group;
    const text = { backend: '{ }', projects: '</>', data: 'SQL', experience: 'git', contact: '@' }[key];
    const tex = labelTexture(text);
    const front = new THREE.MeshStandardMaterial({ map: tex, roughness: .4, metalness: .15, emissive: 0x405130, emissiveIntensity: .25 });
    let mesh;
    if (key === 'data') {
      mesh = new THREE.Mesh(new THREE.CylinderGeometry(.3, .3, .5, 32), dark);
      for (let i = 0; i < 3; i++) {
        const band = new THREE.Mesh(new THREE.TorusGeometry(.306, .011, 6, 48), mint); band.rotation.x = Math.PI / 2; band.position.y = -.18 + i * .18; group.add(band);
      }
    } else if (key === 'contact') {
      mesh = new THREE.Mesh(new THREE.OctahedronGeometry(.34, 0), purple);
    } else {
      mesh = new THREE.Mesh(new THREE.BoxGeometry(.57, .57, .18), [dark, dark, dark, dark, front, dark]);
    }
    mesh.userData.key = key; mesh.rotation.x = -.12; mesh.rotation.y = -.22; group.add(mesh); meshes.push(mesh);
    const points = [new THREE.Vector3(0, 0, 0), pos.clone()];
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: 0x8bad68, transparent: true, opacity: .2 })); world.add(line);
    const dot = new THREE.Mesh(new THREE.SphereGeometry(.038, 8, 8), mint); dot.position.copy(pos.clone().multiplyScalar(.55)); world.add(dot);
  });
  const seedPoints = [];
  for (let i = 0; i < 42; i++) {
    const a = i * 2.399; const r = 1.4 + (i % 9) * .17;
    seedPoints.push(Math.cos(a) * r, Math.sin(a) * r * .8, Math.sin(i * 3.11) * 1.1 - 1);
  }
  const particleGeo = new THREE.BufferGeometry(); particleGeo.setAttribute('position', new THREE.Float32BufferAttribute(seedPoints, 3));
  world.add(new THREE.Points(particleGeo, new THREE.PointsMaterial({ color: 0xabc98a, size: .026, transparent: true, opacity: .45 })));
  let width = 1, height = 1, visible = true, flat = $('#explorer').classList.contains('flat-mode'), lastTime = 0, activeFrame = 0, animationPaused = paused;
  let rotationX = -.06, rotationY = -.12, dragging = false, startX = 0, startY = 0, startRotationX = 0, startRotationY = 0, moved = false;
  const projected = new THREE.Vector3();
  function resize() {
    width = Math.max(viewport.clientWidth, 1); height = Math.max(viewport.clientHeight, 1);
    renderer.setSize(width, height, false); camera.aspect = width / height;
    camera.position.z = width < 380 ? 11.4 : width < 470 ? 10.6 : 9.5;
    camera.updateProjectionMatrix(); render(lastTime);
  }
  function render(time) {
    world.rotation.set(rotationX, rotationY, 0);
    core.rotation.y = time * .00016;
    core.rotation.z = .15 + Math.sin(time * .0003) * .04;
    inner.rotation.x = time * -.0004;
    nodeGroups.contact.rotation.y = time * .00025;
    renderer.render(scene, camera);
    world.updateMatrixWorld();
    Object.keys(positions).forEach(key => {
      nodeGroups[key].getWorldPosition(projected); projected.project(camera);
      const button = $(`[data-node="${key}"]`);
      const screenX = (projected.x * .5 + .5) * width;
      const screenY = (-projected.y * .5 + .5) * height;
      const x = Math.max(button.offsetWidth / 2 + 4, Math.min(width - button.offsetWidth / 2 - 4, screenX));
      const y = Math.max(30, Math.min(height - 45, screenY + (key === 'backend' || key === 'projects' ? -37 : 36)));
      if (!flat) { button.style.left = `${x}px`; button.style.top = `${y}px`; }
    });
  }
  function tick(time) {
    activeFrame = 0;
    if (!visible || flat || document.hidden || animationPaused) return;
    if (time - lastTime > (width < 700 ? 40 : 28)) {
      lastTime = time; render(time);
    }
    activeFrame = requestAnimationFrame(tick);
  }
  function start() {
    if (!activeFrame && visible && !flat && !document.hidden && !animationPaused) activeFrame = requestAnimationFrame(tick);
  }
  function stop() { cancelAnimationFrame(activeFrame); activeFrame = 0; }
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  canvas.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    dragging = true; moved = false; startX = e.clientX; startY = e.clientY; startRotationX = rotationX; startRotationY = rotationY;
    canvas.setPointerCapture(e.pointerId); canvas.classList.add('dragging');
  });
  canvas.addEventListener('pointermove', e => {
    if (!dragging) return;
    const dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) + Math.abs(dy) > 5) moved = true;
    rotationY = Math.max(-.65, Math.min(.65, startRotationY + dx * .003));
    rotationX = Math.max(-.35, Math.min(.35, startRotationX + dy * .002));
    render(lastTime);
  });
  function release(e) {
    if (!dragging) return;
    dragging = false; canvas.classList.remove('dragging');
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId);
    if (!moved && e.type !== 'pointercancel') {
      const rect = canvas.getBoundingClientRect();
      mouse.set(((e.clientX - rect.left) / rect.width) * 2 - 1, -((e.clientY - rect.top) / rect.height) * 2 + 1);
      raycaster.setFromCamera(mouse, camera);
      const hit = raycaster.intersectObjects(meshes, false)[0];
      if (hit) selectNode(hit.object.userData.key);
    }
  }
  canvas.addEventListener('pointerup', release); canvas.addEventListener('pointercancel', release);
  viewport.addEventListener('keydown', e => {
    if (e.target !== viewport || flat) return;
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)) return;
    e.preventDefault();
    if (e.key === 'Home') { rotationX = -.06; rotationY = -.12; }
    else if (e.key === 'ArrowLeft') rotationY -= .1;
    else if (e.key === 'ArrowRight') rotationY += .1;
    else if (e.key === 'ArrowUp') rotationX -= .08;
    else rotationX += .08;
    rotationX = Math.max(-.35, Math.min(.35, rotationX)); rotationY = Math.max(-.65, Math.min(.65, rotationY));
    render(lastTime);
  });
  new ResizeObserver(resize).observe(viewport);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible) start(); else stop();
  }, { threshold: .05 }).observe(viewport);
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else start(); });
  canvas.addEventListener('webglcontextlost', e => {
    e.preventDefault(); stop(); setFlat(true, false); $('#scene-hint').textContent = 'Flat view is available on this device';
  });
  sceneControls = {
    setFlat(value) {
      flat = value;
      if (flat) {
        stop(); $$('.scene-node').forEach(button => { button.style.left = ''; button.style.top = ''; });
      } else { resize(); render(lastTime); start(); }
    },
    setPaused(value) { animationPaused = value; if (value) stop(); else start(); },
    reset() { rotationX = -.06; rotationY = -.12; render(lastTime); }
  };
  resize(); sceneControls.setFlat(flat); sceneControls.setPaused(paused);
  document.documentElement.dataset.sceneReady = 'true';
}
init3D().catch(() => {
  setFlat(true, false);
  $('#scene-hint').textContent = 'Choose a node to explore';
  $('#view-toggle').hidden = true;
  $('#motion-toggle').hidden = true;
  $('#reset-scene').hidden = true;
  document.documentElement.dataset.sceneReady = 'fallback';
});
