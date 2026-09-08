// sidebar.js — логика конверсионного сайдбара (калькулятор + формы через WhatsApp).
(function () {
  var RATE = 6800; // ₽/м², базовая ставка
  var WA = "https://wa.me/79051492388";

  function fmt(n) {
    return "от " + Math.round(n).toLocaleString("ru-RU") + " ₽";
  }

  function initCalc(root) {
    var type = root.querySelector("[data-type]");
    var len = root.querySelector("[data-len]");
    var wid = root.querySelector("[data-wid]");
    var out = root.querySelector("[data-out]");
    function calc() {
      var a = parseFloat(len.value) * parseFloat(wid.value);
      out.textContent = a > 0 ? fmt(a * RATE) : "введите размеры";
    }
    [type, len, wid].forEach(function (el) {
      el.addEventListener("input", calc);
    });
    calc();
  }

  function maskPhone(input) {
    // Маска +7 (___) ___-__-__: цифры группируются при вводе, формат виден сразу
    input.addEventListener("input", function () {
      var d = input.value.replace(/\D/g, "");
      if (d.charAt(0) === "8") d = "7" + d.slice(1);
      if (d.charAt(0) !== "7") d = "7" + d;
      d = d.slice(0, 11);
      if (d.length <= 1) {
        input.value = "";
        return;
      }
      var out = "+7 (" + d.slice(1, 4);
      if (d.length >= 4) out += ") " + d.slice(4, 7);
      if (d.length >= 7) out += "-" + d.slice(7, 9);
      if (d.length >= 9) out += "-" + d.slice(9, 11);
      input.value = out;
    });
  }

  function initMeasure(root) {
    var phone = root.querySelector("[data-phone]");
    maskPhone(phone);
    root.querySelector("[data-call]").addEventListener("click", function () {
      var msg = "Здравствуйте! Вызовите замерщика, мой телефон: " +
        (phone.value.trim() || "перезвоните мне") + ". 33navesa.ru";
      window.open(WA + "?text=" + encodeURIComponent(msg), "_blank");
    });
  }

  function init() {
    document.querySelectorAll("[data-conv-calc]").forEach(initCalc);
    document.querySelectorAll("[data-conv-measure]").forEach(initMeasure);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
