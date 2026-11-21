(function () {
  var d = document, root = d.documentElement;
  root.classList.add('js');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* theme (kept in memory only, never stored) */
  if (matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light';
  d.getElementById('theme').onclick = function () {
    root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
  };

  /* mobile menu */
  var nav = d.getElementById('nav'), burger = d.getElementById('burger');
  burger.onclick = function () {
    var o = nav.classList.toggle('open');
    burger.setAttribute('aria-expanded', o);
  };
  nav.addEventListener('click', function () { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); });

  /* scroll progress */
  var bar = d.querySelector('.progress');
  function prog() {
    var h = root.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  }
  addEventListener('scroll', prog, { passive: true }); prog();

  /* reveal on scroll */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      el.classList.add('in'); io.unobserve(el);
      setTimeout(function () { el.classList.remove('r', 'in'); }, 800);
    });
  }, { threshold: 0.12 });
  d.querySelectorAll('.r').forEach(function (el) { io.observe(el); });

  /* card spotlight */
  d.querySelectorAll('.card').forEach(function (c) {
    c.addEventListener('pointermove', function (e) {
      var r = c.getBoundingClientRect();
      c.style.setProperty('--mx', e.clientX - r.left + 'px');
      c.style.setProperty('--my', e.clientY - r.top + 'px');
    });
  });

  /* project filters */
  var fb = d.querySelectorAll('.filters button'), cards = d.querySelectorAll('.proj');
  fb.forEach(function (b) {
    b.onclick = function () {
      fb.forEach(function (x) { x.classList.remove('on'); });
      b.classList.add('on');
      var f = b.dataset.f;
      cards.forEach(function (c) {
        c.classList.toggle('hide', f !== 'all' && c.dataset.c.split(' ').indexOf(f) < 0);
      });
    };
  });

  /* highlight the current section in the menu */
  var links = {};
  nav.querySelectorAll('a').forEach(function (a) { links[a.getAttribute('href').slice(1)] = a; });
  var so = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      Object.keys(links).forEach(function (k) { links[k].classList.toggle('active', k === e.target.id); });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  Object.keys(links).forEach(function (k) { var el = d.getElementById(k); if (el) so.observe(el); });

  /* contact form opens the visitor's email app */
  d.getElementById('y').textContent = new Date().getFullYear();
  d.getElementById('f').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = new FormData(ev.target);
    var body = 'Name: ' + f.get('n') + '\nEmail: ' + f.get('e') + '\n\n' + f.get('m');
    /* EDIT: keep this address the same as the Email me button */
    location.href = 'mailto:L252605@lhr.nu.edu.pk?subject=' + encodeURIComponent('Project enquiry from ' + f.get('n')) + '&body=' + encodeURIComponent(body);
  });
})();
