const $=id=>document.getElementById(id),defaults=()=>({coreShape:'circle',coreColor:'#ffca36',petalShape:'circle',color:'#ed2996',count:5});let model=defaults(),saved=[];try{saved=JSON.parse(localStorage.getItem('inbloom-drafts')||'[]')}catch{}if(!Array.isArray(saved))saved=[];
const petalNames={circle:'圆瓣',ellipse:'长椭圆',square:'长方形',point:'尖瓣'},coreNames={circle:'圆形',ellipse:'椭圆',square:'方形',point:'菱形',star:'星形',scallop:'小花',ring:'圆环',dots:'花蕊'};
function shape(type,color,isCore=false){let attrs=`fill="${color}"`;if(type==='circle')return `<circle r="${isCore?21:31}" ${attrs}/>`;if(type==='ellipse')return `<ellipse rx="${isCore?16:18}" ry="${isCore?23:45}" ${attrs}/>`;if(type==='square')return `<rect x="${isCore?-19:-17}" y="${isCore?-19:-45}" width="${isCore?38:34}" height="${isCore?38:90}" rx="${isCore?3:5}" ${attrs}/>`;if(type==='point')return `<path d="M0 ${isCore?-25:-46}L${isCore?25:22} 0L0 ${isCore?25:46}L${isCore?-25:-22} 0Z" ${attrs}/>`;if(type==='ring')return `<circle r="20" fill="none" stroke="${color}" stroke-width="9"/>`;if(type==='dots'){let out=`<circle r="6" ${attrs}/>`;for(let i=0;i<7;i++){let a=i*6.283/7;out+=`<circle cx="${Math.cos(a)*16}" cy="${Math.sin(a)*16}" r="5" ${attrs}/>`}return out;}let pts=[];for(let i=0;i<80;i++){let a=i*6.283/80,r=type==='star'?16+8*Math.cos(a*5):19+4*Math.cos(a*7);pts.push(`${Math.cos(a)*r},${Math.sin(a)*r}`)}return `<polygon points="${pts.join(' ')}" ${attrs}/>`}
function svg(f,interactive=false){let petals=`<circle r="26" fill="${f.color}"/>`;for(let i=0;i<f.count;i++)petals+=`<g transform="rotate(${i*360/f.count}) translate(0 32)">${shape(f.petalShape,f.color)}</g>`;return `<svg viewBox="-95 -95 190 190" role="img" aria-label="${f.count}瓣自定义花朵"><g ${interactive?'data-part="petal" tabindex="0" role="button" aria-label="编辑花瓣"':''}>${petals}</g><g ${interactive?'data-part="core" tabindex="0" role="button" aria-label="编辑花心"':''}><circle r="29" fill="transparent"/>${shape(f.coreShape,f.coreColor,true)}</g></svg>`}
const MAX_FLOWERS=24;
const capacityMessage=()=>`已保存 ${saved.length} 种花。请先删除至少一种，再继续设计。`;
function canEdit(){if(saved.length<MAX_FLOWERS)return true;$('notice').textContent=capacityMessage();return false;}
function updateCapacity(){
  const full=saved.length>=MAX_FLOWERS;
  $('plant').disabled=full;
  $('more').disabled=full;
  $('count').disabled=full;
  $('flower').setAttribute('aria-disabled',String(full));
  document.querySelectorAll('.arc-item').forEach(button=>button.disabled=full);
  document.body.classList.toggle('pool-full',full);
  if(full)$('notice').textContent=capacityMessage();
}
let editing='petal',colorIndex=0,shapeIndex=0;
const colors=['#ed2996','#ff68b4','#ff9bc9','#f6bddb','#e6436f','#f3300c','#ff5a45','#ff792a','#ffa34d','#ffc176','#ffca36','#ffe66b','#fff1a6','#fff1d1','#c9d82f','#a6b51d','#78c84a','#65bd83','#27b883','#1a734d','#15c5b8','#23c9cf','#5edce0','#86d9f1','#34a9ef','#4e68eb','#3354bc','#29357b','#7b34ed','#9865ec','#b791df','#d2b1f3','#d641c8','#8d3c94','#7f513d','#b87953','#dcaa79','#f1cfab','#ffffff','#283c2d'];
function draw(){ $('flower').innerHTML=svg(model,true);$('countValue').value=model.count+' 瓣';$('count').value=model.count;renderWheels();updateCapacity();}
function step(n){editing=n===1?'core':'petal';const names=editing==='core'?coreNames:petalNames;shapeIndex=Object.keys(names).indexOf(model[editing+'Shape']);const col=model[editing==='core'?'coreColor':'color'];colorIndex=Math.max(0,colors.indexOf(col));$('editing').textContent=editing==='core'?'正在雕琢 · 花心':'正在雕琢 · 花瓣';draw()}
function renderWheels(){for(const side of ['colors','shapes']){const host=$(side);host.replaceChildren();let entries=side==='colors'?colors:Object.keys(editing==='core'?coreNames:petalNames),index=side==='colors'?colorIndex:shapeIndex;for(let offset=-2;offset<=2;offset++){const idx=(index+offset+entries.length)%entries.length;let b=document.createElement('button');b.className='arc-item'+(offset===0?' selected':'');let angle=offset*.62;let x=(side==='colors'?1:-1)*(132*Math.cos(angle)),y=132*Math.sin(angle);x+=side==='colors'?0:200;y+=150;b.style.transform=`translate(${x}px,${y}px) scale(${offset===0?1.17:.84})`;b.style.opacity=offset===0?1:.65;let key=entries[idx];if(side==='colors'){b.style.background=key;b.setAttribute('aria-label','选择颜色 '+key)}else{b.innerHTML=`<svg viewBox="-55 -55 110 110">${shape(key,'#44633c',editing==='core')}</svg>`;b.setAttribute('aria-label',(editing==='core'?coreNames:petalNames)[key]);}b.onclick=()=>{if(!canEdit())return;if(side==='colors'){colorIndex=idx;model[editing==='core'?'coreColor':'color']=key;}else{shapeIndex=idx;model[editing+'Shape']=key}draw()};host.append(b)}}}
function turn(side,delta){if(!canEdit())return;let list=side==='colors'?colors:Object.keys(editing==='core'?coreNames:petalNames);if(side==='colors'){colorIndex=(colorIndex+delta+list.length)%list.length;model[editing==='core'?'coreColor':'color']=list[colorIndex];}else{shapeIndex=(shapeIndex+delta+list.length)%list.length;model[editing+'Shape']=list[shapeIndex]}draw()}
for(const side of ['colors','shapes']){let locked=false;$(side).onwheel=e=>{e.preventDefault();if(locked)return;locked=true;turn(side,e.deltaY>0?1:-1);setTimeout(()=>locked=false,160)};let startY=0;$(side).onpointerdown=e=>{startY=e.clientY};$(side).onpointerup=e=>{if(Math.abs(e.clientY-startY)>22)turn(side,e.clientY<startY?1:-1)};}
$('flower').onclick=e=>{let part=e.target.closest('[data-part]');if(part)step(part.dataset.part==='core'?1:2)};$('flower').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();(()=>{const part=e.target.closest('[data-part]');if(part)step(part.dataset.part==='core'?1:2)})()}};
$('count').oninput=e=>{if(!canEdit()){e.target.value=model.count;return}model.count=Number(e.target.value);draw()};
function persist(){
  try{localStorage.setItem('inbloom-drafts',JSON.stringify(saved));renderSaved();return true}
  catch{$('notice').textContent='保存失败，请检查浏览器存储设置。当前设计已保留。';return false}
}
function renderSaved(){
  $('total').textContent=' · '+saved.length+' / '+MAX_FLOWERS+' 种';
  $('saved').replaceChildren();
  saved.forEach((f,i)=>{
    const card=document.createElement('div');card.className='card';card.innerHTML=svg(f);
    const button=document.createElement('button');button.textContent='移除第 '+(i+1)+' 种';
    button.onclick=()=>{
      const removed=saved.splice(i,1)[0];
      if(!persist()){saved.splice(i,0,removed);return}
      draw();
      $('notice').textContent=saved.length>=MAX_FLOWERS?capacityMessage():'已移除一种花，可以继续设计。当前设计已保留。';
    };
    card.append(button);$('saved').append(card);
  });
  $('plantSaved').disabled=!saved.length||saved.length>MAX_FLOWERS;
  updateCapacity();
}
function plant(list){
  if(list.length>MAX_FLOWERS){$('notice').textContent=capacityMessage();return}
  try{
    localStorage.setItem('inbloom-drafts',JSON.stringify(list));
    localStorage.setItem('inbloom-pool',JSON.stringify(list));
    location.href='./';
  }catch{$('notice').textContent='无法保存花池，请检查浏览器存储设置。当前设计已保留。';}
}
$('more').onclick=()=>{
  if(!canEdit())return;
  saved.push({...model});
  if(!persist()){saved.pop();return}
  if(saved.length>=MAX_FLOWERS){draw();$('notice').textContent=capacityMessage();return}
  $('notice').textContent='已保存。继续设计下一朵，或将已保存的花放入花池。';
  model=defaults();step(2);
};
$('plant').onclick=()=>{if(canEdit())plant([...saved,{...model}])};
$('plantSaved').onclick=()=>plant(saved);
$('restore').onclick=()=>{localStorage.removeItem('inbloom-pool');location.href='./'};
draw();renderSaved();

step(2);

$('saved').addEventListener('wheel',e=>{if($('saved').scrollWidth>$('saved').clientWidth&&Math.abs(e.deltaY)>Math.abs(e.deltaX)){e.preventDefault();$('saved').scrollLeft+=e.deltaY}},{passive:false});
