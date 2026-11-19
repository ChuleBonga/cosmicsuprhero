import { createFieldWorld } from './world/FieldWorld';
import { availableLocations, consequence } from './aftermath';
import type { Witness } from './encounter';
import './style.css';
import {
  CLUES, FRAGMENTS, INITIAL, WITNESSES, WITNESS_ORDER, replay, transition
} from './encounter';
import type { Choice, Event, Fragment, State } from './encounter';

const SAVE_KEY='arcturian.rebuild.encounter.v1';
const root=document.getElementById('content');
if(!root)throw new Error('Required root node is missing');
const content=root;
let fieldWorld:ReturnType<typeof createFieldWorld>|null=null;
let log:Event[]=[];
try {
  const stored=localStorage.getItem(SAVE_KEY);
  if(stored){
    const parsed:unknown=JSON.parse(stored);
    if(Array.isArray(parsed)&&parsed.length<=100&&parsed.every(x=>typeof x==='object')){
      log=parsed as Event[];
    }
  }
}catch { /* Storage blocked or corrupt; playable without it. */ }
let state:State=replay(log);
function dispatch(event:Event) {
  const next=transition(state,event);
  if(next===state)return;
  log.push(event);
  state=next;
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(log));}catch{ /* memory-only */ }
  render();
  fieldWorld?.refresh();
  // Do not send keyboard/screen-reader focus into the inert chapter while
  // the full-screen spatial investigation is active. The active world owns
  // the interaction until the player explicitly returns to the chapter.
  const world=document.getElementById('world-rehearsal');
  const title=content.querySelector<HTMLElement>('#encounter-title');
  if(title && (!world || world.hidden)){
    title.tabIndex=-1;
    title.focus({preventScroll:true});
  }
}
function node<K extends keyof HTMLElementTagNameMap>(tag:K,text?:string,className?:string):HTMLElementTagNameMap[K] {
  const el=document.createElement(tag);
  if(text!==undefined)el.textContent=text;
  if(className)el.className=className;
  return el;
}
function action(label:string,callback:()=>void,className='action') {
  const b=node('button',label,className);
  b.type='button';
  b.addEventListener('click',callback);
  return b;
}
function heading(title:string,sub:string) {
  content.append(node('p','The arrival quarter / incomplete art','eyebrow'));
  const h=node('h2',title);h.id='encounter-title';content.append(h);
  content.append(node('p',sub,'instruction'));
}
function render() {
  content.replaceChildren();
  if(state.phase==='hear'){
    heading('What happened here?','Listen to each account. The three witnesses remember the same event differently.');
    const grid=node('div',undefined,'witnesses');
    for(const witness of WITNESS_ORDER){
      const info=WITNESSES[witness];
      const card=node('article',undefined,'witness');
      card.append(node('h3',info.role));
      if(state.heard.includes(witness)){
        card.append(node('p',info.statement));
        card.append(node('span','ACCOUNT RECORDED','recorded'));
      }else{
        card.append(node('p','An account you have not heard.'));
        card.append(action('Hear '+info.role,()=>dispatch({type:'HEAR',witness})));
      }
      grid.append(card);
    }
    content.append(grid);
    content.append(node('p',String(state.heard.length)+' / 3 accounts heard','counter'));
  }else if(state.phase==='reconstruct'){
    heading('Reconstruct the night','Choose the order of the three events. Your reading of the evidence determines what you can ask next.');
    content.append(node('p','Select each event in the sequence you believe happened.','instruction'));
    const choices=node('div',undefined,'evidence');
    for(const key of FRAGMENTS) {
      const info=CLUES[key];
      const selected=state.order.includes(key);
      const card=node('article',undefined,'evidence-item');
      card.append(node('h3',info.title),node('p',info.evidence));
      card.append(action(selected?'Selected': 'Add to sequence',()=> {
        const order=selected?state.order.filter(x=>x!==key):[...state.order,key];
        dispatch({type:'ARRANGE',order:order as Fragment[]});
      },selected?'action selected':'action'));
      choices.append(card);
    }
    content.append(choices);
    const path=node('ol',undefined,'order');
    for(const f of state.order)path.append(node('li',CLUES[f].title));
    content.append(path);
    const controls=node('div',undefined,'controls');
    controls.append(action('Clear order',()=>dispatch({type:'ARRANGE',order:[]}),'action subdued'));
    const check=action('Present your reconstruction',()=>dispatch({type:'SUBMIT'}));
    check.disabled=state.order.length!==3;controls.append(check);
    content.append(controls);
    if(state.lastError)content.append(node('p',state.lastError,'error'));
    content.append(node('p','Trust remaining: '+state.trust+' / 2. Attempts: '+state.attempts,'counter'));
  }else if(state.phase==='decide'){
    heading('The choice','The message reached the refuge before the hall failed. The silence was real, but the message was not lost.');
    content.append(node('p','The caretaker asks whether to make the hidden record public now, or preserve its location while the families are consulted.','instruction'));
    const choices=node('div',undefined,'decision-grid');
    choices.append(decision('Protect the location','Give families time to decide together. The caretaker trusts Chule, but the district remains uncertain.','protect'));
    choices.append(decision('Disclose the record','Tell everyone where it was kept. The district knows the truth, but the caretaker questions Chule’s judgment.','disclose'));
    content.append(choices);
  }else{
    const ending=state.choice==='protect'
      ? (state.trust>0
        ? 'Chule protects the families’ confidence. The caretaker agrees to help him reach Credo, while the wider community still needs answers.'
        : 'Chule keeps the record private, but his mistaken accusations have damaged trust. The caretaker will not speak for him to Credo.')
      : (state.trust>0
        ? 'Chule reveals the record. The community can respond openly, while the caretaker questions his judgment.'
        : 'Chule reveals the record after misreading the witnesses. Some welcome the truth, but his credibility has been damaged.');
    heading('A consequence, not a collectible',ending);
    content.append(node('p','The next scene is deliberately locked until the civilization, character performances, and approved script meet the quality gate.','instruction'));
    const locations=availableLocations(state);
    content.append(node('p','Revisit the district through individual accounts. Access and character willingness now depend on both your decision and the trust you earned. This is a mechanical prototype, not yet 3D gameplay.','instruction'));
    const responses=node('div',undefined,'witnesses');
    const result=node('p','Select someone to hear the later consequence.','instruction');
    result.setAttribute('role','status');
    for(const witness of ['caretaker','courier','apprentice'] as Witness[]){
      const outcome=consequence(state,witness);
      const card=node('article',undefined,'witness');
      card.append(node('h3',WITNESSES[witness].role));
      card.append(node('p',outcome.available?'Available to speak':'Unavailable because of earlier choices'));
      const btn=action('Approach '+WITNESSES[witness].role,()=>{result.textContent=outcome.response;});
      btn.disabled=!outcome.available;card.append(btn);responses.append(card);
    }
    content.append(responses,result);
    content.append(node('p','Accessible destinations: '+(locations.join(', ')||'None unlocked')+' (world geometry pending).','counter'));
    content.append(node('span','MECHANIC PROTOTYPE COMPLETE / STORY NOT YET APPROVED','recorded'));
  }
}
function decision(label:string,description:string,choice:Choice) {
  const card=node('article',undefined,'decision');
  card.append(node('h3',label),node('p',description));
  card.append(action('Choose: '+label,()=>dispatch({type:'CHOOSE',choice})));
  return card;
}
const reset=document.getElementById('reset');
reset?.addEventListener('click',()=>{
  log=[];state=INITIAL;
  try{localStorage.removeItem(SAVE_KEY);}catch{}
  render();
  fieldWorld?.refresh();
});
render();

// One renderer for the authored 3D spatial slice. The legacy decorative
// light-only renderer has been removed. Story cards remain as the accessible
// fallback until the physical dialogue and characters pass their art gates.
fieldWorld=createFieldWorld({
 getState:()=>state,
 dispatch,
 onExit:()=>{ /* Keeps the investigation page and current saved state intact. */ }
});
document.getElementById('enter-quarter')?.addEventListener('click',()=>fieldWorld?.open());
