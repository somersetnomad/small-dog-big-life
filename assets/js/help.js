/* Guide index: search + topic filter with FLIP layout transitions */
(function(){
  "use strict";
  var grid=document.getElementById("gindex");if(!grid)return;
  var G=[
    ["discover","discover.html#origins","History: Toltec and Aztec roots","Techichi, Colima dogs and what genetics says.","history aztec toltec mexico origin"],
    ["discover","discover.html#heads","Apple head and deer head","What the terms mean, and the molera.","apple deer head skull molera fontanelle teacup"],
    ["discover","discover.html#body","Size, coat and colour","Smooth and long coats, weight, merle.","coat colour weight size merle smooth long hypoallergenic allergy"],
    ["discover","discover.html#lifespan","How long do Chihuahuas live?","What the UK data shows.","lifespan age life expectancy longevity"],
    ["discover","discover.html#temperament","Temperament","Alert, loyal, opinionated, and why fear looks like aggression.","temperament personality aggression character"],
    ["discover","suitability.html#children","Chihuahuas and children","Honest advice by age.","children kids baby toddler family"],
    ["discover","suitability.html#pets","Cats, dogs and small pets","Living with other animals.","cats dogs pets rabbit multi"],
    ["discover","suitability.html#flats","Flats and renting","Noise, stairs, balconies and tenants’ rights.","flat apartment renting landlord tenant balcony"],
    ["discover","suitability.html#working","Working owners","Time alone, walkers and day care.","work alone hours day care walker"],
    ["discover","suitability.html#older","Older owners","Trips, lifespan and planning ahead.","older elderly retired senior owner"],
    ["tools","suitability.html#questionnaire","Questionnaire: would a Chihuahua suit us?","Eleven questions, seven dimensions.","quiz questionnaire suitability test"],
    ["prepare","acquire.html#rescue","Adopting from a rescue","Where to look and what to expect.","rescue adopt adoption rehome charity"],
    ["prepare","acquire.html#breeders","Responsible breeders and Lucy’s Law","Licensing, the Health Standard and Assured Breeders.","breeder kennel club assured licence lucy puppy buy"],
    ["prepare","acquire.html#health-tests","Health tests for parents","Patellas, hearts and CM/SM MRI.","health test patella heart mri chiari syringomyelia"],
    ["prepare","acquire.html#warning-signs","Puppy farm warning signs","Walk away if you see these.","puppy farm warning signs scam teacup"],
    ["prepare","acquire.html#scams","Online puppy scams","Deposits, fake adverts, Action Fraud.","scam fraud deposit online advert"],
    ["prepare","law.html#microchip","Microchipping law","Chip by eight weeks; keep details current.","microchip chip database law fine"],
    ["prepare","law.html#collar","Collar and tag rules","The Control of Dogs Order 1992 and harnesses.","collar tag harness id law"],
    ["prepare","law.html#travel","Taking your dog abroad","Animal Health Certificates and pet passports.","travel abroad passport ahc rabies holiday eu"],
    ["prepare","law.html#public","Parks, PSPOs and the countryside","Leads, fouling and livestock.","park lead fouling countryside livestock pspo"],
    ["prepare","costs.html#overview","What a Chihuahua costs","PDSA estimates and real-world budgets.","cost money price budget"],
    ["tools","costs.html#calculator","Budget calculator","Every assumption editable.","calculator budget cost money"],
    ["prepare","costs.html#insurance","Choosing pet insurance","Lifetime, maximum benefit, time-limited.","insurance lifetime policy"],
    ["tools","checklist.html#checklist","Home preparation checklist","Room by room, saved on your device.","checklist home prepare puppy proof"],
    ["prepare","checklist.html#first-48","The first 48 hours","Arrival, first night, first meals.","first night arrival settling"],
    ["live","care.html#feeding","How much to feed","Calories and a feeding estimator.","food feeding calories diet weight kibble"],
    ["live","care.html#body-condition","Body condition score","Is my dog the right weight?","weight obese fat thin body condition"],
    ["live","care.html#walks","Walks and harnesses","Distance, harness, big dogs.","walk exercise harness lead"],
    ["live","care.html#grooming","Coat, nails and ears","Brushing, bathing, nail trims.","groom brush bath nails ears"],
    ["live","care.html#eyes","Tear stains and eye care","Daily wiping and warning signs.","tear stain eye"],
    ["live","care.html#teeth","Brushing teeth","A three-week plan.","teeth tooth brushing dental"],
    ["live","care.html#warmth","Coats, cold and heat","Thermoregulation in a small dog.","cold coat winter warm heat summer shiver"],
    ["live","behaviour.html#confidence","Building confidence","Four paws on the ground.","confidence fear nervous shy"],
    ["live","behaviour.html#toilet","Toilet training","Patient routines for small bladders.","toilet house training potty accident"],
    ["live","behaviour.html#handling","How to lift a Chihuahua","Illustrated two-hand lift.","lift pick up handling carry hold"],
    ["live","behaviour.html#vet-ready","Vet visits and muzzle training","Handling practice step by step.","vet muzzle handling groomer"],
    ["live","behaviour.html#alone","Separation confidence","A five-step pathway.","alone separation anxiety leave"],
    ["live","behaviour.html#barking","Barking","Why it happens and what helps.","bark barking noise neighbours"],
    ["health","health.html#prevention","Vaccines, parasites, neutering","Including lungworm.","vaccine vaccination flea worm lungworm tick neuter"],
    ["health","health.html#conditions","Breed-related conditions","Teeth, knees, heart, windpipe and more.","condition disease patella heart trachea hypoglycaemia hydrocephalus"],
    ["tools","health.html#navigator","Care pathway navigator","What matters at your dog’s age.","age stage puppy adult senior navigator"],
    ["health","health.html#puppy","Puppy milestones","8 weeks to 12 months.","puppy milestones teething"],
    ["health","health.html#senior","Senior care","Adapting home and health checks.","senior old age elderly dog dementia arthritis"],
    ["health","health.html#end-of-life","End of life and grief","Quality of life, saying goodbye, support.","euthanasia end of life grief bereavement"],
    ["urgent","help.html#urgent","Phone the vet now","Emergency signs.","emergency urgent vet now collapse breathing"],
    ["urgent","help.html#poisoning","Suspected poisoning","Animal PoisonLine 01202 509000.","poison toxic chocolate grapes xylitol"],
    ["urgent","help.html#first-aid","First aid basics","Bleeding, falls, seizures, heatstroke.","first aid bleeding fall seizure choking"]
  ];
  var LABEL={discover:"Discover",prepare:"Prepare",live:"Live together",health:"Health",tools:"Tool",urgent:"Urgent"};
  grid.innerHTML=G.map(function(g,i){return '<a class="gcard" href="'+g[1]+'" data-t="'+g[0]+'" data-i="'+i+'" data-s="'+(g[2]+" "+g[3]+" "+g[4]).toLowerCase()+'"><span class="k">'+LABEL[g[0]]+'</span><span class="t">'+g[2]+'</span><span class="d">'+g[3]+'</span></a>'}).join("");
  var q=document.getElementById("gsearch"),count=document.getElementById("gcount"),empty=document.getElementById("gempty"),topic="all";
  var Flip=window.Flip,gsap=window.gsap,reduced=function(){return window.SD&&SD.reduced()};
  function apply(){
    var terms=q.value.toLowerCase().trim().split(/\s+/).filter(Boolean);
    var cards=grid.querySelectorAll(".gcard");
    var st=Flip&&!reduced()?Flip.getState(cards):null;
    var n=0;
    cards.forEach(function(c){var ok=(topic==="all"||c.dataset.t===topic)&&terms.every(function(t){return c.dataset.s.indexOf(t)>=0});c.hidden=!ok;if(ok)n++});
    count.textContent=n+" of "+G.length+" guides";empty.hidden=n>0;
    if(st)Flip.from(st,{duration:.6,ease:"expo.out",scale:true,absolute:true,onEnter:function(e){return gsap.fromTo(e,{opacity:0,scale:.9},{opacity:1,scale:1,duration:.5})},onLeave:function(e){return gsap.to(e,{opacity:0,scale:.9,duration:.3})}});
  }
  var t;q.addEventListener("input",function(){clearTimeout(t);t=setTimeout(apply,120)});
  document.querySelectorAll("#gindex-root [data-t]").forEach(function(b){if(b.tagName!=="BUTTON")return;b.addEventListener("click",function(){topic=b.dataset.t;document.querySelectorAll("#gindex-root button[data-t]").forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});apply()})});
  document.getElementById("gclear").addEventListener("click",function(){q.value="";topic="all";document.querySelectorAll("#gindex-root button[data-t]").forEach(function(x){x.setAttribute("aria-pressed",x.dataset.t==="all"?"true":"false")});apply();q.focus()});
  var params=new URLSearchParams(location.search);if(params.get("q")){q.value=params.get("q")}
  apply();
})();
