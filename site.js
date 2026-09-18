/* Update these values once when conference details are final. */
const conference = { season: 'Spring 2026', date: null, registration: 'Opening soon' };

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-conference-season]').forEach((el) => el.textContent = conference.season);
  document.querySelectorAll('[data-registration-status]').forEach((el) => el.textContent = conference.registration);

  const nav = document.querySelector('.site-nav');
  const navLinks = document.querySelector('.nav-links');
  if (nav && navLinks) {
    const toggle = document.createElement('button');
    toggle.className = 'menu-toggle'; toggle.type = 'button';
    toggle.setAttribute('aria-label', 'Open navigation menu'); toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    nav.append(toggle);
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => nav.classList.remove('nav-open')));
  }

  document.querySelectorAll('.committee a[href="#"]').forEach((link) => link.addEventListener('click', (event) => {
    event.preventDefault();
    const card = link.closest('.committee');
    const title = card.querySelector('h3').textContent;
    const label = card.querySelector('.number').textContent;
    const description = card.querySelector('p').textContent;
    const dialog = document.createElement('dialog');
    dialog.className = 'committee-dialog';
    dialog.innerHTML = `<button class="dialog-close" aria-label="Close">×</button><p class="eyebrow">${label}</p><h2>${title}</h2><p>${description}</p><p class="dialog-note">Full committee materials, topics, and chair introductions will appear here once they are ready.</p>`;
    document.body.append(dialog); dialog.showModal(); dialog.querySelector('.dialog-close').focus();
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => dialog.remove());
  }));
});
