/** Continuous during animation, event-driven while paused or motion is reduced. */
export function createAnimationLoop({render,animate,requestFrame=globalThis.requestAnimationFrame.bind(globalThis),cancelFrame=globalThis.cancelAnimationFrame.bind(globalThis),now=()=>performance.now()}) {
  let pending=null,visible=true,last=now();
  function invalidate(){if(visible&&pending===null)pending=requestFrame(tick)}
  function tick(timestamp){pending=null;const dt=Math.max(0,Math.min(.05,(timestamp-last)/1000));last=timestamp;render(dt);if(animate())invalidate()}
  function setVisible(next){visible=next;last=now();if(!visible&&pending!==null){cancelFrame(pending);pending=null}else if(visible)invalidate()}
  return {invalidate,setVisible};
}
