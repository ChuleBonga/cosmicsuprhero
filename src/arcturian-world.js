// Arcturian Awakening — a short game inside the album illustration.
// No autoplay, network API, 3D context or loading gate. Every chapter has a keyboard-accessible path.
const $=(q,root=document)=>root.querySelector(q);
const $$=(q,root=document)=>Array.from(root.querySelectorAll(q));
const state={chapter:1,echoes:new Set(),waypoint:0,completed:false};
// The only public music asset is the explicitly approved 45-second excerpt.
const music=$("#awaken-audio");
const musicButton=$("#music-toggle");
const musicAction=$("#music-action");
const musicIcon=$("#music-icon");
const musicStatus=$("#music-status");
const musicTime=$("#music-time");
const musicScrub=$("#music-scrub");
let previewReady=false;
let musicFrame=0;
let lastMoment="";
const excerptLength=45;
const previewUnavailableMessage="Audio preview is being prepared. You can explore without sound.";
// An approved, cut-down excerpt is required at this local URL. Never fetch the
// unreleased WAV masters from Google Drive in a public browser session.
async function checkPreviewAvailability(){
  const url=music.dataset.previewSrc;
  if(!url || !url.startsWith("/") || url.startsWith("//")){
    musicStatus.textContent=previewUnavailableMessage;
    return;
  }
  try{
    const response=await fetch(url,{method:"HEAD",cache:"no-store"});
    const type=(response.headers.get("content-type")||"").toLowerCase();
    // A missing file can resolve to Vercel's HTML SPA fallback (HTTP 200).
    if(!response.ok || (!type.startsWith("audio/") && !type.includes("mp4") && !type.includes("octet-stream"))){
      throw new Error("No deployable audio preview");
    }
    music.src=url;
    previewReady=true;
    musicButton.disabled=false;
    musicScrub.disabled=false;
    musicStatus.textContent="Sound is optional. Press Listen to hear the 45-second excerpt.";
    updateMusicButton();
  }catch{
    previewReady=false;
    musicButton.disabled=true;
    musicScrub.disabled=true;
    musicStatus.textContent=previewUnavailableMessage;
    musicButton.setAttribute("aria-label","Awaken Now audio preview unavailable");
  }
}
function fmtClock(t){
  const n=Math.max(0,Math.floor(Number.isFinite(t)?t:0));
  return Math.floor(n/60)+":"+String(n%60).padStart(2,"0");
}
function updateMusicButton(){
  const active=!music.paused&&!music.ended;
  musicButton.setAttribute("aria-pressed",String(active));
  musicAction.textContent=active?"Pause":(music.ended?"Replay":music.currentTime>0?"Resume":"Listen");
  musicButton.classList.toggle("is-playing",active);
  musicButton.setAttribute("aria-label",active?"Pause Awaken Now excerpt":(music.ended?"Replay Awaken Now excerpt":"Play Awaken Now excerpt"));
}
function visualMoment(time){
  if(time>=40.5)return "reveal";
  if(time>=28.3)return "home";
  if(time>=12.3)return "crossing";
  return "arrival";
}
function syncMusic(){
  let t=Math.min(excerptLength,Math.max(0,music.currentTime||0));
  if(!document.activeElement?.isSameNode(musicScrub)){musicScrub.value=String(t);}
  musicTime.textContent=fmtClock(t);
  musicScrub.style.setProperty("--scrub-progress",(t/excerptLength*100)+"%");
  const moment=visualMoment(t);
  if(moment!==lastMoment){
    lastMoment=moment;
    painting.dataset.audioMoment=moment;
  }
  const light=music.paused?.08:Math.min(.52,.12+t/45*.34);
  const intensity=music.paused?0:(.3+.16*Math.sin(t*.9)**2);
  painting.style.setProperty("--music-ray",String(light));
  painting.style.setProperty("--music-energy",String(intensity));
}
function liveMusicTick(){
  syncMusic();
  if(!music.paused&&!music.ended){musicFrame=requestAnimationFrame(liveMusicTick);}
}
async function startMusic(){
  if(!previewReady){musicStatus.textContent=previewUnavailableMessage;return;}
  try{
    if(music.ended||music.currentTime>=excerptLength-.25)music.currentTime=0;
    const pending=music.play();
    if(pending&&typeof pending.then==="function")await pending;
    musicStatus.textContent="Playing a 45-second excerpt of Awaken Now.";
    updateMusicButton();
  }catch(_){
    musicStatus.textContent="Preview audio unavailable here. You can continue the journey without sound.";
    updateMusicButton();
  }
}
function pauseMusic(){
  music.pause();
  musicStatus.textContent="Paused. Resume whenever you choose.";
  updateMusicButton();
}
musicButton.addEventListener("click",()=>{
  if(music.paused||music.ended){void startMusic();}
  else{pauseMusic();}
});
musicScrub.addEventListener("input",()=>{
  if(!previewReady)return;
  if(music.readyState===0){music.load();}
  try{if(music.seekable.length||music.readyState>0)music.currentTime=Number(musicScrub.value);}catch(_){}
  syncMusic();
});
music.addEventListener("play",()=>{
  painting.classList.add("audio-playing");
  cancelAnimationFrame(musicFrame);
  musicFrame=requestAnimationFrame(liveMusicTick);
  updateMusicButton();
});
music.addEventListener("pause",()=>{
  painting.classList.remove("audio-playing");
  cancelAnimationFrame(musicFrame);
  syncMusic();
  updateMusicButton();
});
music.addEventListener("timeupdate",()=>{
  if(music.currentTime>=excerptLength && !music.paused){
    music.pause();
    try{music.currentTime=excerptLength;}catch{}
    musicStatus.textContent="The excerpt has ended. Replay or continue the journey.";
    updateMusicButton();
  }
  syncMusic();
});
music.addEventListener("loadedmetadata",syncMusic);
music.addEventListener("waiting",()=>{if(!music.paused)musicStatus.textContent="Loading the music preview…";});
music.addEventListener("playing",()=>{musicStatus.textContent="Playing a 45-second excerpt of Awaken Now.";});
music.addEventListener("ended",()=>{
  painting.classList.remove("audio-playing");
  cancelAnimationFrame(musicFrame);
  musicStatus.textContent="The excerpt has ended. Replay it or continue to pre-save.";
  updateMusicButton();
});
music.addEventListener("error",()=>{
  painting.classList.remove("audio-playing");
  previewReady=false;
  musicButton.disabled=true;
  musicScrub.disabled=true;
  cancelAnimationFrame(musicFrame);
  musicStatus.textContent="The music is temporarily unavailable. The journey and pre-save still work.";
  updateMusicButton();
});
const painting=$("#painting");
const count=$("#echo-count");
const feedback=$("#painting-feedback");
const number=$("#chapter-number"),title=$("#chapter-title"),instructions=$("#chapter-instructions");
const mobileNumber=$("#mobile-chapter-number"),mobileText=$("#mobile-chapter-text");
const guide={
  1:{number:"I. First Contact",title:"It begins with a light.",text:"Enter the painting and follow the sun.",mobile:"Touch the sun or enter the painting.",paint:"I / THE ENCOUNTER"},
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
  $("#game-entry").hidden=chapter!==1;
  const objective=$("#game-objective");
  objective.hidden=chapter===1;
  if(chapter===2){$("#objective-label").textContent="THREE FRAGMENTS IN THE MOUNTAINS";$("#objective-progress").textContent=String(state.echoes.size).padStart(2,"0")+" / 03";}
  if(chapter===3){$("#objective-label").textContent="TRACE YOUR WAY HOME";$("#objective-progress").textContent=String(state.waypoint).padStart(2,"0")+" / 03";}
  $("#echo-targets").hidden=chapter!==2;
  $("#waypoints").hidden=chapter!==3;
  $("#route-trace").hidden=chapter!==3;
  if(chapter===2)$("#journal").hidden=false;
  if(chapter===3)activateWaypoint();
}
function startEncounter(){
  if(state.chapter!==1)return;
  // Entering the painting is not consent to play audio.
  cue("First Contact");
  setChapter(2);
}
$("#sun-target").addEventListener("click",startEncounter);
$("#begin-journey").addEventListener("click",startEncounter);
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
    $("#objective-progress").textContent=String(state.echoes.size).padStart(2,"0")+" / 03";
    painting.dataset.memoryFound=String(state.echoes.size);
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
  $("#objective-progress").textContent=String(state.waypoint).padStart(2,"0")+" / 03";
  painting.dataset.routeProgress=String(state.waypoint);
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
  setTimeout(()=>end.scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}),650);
}
function resetJourney(){
  state.chapter=1;state.echoes.clear();state.waypoint=0;state.completed=false;
  painting.dataset.routeProgress="0";painting.dataset.memoryFound="0";
  music.pause();
  try{music.currentTime=0;}catch(_){}
  syncMusic();
  musicStatus.textContent=previewReady?"Sound is optional. Press Listen to play.":previewUnavailableMessage;
  line.setAttribute("points","54,17");
  count.textContent="00 / 03";
  entries.replaceChildren();
  const prompt=document.createElement("p");prompt.textContent="There are three memories hidden in the mountains.";entries.append(prompt);
  $$("[data-echo]").forEach(btn=>btn.disabled=false);
  $("#finale").hidden=true;$("#journal").hidden=true;
  feedback.textContent="";
  setChapter(1);
  $("#world").scrollIntoView({block:"start",behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
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
void checkPreviewAvailability();
