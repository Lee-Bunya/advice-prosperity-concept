/* Pricing page (pricing.html), Nov 2026. One price: A$5.50 per client a month for everything, minimum A$250 a month
   (the same as the homepage calculator). Microsoft's costs are estimates, billed by Microsoft: Power Apps Premium about
   A$29.90 a person a month, AI credits from about A$50 a month, and the Client Portal (Power Pages) about A$5.50 for
   each client who signs in that month. Setup A$7,249 once, by Bunya. Draft prices, A$ before GST. */
(function(){
  var d = document, $ = function(id){ return d.getElementById(id); };
  if (!$('pzN')) return;
  var RATE = 5.5, MIN = 250, PA = 29.9, AI = 50, PORTAL = 5.5;
  var n = 500, p = 5, c = 50;
  var money = function(v){ return 'A$' + Math.round(v).toLocaleString('en-AU'); };
  var line = function(a, b){ return '<div><dt>' + a + '</dt><dd>' + b + '</dd></div>'; };
  function paint(){
    var sub = Math.max(MIN, n * RATE), pa = p * PA, pp = c * PORTAL, ms = pa + AI + pp;
    $('pzN').value = n; $('pzNo').textContent = n.toLocaleString('en-AU');
    [].forEach.call(d.querySelectorAll('.pz-sizes [data-n]'), function(b){ b.setAttribute('aria-pressed', String(+b.dataset.n === n)); });
    $('pzSub').textContent = money(sub);
    $('pzSum').textContent = n.toLocaleString('en-AU') + ' clients × A$5.50' + (n * RATE < MIN ? ', so the A$250 minimum' : '') + '. Unlimited users. Minimum A$250 a month.';
    $('pzP').textContent = p; $('pzC').textContent = c.toLocaleString('en-AU');
    [].forEach.call(d.querySelectorAll('[data-st]'), function(b){
      var v = b.dataset.st === 'p' ? p : c, dn = +b.dataset.d < 0;
      b.disabled = dn ? v <= (b.dataset.st === 'p' ? 1 : 0) : v >= (b.dataset.st === 'p' ? 200 : 5000);
    });
    $('pzMsLines').innerHTML =
      line('Microsoft 365 licences <small>The plan your practice has today</small>', 'As today') +
      line('Power Apps Premium <small>' + p + (p === 1 ? ' person' : ' people') + ' × about A$29.90</small>', 'about ' + money(pa)) +
      line('AI credits <small>Pay as you go, in your own Microsoft 365</small>', 'from about ' + money(AI)) +
      line('Client Portal <small>Pay as you go: ' + c.toLocaleString('en-AU') + ' clients signing in × about A$5.50</small>', 'about ' + money(pp));
    $('pzMs').textContent = money(ms);
    $('pzT1').textContent = money(sub); $('pzT2').textContent = money(ms); $('pzT3').textContent = money(sub + ms);
  }
  $('pzN').addEventListener('input', function(){ n = +this.value; paint(); });
  d.addEventListener('click', function(e){
    var s = e.target.closest('.pz-sizes [data-n]');
    if (s) { n = +s.dataset.n; paint(); return; }
    var b = e.target.closest('[data-st]');
    if (b && !b.disabled) {
      if (b.dataset.st === 'p') p = Math.max(1, Math.min(200, p + +b.dataset.d));
      else c = Math.max(0, Math.min(5000, c + +b.dataset.d));
      paint();
    }
  });
  paint();
})();
