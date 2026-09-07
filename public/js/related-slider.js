// Мини-слайдер «Похожие товары»: 3 карточки в ряд, стрелки по краям.
// Нативный, без зависимостей. Работает на всех страницах с .related__items.rslide
(function () {
  function init() {
    document.querySelectorAll('.related__items.rslide').forEach(function (box) {
      var slides = box.querySelectorAll(':scope > .slide-box');
      if (!slides.length || box.dataset.relSlider) return;
      box.dataset.relSlider = '1';
      box.classList.add('rel-slider');
      if (slides.length <= 3) return; // стрелки не нужны, CSS разложит в ряд
      var wrap = document.createElement('div');
      wrap.className = 'rel-wrap';
      box.parentNode.insertBefore(wrap, box);
      wrap.appendChild(box);
      var prev = document.createElement('button');
      prev.className = 'rel-arrow rel-prev';
      prev.type = 'button';
      prev.setAttribute('aria-label', 'Назад');
      prev.innerHTML = '&#8249;';
      var next = document.createElement('button');
      next.className = 'rel-arrow rel-next';
      next.type = 'button';
      next.setAttribute('aria-label', 'Вперёд');
      next.innerHTML = '&#8250;';
      wrap.appendChild(prev);
      wrap.appendChild(next);
      function page() {
        var s = slides[0];
        return s.getBoundingClientRect().width + 12;
      }
      prev.addEventListener('click', function () {
        box.scrollBy({ left: -page() * 3, behavior: 'smooth' });
      });
      next.addEventListener('click', function () {
        box.scrollBy({ left: page() * 3, behavior: 'smooth' });
      });
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
