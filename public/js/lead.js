// lead.js — заявки с сайта: маска телефона, модалки, отправка в Web3Forms.
// Напрямую из браузера (ключ публичный по дизайну Web3Forms):
// свой /api/send-lead на домене не отвечает (edge-правила там не исполняются).
// Vanilla JS (jQuery на сайте нет). Подключён в Footer на всех страницах.
(function () {
  var ENDPOINT = "https://api.web3forms.com/submit";
  var ACCESS_KEY = "081e039c-978d-4197-8c9a-68947e22fc5e"; // публичный ключ формы 33navesa
  var overlay = null;

  function normPhone(raw) {
    var d = String(raw || "").replace(/\D/g, "");
    if (d.charAt(0) === "8") d = "7" + d.slice(1);
    if (d.charAt(0) !== "7") d = "7" + d;
    return d.slice(0, 11);
  }

  function maskPhone(input) {
    input.addEventListener("input", function () {
      var d = normPhone(input.value);
      if (d.length <= 1) { input.value = ""; return; }
      var out = "+7 (" + d.slice(1, 4);
      if (d.length >= 4) out += ") " + d.slice(4, 7);
      if (d.length >= 7) out += "-" + d.slice(7, 9);
      if (d.length >= 9) out += "-" + d.slice(9, 11);
      input.value = out;
    });
  }

  function ensureOverlay() {
    if (overlay) return overlay;
    overlay = document.createElement("div");
    overlay.setAttribute("data-lead-overlay", "");
    overlay.style.cssText = "position:fixed;inset:0;background:rgba(0,0,0,.6);z-index:100000;" +
      "display:none;align-items:center;justify-content:center;padding:16px;box-sizing:border-box;";
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });
    document.body.appendChild(overlay);
    return overlay;
  }

  function openModal(id) {
    var modal = document.getElementById(id);
    if (!modal) return;
    if (!modal._leadHome) {
      modal._leadHome = { parent: modal.parentNode, next: modal.nextSibling };
    }
    var ov = ensureOverlay();
    ov.innerHTML = "";
    modal.style.display = "block";
    modal.style.maxWidth = "450px";
    modal.style.width = "100%";
    modal.style.maxHeight = "90vh";
    modal.style.overflowY = "auto";
    ov.appendChild(modal);
    ov.style.display = "flex";
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    if (!overlay) return;
    var modal = overlay.querySelector(".modal");
    if (modal && modal._leadHome) {
      modal.style.display = "";
      if (modal._leadHome.next && modal._leadHome.next.parentNode) {
        modal._leadHome.parent.insertBefore(modal, modal._leadHome.next);
      } else {
        modal._leadHome.parent.appendChild(modal);
      }
    }
    overlay.style.display = "none";
    document.body.style.overflow = "";
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  function showThanks() {
    var thanks = document.getElementById("thanks");
    if (thanks) {
      thanks.innerHTML = '<div class="modal__title">Заявка принята!</div>' +
        "<p>Мы вам перезвоним через двадцать минут.</p>";
      openModal("thanks");
    } else {
      alert("Заявка принята! Мы вам перезвоним через двадцать минут.");
    }
  }

  function formError(form, text) {
    var err = form.querySelector("[data-lead-err]");
    if (!err) {
      err = document.createElement("p");
      err.setAttribute("data-lead-err", "");
      err.style.color = "#D01127";
      err.style.fontSize = "14px";
      form.appendChild(err);
    }
    err.textContent = text;
  }

  function bindForm(form) {
    if (form._leadBound) return;
    form._leadBound = true;
    var phone = form.querySelector('input[type="tel"][name="phone"]');
    if (phone) maskPhone(phone);
    var honey = form.querySelector('input[name="name"]');
    var fio = form.querySelector('input[name="fio"]');
    var subject = form.querySelector('input[name="subject"]');
    var submitBtn = form.querySelector('[type="submit"]');

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var d = normPhone(phone ? phone.value : "");
      if (!/^7\d{10}$/.test(d)) {
        formError(form, "Введите номер полностью: +7 (___) ___-__-__");
        if (phone) phone.focus();
        return;
      }
      if (honey && honey.value) { // бот в мёде — тихо "успех", ничего не шлём
        closeModal();
        form.reset();
        showThanks();
        return;
      }
      if (submitBtn) { submitBtn.disabled = true; submitBtn.value = "Отправляем..."; }
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: ACCESS_KEY,
          subject: "Заявка на замер — 33navesa.ru",
          from_name: fio && fio.value ? fio.value : "Форма с сайта",
          phone: "+" + d,
          page: window.location.pathname,
          form: subject ? subject.value : document.title
        })
      }).then(function (r) {
        return r.json().then(function (j) { return { s: r.status, j: j }; });
      }).then(function (res) {
        if (res.j && res.j.success) {
          closeModal();
          form.reset();
          if (submitBtn) { submitBtn.disabled = false; submitBtn.value = submitBtn.getAttribute("data-label") || "Отправить"; }
          showThanks();
        } else {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.value = "Отправить"; }
          formError(form, "Не получилось отправить. Позвоните нам: +7 (905) 149-23-88");
        }
      }).catch(function () {
        if (submitBtn) { submitBtn.disabled = false; submitBtn.value = "Отправить"; }
        formError(form, "Нет связи с сервером. Позвоните нам: +7 (905) 149-23-88");
      });
    });
  }

  function init() {
    document.querySelectorAll('a[href^="#"][data-fancybox]').forEach(function (a) {
      var id = a.getAttribute("href").slice(1);
      if (!id || a._leadBound) return;
      a._leadBound = true;
      a.addEventListener("click", function (e) {
        if (document.getElementById(id)) { e.preventDefault(); openModal(id); }
      });
    });
    document.querySelectorAll(
      "form.callback-form, form.callback-form2, form.home-form, form.order2-form, form.feedback-form"
    ).forEach(bindForm);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
