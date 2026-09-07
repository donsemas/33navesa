// Калькулятор /cena/: вилка цены по тарифной сетке из брифа (09.2026).
// ставка/м² = база_типа + Σ(ставка_опции − база_типа) + кровля + покраска,
// далее × площадь, ×0.8 без опор, ×0.9 самовывоз; вилка [низ, низ+10%], округление до 500 ₽.
(function () {
  var T = {
    base: { odno: 6800, dvuh: 6900, aroch: 6900, pristen: 6700 },
    abs: { pk8: 7000, pk10: 7200, op80: 7100, fermy: 7500 },
    krov: { sota: 0, mono: 1000, prof: 100, metch: 150, myag: 200 },
    paint: 50,
    noPil: 0.8,
    noMon: 0.9,
    fork: 0.1
  };

  function fmt(n) {
    return n.toLocaleString('ru-RU') + ' ₽';
  }
  function round500(n) {
    return Math.round(n / 500) * 500;
  }

  function init() {
    var root = document.querySelector('[data-pcalc]');
    if (!root || root.dataset.done) return;
    root.dataset.done = '1';

    var state = { type: 'odno', pk: 'pk6', op: 'op60', ferm: 'std', krov: 'sota' };
    var out = root.querySelector('[data-out]');
    var detail = root.querySelector('[data-detail]');

    function sel(group) {
      return state[group];
    }

    function calc() {
      var base = T.base[state.type] || 6800;
      var rate = base;
      if (state.pk === 'pk8') rate += T.abs.pk8 - base;
      if (state.pk === 'pk10') rate += T.abs.pk10 - base;
      if (state.op === 'op80') rate += T.abs.op80 - base;
      if (state.op === 'op100') rate += 100;
      if (state.ferm === 'strong') rate += T.abs.fermy - base;
      rate += T.krov[state.krov] || 0;
      if (root.querySelector('[data-paint]').checked) rate += T.paint;

      var len = parseFloat(root.querySelector('[data-len]').value) || 0;
      var wid = parseFloat(root.querySelector('[data-wid]').value) || 0;
      var area = len * wid;
      if (area <= 0) {
        out.textContent = 'Укажите размеры';
        detail.textContent = '';
        return;
      }
      var total = rate * area;
      if (state.op === 'nopil') total *= T.noPil;
      if (root.querySelector('[data-nomon]').checked) total *= T.noMon;

      var low = round500(total);
      var high = round500(total * (1 + T.fork));
      out.textContent = 'от ' + fmt(low) + ' до ' + fmt(high);
      detail.textContent =
        '≈ ' + fmt(Math.round(rate)) + '/м² × ' + area.toLocaleString('ru-RU') + ' м²';
    }

    root.querySelectorAll('[data-group]').forEach(function (g) {
      g.addEventListener('click', function (e) {
        var b = e.target.closest('button[data-value]');
        if (!b) return;
        g.querySelectorAll('button').forEach(function (x) {
          x.classList.remove('is-active');
        });
        b.classList.add('is-active');
        state[g.dataset.group] = b.dataset.value;
        calc();
      });
    });

    root.querySelectorAll('input').forEach(function (el) {
      el.addEventListener('input', calc);
      el.addEventListener('change', calc);
    });

    calc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
