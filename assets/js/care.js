/* Daily calorie estimator */
(function(){
  "use strict";
  var root=document.getElementById("kcal");if(!root)return;
  var STAGES=[["Neutered adult",1.6],["Entire (not neutered) adult",1.8],["Less active or senior adult",1.4],["Weight loss (use target weight)",1.0],["Puppy under 4 months",3.0],["Puppy 4–12 months",2.0]];
  var saved=window.SD&&SD.store.get("kcal")||{};
  var s={w:saved.w||2.5,stage:saved.stage||0,density:saved.density||380};
  root.innerHTML='<div class="tool-bar"><span class="kicker">Daily calorie estimator</span><span class="ui" style="font-size:var(--s--1);color:var(--ink-3)">A starting point, not a prescription</span></div>'+
    '<div class="calc kcal-grid"><div>'+
    '<div class="field"><label for="k-w">Body weight (kg)</label><input class="input" id="k-w" inputmode="decimal" value="'+s.w+'" aria-describedby="k-wh k-we"><span class="hint" id="k-wh">Use your vet’s target weight if your dog is over- or underweight.</span><span class="err" id="k-we" hidden>Enter a weight between 0.5 and 8 kg.</span></div>'+
    '<div class="field"><label for="k-s">Life stage and activity</label><select class="input" id="k-s">'+STAGES.map(function(x,i){return '<option value="'+i+'"'+(i==s.stage?" selected":"")+'>'+x[0]+'</option>'}).join("")+'</select></div>'+
    '<div class="field"><label for="k-d">Food energy (kcal per 100 g)</label><input class="input" id="k-d" inputmode="numeric" value="'+s.density+'" aria-describedby="k-dh k-de"><span class="hint" id="k-dh">On the bag or the maker’s website. Dry food is often 350–420; wet food 80–120.</span><span class="err" id="k-de" hidden>Enter a number between 50 and 600.</span></div>'+
    '</div><div class="calc-out" style="position:relative;top:auto" aria-live="polite"><span class="lbl">Estimated daily need</span><div class="big" id="k-out">—</div><p style="margin:.4rem 0 0;font-size:var(--s--1);opacity:.8" id="k-range"></p><div class="grid2"><div><span class="lbl">Food per day</span><div class="v" id="k-g">—</div></div><div><span class="lbl">Treat allowance</span><div class="v" id="k-t">—</div></div></div><p class="note" id="k-note">Weigh portions, check body condition every two weeks and adjust by about 10% at a time.</p></div></div>';
  var w=root.querySelector("#k-w"),st=root.querySelector("#k-s"),d=root.querySelector("#k-d");
  function calc(){
    var wv=parseFloat(w.value.replace(",",".")),dv=parseFloat(d.value);
    var okW=!isNaN(wv)&&wv>=.5&&wv<=8,okD=!isNaN(dv)&&dv>=50&&dv<=600;
    w.toggleAttribute("aria-invalid",!okW);root.querySelector("#k-we").hidden=okW;
    d.toggleAttribute("aria-invalid",!okD);root.querySelector("#k-de").hidden=okD;
    if(!okW||!okD){root.querySelector("#k-out").textContent="—";root.querySelector("#k-g").textContent="—";root.querySelector("#k-t").textContent="—";root.querySelector("#k-range").textContent="";return}
    var rer=70*Math.pow(wv,.75),f=STAGES[+st.value][1],mer=rer*f;
    root.querySelector("#k-out").textContent=Math.round(mer)+" kcal";
    root.querySelector("#k-range").textContent="Likely range "+Math.round(mer*.85)+"–"+Math.round(mer*1.15)+" kcal. Resting need "+Math.round(rer)+" kcal × "+f+".";
    root.querySelector("#k-g").textContent=Math.round(mer*.9/dv*100)+" g";
    root.querySelector("#k-t").textContent=Math.round(mer*.1)+" kcal";
    s={w:wv,stage:+st.value,density:dv};if(window.SD)SD.store.set("kcal",s);
  }
  [w,st,d].forEach(function(el){el.addEventListener("input",calc);el.addEventListener("change",calc)});
  calc();
})();
