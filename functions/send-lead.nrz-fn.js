// ONREZA Function: приём заявки с сайта и отправка письма владельцу.
// Доставка — через formsubmit.co (HTTP, без SMTP-паролей).
// Секреты — только через ctx.env: LEAD_EMAIL — ящик владельца.
// Привязка маршрута — в onreza.rules.toml (pipeline terminal, override).
export const config = { name: "send-lead" };

function json(data, status) {
  return Response.json(data, { status: status || 200 });
}

function normPhone(raw) {
  var d = String(raw || "").replace(/\D/g, "");
  if (d.charAt(0) === "8") d = "7" + d.slice(1);
  return d;
}

function clean(s, max) {
  return String(s || "")
    .replace(/[<>"\r\n]+/g, " ")
    .trim()
    .slice(0, max || 200);
}

export default {
  async fetch(request, ctx) {
    if (request.method !== "POST") {
      return json({ ok: false, error: "method" }, 405);
    }
    var body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ ok: false, error: "body" }, 400);
    }
    // Honeypot: боты заполняют скрытое поле — тихо "успех", письма нет.
    if (body.name) {
      return json({ ok: true });
    }
    var digits = normPhone(body.phone);
    if (!/^7\d{10}$/.test(digits)) {
      return json({ ok: false, error: "phone" }, 400);
    }
    var to = String((ctx.env && ctx.env.LEAD_EMAIL) || "").trim();
    if (!to || to.indexOf("@") < 0) {
      await ctx.log.error("send-lead: missing LEAD_EMAIL", {});
      return json({ ok: false, error: "config" }, 500);
    }
    var fio = clean(body.fio, 100);
    var source = clean(body.source || body.subject, 100) || "Сайт 33navesa";
    var payload = {
      _subject: "Заявка на замер — 33navesa",
      _template: "table",
      "Имя": fio || "—",
      "Телефон": "+" + digits,
      "Форма": source,
      "Страница": clean(body.page, 200) || "—",
    };
    try {
      var r = await fetch("https://formsubmit.co/ajax/" + encodeURIComponent(to), {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (r.ok) {
        return json({ ok: true });
      }
      await ctx.log.warn("send-lead: formsubmit reject", { status: r.status });
      return json({ ok: false, error: "mail" }, 502);
    } catch (e) {
      await ctx.log.error("send-lead: fetch fail", {});
      return json({ ok: false, error: "mail" }, 502);
    }
  },
};
