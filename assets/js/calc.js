/* UK ownership budget calculator */
(function(){
  "use strict";
  var root=document.getElementById("calc");if(!root)return;
  var CATS={start:["Getting started","#C8902E"],food:["Food","#8A9A5B"],ins:["Insurance","#E07A52"],vet:["Vet & parasites","#D9C2A0"],dental:["Dental care","#F2D8CC"],care:["Supplies & grooming","#A3907A"],sit:["Sitters & boarding","#6E8FA8"],fund:["Emergency fund","#F0E7D9"]};
  var F=[
    {g:"Getting started",id:"acq",l:"Adoption fee or puppy price",d:1800,max:4000,step:50,c:"start",h:"Rescue fees are usually £150–£500. Puppies from health-testing breeders typically £1,000–£3,000."},
    {g:"Getting started",id:"setup",l:"Equipment and home safety",d:350,max:1000,step:10,c:"start",h:"Bed, carrier, harness, collar and tag, lead, two coats, gates, bowls, toys, grooming kit."},
    {g:"Getting started",id:"vacc",l:"Primary vaccinations",d:110,max:300,step:5,c:"start",h:"Usually included by rescues. Set to £0 if already done."},
    {g:"Getting started",id:"neuter",l:"Neutering",d:320,max:700,step:10,c:"start",h:"Females usually cost more. Rescues normally neuter before rehoming."},
    {g:"Getting started",id:"classes",l:"Puppy or confidence classes",d:130,max:400,step:5,c:"start",h:"A five- or six-week reward-based course."},
    {g:"Every year",id:"food",l:"Food and treats (per year)",d:300,max:1500,step:10,c:"food",h:"Good small-breed dry food for a 2–3 kg adult: about £15–£30 a month. Fresh or raw costs more."},
    {g:"Every year",id:"ins",l:"Lifetime insurance (per month)",d:32,max:120,step:1,c:"ins",h:"Typical quotes for a young Chihuahua on lifetime cover. Get real quotes for your postcode."},
    {g:"Every year",id:"vet",l:"Annual check and booster",d:95,max:300,step:5,c:"vet",h:"Some components are yearly (leptospirosis), others every three years."},
    {g:"Every year",id:"para",l:"Flea, tick, worm and lungworm prevention",d:150,max:400,step:5,c:"vet",h:"Toy-dog doses of prescription products. A practice health plan may bundle this."},
    {g:"Every year",id:"dent",l:"Dental scale and polish under anaesthetic",d:550,max:1500,step:10,c:"dental",h:"A single procedure. X-rays and extractions add more."},
    {g:"Every year",id:"dentYrs",l:"Dental procedure every … years",d:2,min:1,max:5,step:1,unit:"yrs",c:"dental",h:"Many toy dogs need cleaning every one to two years, even with daily brushing."},
    {g:"Every year",id:"supp",l:"Supplies, toys, poo bags, replacements",d:120,max:500,step:5,c:"care",h:"Chewed toys, worn harnesses, toothpaste, shampoo, nail clippers."},
    {g:"Every year",id:"groom",l:"Grooming and nail trims",d:60,max:500,step:5,c:"care",h:"Most owners groom at home. Long coats may need occasional professional tidies."},
    {g:"Every year",id:"sitDays",l:"Days of sitting or boarding per year",d:10,max:60,step:1,unit:"days",c:"sit",h:"Holidays, hospital stays, long work days."},
    {g:"Every year",id:"sitRate",l:"Cost per day",d:30,max:80,step:1,c:"sit",h:"Home boarding and pet sitters typically charge £25–£45 a day."},
    {g:"Every year",id:"excess",l:"Excesses and uncovered costs",d:120,max:800,step:10,c:"vet",h:"Claim excesses, co-payments for older dogs and anything your policy excludes."},
    {g:"Planning",id:"fund",l:"Emergency fund to build in year one",d:1000,max:5000,step:50,c:"fund",h:"Paid once. Make it larger if you don’t insure."},
    {g:"Planning",id:"years",l:"Lifespan to plan for",d:14,min:1,max:20,step:1,unit:"yrs",h:"Many Chihuahuas live into their teens. Plan for the long version."},
    {g:"Planning",id:"insRise",l:"Insurance premium rise per year",d:7,max:20,step:1,unit:"%",h:"Lifetime premiums usually rise with age. Ask insurers how theirs change."}
  ];
  var PRESETS={rescue:{acq:300,vacc:0,neuter:0,classes:90,years:10},breeder:{acq:1800,vacc:110,neuter:320,classes:130,years:14}};
  var defaults={};F.forEach(function(f){defaults[f.id]=f.d});
  var vals=Object.assign({},defaults);
  var saved=window.SD&&SD.store.get("budget");if(saved&&saved.vals){Object.keys(saved.vals).forEach(function(k){if(k in vals&&typeof saved.vals[k]==="number")vals[k]=saved.vals[k]})}
  var preset=(saved&&saved.preset)||"breeder";
  var fmt=function(n){return "£"+Math.round(n).toLocaleString("en-GB")};

  function fieldHTML(f){
    var unit=f.unit||"£";
    var input=unit==="£"?'<div class="money"><input class="input" inputmode="decimal" id="f-'+f.id+'" value="'+vals[f.id]+'" aria-describedby="h-'+f.id+'"></div>':
      '<div style="display:flex;align-items:center;gap:.4rem"><input class="input" inputmode="numeric" id="f-'+f.id+'" value="'+vals[f.id]+'" aria-describedby="h-'+f.id+'" style="text-align:right"><span style="font-size:var(--s--1);color:var(--ink-3)">'+unit+'</span></div>';
    return '<div class="row"><label for="f-'+f.id+'">'+f.l+'</label>'+input+'<input type="range" min="'+(f.min||0)+'" max="'+f.max+'" step="'+f.step+'" value="'+Math.min(f.max,vals[f.id])+'" data-for="'+f.id+'" aria-label="'+f.l+' slider" tabindex="-1"><span class="hint" id="h-'+f.id+'">'+f.h+'</span><span class="err" id="e-'+f.id+'" hidden>Enter a number of 0 or more.</span></div>';
  }
  function render(){
    var groups={};F.forEach(function(f){(groups[f.g]=groups[f.g]||[]).push(f)});
    root.innerHTML='<div class="tool-bar"><span class="kicker">UK budget calculator · 2026 prices</span><span class="save-state"><span class="led" aria-hidden="true"></span><span></span></span></div>'+
      '<div class="preset" role="group" aria-label="Starting point"><button type="button" class="chip" data-preset="breeder" aria-pressed="'+(preset==="breeder")+'">Puppy from a breeder</button><button type="button" class="chip" data-preset="rescue" aria-pressed="'+(preset==="rescue")+'">Adult from a rescue</button></div>'+
      '<div class="calc"><div class="calc-in"><div class="calc-mini" aria-hidden="true"><span>First year <b id="m-first">£0</b></span><span>Per month <b id="m-month">£0</b></span><span>Lifetime <b id="m-life">£0</b></span></div>'+Object.keys(groups).map(function(g){return '<fieldset><legend>'+g+'</legend>'+groups[g].map(fieldHTML).join("")+'</fieldset>'}).join("")+'</div>'+
      '<aside class="calc-out" aria-live="polite" aria-atomic="false"><span class="lbl">First year</span><div class="big" id="o-first">£0</div>'+
      '<div class="grid2"><div><span class="lbl">Typical year after</span><div class="v" id="o-year">£0</div></div><div><span class="lbl">Per month, year two</span><div class="v" id="o-month">£0</div></div></div>'+
      '<span class="lbl">Lifetime estimate</span><div class="v" style="font-family:var(--display);font-size:var(--s3)" id="o-life">£0</div><p style="font-size:var(--s--1);opacity:.75;margin:.2rem 0 0" id="o-life-note"></p>'+
      '<div class="stack" id="o-stack" role="img" aria-label="Lifetime cost by category"></div><ul class="legend" id="o-legend"></ul>'+
      '<p class="note" id="o-pdsa"></p>'+
      '<div style="display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem"><button type="button" class="btn small ghost" data-copy>Copy summary</button><button type="button" class="btn small ghost" data-print>Print</button><button type="button" class="btn small ghost" data-reset>Reset</button></div></aside></div>';
    wire();compute(true);updateSave();if(window.SD)SD.springButtons(root);
  }
  function setRangeFill(r){var p=(r.value-r.min)/(r.max-r.min)*100;r.style.setProperty("--p",p+"%")}
  function wire(){
    F.forEach(function(f){
      var inp=root.querySelector("#f-"+f.id),rng=root.querySelector('[data-for="'+f.id+'"]'),err=root.querySelector("#e-"+f.id);
      setRangeFill(rng);
      inp.addEventListener("input",function(){
        var v=parseFloat(String(inp.value).replace(/[£,\s]/g,""));
        if(inp.value.trim()===""||isNaN(v)||v<0||(f.min&&v<f.min)){inp.setAttribute("aria-invalid","true");err.hidden=false;err.textContent=f.min?"Enter a number of "+f.min+" or more.":"Enter a number of 0 or more.";return}
        inp.removeAttribute("aria-invalid");err.hidden=true;vals[f.id]=v;rng.value=Math.min(f.max,v);setRangeFill(rng);changed();
      });
      inp.addEventListener("blur",function(){if(inp.getAttribute("aria-invalid")!=="true")inp.value=vals[f.id]});
      rng.addEventListener("input",function(){vals[f.id]=+rng.value;inp.value=rng.value;inp.removeAttribute("aria-invalid");err.hidden=true;setRangeFill(rng);changed()});
    });
    root.querySelectorAll("[data-preset]").forEach(function(b){b.addEventListener("click",function(){
      preset=b.dataset.preset;var p=PRESETS[preset];Object.keys(p).forEach(function(k){vals[k]=p[k]});
      root.querySelectorAll("[data-preset]").forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});
      syncInputs();changed();SD.toast(preset==="rescue"?"Set to adult rescue figures":"Set to breeder puppy figures");
    })});
    root.querySelector("[data-reset]").addEventListener("click",function(){vals=Object.assign({},defaults);preset="breeder";root.querySelectorAll("[data-preset]").forEach(function(x){x.setAttribute("aria-pressed",x.dataset.preset==="breeder"?"true":"false")});syncInputs();if(window.SD)SD.store.del("budget");compute();SD.toast("Reset to default figures")});
    root.querySelector("[data-print]").addEventListener("click",function(){window.print()});
    root.querySelector("[data-copy]").addEventListener("click",function(){
      var r=last;var txt="Chihuahua budget (UK, 2026 prices)\nFirst year: "+fmt(r.first)+"\nTypical year after: "+fmt(r.year2)+"\nPer month (year two): "+fmt(r.year2/12)+"\nLifetime ("+vals.years+" years): "+fmt(r.life)+"\n\n"+Object.keys(r.cats).map(function(k){return CATS[k][0]+": "+fmt(r.cats[k])}).join("\n")+"\n\nAssumptions: "+F.map(function(f){return f.l+" = "+(f.unit?vals[f.id]+" "+f.unit:fmt(vals[f.id]))}).join("; ")+"\nsmalldog.noorintelligence.tech/costs.html";
      (navigator.clipboard?navigator.clipboard.writeText(txt):Promise.reject()).then(function(){SD.toast("Summary copied")}).catch(function(){SD.toast("Couldn’t copy. Try Print instead.")});
    });
  }
  function syncInputs(){F.forEach(function(f){var i=root.querySelector("#f-"+f.id),r=root.querySelector('[data-for="'+f.id+'"]');i.value=vals[f.id];i.removeAttribute("aria-invalid");root.querySelector("#e-"+f.id).hidden=true;r.value=Math.min(f.max,vals[f.id]);setRangeFill(r)})}
  var t;function changed(){compute();clearTimeout(t);t=setTimeout(function(){if(window.SD){SD.store.set("budget",{vals:vals,preset:preset});updateSave()}},300)}
  function updateSave(){var el=root.querySelector(".save-state"),on=window.SD&&SD.consent.prefsAllowed();el.classList.toggle("on",on);el.lastElementChild.innerHTML=on?"Saving on this device":'Not saved · <button type="button" style="all:unset;cursor:pointer;text-decoration:underline">turn on saving</button>';var b=el.querySelector("button");if(b)b.addEventListener("click",function(){document.querySelector("[data-open-consent]").click()})}
  document.addEventListener("sd:consent",function(){if(SD.consent.prefsAllowed())SD.store.set("budget",{vals:vals,preset:preset});if(root.querySelector(".save-state"))updateSave()});

  var last,shown={};
  function compute(instant){
    var v=vals,yrs=Math.max(1,Math.round(v.years)),g=v.insRise/100;
    var oneoff=v.acq+v.setup+v.vacc+v.neuter+v.classes;
    var dentalYr=v.dent/Math.max(1,v.dentYrs);
    var nonIns={food:v.food,vet:v.vet+v.para+v.excess,dental:dentalYr,care:v.supp+v.groom,sit:v.sitDays*v.sitRate};
    var nonInsSum=Object.keys(nonIns).reduce(function(a,k){return a+nonIns[k]},0);
    var ins12=v.ins*12;
    var first=oneoff+v.fund+nonInsSum+ins12-(v.vacc>0?v.vet*0.5:0);
    var year2=nonInsSum+ins12*(1+g);
    var insLife=0;for(var y=0;y<yrs;y++)insLife+=ins12*Math.pow(1+g,y);
    var cats={start:oneoff,food:nonIns.food*yrs,ins:insLife,vet:nonIns.vet*yrs,dental:nonIns.dental*yrs,care:nonIns.care*yrs,sit:nonIns.sit*yrs,fund:v.fund};
    var life=Object.keys(cats).reduce(function(a,k){return a+cats[k]},0);
    last={first:first,year2:year2,life:life,cats:cats};
    tween("o-first",first,instant);tween("o-year",year2,instant);tween("o-month",year2/12,instant);tween("o-life",life,instant);
    root.querySelector("#m-first").textContent=fmt(first);root.querySelector("#m-month").textContent=fmt(year2/12);root.querySelector("#m-life").textContent=fmt(life);
    root.querySelector("#o-life-note").textContent="Over "+yrs+" years, including insurance rising "+v.insRise+"% a year. Excludes treatment your insurance doesn’t cover.";
    root.querySelector("#o-stack").innerHTML=Object.keys(cats).map(function(k){return '<i style="flex-grow:'+Math.max(0,cats[k]).toFixed(0)+';background:'+CATS[k][1]+'" title="'+CATS[k][0]+'"></i>'}).join("");
    root.querySelector("#o-legend").innerHTML=Object.keys(cats).map(function(k){return '<li><span><i style="background:'+CATS[k][1]+'"></i>'+CATS[k][0]+'</span><span>'+fmt(cats[k])+'</span></li>'}).join("");
    var pdsa=year2/12<69?"Your monthly figure is below the PDSA’s minimum estimate of £69 for a small dog. Check you haven’t left anything out.":"For comparison, the PDSA’s minimum for a small dog is £69 a month and £6,200–£12,000 over a lifetime, excluding purchase price and illness.";
    root.querySelector("#o-pdsa").textContent=pdsa;
  }
  function tween(id,to,instant){
    var el=root.querySelector("#"+id);var from=shown[id]||0;shown[id]=to;
    if(instant||!window.gsap||(window.SD&&SD.reduced())){el.textContent=fmt(to);return}
    var o={v:from};gsap.to(o,{v:to,duration:.6,ease:"power3.out",onUpdate:function(){el.textContent=fmt(o.v)}});
  }
  render();
})();
