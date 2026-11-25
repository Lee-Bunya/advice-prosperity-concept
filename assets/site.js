(function(){
  var d=document; d.documentElement.classList.add('js');
  var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  /* reveal on scroll */
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.18,rootMargin:'0px 0px -6% 0px'});
  d.querySelectorAll('.rv,.arcset,.approve').forEach(function(el){io.observe(el)});

  var nav=d.getElementById('nav');

  /* homepage header: dark over the cover, light once the next section reaches the top.
     A class swap rather than a scroll-driven animation, which Chrome didn't always repaint. */
  var bnTop=d.getElementById('bottleneck');
  if(nav&&bnTop&&d.querySelector('.hero')){
    var solid=function(){nav.classList.toggle('solid',bnTop.getBoundingClientRect().top<=nav.offsetHeight)};
    var navTick=false;
    addEventListener('scroll',function(){if(navTick)return;navTick=true;requestAnimationFrame(function(){navTick=false;solid()})},{passive:true});
    addEventListener('resize',solid);solid();
  }

  /* phone menu */
  var tg=d.querySelector('.nav-toggle');
  if(tg){tg.addEventListener('click',function(){var o=nav.classList.toggle('open');tg.setAttribute('aria-expanded',o)});
    d.querySelectorAll('#menu a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');tg.setAttribute('aria-expanded','false')})})}

  /* ---------- self-playing product glimpses ----------
     Each one loops while it is on screen and stops when it leaves.
     steps = [[ms, fn, isReset]]. With reduced motion, nothing loops:
     the forward steps are applied once so the finished state shows. */
  function loop(el,steps,total){
    if(reduce){steps.forEach(function(s){if(!s[2])s[1]()});return}
    var t=[],on=false;
    function run(){steps.forEach(function(s){t.push(setTimeout(s[1],s[0]))});t.push(setTimeout(function(){t=[];run()},total))}
    new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting&&!on){on=true;run()}
      else if(!e.isIntersecting&&on){on=false;t.forEach(clearTimeout);t=[]}
    })},{threshold:.35}).observe(el);
  }

  /* approval cards (hero and the morning screen) */
  d.querySelectorAll('[data-approve-card]').forEach(function(card){
    var btns=[].slice.call(card.querySelectorAll('[data-ok]')),cnt=card.querySelector('[data-count]'),foot=card.querySelector('[data-foot]');
    var subs=btns.map(function(b){return b.closest('.row').querySelector('small').textContent}),foot0=foot.textContent;
    function left(){return btns.filter(function(b){return !b.classList.contains('done')}).length}
    function approve(b){
      if(b.classList.contains('done'))return;
      b.classList.add('done');b.textContent='Approved';
      var row=b.closest('.row');row.classList.add('done');
      row.querySelector('small').textContent='Approved by you · filed to the client record';
      var n=left();cnt.textContent=n?n+' prepared':'All clear';
      if(!n)foot.textContent='All approved. Nothing is waiting on you.';
    }
    function reset(){
      btns.forEach(function(b,i){b.classList.remove('done');b.textContent='Approve';var row=b.closest('.row');row.classList.remove('done');row.querySelector('small').textContent=subs[i]});
      cnt.textContent=btns.length+' prepared';foot.textContent=foot0;
    }
    card.addEventListener('click',function(e){var b=e.target.closest('[data-ok]');if(b)approve(b)});
    var steps=[[0,reset,true]];
    btns.forEach(function(b,i){steps.push([1700+i*1500,function(){approve(b)}])});
    loop(card,steps,1700+btns.length*1500+2600);
  });

  /* SOA request pack */
  d.querySelectorAll('[data-pk]').forEach(function(pk){
    var win=pk.closest('.win'),st=win.querySelector('[data-pk-st]'),log=win.querySelector('[data-pk-log]'),sp=win.querySelector('.pk-side p');
    var label=pk.textContent,sp0=sp.textContent;
    function approve(){
      if(pk.classList.contains('done'))return;
      pk.classList.add('done');pk.textContent='Approved';st.textContent='With paraplanning';
      log.textContent='Approved by Liam Hartley · just now. Sent to paraplanning with 6 attachments.';
      sp.textContent='The Spencers have moved to Paraplanning on the board.';
    }
    function reset(){pk.classList.remove('done','press');pk.textContent=label;st.textContent='Waiting for you';log.textContent='';sp.textContent=sp0}
    pk.addEventListener('click',approve);
    loop(win,[[0,reset,true],[2300,function(){pk.classList.add('press')},true],[2650,function(){pk.classList.remove('press');approve()}]],7600);
  });

  /* pipeline board: the Spencers move across */
  d.querySelectorAll('[data-kanban]').forEach(function(wrap){
    var cols=[].slice.call(wrap.querySelectorAll('.kb .col')),card=wrap.querySelector('[data-mover]'),tag=card.querySelector('small');
    var home=cols.indexOf(card.parentNode),tag0=tag.textContent;
    function counts(){cols.forEach(function(c){c.querySelector('h4 span').textContent=c.querySelectorAll('.kc').length})}
    function move(i,text,quiet){
      var a=card.getBoundingClientRect();
      if(i===home)cols[i].insertBefore(card,cols[i].querySelector('.kc'));else cols[i].appendChild(card);
      tag.textContent=text;counts();card.classList.toggle('hot',i!==home);
      var b=card.getBoundingClientRect();
      if(!quiet&&!reduce&&card.animate)card.animate([{transform:'translate('+(a.left-b.left)+'px,'+(a.top-b.top)+'px)'},{transform:'none'}],{duration:900,easing:'cubic-bezier(.16,.84,.24,1)'});
    }
    var labels=['Strategy paper being prepared','SOA request pack prepared','With the paraplanner'];
    var steps=[[0,function(){move(home,tag0,true)},true]];
    labels.forEach(function(text,n){if(cols[home+1+n])steps.push([1500+n*2200,function(){move(home+1+n,text)},n>0])});
    loop(wrap,steps,1500+labels.length*2200+1800);
  });

  /* screens that fill themselves: fact find, review */
  d.querySelectorAll('.ff,.rvw').forEach(function(body){
    var win=body.closest('.win');
    [].forEach.call(body.querySelectorAll('.ch'),function(c,i){c.style.setProperty('--i',i)});
    function reset(){win.classList.add('rst');win.classList.remove('play');void win.offsetWidth;win.classList.remove('rst')}
    loop(win,[[0,reset,true],[350,function(){win.classList.add('play')}]],8200);
  });

  /* bottleneck scene (homepage only) */
  if(d.getElementById('bottleneck')){
  var bn=d.getElementById('bottleneck'),grid=d.getElementById('bnGrid'),nEl=d.getElementById('bnN'),wEl=d.getElementById('bnW');
  var days=[['Discovery meeting',1],['File note typed up',0],['Fact find keyed in again',0],['Strategy worked through',1],['SOA request written and emailed',0]];
  for(var q=0;q<13;q++)days.push(['In the paraplanning queue',0]);
  days.push(['Draft back.\nChecked and changed',1],['Waiting on a meeting time',0],['Advice presented',1]);
  var cells=days.map(function(x){var i=d.createElement('i');if(!x[1])i.className='wait';grid.appendChild(i);return i});
  var lastDay=-1,lastPhase='',nSmall=nEl.parentNode.querySelector('small');
  cells.forEach(function(c,i){c.style.setProperty('--k',20-i)});
  function bnState(){
    var r=bn.getBoundingClientRect(),p=Math.min(1,Math.max(0,-r.top/(r.height-innerHeight)));
    var phase=p<.38?'1':p<.56?'2':p<.74?'3':'4';
    var day=phase==='1'?Math.max(1,Math.min(21,Math.ceil(p/.36*21))):21;
    if(day!==lastDay&&phase!=='4'){lastDay=day;nEl.textContent=day;wEl.textContent=days[day-1][0];cells.forEach(function(c,i){c.classList.toggle('on',i<day)})}
    if(phase!==lastPhase){var was=lastPhase;lastPhase=phase;bn.dataset.phase=phase;
      if(phase==='4'){nSmall.textContent='Minutes';nEl.textContent='30';wEl.textContent='From first meeting to advice,\nprepared for your approval.'}
      else if(was==='4'){nSmall.textContent='Day';nEl.textContent=day;lastDay=day}
      if(phase==='2')wEl.textContent='4 days of advice.\n17 days of everything else.'; else if(phase==='1')wEl.textContent=days[day-1][0]}
  }
  var tick=false;
  addEventListener('scroll',function(){if(tick)return;tick=true;requestAnimationFrame(function(){tick=false;bnState()})},{passive:true});
  addEventListener('resize',bnState);
  bnState();
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
    location.href='mailto:enquiries@adviceprosperity.com.au?subject='+encodeURIComponent('Demo request: '+v('practice'))+'&body='+encodeURIComponent(body);
    msg.style.color='';msg.textContent='Your email is ready to send. If nothing opened, call 1300 286 922.';
  });
})();
