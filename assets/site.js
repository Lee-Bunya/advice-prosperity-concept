(function(){
  var d=document; d.documentElement.classList.add('js');
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* reveal on scroll */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
  d.querySelectorAll('.rv,.arcset,.approve').forEach(function(el){io.observe(el)});

  /* nav rule */
  var nav=d.getElementById('nav');
  function navState(){}

  /* phone menu */
  var tg=d.querySelector('.nav-toggle');
  if(tg){tg.addEventListener('click',function(){var o=nav.classList.toggle('open');tg.setAttribute('aria-expanded',o)});
    d.querySelectorAll('#menu a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');tg.setAttribute('aria-expanded','false')})})}

  /* hero approvals */
  d.querySelectorAll('[data-approve-card]').forEach(function(card){
    var left=card.querySelectorAll('[data-ok]').length;
    card.addEventListener('click',function(e){
      var b=e.target.closest('[data-ok]'); if(!b||b.classList.contains('done'))return;
      b.classList.add('done'); b.textContent='Approved'; b.disabled=true;
      var row=b.closest('.row'); row.classList.add('done');
      row.querySelector('small').textContent='Approved by you · filed to the client record';
      left--;
      card.querySelector('[data-count]').textContent=left?left+' prepared':'All clear';
      if(!left)card.querySelector('[data-foot]').textContent='All approved. Nothing is waiting on you.';
    });
  });

  /* SOA pack approval */
  var pk=d.querySelector('[data-pk]');
  if(pk)pk.addEventListener('click',function(){
    if(pk.classList.contains('done'))return;
    pk.classList.add('done'); pk.textContent='Approved'; pk.disabled=true;
    d.querySelector('[data-pk-st]').textContent='With paraplanning';
    d.querySelector('[data-pk-log]').textContent='Approved by Liam Hartley · just now. Sent to paraplanning with 6 attachments.';
    var sp=d.querySelector('.pk-side p'); if(sp)sp.textContent='The Spencers have moved to Paraplanning on the board.';
  });

  /* kanban: the Spencers move from Fact find to Strategy */
  var kbWrap=d.querySelector('[data-kanban]');
  if(kbWrap){
    var kio=new IntersectionObserver(function(es){es.forEach(function(e){
      if(!e.isIntersecting)return; kio.disconnect();
      setTimeout(function(){
        var card=kbWrap.querySelector('[data-mover]'),from=kbWrap.querySelector('[data-from]'),to=kbWrap.querySelector('[data-to]');
        var a=card.getBoundingClientRect();
        to.appendChild(card);
        card.querySelector('small').textContent='Paper being prepared';
        from.querySelector('[data-n]').textContent='1'; to.querySelector('[data-n]').textContent='2';
        var b=card.getBoundingClientRect();
        card.classList.add('hot');
        if(!reduce&&card.animate)card.animate([{transform:'translate('+(a.left-b.left)+'px,'+(a.top-b.top)+'px)'},{transform:'none'}],{duration:900,easing:'cubic-bezier(.16,.84,.24,1)'});
      },900);
    })},{threshold:.55});
    kio.observe(kbWrap);
  }

  /* bottleneck scene (homepage only) */
  if(d.getElementById('bottleneck')){
  var bn=d.getElementById('bottleneck'),grid=d.getElementById('bnGrid'),nEl=d.getElementById('bnN'),wEl=d.getElementById('bnW');
  var days=[['Discovery meeting',1],['File note typed up',0],['Fact find keyed in again',0],['Strategy worked through',1],['SOA request written and emailed',0]];
  for(var q=0;q<13;q++)days.push(['In the paraplanning queue',0]);
  days.push(['Draft back. Checked and changed',1],['Waiting on a meeting time',0],['Advice presented',1]);
  var cells=days.map(function(x){var i=d.createElement('i');if(!x[1])i.className='wait';grid.appendChild(i);return i});
  var lastDay=-1,lastPhase='';
  function bnState(){
    var r=bn.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));
    var phase=p<.5?'1':p<.74?'2':'3';
    var day=phase==='1'?Math.max(1,Math.min(21,Math.ceil(p/.48*21))):21;
    if(day!==lastDay){lastDay=day;nEl.textContent=day;wEl.textContent=days[day-1][0];cells.forEach(function(c,i){c.classList.toggle('on',i<day)})}
    if(phase!==lastPhase){lastPhase=phase;bn.dataset.phase=phase;if(phase==='2')wEl.textContent='4 days of advice. 17 days of everything else.'; else if(phase==='1')wEl.textContent=days[day-1][0]}
  }
  var tick=false;
  addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;navState();bnState()})},{passive:true});
  addEventListener('resize',bnState);
  navState();bnState();

  }

  /* pricing (homepage only) */
  if(d.getElementById('clients')){
  var rng=d.getElementById('clients'),cN=d.getElementById('cN'),cOut=d.getElementById('cOut');
  function price(){var c=+rng.value,m=Math.max(250,c*5.5);cN.textContent=c.toLocaleString('en-AU');cOut.textContent='A$'+Math.round(m).toLocaleString('en-AU')+' a month'}
  rng.addEventListener('input',price);price();
  }

  /* demo form: composes an email in the visitor's own mail app */
  var df=d.getElementById('demoForm');
  if(df)df.addEventListener('submit',function(e){
    e.preventDefault();
    var msg=d.getElementById('demoMsg'),v=function(n){return (df.elements[n].value||'').trim()};
    if(!v('name')||!v('practice')||!/^\S+@\S+\.\S+$/.test(v('email'))){msg.style.color='var(--brick)';msg.textContent='Add your name, practice and a valid email, then try again.';return}
    var body=['Name: '+v('name'),'Practice: '+v('practice'),'Email: '+v('email'),'Phone: '+(v('phone')||'not given'),'Advisers: '+v('advisers'),'',v('note')].join('\n');
    location.href='mailto:info@adviceprosperity.com.au?subject='+encodeURIComponent('Demo request: '+v('practice'))+'&body='+encodeURIComponent(body);
    msg.style.color='';msg.textContent='Your email is ready to send. If nothing opened, call 1300 286 922.';
  });
})();
