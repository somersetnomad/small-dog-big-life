/* Room-by-room preparation checklist with FLIP filtering */
(function(){
  "use strict";
  var root=document.getElementById("checklist-tool");if(!root)return;
  var ROOMS=[
    {id:"living",n:"Living room",items:[["Block gaps behind and under the sofa and units","Small dogs wedge themselves in and get stuck."],["Choose and set up the den: covered bed or crate in a quiet corner","Somewhere warm and away from the walkway."],["Add a ramp or steps to the sofa, or teach ‘off’ and lift them down","Jumping down is a common cause of injury."],["Tidy cables away or cover them","Puppies chew."],["Move houseplants out of reach and check they aren’t toxic",""],["Agree a ‘four paws on the floor’ rule with visitors","Visitors shouldn’t pick the dog up."]]},
    {id:"kitchen",n:"Kitchen",items:[["Use a bin with a lid the dog can’t open","Bins hold bones, corn cobs and wrappers."],["Move chocolate, raisins, xylitol products and medicines into high cupboards",""],["Choose a feeding spot away from foot traffic",""],["Buy shallow, heavy bowls","They suit small faces and don’t tip over."],["Agree that nobody feeds scraps from the table","Tiny dogs gain weight fast."]]},
    {id:"bed",n:"Bedrooms & stairs",items:[["Fit stair gates at the top and bottom of the stairs","Open-backed stairs need extra care."],["Decide where the dog sleeps for the first nights","Beside your bed helps puppies settle."],["Add steps or a ramp if the dog will be allowed on your bed",""],["Check balcony railings and fit mesh or screening if the gaps are wide","A Chihuahua can slip through surprisingly small gaps."],["Keep laundry, socks and hair ties off the floor","They can block the gut if swallowed."]]},
    {id:"garden",n:"Garden & doors",items:[["Walk the fence line at ankle height and close every gap",""],["Check that gates shut by themselves and have no gap at the bottom",""],["Remove or fence off toxic plants, slug pellets and compost",""],["Cover ponds and water features",""],["Plan supervision. Birds of prey and foxes occasionally threaten very small dogs.",""],["Agree a front-door routine: dog behind a gate or in another room when the door opens","Open doors are a leading escape route."]]},
    {id:"car",n:"Car & travel",items:[["Buy a secure carrier or a crash-tested small-dog harness",""],["Plan where the carrier sits and how it is secured","Back seat or boot area, never a lap or footwell."],["Pack a travel kit: water, bowl, poo bags, blanket, spare harness",""],["Practise short, happy car trips before longer journeys",""]]},
    {id:"docs",n:"Documents & vet",items:[["Register with a vet and book a first health check",""],["Save your vet’s out-of-hours number in your phone",""],["Arrange insurance to start on day one",""],["Get the microchip transfer details from the breeder or rescue",""],["Order an ID tag with your name, address and phone number","Required by law in public places."],["File vaccination, worming and health-test records together",""],["Book puppy or confidence classes",""]]},
    {id:"shop",n:"Shopping list",items:[["Same food the dog currently eats","Change gradually later, if at all."],["Small-breed harness, light collar and lead",""],["Warm coat and waterproof coat",""],["Snuggle bed and fleece blankets",""],["Dog toothbrush and dog toothpaste","Never human toothpaste."],["Soft brush or rubber mitt, nail clippers",""],["Puzzle feeder and a few soft toys",""],["Enzymatic cleaner for toilet accidents",""]]},
    {id:"week",n:"First week",items:[["Update the microchip database to your details",""],["Attend the first vet check",""],["Start short alone-time practice","A few minutes, building slowly."],["Start daily handling practice: paws, ears, mouth",""],["Start tooth-brushing practice","Begin with letting them lick the paste."],["Set a toilet routine: after waking, eating, playing and before bed",""]]}
  ];
  var state={done:{},custom:{},filter:"all",hideDone:false};
  var saved=window.SD&&SD.store.get("checklist");
  if(saved){state.done=saved.done||{};state.custom=saved.custom||{};state.hideDone=!!saved.hideDone}
  var G=window.gsap,Flip=window.Flip;
  var reduced=function(){return window.SD&&SD.reduced()};
  var checkSVG='<svg viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 7.5l3 3 6-7"/></svg>';
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]})}
  function allItems(room){
    var base=room.items.map(function(it,i){return {key:room.id+"-"+i,t:it[0],w:it[1],custom:false}});
    var c=(state.custom[room.id]||[]).map(function(it){return {key:it.key,t:it.t,w:"",custom:true}});
    return base.concat(c);
  }
  function totals(){var t=0,d=0;ROOMS.forEach(function(r){allItems(r).forEach(function(it){t++;if(state.done[it.key])d++})});return {t:t,d:d}}
  function save(){if(window.SD){SD.store.set("checklist",{done:state.done,custom:state.custom,hideDone:state.hideDone});updateSave()}}
  function updateSave(){var el=root.querySelector(".save-state");if(!el)return;var on=window.SD&&SD.consent.prefsAllowed();el.classList.toggle("on",on);el.lastElementChild.innerHTML=on?"Saving on this device":'Not saved: ticks will be lost when you leave · <button type="button" style="all:unset;cursor:pointer;text-decoration:underline">turn on saving</button>';var b=el.querySelector("button");if(b)b.addEventListener("click",function(){document.querySelector("[data-open-consent]").click()})}
  document.addEventListener("sd:consent",function(){save()});

  function render(){
    var tt=totals(),C=2*Math.PI*26,off=C*(1-(tt.t?tt.d/tt.t:0));
    root.innerHTML='<div class="tool-bar"><span class="kicker">Home preparation checklist</span><span class="save-state"><span class="led" aria-hidden="true"></span><span></span></span></div>'+
      '<div class="cl-progress"><svg class="ring" viewBox="0 0 64 64" aria-hidden="true"><circle class="bg" cx="32" cy="32" r="26"/><circle class="fg" cx="32" cy="32" r="26" stroke-dasharray="'+C.toFixed(1)+'" stroke-dashoffset="'+off.toFixed(1)+'"/></svg><div><strong id="cl-count">'+tt.d+' of '+tt.t+'</strong><span style="font-size:var(--s--1);color:var(--ink-3)" id="cl-msg">'+msg(tt)+'</span></div></div>'+
      '<div class="cl-filters" role="group" aria-label="Filter by room"><button type="button" class="chip" data-f="all" aria-pressed="'+(state.filter==="all")+'">All rooms</button>'+ROOMS.map(function(r){return '<button type="button" class="chip" data-f="'+r.id+'" aria-pressed="'+(state.filter===r.id)+'">'+r.n+'</button>'}).join("")+
      '<label class="chip" style="display:inline-flex;gap:.4rem;align-items:center;margin-left:auto"><input type="checkbox" id="cl-hide" '+(state.hideDone?"checked":"")+' style="accent-color:var(--chilli)"> Hide ticked</label></div>'+
      '<div class="cl-grid">'+ROOMS.map(roomHTML).join("")+'</div>'+
      '<p class="empty" id="cl-empty" hidden>Everything in view is ticked. Nicely done.</p>'+
      '<div class="cl-actions"><button type="button" class="btn small ghost" data-print>Print checklist</button><button type="button" class="btn small ghost" data-reset>Clear all ticks</button></div>';
    wire();applyFilter(true);updateSave();if(window.SD)SD.springButtons(root);
  }
  function msg(tt){if(!tt.d)return "Start anywhere. There’s no right order.";if(tt.d===tt.t)return "Everything’s ready. Enjoy the first evening together.";var p=tt.d/tt.t;return p<.5?"A good start. Keep going over a few evenings.":"Most of the way there."}
  function roomHTML(r){
    var items=allItems(r),d=items.filter(function(i){return state.done[i.key]}).length;
    return '<section class="cl-room" data-room="'+r.id+'" aria-labelledby="h-'+r.id+'"><h3 id="h-'+r.id+'">'+r.n+' <small>'+d+'/'+items.length+'</small></h3><ul>'+items.map(function(it){
      var id="c-"+it.key;return '<li class="cl-item" data-key="'+it.key+'"><input type="checkbox" id="'+id+'"'+(state.done[it.key]?" checked":"")+'><label for="'+id+'"><span class="cl-box">'+checkSVG+'</span><span class="txt">'+esc(it.t)+(it.w?'<span class="why">'+esc(it.w)+'</span>':"")+'</span></label>'+(it.custom?'<button type="button" class="del" data-del="'+it.key+'" aria-label="Remove '+esc(it.t)+'">Remove</button>':"")+'</li>'}).join("")+
      '</ul><form class="cl-add" data-add="'+r.id+'"><label class="visually-hidden" for="add-'+r.id+'">Add your own item to '+r.n+'</label><input class="input" id="add-'+r.id+'" maxlength="120" placeholder="Add your own item" autocomplete="off"><button class="btn small" type="submit">Add</button></form></section>';
  }
  function refreshCounts(){
    var tt=totals(),C=2*Math.PI*26;
    root.querySelector(".ring .fg").style.strokeDashoffset=(C*(1-(tt.t?tt.d/tt.t:0))).toFixed(1);
    root.querySelector("#cl-count").textContent=tt.d+" of "+tt.t;root.querySelector("#cl-msg").textContent=msg(tt);
    ROOMS.forEach(function(r){var items=allItems(r);var d=items.filter(function(i){return state.done[i.key]}).length;root.querySelector('[data-room="'+r.id+'"] h3 small').textContent=d+"/"+items.length});
  }
  function applyFilter(instant){
    var flipState=(!instant&&Flip&&!reduced())?Flip.getState(root.querySelectorAll(".cl-room, .cl-item")):null;
    root.querySelectorAll(".cl-room").forEach(function(sec){
      var show=state.filter==="all"||state.filter===sec.dataset.room;sec.hidden=!show;
      sec.querySelectorAll(".cl-item").forEach(function(li){li.hidden=state.hideDone&&state.done[li.dataset.key]});
    });
    var anyVisible=[].some.call(root.querySelectorAll(".cl-item"),function(li){return !li.hidden&&!li.closest(".cl-room").hidden});
    root.querySelector("#cl-empty").hidden=anyVisible;
    if(flipState)Flip.from(flipState,{duration:.7,ease:"expo.out",absolute:true,stagger:.01,onEnter:function(els){return G.fromTo(els,{opacity:0,scale:.96},{opacity:1,scale:1,duration:.5})},onLeave:function(els){return G.to(els,{opacity:0,scale:.96,duration:.3})}});
  }
  function wire(){
    if(!root._wired){root._wired=true;root.addEventListener("change",function(e){
      if(e.target.id==="cl-hide"){state.hideDone=e.target.checked;save();applyFilter();return}
      var li=e.target.closest(".cl-item");if(!li)return;
      var k=li.dataset.key;if(e.target.checked)state.done[k]=true;else delete state.done[k];
      save();refreshCounts();
      if(e.target.checked&&G&&!reduced()){
        G.fromTo(li.querySelector(".cl-box"),{scale:.6},{scale:1,duration:.6,ease:"back.out(3)"});
        var tt=totals();if(tt.d===tt.t){SD.toast("Checklist complete");SD.perk(document.querySelector(".brand-mark"),false);setTimeout(function(){SD.perk(document.querySelector(".brand-mark"),true)},250)}
      }
      if(state.hideDone)setTimeout(applyFilter,450);
    });}
    root.querySelectorAll("[data-f]").forEach(function(b){b.addEventListener("click",function(){state.filter=b.dataset.f;root.querySelectorAll("[data-f]").forEach(function(x){x.setAttribute("aria-pressed",x===b?"true":"false")});applyFilter()})});
    root.querySelectorAll("[data-add]").forEach(function(f){f.addEventListener("submit",function(e){e.preventDefault();var inp=f.querySelector("input"),v=inp.value.trim();
      if(!v){inp.setAttribute("aria-invalid","true");inp.placeholder="Type something to add";inp.focus();return}
      inp.removeAttribute("aria-invalid");var r=f.dataset.add;(state.custom[r]=state.custom[r]||[]).push({key:r+"-c"+Date.now().toString(36),t:v});save();
      var keepFilter=state.filter;render();state.filter=keepFilter;var ni=root.querySelector("#add-"+r);if(ni)ni.focus();SD.toast("Added to "+ROOMS.filter(function(x){return x.id===r})[0].n);
    })});
    root.querySelectorAll("[data-del]").forEach(function(b){b.addEventListener("click",function(){var k=b.dataset.del,r=k.split("-")[0];state.custom[r]=(state.custom[r]||[]).filter(function(x){return x.key!==k});delete state.done[k];save();render();SD.toast("Item removed")})});
    root.querySelector("[data-print]").addEventListener("click",function(){window.print()});
    root.querySelector("[data-reset]").addEventListener("click",function(){
      if(!Object.keys(state.done).length){SD.toast("Nothing is ticked yet");return}
      var b=this;if(b.dataset.confirm!=="1"){b.dataset.confirm="1";b.textContent="Tap again to clear all ticks";setTimeout(function(){b.dataset.confirm="";b.textContent="Clear all ticks"},4000);return}
      state.done={};save();render();SD.toast("Ticks cleared. Your own items are kept.");
    });
  }
  render();
})();
