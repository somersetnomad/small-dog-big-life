/* Household suitability questionnaire */
(function(){
  "use strict";
  var DIMS={time:"Time & company",space:"Space & safety",children:"Children",others:"Other animals",budget:"Budget",experience:"Experience & training",lifestyle:"Climate & lifestyle"};
  var LINKS={time:["behaviour.html#alone","Building confidence alone"],space:["checklist.html","Home preparation checklist"],children:["suitability.html#children","Families with children"],others:["suitability.html#pets","Multi-pet households"],budget:["costs.html#calculator","Budget calculator"],experience:["behaviour.html","Behaviour & training guide"],lifestyle:["care.html#warmth","Warmth, coats and weather"]};
  var Q=[
    {id:"alone",label:"Hours alone",dim:"time",q:"On a typical weekday, how long would the dog be on its own?",why:"Companion breeds cope poorly with long stretches alone, and small bladders need regular breaks.",opts:[
      ["Rarely more than an hour or two","Someone is usually home.",{time:100},"Someone is home most of the time, which suits a companion breed very well."],
      ["Up to about four hours","",{time:80},"Gaps of up to four hours are manageable for an adult dog, with alone-time training from day one."],
      ["Four to six hours","",{time:45},"Four to six hours alone is longer than most welfare charities advise. A midday visit from a walker, friend or neighbour would change this."],
      ["More than six hours, most days","",{time:15},"Six-plus hours alone most days is likely to cause loneliness and toilet problems. Day care or a dog walker would be essential, or this may not be the right time."]]},
    {id:"daily",label:"Daily time",dim:"time",q:"How much time could you give each day to walks, play and training?",why:"Chihuahuas don’t need long walks, but they do need daily outings, play and short training sessions.",opts:[
      ["Under 30 minutes","",{time:30,experience:40},"Under 30 minutes a day leaves little room for exercise, socialisation and training, which a young Chihuahua needs."],
      ["30 to 60 minutes","",{time:80,experience:75},"Half an hour to an hour a day covers short walks, play and a few minutes of training. That is a good baseline."],
      ["One to two hours","",{time:100,experience:90},"An hour or two a day is generous and gives plenty of room for socialisation."],
      ["More than two hours, including long hikes","",{time:90,lifestyle:60},"Plenty of time is great. If that time is mostly long hikes, remember many Chihuahuas tire after a couple of miles and need carrying or a rest."]]},
    {id:"home",label:"Type of home",dim:"space",q:"What kind of home do you live in?",why:"Chihuahuas suit small homes well. What matters is safe floors, safe stairs and easy toilet access.",opts:[
      ["Flat with a lift or on the ground floor","",{space:90},"A ground-floor or lift-access flat is close to ideal for a Chihuahua."],
      ["Flat up several flights of stairs, no lift","",{space:60},"Stairs make frequent toilet trips harder, especially for a puppy at night, and steep stairs are a fall risk. Plan how you’ll manage."],
      ["House with a secure garden","",{space:95},"A house with a garden is great, as long as fences and gates have no gaps a very small dog could squeeze through."],
      ["House without a garden","",{space:80},"No garden is fine with regular short walks, though toilet training takes more trips out."]]},
    {id:"hazards",label:"Home hazards",dim:"space",q:"How easily could you make your home safe for a very small dog?",why:"Think about high beds and sofas, open-backed stairs, balcony gaps, gaps under fences and doors that slam.",opts:[
      ["Very easily. Few hazards.","",{space:100},"Few hazards and an easy fix: good."],
      ["Some hazards, but I can fix them","Gates, ramps, mesh, door stops.",{space:80},"Some hazards that you can manage with gates, ramps, mesh and door stops."],
      ["Many hazards that are hard to change","",{space:30},"Many hazards that are hard to change put a toy dog at real risk of injury. Fix these first, or think again."]]},
    {id:"kids",label:"Children",dim:"children",q:"Which children live in, or often visit, your home?",why:"Very young children and very small dogs are a risky mix for both. Older children can be wonderful companions.",opts:[
      ["None, or only occasional visitors","",{children:100},"No young children at home makes things simpler."],
      ["Children aged 10 and over","",{children:85},"Older children can make excellent companions once they’ve learned to handle a small dog safely."],
      ["Children aged 5 to 9","",{children:55},"Children aged 5–9 can work with an adult dog of steady temperament, clear house rules and constant supervision."],
      ["Children under 5, or a baby on the way","",{children:20},"Children under five carry a real risk of injuring a Chihuahua and of being bitten. Most rescues and breeders wouldn’t place a puppy here. Consider waiting."]]},
    {id:"pets",label:"Other animals",dim:"others",q:"Which other animals share your home?",why:"Chihuahuas often live happily with cats and gentle dogs. Large, bouncy dogs and small caged pets need careful management.",opts:[
      ["None","",{others:100},"No other animals to introduce."],
      ["A calm cat","",{others:85},"Chihuahuas and calm cats often get on well. Introduce them slowly and protect the dog’s eyes from swats."],
      ["A small or gentle dog","",{others:90},"A small or gentle dog is often welcome company for a Chihuahua."],
      ["A large or boisterous dog","",{others:35},"A large, playful dog can injure a Chihuahua without meaning to. Can you supervise every interaction and separate them otherwise?"],
      ["Rabbits, guinea pigs, birds or other small pets","",{others:50},"Chihuahuas can have a strong prey drive. Small pets would need secure, permanent separation."]]},
    {id:"noise",label:"Household pace",dim:"lifestyle",q:"What is your home usually like?",why:"Chihuahuas notice everything. Busy homes are fine with a confident dog and a quiet retreat.",opts:[
      ["Quiet, with a predictable routine","",{lifestyle:95},"A calm, predictable home helps a small dog feel secure."],
      ["Some visitors and bustle","",{lifestyle:85},"Some visitors and bustle are good for socialisation, as long as the dog has a retreat."],
      ["Very busy: lots of visitors, noise or comings and goings","",{lifestyle:55},"A very busy home can overwhelm a sensitive dog. You’d need a quiet room it can retreat to, and visitors coached to let the dog approach first."]]},
    {id:"money",label:"Budget",dim:"budget",q:"Which best describes your budget for a dog?",why:"Even a small dog costs the PDSA’s minimum estimate of around £69 a month, before vet bills for illness or injury.",opts:[
      ["Comfortable: £100+ a month and £1,000+ set aside for emergencies","",{budget:100},"A comfortable monthly budget plus an emergency fund covers routine care and the unexpected."],
      ["Around £70 to £100 a month, and some savings","",{budget:75},"Around £70–100 a month covers the basics. Build an emergency fund, and choose lifetime insurance carefully."],
      ["Tight: I’d struggle with an unexpected £500 bill","",{budget:25},"A tight budget makes it hard to pay for dental work, injury or illness, which are common in toy breeds. Try the cost calculator before deciding."]]},
    {id:"exp",label:"Experience",dim:"experience",q:"What’s your experience with dogs?",why:"First-time owners can do brilliantly with a Chihuahua, especially with an adult rescue dog and good classes.",opts:[
      ["This would be my first dog","",{experience:55},"As a first-time owner, consider an adult rescue Chihuahua with a known temperament, and book reward-based classes early."],
      ["I’ve had dogs, but not small breeds","",{experience:75},"Dog experience transfers well. Adjust for gentle handling, safe lifting and slower toilet training."],
      ["I’ve lived with small or toy breeds","",{experience:100},"Experience with toy breeds is a real advantage."]]},
    {id:"train",label:"Training",dim:"experience",q:"How do you feel about training and socialising?",why:"Reward-based training and gentle socialisation are what turn a nervous small dog into a confident one.",opts:[
      ["Keen: short daily sessions and classes","",{experience:100},"Commitment to daily, reward-based training is the single best predictor of a confident Chihuahua."],
      ["Happy to do some, when there’s time","",{experience:65},"Some training helps. Aim for a few minutes a day: it adds up and prevents problems."],
      ["I’d rather not. Small dogs don’t need much.","",{experience:20},"Small dogs need training as much as big ones. Without it, fear-based barking and snapping are common."]]},
    {id:"life",label:"Outdoors & holidays",dim:"lifestyle",q:"Which describes your outdoor life and holidays?",why:"Chihuahuas feel the cold, overheat in hot weather and need a plan for when you travel.",opts:[
      ["Short walks, a coat in winter, and a sitter or dog-friendly holidays","",{lifestyle:100},"Short walks, a winter coat and a plan for holidays are exactly right."],
      ["Lots of long country walks in all weathers","",{lifestyle:60},"Long walks in all weathers can be too much for a small dog in cold, wet or hot conditions. Plan shorter routes and carry them when needed."],
      ["I’m often away and haven’t thought about care","",{lifestyle:30},"Frequent travel without a care plan is a problem for a companion breed. Line up trusted sitters or licensed boarding first."]]}
  ];

  var root=document.getElementById("quiz");if(!root)return;
  var state={step:0,answers:{},done:false};
  var saved=window.SD&&SD.store.get("quiz");
  if(saved&&saved.answers){state=saved}
  var reduced=function(){return window.SD&&SD.reduced()};
  var G=window.gsap;

  var SHAPES=["M36 6 C54 6 66 18 66 36 C66 54 54 66 36 66 C18 66 6 54 6 36 C6 18 18 6 36 6 Z",
    "M36 4 C58 4 68 14 68 36 C68 58 58 68 36 68 C14 68 4 58 4 36 C4 14 14 4 36 4 Z",
    "M14 66 L22 8 Q24 2 28 7 L36 22 L44 7 Q48 2 50 8 L58 66 Z",
    "M36 4 L66 26 L56 66 L16 66 L6 26 Z"];
  function blob(i){return '<svg class="quiz-blob" viewBox="0 0 72 72" aria-hidden="true"><path fill="currentColor" opacity=".9" d="'+SHAPES[i%SHAPES.length]+'"/><text x="36" y="44" text-anchor="middle" font-family="Instrument Serif,serif" font-size="24" fill="var(--paper)">'+(i+1)+'</text></svg>'}

  function persist(){if(window.SD){var ok=SD.store.set("quiz",state);updateSaveState(ok)}}
  function updateSaveState(){
    var el=root.querySelector(".save-state");if(!el)return;
    var on=window.SD&&SD.consent.prefsAllowed();
    el.classList.toggle("on",on);
    el.querySelector("span:last-child").innerHTML=on?"Saving on this device":'Not saved · <button type="button" class="linklike" data-open-consent style="all:unset;cursor:pointer;text-decoration:underline">turn on saving</button>';
    var b=el.querySelector("[data-open-consent]");if(b)b.addEventListener("click",function(){document.querySelector("[data-open-consent]").click()});
  }
  document.addEventListener("sd:consent",function(){if(SD.consent.prefsAllowed())persist();updateSaveState()});

  function bar(){return '<div class="tool-bar"><span class="kicker">Household questionnaire</span><span class="save-state"><span class="led" aria-hidden="true"></span><span></span></span></div>'}
  function side(){
    return '<aside class="quiz-side" aria-label="Progress"><p class="kicker" style="margin-bottom:.6rem">'+Object.keys(state.answers).length+' of '+Q.length+' answered</p><ol>'+Q.map(function(q,i){
      var done=state.answers[q.id]!==undefined,cur=!state.done&&i===state.step;
      var tick=done?'<svg class="tick" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7"/></svg>':'<svg class="tick" viewBox="0 0 14 14" aria-hidden="true"><circle cx="7" cy="7" r="3" fill="none" stroke="currentColor"/></svg>';
      var label=q.label;
      return '<li class="'+(done?"done ":"")+(cur?"cur":"")+'">'+tick+(done||cur?'<button type="button" data-goto="'+i+'"'+(cur?' aria-current="step"':"")+'>'+(i+1)+'. '+label+'</button>':'<span>'+(i+1)+'. '+label+'</span>')+'</li>'}).join("")+'</ol></aside>';
  }
  function renderStep(dir){
    var i=state.step,q=Q[i],cur=state.answers[q.id];
    root.innerHTML=bar()+'<div class="quiz"><div class="quiz-main"><div class="quiz-step"><form novalidate>'+blob(i)+
      '<p class="kicker">Question '+(i+1)+' of '+Q.length+' · '+DIMS[q.dim]+'</p>'+
      '<fieldset style="border:0;padding:0;margin:0"><legend><h3 tabindex="-1">'+q.q+'</h3></legend><p class="why">'+q.why+'</p><div class="choice" role="radiogroup">'+
      q.opts.map(function(o,j){return '<label><input type="radio" name="a" value="'+j+'"'+(cur===j?" checked":"")+'><span>'+o[0]+(o[1]?'<small>'+o[1]+'</small>':"")+'</span></label>'}).join("")+
      '</div></fieldset><p class="err" role="alert" hidden>Choose the answer closest to your situation to continue.</p><div class="quiz-nav">'+
      (i>0?'<button type="button" class="btn ghost" data-back>Back</button>':"")+
      '<button type="submit" class="btn accent">'+(i===Q.length-1?"See my reading":"Next")+'</button>'+
      (Object.keys(state.answers).length?'<button type="button" class="btn ghost small" data-reset style="margin-left:auto">Start again</button>':"")+
      '</div></form></div></div>'+side()+'</div>';
    updateSaveState();
    var form=root.querySelector("form"),h=root.querySelector("h3");
    form.addEventListener("submit",function(e){e.preventDefault();var v=form.querySelector("input:checked");
      if(!v){var er=form.querySelector(".err");er.hidden=false;return}
      state.answers[q.id]=+v.value;
      if(i<Q.length-1){state.step=i+1;persist();renderStep(1)}else{state.done=true;persist();renderResult()}
    });
    form.addEventListener("change",function(){form.querySelector(".err").hidden=true});
    var back=root.querySelector("[data-back]");if(back)back.addEventListener("click",function(){state.step=i-1;persist();renderStep(-1)});
    wireCommon();
    if(window.SD)SD.springButtons(root);
    if(G&&!reduced()){
      var morph=window.MorphSVGPlugin;
      var path=root.querySelector(".quiz-blob path");
      if(morph&&i>0)G.from(path,{morphSVG:SHAPES[(i-1)%SHAPES.length],duration:.9,ease:"elastic.out(1,.6)"});
      G.from(root.querySelectorAll(".quiz-step .kicker, .quiz-step h3, .quiz-step .why, .choice label, .quiz-nav"),{x:dir===-1?-40:40,opacity:0,duration:.7,stagger:.04,ease:"expo.out"});
    }
    if(dir)h.focus({preventScroll:true});
  }
  function compute(){
    var sums={},counts={},notes={};
    Object.keys(DIMS).forEach(function(d){sums[d]=0;counts[d]=0;notes[d]=[]});
    Q.forEach(function(q){var a=state.answers[q.id];if(a===undefined)return;var o=q.opts[a];
      Object.keys(o[2]).forEach(function(d){sums[d]+=o[2][d];counts[d]++});notes[q.dim].push(o[3]);
      Object.keys(o[2]).forEach(function(d){if(d!==q.dim&&o[3]&&notes[d].indexOf(o[3])<0&&o[2][d]<70)notes[d].push(o[3])});
    });
    var scores={};Object.keys(DIMS).forEach(function(d){scores[d]=counts[d]?Math.round(sums[d]/counts[d]):null});
    return {scores:scores,notes:notes};
  }
  function verdict(s){
    var vals=Object.keys(s).map(function(k){return s[k]}).filter(function(v){return v!==null});
    var min=Math.min.apply(null,vals),avg=vals.reduce(function(a,b){return a+b},0)/vals.length;
    var lows=Object.keys(s).filter(function(k){return s[k]!==null&&s[k]<40});
    if(lows.length>=2)return ["Not the right time, for now","Two or more areas would put a Chihuahua’s welfare or safety at real risk. That can change: the notes below explain what would need to be different."];
    if(lows.length===1)return ["Possible, with one important change",DIMS[lows[0]]+" is a real obstacle at the moment. Everything else looks workable, so tackle that first."];
    if(avg>=82&&min>=60)return ["A strong match","Your household offers what a Chihuahua needs. The notes below are refinements, not obstacles."];
    return ["A good match, with planning","Nothing here rules a Chihuahua out, but a few areas need thought before the dog arrives."];
  }
  function renderResult(load){
    var r=compute(),v=verdict(r.scores);
    var rows=Object.keys(DIMS).map(function(d){var s=r.scores[d];if(s===null)return"";var cls=s>=70?"":s>=45?"mid":"low";var word=s>=70?"Good":s>=45?"Plan for it":"Obstacle";
      return '<div class="score-row"><span><strong>'+DIMS[d]+'</strong></span><div class="bar" role="img" aria-label="'+DIMS[d]+': '+word+'"><i class="'+cls+'" style="width:'+s+'%"></i></div><span style="font-size:var(--s--1);font-weight:600">'+word+'</span></div>'}).join("");
    var det=Object.keys(DIMS).map(function(d){if(r.scores[d]===null)return"";return '<details><summary>'+DIMS[d]+': why</summary><ul style="margin:.6rem 0 .4rem;padding-left:1.1rem">'+r.notes[d].map(function(n){return'<li style="margin-bottom:.3rem">'+n+'</li>'}).join("")+'</ul><a class="link-arrow" href="'+LINKS[d][0]+'">'+LINKS[d][1]+'</a></details>'}).join("");
    root.innerHTML=bar()+'<div class="quiz"><div class="quiz-main quiz-result"><svg class="quiz-blob" viewBox="0 0 72 72" aria-hidden="true"><path fill="currentColor" d="'+SHAPES[2]+'"/></svg><p class="kicker">Your reading</p><h3 class="verdict" tabindex="-1">'+v[0]+'</h3><p style="max-width:56ch">'+v[1]+'</p><div style="margin:1.4rem 0">'+rows+'</div><h4 style="font-family:var(--ui);margin:1.4rem 0 .4rem">The reasons, area by area</h4>'+det+
      '<div class="quiz-nav" style="margin-top:1.6rem"><a class="btn accent" href="acquire.html">Next: finding the right dog {{a}}</a><button type="button" class="btn ghost" data-copy>Copy summary</button><button type="button" class="btn ghost" data-print>Print</button><button type="button" class="btn ghost" data-reset>Start again</button></div>'+
      '<p style="font-size:var(--s--1);color:var(--ink-3);margin-top:1rem">This reading is a prompt for thinking, not a judgement. Rescue organisations and breeders will ask similar questions; the best ones will be glad you’ve thought about them.</p></div>'+side()+'</div>';
    root.innerHTML=root.innerHTML.replace("{{a}}",'<svg class="arrow" viewBox="0 0 16 10" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M0 5h14M10 1l4 4-4 4"/></svg>');
    updateSaveState();wireCommon();if(window.SD)SD.springButtons(root);
    root.querySelector("[data-copy]").addEventListener("click",function(){
      var txt="Would a Chihuahua suit us? — "+v[0]+"\n"+v[1]+"\n\n"+Object.keys(DIMS).map(function(d){return DIMS[d]+": "+(r.scores[d]>=70?"Good":r.scores[d]>=45?"Plan for it":"Obstacle")+"\n - "+r.notes[d].join("\n - ")}).join("\n\n")+"\n\nsmalldog.noorintelligence.tech/suitability.html";
      (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){SD.toast("Summary copied")}).catch(function(){SD.toast("Couldn’t copy — try Print instead")});
    });
    root.querySelector("[data-print]").addEventListener("click",function(){window.print()});
    var h=root.querySelector(".verdict");if(!load)h.focus({preventScroll:false});
    if(G&&!reduced()){
      if(window.MorphSVGPlugin)G.from(root.querySelector(".quiz-blob path"),{morphSVG:SHAPES[0],duration:1.2,ease:"elastic.out(1,.5)"});
      G.from(root.querySelectorAll(".bar i"),{scaleX:0,duration:1.4,stagger:.08,ease:"expo.out",delay:.2});
      G.from(root.querySelectorAll(".kicker, .verdict, .quiz-result > p, .score-row"),{y:24,opacity:0,stagger:.05,duration:.9});
    }
  }
  function wireCommon(){
    root.querySelectorAll("[data-goto]").forEach(function(b){b.addEventListener("click",function(){state.step=+b.dataset.goto;state.done=false;persist();renderStep(1)})});
    root.querySelectorAll("[data-reset]").forEach(function(b){b.addEventListener("click",function(){state={step:0,answers:{},done:false};if(window.SD)SD.store.del("quiz");renderStep(-1);SD.toast("Answers cleared")})});
  }
  function start(){if(state.done&&Object.keys(state.answers).length===Q.length)renderResult(true);else renderStep(0)}
  if(window.SD)start();else document.addEventListener("sd:ready",start);
})();
