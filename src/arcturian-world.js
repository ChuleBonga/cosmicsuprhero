// The album website is a clear entry to ONE game, not another minigame.
// Preserve tracklist accessibility and image fallback without game state.
const $=(selector)=>document.querySelector(selector);
const dialog=$("#tracklist-dialog");
function openTracklist(){
  if(!dialog)return;
  if(typeof dialog.showModal==="function")dialog.showModal();
  else dialog.setAttribute("open","");
}
function closeTracklist(){
  if(!dialog)return;
  if(typeof dialog.close==="function")dialog.close();
  else dialog.removeAttribute("open");
}
$("#open-tracklist")?.addEventListener("click",openTracklist);
$("#open-tracklist-bottom")?.addEventListener("click",openTracklist);
$("#close-tracklist")?.addEventListener("click",closeTracklist);
dialog?.addEventListener("click",event=>{if(event.target===dialog)closeTracklist();});
$("#cover-image")?.addEventListener("error",()=>{
  $(".album-cover")?.classList.add("painting--image-error");
});
