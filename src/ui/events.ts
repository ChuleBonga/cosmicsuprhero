export type UIMessage={
  phase?:string; instruction?:string; action?:string|null; actionLabel?:string;
  journal?:string; awake?:number; checkpoint?:string; completed?:boolean;
};
export const announce=(detail:UIMessage)=>window.dispatchEvent(new CustomEvent<UIMessage>('aa:ui',{detail}));
export const onAction=(callback:(name:string)=>void)=>{
 const handler=(event:Event)=>callback((event as CustomEvent<{name:string}>).detail.name);
 window.addEventListener('aa:action',handler);return()=>window.removeEventListener('aa:action',handler);
};
