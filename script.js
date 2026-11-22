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

  /* contact: edit this value */
  var EMAIL = 'L252605@lhr.nu.edu.pk';
  d.getElementById('y').textContent = new Date().getFullYear();
  function gmail(sub, body) {
    return 'https://mail.google.com/mail/?view=cm&fs=1&to=' + encodeURIComponent(EMAIL) + '&su=' + encodeURIComponent(sub || '') + '&body=' + encodeURIComponent(body || '');
  }
  var mail = d.getElementById('mail');
  mail.href = gmail('Project enquiry'); mail.target = '_blank'; mail.rel = 'noopener';
  d.getElementById('addr').textContent = EMAIL;
  d.getElementById('mailto').href = 'mailto:' + EMAIL;
  var cp = d.getElementById('copy');
  cp.onclick = function () {
    function ok() { cp.textContent = 'Copied'; setTimeout(function () { cp.textContent = 'Copy'; }, 1800); }
    if (navigator.clipboard) navigator.clipboard.writeText(EMAIL).then(ok, function () { prompt('Copy this email:', EMAIL); });
    else prompt('Copy this email:', EMAIL);
  };
  /* contact form: opens a ready-to-send Gmail draft addressed to EMAIL */
  var note = d.getElementById('note');
  d.getElementById('f').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var f = new FormData(ev.target), n = f.get('n'), e = f.get('e'), m = f.get('m');
    var sub = 'Project enquiry from ' + n, body = 'Name: ' + n + '\nEmail: ' + e + '\n\n' + m;
    window.open(gmail(sub, body), '_blank');
    note.textContent = 'Your Gmail draft opened in a new tab. Press Send there to finish. Nothing opened? ';
    var a = d.createElement('a');
    a.href = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(sub) + '&body=' + encodeURIComponent(body);
    a.textContent = 'Use your mail app instead';
    note.appendChild(a);
  });
})();
