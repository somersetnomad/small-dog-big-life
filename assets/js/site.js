/* Small Dog. Full Life. — interaction & motion engine
   Motion vocabulary:
   - "Settle": things arrive by rising out of an invisible mask and settling (expo out).
   - "Perk": the ears mark lifts to alert; used for acknowledgement and arrivals.
   - "Curious tilt": the masthead ears tilt slightly towards the pointer — the signature.
   - "Unveil": photography opens through a moving crop, never pops in.
   - Springs: controls respond with a weighted, slightly elastic press.
   Reading content is never hidden waiting for scroll: text reveals only run on
   elements in or near the first viewport or are short headings, and everything
   is visible immediately when motion is reduced or scripts fail. */
(function(){
  "use strict";
  var doc=document.documentElement;
  doc.classList.remove("no-js");doc.classList.add("js");
  var SD=window.SD=window.SD||{};

  /* ------------------------------------------------------------------ Storage + consent */
  var CONSENT_KEY="sdfl-consent-v1";
  function rawGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function rawSet(k,v){try{localStorage.setItem(k,v);return true}catch(e){return false}}
  function rawDel(k){try{localStorage.removeItem(k)}catch(e){}}
  SD.consent={
    read:function(){try{return JSON.parse(rawGet(CONSENT_KEY))||null}catch(e){return null}},
    prefsAllowed:function(){var c=this.read();return !!(c&&c.preferences)},
    save:function(prefs){
      rawSet(CONSENT_KEY,JSON.stringify({essential:true,preferences:!!prefs,date:new Date().toISOString(),version:1}));
      if(!prefs){SD.store.clearAll()}
      document.dispatchEvent(new CustomEvent("sd:consent",{detail:{preferences:!!prefs}}));
    }
  };
  SD.store={
    prefix:"sdfl-tool-",
    get:function(k){try{return JSON.parse(rawGet(this.prefix+k))}catch(e){return null}},
    set:function(k,v){if(!SD.consent.prefsAllowed())return false;return rawSet(this.prefix+k,JSON.stringify(v))},
    del:function(k){rawDel(this.prefix+k)},
    clearAll:function(){try{Object.keys(localStorage).forEach(function(k){if(k.indexOf("sdfl-tool-")===0)localStorage.removeItem(k)})}catch(e){}}
  };

  /* ------------------------------------------------------------------ Motion preference */
  var mq=window.matchMedia("(prefers-reduced-motion: reduce)");
  var userMotion=rawGet("sdfl-motion"); // "reduce" | "full" | null
  SD.reduced=function(){return userMotion==="reduce"||(userMotion!=="full"&&mq.matches)};
  if(SD.reduced())doc.classList.add("reduce-motion");

  var hasG=typeof window.gsap!=="undefined";
  var G=window.gsap;
  if(hasG){
    var plugins=[window.ScrollTrigger,window.SplitText,window.Flip,window.MorphSVGPlugin,window.DrawSVGPlugin].filter(Boolean);
    G.registerPlugin.apply(G,plugins);
    G.defaults({ease:"expo.out",duration:1.1});
  }
  var ST=window.ScrollTrigger;
  var motionOK=hasG&&!SD.reduced();

  /* ------------------------------------------------------------------ Toast (microinteraction) */
  var toastEl;
  SD.toast=function(msg){
    if(!toastEl){toastEl=document.createElement("div");toastEl.className="toast";toastEl.setAttribute("role","status");toastEl.setAttribute("aria-live","polite");document.body.appendChild(toastEl)}
    toastEl.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.2 4.2L19 7"/></svg><span></span>';
    toastEl.querySelector("span").textContent=msg;
    if(motionOK){
      G.killTweensOf(toastEl);
      G.fromTo(toastEl,{yPercent:150,xPercent:-50,x:0,scale:.9},{yPercent:0,xPercent:-50,scale:1,duration:.7,ease:"back.out(2.2)"});
      G.fromTo(toastEl.querySelector("path"),{drawSVG:"0%"},{drawSVG:"100%",duration:.5,delay:.2,ease:"power2.out"});
      G.to(toastEl,{yPercent:160,duration:.5,ease:"power3.in",delay:2.6});
    }else{
      toastEl.style.transform="translate(-50%,0)";
      clearTimeout(toastEl._t);toastEl._t=setTimeout(function(){toastEl.style.transform="translate(-50%,150%)"},2800);
    }
  };

  /* ------------------------------------------------------------------ Spring physics */
  function Spring(opts){this.k=opts.k||320;this.c=opts.c||18;this.x=opts.from||0;this.v=0;this.target=this.x;this.onUpdate=opts.onUpdate;this.raf=0}
  Spring.prototype.to=function(t){this.target=t;if(!this.raf)this._tick(performance.now())};
  Spring.prototype._tick=function(last){var s=this;s.raf=requestAnimationFrame(function(now){
    var dt=Math.min(.032,(now-last)/1000);var steps=4,h=dt/steps;
    for(var i=0;i<steps;i++){var f=-s.k*(s.x-s.target)-s.c*s.v;s.v+=f*h;s.x+=s.v*h}
    s.onUpdate(s.x);
    if(Math.abs(s.v)<.001&&Math.abs(s.x-s.target)<.0005){s.x=s.target;s.onUpdate(s.x);s.raf=0;return}
    s._tick(now)})};
  SD.Spring=Spring;

  function springButtons(root){
    if(SD.reduced())return;
    (root||document).querySelectorAll(".btn,.chip,.btn-contents,.btn-urgent,.path-tabs button").forEach(function(b){
      if(b._spring)return;
      var sp=b._spring=new Spring({from:1,k:420,c:16,onUpdate:function(x){b.style.transform="scale("+x.toFixed(4)+")"}});
      b.addEventListener("pointerdown",function(){sp.to(.94)});
      ["pointerup","pointerleave","pointercancel"].forEach(function(ev){b.addEventListener(ev,function(){sp.to(1)})});
      b.addEventListener("keydown",function(e){if(e.key===" "||e.key==="Enter"){sp.to(.95);setTimeout(function(){sp.to(1)},90)}});
    });
  }
  SD.springButtons=springButtons;

  /* ------------------------------------------------------------------ Brand ears: morph + curious tilt */
  var EAR_RELAXED={l:"M3 23 L6.5 7.5 Q7.2 5.2 9 6.6 L16 13 Z",r:"M31 23 L27.5 7.5 Q26.8 5.2 25 6.6 L18 13 Z",li:"M6.4 19.6 L8.4 10.4 L13 14.5 Z",ri:"M27.6 19.6 L25.6 10.4 L21 14.5 Z"};
  var EAR_ALERT={l:"M4 23 L7.5 1.5 Q8.4 -.4 9.8 1.4 L16 13 Z",r:"M30 23 L26.5 1.5 Q25.6 -.4 24.2 1.4 L18 13 Z",li:"M7.3 18.8 L8.9 6 L13.2 13.8 Z",ri:"M26.7 18.8 L25.1 6 L20.8 13.8 Z"};
  SD.perk=function(svg,on){
    if(!svg||!motionOK||!window.MorphSVGPlugin)return;
    var s=on?EAR_ALERT:EAR_RELAXED;
    G.to(svg.querySelector(".ear-l"),{morphSVG:s.l,duration:.55,ease:on?"back.out(3)":"power3.out"});
    G.to(svg.querySelector(".ear-r"),{morphSVG:s.r,duration:.55,ease:on?"back.out(3)":"power3.out",delay:on?.06:0});
    G.to(svg.querySelector(".ear-li"),{morphSVG:s.li,duration:.55,ease:"power3.out"});
    G.to(svg.querySelector(".ear-ri"),{morphSVG:s.ri,duration:.55,ease:"power3.out",delay:on?.06:0});
  };
  function initBrand(){
    var brand=document.querySelector(".brand");if(!brand)return;
    var mark=brand.querySelector(".brand-mark");
    if(!motionOK){return}
    // arrive relaxed, then perk — "someone's come in"
    G.set([mark.querySelector(".ear-l"),mark.querySelector(".ear-r"),mark.querySelector(".ear-li"),mark.querySelector(".ear-ri")],{});
    setTimeout(function(){SD.perk(mark,false);setTimeout(function(){SD.perk(mark,true)},450)},600);
    brand.addEventListener("pointerenter",function(){SD.perk(mark,false);setTimeout(function(){SD.perk(mark,true)},180)});
    // curious tilt toward pointer (fine pointers only)
    if(window.matchMedia("(pointer:fine)").matches){
      var tilt=new Spring({from:0,k:60,c:9,onUpdate:function(x){mark.style.transform="rotate("+x.toFixed(2)+"deg)"}});
      var lastMove=0;
      window.addEventListener("pointermove",function(e){
        var now=performance.now();if(now-lastMove<40)return;lastMove=now;
        var r=mark.getBoundingClientRect();var dx=e.clientX-(r.left+r.width/2);var dy=e.clientY-(r.top+r.height/2);
        var ang=Math.max(-11,Math.min(11,dx/Math.max(120,Math.abs(dy)+120)*9));
        tilt.to(ang);
      },{passive:true});
      document.addEventListener("pointerleave",function(){tilt.to(0)});
    }
  }

  /* ------------------------------------------------------------------ Masthead */
  function initMast(){
    var mast=document.querySelector(".mast");if(!mast)return;
    var lastY=window.scrollY,ticking=false;
    function onScroll(){
      var y=window.scrollY;
      mast.classList.toggle("is-solid",y>24);
      if(!document.body.classList.contains("contents-open")){
        if(y>lastY+6&&y>400)mast.classList.add("is-hidden");
        else if(y<lastY-6||y<200)mast.classList.remove("is-hidden");
      }
      lastY=y;ticking=false;
    }
    window.addEventListener("scroll",function(){if(!ticking){requestAnimationFrame(onScroll);ticking=true}},{passive:true});
    onScroll();
    mast.addEventListener("focusin",function(){mast.classList.remove("is-hidden")});

    // contents overlay
    var btn=document.querySelector(".btn-contents"),panel=document.getElementById("contents");
    if(!btn||!panel)return;
    var lastFocus;
    function open(){
      lastFocus=document.activeElement;
      panel.classList.add("is-open");panel.removeAttribute("hidden");document.body.classList.add("contents-open");
      btn.setAttribute("aria-expanded","true");btn.querySelector(".lbl").textContent="Close";
      document.body.style.overflow="hidden";mast.classList.add("is-solid");
      if(motionOK){
        G.fromTo(panel,{clipPath:"inset(0 0 100% 0)"},{clipPath:"inset(0 0 0% 0)",duration:.8,ease:"expo.inOut"});
        G.fromTo(panel.querySelectorAll("h2, .col h3, .col li, .cfoot > *"),{yPercent:60,opacity:0},{yPercent:0,opacity:1,duration:.9,stagger:.025,delay:.3});
      }
      var first=panel.querySelector("a");if(first)setTimeout(function(){first.focus()},motionOK?400:0);
    }
    function close(){
      function done(){panel.classList.remove("is-open");panel.setAttribute("hidden","");document.body.classList.remove("contents-open");document.body.style.overflow=""}
      btn.setAttribute("aria-expanded","false");btn.querySelector(".lbl").textContent="Contents";
      if(motionOK){G.to(panel,{clipPath:"inset(0 0 100% 0)",duration:.6,ease:"expo.inOut",onComplete:done})}else done();
      if(lastFocus)lastFocus.focus();
    }
    btn.addEventListener("click",function(){btn.getAttribute("aria-expanded")==="true"?close():open()});
    document.addEventListener("keydown",function(e){
      if(e.key==="Escape"&&panel.classList.contains("is-open"))close();
      if(e.key==="Tab"&&panel.classList.contains("is-open")){
        var f=[btn].concat([].slice.call(panel.querySelectorAll("a,button")));var i=f.indexOf(document.activeElement);
        if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}
      }
    });
    panel.addEventListener("click",function(e){var a=e.target.closest("a");if(a&&a.hash&&a.pathname===location.pathname)close()});
  }

  /* ------------------------------------------------------------------ Videos: autoplay in view, pause control */
  var pauseSVG='<svg class="i-pause" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><rect x="2" y="1" width="3.5" height="12" rx="1"/><rect x="8.5" y="1" width="3.5" height="12" rx="1"/></svg><svg class="i-play" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true"><path d="M3 1.5v11l9.5-5.5z"/></svg>';
  var saveData=navigator.connection&&navigator.connection.saveData;
  function initVideos(){
    var vids=[].slice.call(document.querySelectorAll("video[data-src]"));
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        var v=en.target;
        if(en.isIntersecting){
          if(!v.src&&!v.dataset.loaded){v.src=v.dataset.src;v.dataset.loaded="1"}
          if(v.dataset.auto==="1"&&!v._userPaused&&!SD.reduced()&&!saveData){var p=v.play();if(p&&p.catch)p.catch(function(){})}
        }else if(!v.paused){v.pause()}
      });
    },{rootMargin:"200px 0px"});
    vids.forEach(function(v){
      v.muted=true;v.setAttribute("muted","");v.playsInline=true;v.loop=true;
      var host=v.closest("[data-video-host]")||v.parentElement;
      if(v.dataset.auto==="1"){
        var b=document.createElement("button");b.type="button";b.className="vid-toggle";b.innerHTML=pauseSVG;
        var paused=SD.reduced()||saveData;
        b.setAttribute("aria-pressed",paused?"true":"false");
        b.setAttribute("aria-label",paused?"Play video":"Pause video");
        if(paused)v._userPaused=true;
        b.addEventListener("click",function(e){e.preventDefault();e.stopPropagation();
          if(v.paused){v._userPaused=false;if(!v.src)v.src=v.dataset.src;v.play().catch(function(){});b.setAttribute("aria-pressed","false");b.setAttribute("aria-label","Pause video")}
          else{v._userPaused=true;v.pause();b.setAttribute("aria-pressed","true");b.setAttribute("aria-label","Play video")}
          var h=v.closest(".i2v");if(h)h.classList.toggle("is-playing",!v.paused);
        });
        host.appendChild(b);
        v.addEventListener("playing",function(){var h=v.closest(".i2v");if(h)h.classList.add("is-playing")});
      }
      io.observe(v);
    });
    // Image-to-video: still frame that begins moving on hover / focus / (touch) when centred
    var touch=window.matchMedia("(hover:none)").matches;
    document.querySelectorAll(".i2v[data-hover]").forEach(function(box){
      var v=box.querySelector("video");if(!v)return;
      var link=box.closest("a")||box;
      function start(){if(SD.reduced()||saveData)return;if(!v.src)v.src=v.dataset.src;v.play().then(function(){box.classList.add("is-playing")}).catch(function(){})}
      function stop(){v.pause();box.classList.remove("is-playing")}
      if(!touch){link.addEventListener("pointerenter",start);link.addEventListener("pointerleave",stop);link.addEventListener("focus",start);link.addEventListener("blur",stop)}
      else{
        var io2=new IntersectionObserver(function(en){en.forEach(function(e){if(e.intersectionRatio>.7)start();else stop()})},{threshold:[0,.7,1]});
        io2.observe(box);
      }
    });
  }

  /* ------------------------------------------------------------------ Split-text reveals */
  function splitReveal(el,delay){
    if(!window.SplitText){el.classList.add("is-ready");return null}
    var split=new SplitText(el,{type:"lines,words",linesClass:"split-line",mask:"lines",autoSplit:false});
    el.classList.add("is-ready");
    return G.from(split.lines,{yPercent:110,duration:1.15,stagger:.09,delay:delay||0,ease:"expo.out"});
  }
  function initTextReveals(){
    var els=[].slice.call(document.querySelectorAll("[data-split]"));
    if(!motionOK){els.forEach(function(e){e.classList.add("is-ready")});return}
    document.fonts.ready.then(function(){
      els.forEach(function(el){
        if(el.closest(".hero"))return; // hero handled by its own choreography
        var r=el.getBoundingClientRect();
        if(r.top<window.innerHeight*.95){splitReveal(el,.15)}
        else{
          var split=new SplitText(el,{type:"lines",linesClass:"split-line",mask:"lines"});
          el.classList.add("is-ready");
          G.set(split.lines,{yPercent:105});
          ST.create({trigger:el,start:"top 88%",once:true,onEnter:function(){G.to(split.lines,{yPercent:0,duration:1.1,stagger:.08,ease:"expo.out"})}});
        }
      });
    });
  }

  /* ------------------------------------------------------------------ Masked image reveals */
  function initMasks(){
    var els=document.querySelectorAll(".mask.reveal");
    if(!motionOK){els.forEach(function(m){m.style.clipPath="none"});return}
    els.forEach(function(m){
      var inner=m.querySelector("video,img");
      var from=m.classList.contains("circle")?"circle(0% at 50% 60%)":m.classList.contains("curtain")?"inset(0 100% 0 0)":"inset(100% 0 0 0)";
      var to=m.classList.contains("circle")?"circle(75% at 50% 50%)":"inset(0% 0% 0% 0%)";
      var tl=G.timeline({scrollTrigger:{trigger:m,start:"top 85%",once:true}});
      tl.fromTo(m,{clipPath:from},{clipPath:to,duration:1.5,ease:"expo.inOut"});
      if(inner)tl.fromTo(inner,{scale:1.25},{scale:1,duration:1.8,ease:"expo.out"},0);
    });
  }

  /* ------------------------------------------------------------------ Parallax layers */
  function initParallax(){
    if(!motionOK)return;
    document.querySelectorAll("[data-parallax]").forEach(function(el){
      var amt=parseFloat(el.dataset.parallax)||10;
      G.fromTo(el,{yPercent:-amt},{yPercent:amt,ease:"none",scrollTrigger:{trigger:el.closest("section")||el,start:"top bottom",end:"bottom top",scrub:true}});
    });
  }

  /* ------------------------------------------------------------------ SVG path drawing */
  function initDraw(){
    var els=document.querySelectorAll("[data-draw]");
    if(!motionOK||!window.DrawSVGPlugin)return;
    els.forEach(function(svg){
      var paths=svg.querySelectorAll(".ink,.accent,.thin");
      var labels=svg.querySelectorAll("text,.fill-a,.fill-m");
      G.set(paths,{drawSVG:"0%"});G.set(labels,{opacity:0});
      var tl=G.timeline({scrollTrigger:{trigger:svg,start:"top 80%",once:true}});
      tl.to(paths,{drawSVG:"100%",duration:1.6,stagger:.04,ease:"power2.inOut"}).to(labels,{opacity:1,duration:.6,stagger:.03,ease:"power1.out"},"-=.8");
    });
  }

  /* ------------------------------------------------------------------ Scroll-linked timeline */
  function initTimeline(){
    var tl=document.querySelector(".timeline");if(!tl)return;
    var path=tl.querySelector(".tl-line path.accent");
    if(!motionOK||!path)return;
    G.fromTo(path,{drawSVG:"0%"},{drawSVG:"100%",ease:"none",scrollTrigger:{trigger:tl,start:"top 60%",end:"bottom 70%",scrub:.6}});
    tl.querySelectorAll(".tl-item").forEach(function(it){
      G.from(it.querySelector(".dot"),{scale:0,duration:.6,ease:"back.out(3)",scrollTrigger:{trigger:it,start:"top 70%",once:true}});
      G.from(it.querySelectorAll(".when,.era,h3,p"),{y:30,opacity:0,stagger:.08,duration:1,scrollTrigger:{trigger:it,start:"top 78%",once:true}});
    });
  }

  /* ------------------------------------------------------------------ Home: hero choreography */
  function initHero(){
    var hero=document.querySelector(".hero");if(!hero)return;
    var title=hero.querySelector(".hero-title");
    if(!motionOK){title&&title.classList.add("is-ready");return}
    var media=hero.querySelector(".hero-media"),ears=hero.querySelector(".hero-ears");
    if(!media){title&&title.classList.add("is-ready");return}
    var tl=G.timeline({delay:.15});
    document.fonts.ready.then(function(){
      title.classList.add("is-ready");
      var lines=title.querySelectorAll(".line > span");
      tl.from(hero.querySelectorAll(".hero-top > *"),{yPercent:100,opacity:0,duration:.9,stagger:.08})
        .fromTo(media,{clipPath:"inset(12% 30% 50% 30% round 200px)"},{clipPath:"inset(0% 0% 0% 0% round 3px)",duration:1.8,ease:"expo.inOut"},.15)
        .from(media.querySelector(".layer"),{scale:1.35,duration:2.2,ease:"expo.out"},.15)
        .from(lines,{yPercent:115,rotate:2,duration:1.3,stagger:.1,ease:"expo.out"},.55)
        .from(hero.querySelectorAll(".hero-foot > *"),{y:30,opacity:0,duration:1,stagger:.1},1.1)
        .from(document.querySelector(".mast .wrap"),{y:-20,opacity:0,duration:.9},1.0);
      if(ears){
        var p=ears.querySelectorAll("path");
        tl.fromTo(p,{drawSVG:"0%"},{drawSVG:"100%",duration:1.2,stagger:.12,ease:"power2.inOut"},1.2);
      }
      // layered parallax: media, title and ears at different speeds
      G.to(media.querySelector(".layer"),{yPercent:10,ease:"none",scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}});
      G.to(title,{yPercent:-18,ease:"none",scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}});
      if(ears)G.to(ears,{yPercent:-60,rotate:-8,ease:"none",scrollTrigger:{trigger:hero,start:"top top",end:"bottom top",scrub:true}});
    });
  }

  /* ------------------------------------------------------------------ Home: pinned chapters */
  function initChapters(){
    var sec=document.querySelector(".chapters");if(!sec)return;
    var chaps=[].slice.call(sec.querySelectorAll(".chap")),frames=[].slice.call(sec.querySelectorAll(".chap-media .frame")),dots=[].slice.call(sec.querySelectorAll(".chap-progress i"));
    var desktop=window.matchMedia("(min-width:821px)").matches;
    if(!motionOK||!desktop){sec.classList.add("no-pin");return}
    var cur=-1;
    function show(i){
      if(i===cur)return;var prev=cur;cur=i;
      chaps.forEach(function(c,j){c.classList.toggle("is-on",j===i);c.setAttribute("aria-hidden",j===i?"false":"true")});
      dots.forEach(function(d,j){d.classList.toggle("is-on",j===i)});
      var f=frames[i];
      frames.forEach(function(fr,j){if(j!==i&&j!==prev){fr.classList.remove("is-on");G.set(fr,{clipPath:"inset(100% 0 0 0)"})}});
      f.classList.add("is-on");
      var dir=prev<i?1:-1;
      G.fromTo(f,{clipPath:dir>0?"inset(100% 0 0 0)":"inset(0 0 100% 0)",zIndex:2},{clipPath:"inset(0% 0 0% 0)",duration:1.1,ease:"expo.inOut",onComplete:function(){frames.forEach(function(fr,j){if(j!==i){fr.classList.remove("is-on")}});G.set(f,{zIndex:1})}});
      G.fromTo(f.querySelector("video,img"),{scale:1.15},{scale:1,duration:1.6,ease:"expo.out"});
      var v=f.querySelector("video");if(v&&!SD.reduced()){if(!v.src)v.src=v.dataset.src;v.play().catch(function(){})}
      frames.forEach(function(fr,j){if(j!==i){var vv=fr.querySelector("video");if(vv)vv.pause()}});
      var c=chaps[i];
      G.fromTo(c.querySelectorAll(".n,h3,p,li,.link-arrow"),{y:40,opacity:0},{y:0,opacity:1,duration:1,stagger:.05,ease:"expo.out"});
    }
    ST.create({trigger:sec,start:"top top",end:"+="+(chaps.length*90)+"%",pin:sec.querySelector(".chapters-inner"),pinSpacing:true,
      onUpdate:function(self){var i=Math.min(chaps.length-1,Math.floor(self.progress*chaps.length*0.9999));show(i)}});
    show(0);
  }

  /* ------------------------------------------------------------------ Horizontal gallery */
  function initHGallery(){
    document.querySelectorAll(".hgal").forEach(function(g){
      var track=g.querySelector(".hgal-track");
      if(!motionOK||window.innerWidth<821){g.classList.add("no-pin");g.closest("section").classList.add("no-pin");return}
      function dist(){return track.scrollWidth-window.innerWidth}
      G.to(track,{x:function(){return -dist()},ease:"none",scrollTrigger:{trigger:g,start:"center center",end:function(){return "+="+dist()},pin:g.closest(".hgal-pin")||g,scrub:.8,invalidateOnRefresh:true,anticipatePin:1}});
      track.querySelectorAll(".hgal-card").forEach(function(card){
        var img=card.querySelector(".i2v");
        G.fromTo(img,{clipPath:"inset(6% 6% 6% 6%)"},{clipPath:"inset(0% 0% 0% 0%)",ease:"none",scrollTrigger:{trigger:card,containerAnimation:ST.getAll().slice(-1)[0].animation,start:"left right",end:"left 60%",scrub:true}});
      });
    });
  }

  /* ------------------------------------------------------------------ Accordions (spring height) */
  function initAccordions(){
    document.querySelectorAll(".acc-btn").forEach(function(btn){
      var panel=document.getElementById(btn.getAttribute("aria-controls"));if(!panel)return;
      panel.hidden=true;panel.style.height="0px";
      var sp=new Spring({from:0,k:260,c:24,onUpdate:function(x){panel.style.height=Math.max(0,x).toFixed(1)+"px"}});
      btn.addEventListener("click",function(){
        var open=btn.getAttribute("aria-expanded")==="true";
        btn.setAttribute("aria-expanded",open?"false":"true");
        var h=panel.firstElementChild.offsetHeight;
        if(SD.reduced()){panel.hidden=open;panel.style.height=open?"0px":"auto";return}
        if(!open){panel.hidden=false;sp.x=0;sp.to(h);setTimeout(function(){if(btn.getAttribute("aria-expanded")==="true"&&!sp.raf)panel.style.height="auto"},900)}
        else{sp.x=panel.offsetHeight;sp.to(0);setTimeout(function(){if(btn.getAttribute("aria-expanded")==="false")panel.hidden=true},700)}
      });
    });
  }

  /* ------------------------------------------------------------------ Article TOC */
  function initTOC(){
    var toc=document.querySelector(".toc");if(!toc)return;
    var links=[].slice.call(toc.querySelectorAll("a[href^='#']"));
    var targets=links.map(function(a){return document.getElementById(a.hash.slice(1))}).filter(Boolean);
    var bar=toc.querySelector(".toc-progress i");
    var prose=document.querySelector(".prose");
    function update(){
      var y=window.scrollY+window.innerHeight*.3,active=0;
      targets.forEach(function(t,i){if(t.getBoundingClientRect().top+window.scrollY<=y)active=i});
      links.forEach(function(a,i){a.classList.toggle("is-active",i===active);if(i===active)a.setAttribute("aria-current","true");else a.removeAttribute("aria-current")});
      if(bar&&prose){var r=prose.getBoundingClientRect();var p=Math.min(1,Math.max(0,(window.innerHeight*.3-r.top)/r.height));bar.style.transform="scaleX("+p+")"}
    }
    window.addEventListener("scroll",function(){requestAnimationFrame(update)},{passive:true});update();
    links.forEach(function(a){a.addEventListener("click",function(){var d=toc.querySelector("details");if(d&&window.innerWidth<980)d.open=false})});
  }

  /* ------------------------------------------------------------------ Page transitions */
  var nativeVT=("onpagereveal" in window)&&CSS.supports&&CSS.supports("view-transition-name","none");
  function initTransitions(){
    if(nativeVT){
      // Native cross-document view transitions handle cinematic + shared-element moves.
      window.addEventListener("pagereveal",function(e){if(e.viewTransition&&SD.reduced())e.viewTransition.skipTransition()});
      return;
    }
    if(!motionOK)return;
    var cur=document.createElement("div");cur.className="curtain";cur.setAttribute("aria-hidden","true");
    cur.innerHTML=document.querySelector(".brand-mark")?document.querySelector(".brand-mark").outerHTML:"";
    document.body.appendChild(cur);
    // lift on arrival
    if(sessionStorage.getItem("sdfl-curtain")==="1"){
      sessionStorage.removeItem("sdfl-curtain");
      G.set(cur,{yPercent:0});G.to(cur,{yPercent:-101,duration:.9,ease:"expo.inOut",delay:.05});
    }
    document.addEventListener("click",function(e){
      var a=e.target.closest("a");if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==="_blank"||a.hasAttribute("download"))return;
      if(a.origin!==location.origin||(a.pathname===location.pathname&&a.hash))return;
      if(!/\.html$|\/$/.test(a.pathname))return;
      e.preventDefault();
      try{sessionStorage.setItem("sdfl-curtain","1")}catch(_){}
      G.fromTo(cur,{yPercent:101},{yPercent:0,duration:.6,ease:"expo.inOut",onComplete:function(){location.href=a.href}});
    });
    window.addEventListener("pageshow",function(ev){if(ev.persisted)G.set(cur,{yPercent:101})});
  }

  /* ------------------------------------------------------------------ Consent banner */
  function initConsent(){
    var box=document.getElementById("consent");if(!box)return;
    var prefToggle=box.querySelector("#pref-tools");
    function openBox(showPrefs){
      var c=SD.consent.read();prefToggle.checked=c?!!c.preferences:false;
      box.classList.add("is-open");box.classList.toggle("show-prefs",!!showPrefs);
      if(motionOK)G.fromTo(box,{y:40,opacity:0},{y:0,opacity:1,duration:.8,ease:"expo.out"});
    }
    function closeBox(msg){
      function done(){box.classList.remove("is-open","show-prefs")}
      if(motionOK)G.to(box,{y:30,opacity:0,duration:.4,ease:"power2.in",onComplete:done});else done();
      if(msg)SD.toast(msg);
    }
    box.querySelector("[data-consent=all]").addEventListener("click",function(){SD.consent.save(true);closeBox("Saved. Your tools will remember your progress on this device.")});
    box.querySelector("[data-consent=essential]").addEventListener("click",function(){SD.consent.save(false);closeBox("Saved. Nothing optional will be stored.")});
    box.querySelector("[data-consent=prefs]").addEventListener("click",function(){box.classList.toggle("show-prefs");var b=this;b.setAttribute("aria-expanded",box.classList.contains("show-prefs")?"true":"false")});
    box.querySelector("[data-consent=save]").addEventListener("click",function(){SD.consent.save(prefToggle.checked);closeBox(prefToggle.checked?"Preferences saved.":"Saved. Optional storage is off.")});
    document.querySelectorAll("[data-open-consent]").forEach(function(b){b.addEventListener("click",function(e){e.preventDefault();openBox(true);box.querySelector("#pref-tools").focus()})});
    if(!SD.consent.read())setTimeout(function(){openBox(false)},motionOK?1600:0);
  }

  /* ------------------------------------------------------------------ Motion toggle (footer) */
  function initMotionToggle(){
    document.querySelectorAll("[data-motion-toggle]").forEach(function(b){
      b.setAttribute("aria-pressed",SD.reduced()?"true":"false");
      b.textContent=SD.reduced()?"Motion: reduced (turn on)":"Motion: on (reduce)";
      b.addEventListener("click",function(){
        var next=SD.reduced()?"full":"reduce";rawSet("sdfl-motion",next);location.reload();
      });
    });
  }

  /* ------------------------------------------------------------------ Boot */
  function boot(){
    initConsent();initMast();initBrand();initVideos();springButtons();initAccordions();initTOC();initMotionToggle();initTransitions();
    if(hasG){initHero();initTextReveals();initMasks();initParallax();initDraw();initTimeline();initChapters();initHGallery();}
    else{document.querySelectorAll("[data-split],.hero-title").forEach(function(e){e.classList.add("is-ready")});document.querySelectorAll(".mask.reveal").forEach(function(m){m.style.clipPath="none"})}
    document.dispatchEvent(new CustomEvent("sd:ready"));
    if(ST){window.addEventListener("load",function(){ST.refresh()});document.fonts&&document.fonts.ready.then(function(){ST.refresh()})}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",boot);else boot();
})();
