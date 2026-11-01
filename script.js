(function () {
  var root = document.documentElement;
  var kurangiGerak = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Tombol tema terang / gelap ---------- */
  var temaBtn = document.getElementById('temaBtn');

  function perbaruiLabel() {
    temaBtn.textContent = root.getAttribute('data-bs-theme') === 'dark' ? 'Mode terang' : 'Mode gelap';
  }

  if (temaBtn) {
    perbaruiLabel();
    temaBtn.addEventListener('click', function () {
      var berikut = root.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-bs-theme', berikut);
      try { localStorage.setItem('tema', berikut); } catch (e) {}
      perbaruiLabel();
    });
  }

  /* ---------- Tutup menu di ponsel setelah tautan diklik ---------- */
  var menu = document.getElementById('menu');
  if (menu && window.bootstrap) {
    menu.querySelectorAll('a.nav-link').forEach(function (a) {
      a.addEventListener('click', function () {
        if (menu.classList.contains('show')) {
          bootstrap.Collapse.getOrCreateInstance(menu).hide();
        }
      });
    });
  }

  /* ---------- Tombol salin (email) ---------- */
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    var awal = btn.textContent;

    function beriTanda(teks) {
      btn.textContent = teks;
      setTimeout(function () { btn.textContent = awal; }, 1800);
    }

    btn.addEventListener('click', function () {
      var target = document.getElementById(btn.getAttribute('data-copy'));
      if (!target) return;

      function pilihTeks() {
        var range = document.createRange();
        range.selectNodeContents(target);
        var sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        beriTanda('Teks dipilih');
      }

      try {
        navigator.clipboard.writeText(target.textContent.trim()).then(
          function () { beriTanda('Tersalin'); },
          pilihTeks
        );
      } catch (e) {
        pilihTeks();
      }
    });
  });

  /* ---------- Efek mengetik di beranda ---------- */
  var tulis = document.getElementById('tulis');
  if (tulis && !kurangiGerak) {
    var kata = ['Desain Grafis', 'Pemrograman Web'];
    var iKata = 0;
    var iHuruf = 0;
    var menghapus = false;

    var langkah = function () {
      var k = kata[iKata];
      if (!menghapus) {
        iHuruf++;
        tulis.textContent = k.slice(0, iHuruf);
        if (iHuruf === k.length) { menghapus = true; return setTimeout(langkah, 1700); }
        return setTimeout(langkah, 85);
      }
      iHuruf--;
      tulis.textContent = k.slice(0, iHuruf);
      if (iHuruf === 0) {
        menghapus = false;
        iKata = (iKata + 1) % kata.length;
        return setTimeout(langkah, 350);
      }
      return setTimeout(langkah, 45);
    };

    tulis.textContent = '';
    setTimeout(langkah, 900);
  }

  /* ---------- Muncul saat di-scroll + hitung persen keahlian ---------- */
  function hitungPersen(el) {
    var target = parseInt(el.textContent, 10);
    if (isNaN(target) || kurangiGerak) return;
    var mulai = null;
    el.textContent = '0%';
    function frame(t) {
      if (mulai === null) mulai = t;
      var p = Math.min((t - mulai) / 1100, 1);
      var halus = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * halus) + '%';
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  var daftar = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && !kurangiGerak) {
    var pengamat = new IntersectionObserver(function (entri) {
      entri.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        e.target.querySelectorAll('.skill-val').forEach(hitungPersen);
        pengamat.unobserve(e.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

    daftar.forEach(function (el) { pengamat.observe(el); });
  } else {
    daftar.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Bayangan navbar dan garis progres scroll ---------- */
  var kepala = document.querySelector('.site-head');
  var garis = document.querySelector('.scroll-progress');
  var menunggu = false;

  function saatScroll() {
    if (menunggu) return;
    menunggu = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      var maks = document.documentElement.scrollHeight - window.innerHeight;
      if (kepala) kepala.classList.toggle('scrolled', y > 8);
      if (garis) garis.style.transform = 'scaleX(' + (maks > 0 ? Math.min(y / maks, 1) : 0) + ')';
      menunggu = false;
    });
  }

  window.addEventListener('scroll', saatScroll, { passive: true });
  window.addEventListener('resize', saatScroll);
  saatScroll();
})();