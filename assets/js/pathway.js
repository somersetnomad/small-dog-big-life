/* Care pathway navigator: puppy / adult / senior */
(function(){
  "use strict";
  var root=document.getElementById("pathway");if(!root)return;
  var STAGES={
    puppy:{n:"Puppy",range:"8 weeks – 12 months",cards:{
      "Vet care":["Vaccinations at about 8 and 10–12 weeks, booster at 12 months","Worming every 2 weeks to 12 weeks, then monthly to 6 months","Flea and lungworm prevention dosed by weight","Check for retained baby teeth at 6–7 months","Discuss neutering timing with your vet"],
      "Feeding":["Complete puppy food, 3–4 small meals a day","Never skip meals: toy puppies risk low blood sugar","Weigh portions and adjust as they grow","Move to adult food around 12 months, gradually"],
      "Exercise & play":["Short, gentle outings and lots of sleep","No jumping from furniture or arms","Carry to see the world before vaccinations finish","Daily 2–5 minute training games"],
      "Grooming & teeth":["Introduce brushing the coat and teeth from the first week","Handle paws, ears and mouth daily with treats","Trim nails little and often"],
      "Watch for":["Weakness, trembling or wobbliness (low blood sugar): call your vet now","Diarrhoea or vomiting: puppies dehydrate fast","A domed head, circling or seizures","Skipping on a back leg"]}},
    adult:{n:"Adult",range:"About 1 – 8 years",cards:{
      "Vet care":["Annual health check and boosters","Year-round flea, worm and lungworm plan","Dental check every visit; professional clean every 1–2 years for many","Microchip scanned annually"],
      "Feeding":["Complete adult food, two meals a day","Most need 150–250 kcal a day: use the estimator","Treats under 10% of calories","Body condition check every two weeks"],
      "Exercise & play":["Two outings a day, often 20–30 minutes each","Harness for the lead, coat in cold or wet weather","Scent games and puzzle feeders","Keep training: it builds confidence"],
      "Grooming & teeth":["Daily tooth brushing","Brush smooth coats weekly, long coats 2–3 times a week","Nails every 2–4 weeks","Wipe tear stains daily if needed"],
      "Watch for":["A honking cough, especially on the lead","Faster breathing at rest or tiring on walks","Skipping, stiffness or reluctance to jump","Bad breath, dropping food, pawing at the mouth"]}},
    senior:{n:"Senior",range:"About 8 years and beyond",cards:{
      "Vet care":["Health checks every six months","Blood and urine tests as your vet advises","Heart monitoring if a murmur is found","Pain relief for stiffness: ask, don’t assume it’s age"],
      "Feeding":["Senior or adult food, possibly softer textures","Watch weight in both directions","Monitor thirst: drinking more can signal kidney or hormone problems","Smaller, more frequent meals if appetite dips"],
      "Exercise & play":["Shorter, more frequent walks","A buggy or sling for longer outings","Gentle scent games for an active mind","Warm-up time before walks in cold weather"],
      "Grooming & teeth":["Keep brushing teeth, gently around sore spots","Nails grow faster as activity drops: trim more often","Check for new lumps while grooming","Keep warm and dry after baths"],
      "Watch for":["Resting breathing over about 30 breaths a minute","Night-time wandering, staring or confusion","Accidents indoors after years of being clean","Weight loss, lumps, coughing or fainting"]}}
  };
  var order=["puppy","adult","senior"];
  var saved=window.SD&&SD.store.get("pathway")||{};
  var cur=saved.stage||"adult";
  var G=window.gsap,Flip=window.Flip,reduced=function(){return window.SD&&SD.reduced()};
  root.innerHTML='<div class="tool-bar"><span class="kicker">Care pathway navigator</span><span class="ui" style="font-size:var(--s--1);color:var(--ink-3)" id="pw-range"></span></div>'+
    '<div class="path-age"><div class="field"><label for="pw-y">Dog’s age: years</label><input class="input" id="pw-y" inputmode="numeric" placeholder="e.g. 3" value="'+(saved.y!=null?saved.y:"")+'"></div><div class="field"><label for="pw-m">and months</label><input class="input" id="pw-m" inputmode="numeric" placeholder="0–11" value="'+(saved.m!=null?saved.m:"")+'"></div><p class="err" id="pw-err" role="alert" hidden style="margin:0 0 .8rem"></p></div>'+
    '<div class="path-tabs" role="tablist" aria-label="Life stage"><span class="pill" aria-hidden="true"></span>'+order.map(function(k){return '<button role="tab" id="tab-'+k+'" aria-controls="pw-panel" aria-selected="'+(k===cur)+'" tabindex="'+(k===cur?0:-1)+'" data-s="'+k+'">'+STAGES[k].n+'</button>'}).join("")+'</div>'+
    '<div id="pw-panel" role="tabpanel" aria-labelledby="tab-'+cur+'"><p id="pw-focus" style="font-family:var(--display);font-size:var(--s2);line-height:1.15;margin:0 0 1rem"></p><div class="path-cards"></div></div>';
  var pill=root.querySelector(".pill"),cards=root.querySelector(".path-cards");
  var pillSpring=window.SD?new SD.Spring({from:0,k:300,c:22,onUpdate:function(x){pill.style.transform="translateX("+x+"px)"}}):null;
  function movePill(instant){var b=root.querySelector('[data-s="'+cur+'"]');pill.style.width=b.offsetWidth+"px";var x=b.offsetLeft-4;if(instant||!pillSpring||reduced()){pill.style.transform="translateX("+x+"px)";if(pillSpring)pillSpring.x=x}else pillSpring.to(x)}
  function focusLine(){
    var y=parseFloat(root.querySelector("#pw-y").value),m=parseFloat(root.querySelector("#pw-m").value)||0;
    if(isNaN(y))return {puppy:"Puppyhood is about safety, warmth and gentle, varied experiences.",adult:"The adult years are about maintenance: teeth, weight and a busy mind.",senior:"The senior years are about comfort, early detection and adapting the home."}[cur];
    var months=y*12+m;
    if(months<3)return "Right now: settling in, regular meals, warmth, and the second vaccination.";
    if(months<4)return "Right now: peak socialisation. Lots of short, happy new experiences.";
    if(months<7)return "Right now: teething. Offer safe chews and keep up brushing practice.";
    if(months<12)return "Right now: adolescence. Keep training kind and consistent, and check baby teeth have gone.";
    if(months<24)return "Right now: first booster done? Switch to adult food and keep building confidence.";
    if(months<96)return "Right now: maintenance. Daily teeth, lean body, annual check.";
    if(months<144)return "Right now: twice-yearly checks and a softer, warmer home set-up.";
    return "Right now: comfort first. Track good and bad days, and keep pain well controlled.";
  }
  function show(k,animate){
    var st=animate&&Flip&&!reduced()?Flip.getState(cards.children):null;
    cur=k;
    root.querySelectorAll("[role=tab]").forEach(function(b){var on=b.dataset.s===k;b.setAttribute("aria-selected",on);b.tabIndex=on?0:-1});
    root.querySelector("#pw-panel").setAttribute("aria-labelledby","tab-"+k);
    root.querySelector("#pw-range").textContent=STAGES[k].range;
    root.querySelector("#pw-focus").textContent=focusLine();
    var c=STAGES[k].cards;
    cards.innerHTML=Object.keys(c).map(function(h){return '<div class="path-card" data-flip-id="'+h+'"><h4>'+h+'</h4><ul>'+c[h].map(function(i){return "<li>"+i+"</li>"}).join("")+'</ul></div>'}).join("");
    movePill(!animate);
    if(st){Flip.from(st,{duration:.7,ease:"expo.out",targets:cards.children});G.from(cards.querySelectorAll("li"),{opacity:0,x:12,duration:.5,stagger:.015,delay:.15})}
    save();
  }
  function save(){if(window.SD)SD.store.set("pathway",{stage:cur,y:root.querySelector("#pw-y").value===""?null:+root.querySelector("#pw-y").value,m:root.querySelector("#pw-m").value===""?null:+root.querySelector("#pw-m").value})}
  root.querySelectorAll("[role=tab]").forEach(function(b){b.addEventListener("click",function(){show(b.dataset.s,true)})});
  root.querySelector("[role=tablist]").addEventListener("keydown",function(e){var i=order.indexOf(cur);if(e.key==="ArrowRight"||e.key==="ArrowLeft"){e.preventDefault();var n=order[(i+(e.key==="ArrowRight"?1:2))%3];show(n,true);root.querySelector('[data-s="'+n+'"]').focus()}});
  function fromAge(){
    var yv=root.querySelector("#pw-y").value.trim(),mv=root.querySelector("#pw-m").value.trim(),err=root.querySelector("#pw-err");
    if(yv===""&&mv===""){err.hidden=true;save();return}
    var y=yv===""?0:Number(yv),m=mv===""?0:Number(mv);
    if(isNaN(y)||y<0||y>25||isNaN(m)||m<0||m>11){err.textContent="Enter years from 0 to 25 and months from 0 to 11.";err.hidden=false;return}
    err.hidden=true;var months=y*12+m;
    if(months<2){err.textContent="Puppies shouldn’t leave their mother before 8 weeks. The puppy stage is shown.";err.hidden=false}
    var k=months<12?"puppy":months<96?"adult":"senior";show(k,k!==cur);if(k===cur){root.querySelector("#pw-focus").textContent=focusLine();save()}
  }
  root.querySelector("#pw-y").addEventListener("input",fromAge);root.querySelector("#pw-m").addEventListener("input",fromAge);
  show(cur,false);
  window.addEventListener("resize",function(){movePill(true)});
  if(document.fonts)document.fonts.ready.then(function(){movePill(true)});
})();
