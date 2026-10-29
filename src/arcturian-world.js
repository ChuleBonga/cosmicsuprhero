// Arcturian Awakening — a short game inside the album illustration.
// No autoplay, network API, 3D context or loading gate. Every chapter has a keyboard-accessible path.
const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>Array.from(root.querySelectorAll(q));
const state={chapter:1,echoes:new Set(),waypoint:0,completed:false};
const painting=$("#painting");
const count=$("#echo-count");
const feedback=$("#painting-feedback");
const number=$("#chapter-number"),title=$("#chapter-title"),instructions=$("#chapter-instructions");
const mobileNumber=$("#mobile-chapter-number"),mobileText=$("#mobile-chapter-text");
const guide={
  1:{number:"I. First Contact",title:"It begins with a light.",text:"Touch the sun to begin. Find what the landscape carries.",mobile:"Touch the sun to begin.",paint:"I / THE ENCOUNTER"},
  2:{number:"II. What we carry",title:"Listen to the land.",text:"Find three memories among the mountains. Each has a name and a place in the album.",mobile:"Find the three marks hidden in the mountains.",paint:"II / THREE MEMORIES"},
  3:{number:"III. The return",title:"The way back is human.",text:"Follow the three marks along the ridge. The final mark is beside the human figure.",mobile:"Follow the ridge, one mark at a time.",paint:"III / THE RETURN"}
};
let feedbackTimer;
function cue(message){
  feedback.textContent=message;
  clearTimeout(feedbackTimer);
  feedbackTimer=setTimeout(()=>{if(!state.completed)feedback.textContent="";},3100);
}
function setChapter(chapter){
  state.chapter=chapter;
  const g=guide[chapter];
  number.textContent=g.number;title.textContent=g.title;instructions.textContent=g.text;
  mobileNumber.textContent=g.number;mobileText.textContent=g.mobile;
  painting.dataset.chapter=String(chapter);
  $("#painting-chapter").textContent=g.paint;
  $("#scene-indicator").textContent=g.paint.replace(/^[IVX]+\s\/\s/,"");
  $(".edition-number").textContent=String(chapter).padStart(2,"0")+" / 03";
  $$("#progress span").forEach((dot,i)=>{
    dot.classList.toggle("active",i+1===chapter);
    dot.classList.toggle("done",i+1<chapter);
  });
  $("#sun-target").hidden=chapter!==1;
  $("#echo-targets").hidden=chapter!==2;
  $("#waypoints").hidden=chapter!==3;
  $("#route-trace").hidden=chapter!==3;
  if(chapter===2)$("#journal").hidden=false;
  if(chapter===3)activateWaypoint();
}
function startEncounter(){
  if(state.chapter!==1)return;
  cue("First Contact");
  setChapter(2);
}
$("#sun-target").addEventListener("click",startEncounter);
const memoryData={
  xaba:{title:"Xaba",fragment:"A name that lives beyond the body."},
  mama:{title:"Mama Calls Me Chule",fragment:"To be known by the people who knew us first."},
  god:{title:"Songs Sent to God",fragment:"What we say when no one else is listening."}
};
const entries=$("#journal-entries");
$$("[data-echo]").forEach(btn=>{
  btn.addEventListener("click",()=>{
    if(state.chapter!==2)return;
    const id=btn.dataset.echo;
    if(state.echoes.has(id))return;
    state.echoes.add(id);btn.disabled=true;
    const item=memoryData[id];
    cue(item.title);
    if(state.echoes.size===1)entries.replaceChildren();
    const span=document.createElement("span");
    span.textContent=item.title;
    span.title=item.fragment;
    entries.append(span);
    count.textContent=String(state.echoes.size).padStart(2,"0")+" / 03";
    number.textContent="II. What we carry · "+state.echoes.size+"/3";
    mobileNumber.textContent=state.echoes.size+" of 3 memories found";
    mobileText.textContent=item.fragment;
    if(state.echoes.size===3){
      instructions.textContent="You found what the landscape carries. Now follow the ridge toward home.";
      cue("The way home is open.");
      setTimeout(()=>{
        if(state.chapter===2){setChapter(3);cue("Follow the first mark.");}
      },950);
    }
  });
});
const positions=[[37,37],[62,53],[69,79]];
const line=$("#route-line");
function activateWaypoint(){
  $$("[data-waypoint]").forEach((button,i)=>{
    button.disabled=i!==state.waypoint;
    button.setAttribute("aria-label",i===state.waypoint?
      "Follow the ridge. Point "+(i+1)+" of 3":
      "Ridge point "+(i+1)+"; follow previous point first");
  });
}
$$("[data-waypoint]").forEach(btn=>btn.addEventListener("click",()=>{
  if(state.chapter!==3||state.completed)return;
  const index=Number(btn.dataset.waypoint);
  if(index!==state.waypoint)return;
  const pathPoints=[[54,17],...positions.slice(0,index+1)];
  line.setAttribute("points",pathPoints.map(p=>p.join(",")).join(" "));
  state.waypoint++;
  cue(["Across the first ridge.","The land begins to soften.","Back to the human."][index]);
  mobileText.textContent=state.waypoint===3?"You made it back.":"Follow mark "+(state.waypoint+1)+".";
  if(state.waypoint===3){completeJourney();}
  else{activateWaypoint();}
}));
function completeJourney(){
  state.completed=true;
  cue("The World Is Ours");
  $("#painting-chapter").textContent="THE WORLD IS OURS";
  const end=$("#finale");
  end.hidden=false;
  setTimeout(()=>end.scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"}),650);
}
function resetJourney(){
  state.chapter=1;state.echoes.clear();state.waypoint=0;state.completed=false;
  line.setAttribute("points","54,17");
  count.textContent="00 / 03";
  entries.replaceChildren();
  const prompt=document.createElement("p");prompt.textContent="There are three memories hidden in the mountains.";entries.append(prompt);
  $$("[data-echo]").forEach(btn=>btn.disabled=false);
  $("#finale").hidden=true;$("#journal").hidden=true;
  feedback.textContent="";
  setChapter(1);
  $("#world").scrollIntoView({block:"start",behavior:"smooth"});
  $("#sun-target").focus({preventScroll:true});
}
$("#play-again").addEventListener("click",resetJourney);

// The full published track list is available at every stage of the journey.
const dialog=$("#tracklist-dialog");
function openTracklist(){
  if(dialog.showModal)dialog.showModal();
  else dialog.setAttribute("open","");
}
function closeTracklist(){
  if(dialog.close)dialog.close();
  else dialog.removeAttribute("open");
}
$("#open-tracklist").addEventListener("click",openTracklist);
$("#open-tracklist-bottom").addEventListener("click",openTracklist);
$("#close-tracklist").addEventListener("click",closeTracklist);
dialog.addEventListener("click",e=>{if(e.target===dialog)closeTracklist();});

// The image source is the official album CDN; no loading overlay blocks the site.
$("#cover-image").addEventListener("error",()=>{
  painting.classList.add("painting--image-error");
  cue("Artwork is temporarily unavailable. Pre-save is still accessible.");
});
setChapter(1);
