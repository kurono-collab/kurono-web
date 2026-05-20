import { initCursor } from './cursor.js';
import { initSwarm }  from './swarm.js';

initCursor();

const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('solid', window.scrollY > 60);
}, { passive: true });

const obs = new IntersectionObserver(
  es => es.forEach(e => { if (e.isIntersecting) e.target.classList.add('show'); }),
  { threshold: .07 }
);
document.querySelectorAll('.about').forEach(el => obs.observe(el));

initSwarm();
