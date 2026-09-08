// sidebar.js — логика конверсионного сайдбара (калькулятор + формы через WhatsApp).
(function () {
  var RATE = 6800; // ₽/м², базовая ставка

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
    var btn = root.querySelector("[data-call]");
    var honey = root.querySelector("[data-honey]");
    maskPhone(phone);
    function fail(text) {
      var err = root.querySelector("[data-form-err]");
      if (!err) {
        err = document.createElement("p");
        err.setAttribute("data-form-err", "");
        err.className = "conv-micro";
        err.style.color = "#D01127";
        btn.parentNode.insertBefore(err, btn);
      }
      err.textContent = text;
    }
    btn.addEventListener("click", function () {
      var d = phone.value.replace(/\D/g, "");
      if (d.charAt(0) === "8") d = "7" + d.slice(1);
      if (!/^7\d{10}$/.test(d)) {
        fail("Введите номер полностью: +7 (___) ___-__-__");
        phone.focus();
        return;
      }
      btn.disabled = true;
      var btnText = btn.textContent;
      btn.textContent = "Отправляем...";
      fetch("/api/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: d, name: honey ? honey.value : "" })
      }).then(function (r) {
        return r.json().then(function (j) { return { s: r.status, j: j }; });
      }).then(function (res) {
        if (res.s === 200 && res.j && res.j.ok) {
          root.innerHTML = '<div class="conv-title">Спасибо!</div>' +
            '<p class="conv-micro">Заявка принята, мы перезвоним вам в течение 15 минут.</p>';
        } else if (res.j && res.j.error === "phone") {
          btn.disabled = false;
          btn.textContent = btnText;
          fail("Введите номер полностью: +7 (___) ___-__-__");
        } else {
          btn.disabled = false;
          btn.textContent = btnText;
          fail("Не получилось отправить. Позвоните нам: +7 (905) 149-23-88");
        }
      }).catch(function () {
        btn.disabled = false;
        btn.textContent = btnText;
        fail("Нет связи с сервером. Позвоните нам: +7 (905) 149-23-88");
      });
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
