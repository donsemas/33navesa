// ONREZA Function: приём заявки "Бесплатный замер" и отправка SMS владельцу.
// Self-contained entry (без импортов и npm-зависимостей).
// Секреты — только через ctx.env (переменные окружения ONREZA):
//   SMS_RU_API_KEY — ключ sms.ru, MY_PHONE_NUMBER — номер владельца.
// Привязка маршрута — в onreza.rules.toml (pipeline terminal, override).
export const config = { name: "send-sms" };

function json(data, status) {
  return Response.json(data, { status: status || 200 });
}

function normPhone(raw) {
  var d = String(raw || "").replace(/\D/g, "");
  if (d.charAt(0) === "8") d = "7" + d.slice(1);
  return d;
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
    // Honeypot: боты заполняют скрытое поле — тихо "успех", SMS нет.
    if (body.name) {
      return json({ ok: true });
    }
    var digits = normPhone(body.phone);
    if (!/^7\d{10}$/.test(digits)) {
      return json({ ok: false, error: "phone" }, 400);
    }
    var apiId = String((ctx.env && ctx.env.SMS_RU_API_KEY) || "").trim();
    var to = normPhone(ctx.env && ctx.env.MY_PHONE_NUMBER);
    if (!apiId || !/^7\d{10}$/.test(to)) {
      await ctx.log.error("send-sms: missing env", {});
      return json({ ok: false, error: "config" }, 500);
    }
    // Короткий текст (~30 символов кириллицы = 1 SMS-сегмент).
    var msg = "Заявка на замер! Тел: +" + digits;
    var url =
      "https://sms.ru/sms/send?api_id=" +
      encodeURIComponent(apiId) +
      "&to=" +
      encodeURIComponent(to) +
      "&msg=" +
      encodeURIComponent(msg) +
      "&json=1";
    try {
      var r = await fetch(url);
      var data = await r.json();
      if (data && data.status_code === 100) {
        return json({ ok: true });
      }
      await ctx.log.warn("send-sms: sms.ru reject", {
        status_code: data && data.status_code,
      });
      return json({ ok: false, error: "sms" }, 502);
    } catch (e) {
      await ctx.log.error("send-sms: fetch fail", {});
      return json({ ok: false, error: "sms" }, 502);
    }
  },
};
