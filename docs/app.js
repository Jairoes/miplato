const foods=[
{id:'pollo',name:'Pollo a la plancha',cat:'protein',emoji:'🍗',portion:'1 filete mediano',g:100,k:165,p:31,c:0,f:3.6,tint:'#f1e8db'},
{id:'pescado',name:'Pescado a la plancha',cat:'protein',emoji:'🐟',portion:'1 filete de bonito',g:120,k:168,p:30,c:0,f:5.3,tint:'#e7eee9'},
{id:'huevo',name:'Huevo sancochado',cat:'protein',emoji:'🥚',portion:'1 unidad mediana',g:50,k:78,p:6.3,c:.6,f:5.3,tint:'#f2ede1'},
{id:'lenteja',name:'Lentejas cocidas',cat:'protein',emoji:'🫘',portion:'½ taza',g:100,k:116,p:9,c:20,f:.4,tint:'#e9e6db'},
{id:'arroz',name:'Arroz blanco cocido',cat:'carb',emoji:'🍚',portion:'½ taza',g:100,k:130,p:2.7,c:28,f:.3,tint:'#efede4'},
{id:'quinua',name:'Quinua cocida',cat:'carb',emoji:'🌾',portion:'½ taza',g:100,k:120,p:4.4,c:21.3,f:1.9,tint:'#ecead9'},
{id:'papa',name:'Papa sancochada',cat:'carb',emoji:'🥔',portion:'1 unidad mediana',g:150,k:131,p:2.9,c:30.2,f:.2,tint:'#efeadc'},
{id:'camote',name:'Camote sancochado',cat:'carb',emoji:'🍠',portion:'1 unidad pequeña',g:130,k:112,p:2,c:26,f:.2,tint:'#f2e3d9'},
{id:'choclo',name:'Choclo desgranado',cat:'carb',emoji:'🌽',portion:'½ taza',g:90,k:86,p:3,c:19,f:1.4,tint:'#f4eed1'},
{id:'ensalada',name:'Ensalada fresca',cat:'veg',emoji:'🥗',portion:'2 tazas · sin aliño',g:150,k:38,p:1.8,c:8,f:.4,tint:'#e7efdc'},
{id:'brocoli',name:'Brócoli al vapor',cat:'veg',emoji:'🥦',portion:'1 taza',g:100,k:35,p:2.4,c:7.2,f:.4,tint:'#e6eddc'},
{id:'zanahoria',name:'Zanahoria cocida',cat:'veg',emoji:'🥕',portion:'½ taza',g:80,k:28,p:.6,c:6.6,f:.2,tint:'#f4e9da'},
{id:'palta',name:'Palta fresca',cat:'fat',emoji:'🥑',portion:'¼ de unidad mediana',g:50,k:80,p:1,c:4.3,f:7.4,tint:'#e7eddb'},
{id:'aceite',name:'Aceite de oliva',cat:'fat',emoji:'🫒',portion:'1 cucharadita',g:5,k:45,p:0,c:0,f:5,tint:'#ededda'},
{id:'mani',name:'Maní tostado',cat:'fat',emoji:'🥜',portion:'1 puñadito · sin sal',g:20,k:117,p:5.2,c:3.2,f:9.9,tint:'#ede3d6'},
{id:'papaya',name:'Papaya fresca',cat:'fruit',emoji:'🍈',portion:'1 taza en cubos',g:140,k:60,p:.7,c:15,f:.4,tint:'#f4e6d5'},
{id:'platano',name:'Plátano de seda',cat:'fruit',emoji:'🍌',portion:'1 unidad pequeña',g:100,k:89,p:1.1,c:22.8,f:.3,tint:'#f3efd5'},
{id:'mandarina',name:'Mandarina',cat:'fruit',emoji:'🍊',portion:'1 unidad mediana',g:90,k:48,p:.7,c:12,f:.3,tint:'#f4e8d7'}
];
const labels={protein:'Proteína',carb:'Carbohidrato',veg:'Verdura',fat:'Grasa',fruit:'Fruta'};
const recipes={costa:{pescado:1,papa:1,ensalada:1,aceite:1},andes:{pollo:1,quinua:1,brocoli:2,aceite:1},veggie:{lenteja:1.5,arroz:1,ensalada:1,palta:1},desayuno:{huevo:2,camote:1,palta:1,papaya:1},casero:{pollo:1,arroz:1,brocoli:1,zanahoria:1,aceite:1},cena:{huevo:2,quinua:1,ensalada:1,palta:1}};
const $=s=>document.querySelector(s);
let state={items:{},meal:'Almuerzo',target:650},category='all',search='',toastTimer;
function readStorage(key,fallback){try{const v=JSON.parse(localStorage.getItem(key));return v??fallback}catch{return fallback}}
let saved=readStorage('mi-plato-saved-v1',[]);if(!Array.isArray(saved))saved=[];
const old=readStorage('mi-plato-current-v1',null);
function validItems(items){if(!items||typeof items!=='object')return {};return Object.fromEntries(Object.entries(items).filter(([id,q])=>foods.some(f=>f.id===id)&&Number.isFinite(q)&&q>0&&q<=10))}
if(old){state.items=validItems(old.items);if(['Desayuno','Almuerzo','Cena'].includes(old.meal))state.meal=old.meal;if(Number.isFinite(old.target)&&old.target>=200&&old.target<=1500)state.target=old.target}
function persist(){try{localStorage.setItem('mi-plato-current-v1',JSON.stringify(state));return true}catch{return false}}
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),3000)}
function clean(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function renderCatalog(){const list=foods.filter(f=>(category==='all'||f.cat===category)&&clean(f.name).includes(clean(search)));$('#results-count').textContent=list.length+' alimentos para elegir';$('#food-grid').innerHTML=list.length?list.map(f=>'<article class="food-card '+(state.items[f.id]?'in-plate':'')+'"><div class="food-visual" style="--tint:'+f.tint+'">'+cutoutVisual(f.id)+'<small class="food-category">'+labels[f.cat]+'</small></div><div class="food-body"><h4>'+f.name+'</h4><p>'+f.portion+' · '+f.g+' g</p><div class="food-bottom"><strong>'+f.k+' <small>kcal</small></strong><button class="add-food" data-add="'+f.id+'" aria-label="Agregar '+f.name+'">+</button></div></div></article>').join(''):'<p class="empty-results">No encontramos ese alimento.<br>Prueba con papa, pollo o quinua.</p>'}
function totals(items=state.items){return Object.entries(items).reduce((t,[id,q])=>{const f=foods.find(f=>f.id===id);if(f){t.k+=f.k*q;t.p+=f.p*q;t.c+=f.c*q;t.f+=f.f*q}return t},{k:0,p:0,c:0,f:0})}

function photoSrc(id){return window.foodPhotos?.[id]?.src || '';}

function cutoutVisual(id,className='food-cutout'){
 const p=window.foodPhotos?.[id];if(!p)return '';
 const b=p.bounds||[0,0,p.width||1280,p.height||1280],pad=Math.max(b[2]-b[0],b[3]-b[1])*.07;
 return '<svg class="'+className+'" viewBox="'+[b[0]-pad,b[1]-pad,b[2]-b[0]+2*pad,b[3]-b[1]+2*pad].join(' ')+'" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><image href="'+p.src+'" width="'+p.width+'" height="'+p.height+'"/></svg>';
}
function foodPlacement(cat,index,count){
 if(cat==='veg'){
  if(count===1)return [40,40,210,210];
  const spots=[[35,115],[115,35],[55,55]];
  return [...spots[index%spots.length],135,135];
 }
 if(cat==='protein'){
  if(count===1)return [200,115,175,175];
  const spots=[[231,120],[231,205],[207,163],[278,166]];
  const s=count>2?83:112;return [...spots[index%spots.length],s,s];
 }
 if(count===1)return [115,200,175,175];
 const spots=[[120,234],[207,234],[166,212],[160,282],[220,283]];
 const s=count>2?80:112;return [...spots[index%spots.length],s,s];
}


function portionServings(entries){
 return entries.flatMap(([id,quantity])=>{
  const count=Math.floor(quantity),fraction=Math.round((quantity-count)*1000)/1000;
  const servings=Array.from({length:count},()=>({id,fraction:1}));
  if(fraction>0)servings.push({id,fraction});
  return servings;
 });
}
function servingLayout(cat,count){
 const radius=164;
 for(let size=150;size>=8;size-=2){
  const gap=Math.min(6,size*.12),slots=[];
  for(let x=gap;x+size<=radius;x+=size+gap){
   const low=cat==='veg'?-radius+gap:gap;
   for(let y=low;y+size<=radius;y+=size+gap){
    const farY=Math.max(Math.abs(y),Math.abs(y+size));
    if(Math.hypot(x+size,farY)<=radius){
     slots.push({x:200+x,y:200+y,w:size,h:size,angle:cat==='veg'?-135:cat==='protein'?-45:45});
    }
   }
  }
  if(slots.length>=count){
   slots.sort((a,b)=>Math.hypot(b.x+b.w/2-200,b.y+b.h/2-200)-Math.hypot(a.x+a.w/2-200,a.y+a.h/2-200));
   return slots.slice(0,count);
  }
 }
 return [];
}
function renderServing(serving,slot,key){
 const {id,fraction}=serving,pic=window.foodPhotos?.[id];
 if(!pic)return '';
 const {x,y,w,h,angle=0}=slot,b=pic.bounds||[0,0,pic.width,pic.height];
 const bw=b[2]-b[0],bh=b[3]-b[1],scale=Math.min(w/bw,h/bh)*.94;
 const px=x+(w-bw*scale)/2-b[0]*scale,py=y+(h-bh*scale)/2-b[1]*scale;
 const partial=fraction<1,clip=key+'-fraction';
 const quantityLabel=partial?(fraction===.5?'media porción':fraction+' de porción'):'1 porción';
 const image='<image href="'+photoSrc(id)+'" x="'+px+'" y="'+py+'" width="'+pic.width*scale+'" height="'+pic.height*scale+'" preserveAspectRatio="none"'+(partial?' clip-path="url(#'+clip+')"':'')+'/>';
 const font=Math.max(9,Math.min(14,w*.22)),badgeX=x+w*.65,badgeY=y+h*.75,badgeWidth=font*1.8;
 const badge=partial?'<g transform="rotate('+(-angle)+' '+badgeX+' '+badgeY+')" class="portion-fraction-badge"><rect x="'+(badgeX-badgeWidth/2)+'" y="'+(badgeY-font)+'" width="'+badgeWidth+'" height="'+font*1.5+'" rx="'+font*.4+'" fill="#224c37" stroke="#fff"/><text x="'+badgeX+'" y="'+badgeY+'" text-anchor="middle" fill="#fff" font-size="'+font+'" font-family="DM Sans,sans-serif">'+(fraction===.5?'½':fraction)+'</text></g>':'';
 return '<g class="plate-serving" data-food="'+id+'" data-fraction="'+fraction+'" role="img" aria-label="'+foods.find(f=>f.id===id).name+': '+quantityLabel+'" transform="rotate('+angle+' 200 200)"><title>'+foods.find(f=>f.id===id).name+' · '+quantityLabel+'</title>'+(partial?'<defs><clipPath id="'+clip+'"><rect x="'+x+'" y="'+y+'" width="'+w*fraction+'" height="'+h+'"/></clipPath></defs>':'')+image+badge+'</g>';
}
function companionServing(id,fraction,index){
 return '<span class="companion-serving'+(fraction<1?' is-partial':'')+'" data-food="'+id+'" data-fraction="'+fraction+'">'+cutoutVisual(id,'extra-cutout')+(fraction<1?'<b class="companion-fraction">'+(fraction===.5?'½':fraction)+'</b>':'')+'</span>';
}

const sectorDefs=[
{cat:'veg',label:'Verduras',fraction:'½',path:'M200 200 L318.79 81.21 A168 168 0 0 0 81.21 318.79 Z',box:[32,32,287,287],spot:[131,157],fill:'#eef4e6'},
{cat:'protein',label:'Proteínas',fraction:'¼',path:'M200 200 L318.79 81.21 A168 168 0 0 1 318.79 318.79 Z',box:[200,81,168,238],spot:[286,203],fill:'#f6eee0'},
{cat:'carb',label:'Carbohidratos',fraction:'¼',path:'M200 200 L318.79 318.79 A168 168 0 0 1 81.21 318.79 Z',box:[81,200,238,168],spot:[200,291],fill:'#eeefde'}
];
function renderPlate(items,prefix='main',interactive=true){
 const groups=sectorDefs.map(s=>{
  const chosen=Object.entries(items).filter(([id])=>foods.find(f=>f.id===id)?.cat===s.cat);
  const clip=prefix+'-'+s.cat;

  const servings=portionServings(chosen);
  const slots=servings.length===1?[{x:foodPlacement(s.cat,0,1)[0],y:foodPlacement(s.cat,0,1)[1],w:foodPlacement(s.cat,0,1)[2],h:foodPlacement(s.cat,0,1)[3],angle:0}]:servingLayout(s.cat,servings.length);
  const images=servings.map((serving,i)=>renderServing(serving,slots[i],prefix+'-'+s.cat+'-'+i)).join('');
  const empty='<text x="'+s.spot[0]+'" y="'+(s.spot[1]-8)+'" class="sector-plus" text-anchor="middle">+</text><text x="'+s.spot[0]+'" y="'+(s.spot[1]+17)+'" class="sector-empty-label" text-anchor="middle">'+s.label+'</text>';
  return '<defs><clipPath id="'+clip+'"><path d="'+s.path+'"/></clipPath></defs><g '+(interactive?'class="plate-sector" role="button" tabindex="0" data-sector="'+s.cat+'" aria-label="Elegir '+s.label.toLowerCase()+' para el plato"':'')+'><path d="'+s.path+'" fill="'+s.fill+'"/><g clip-path="url(#'+clip+')">'+images+'</g>'+(chosen.length?'':empty)+'<path class="sector-outline" d="'+s.path+'" fill="transparent"/></g>';
 }).join('');
 return '<svg class="portion-plate" viewBox="0 0 400 400" role="group" aria-label="Plato dividido en mitad de verduras, un cuarto de proteínas y un cuarto de carbohidratos"><defs><radialGradient id="'+prefix+'-surface"><stop offset="70%" stop-color="#fff"/><stop offset="90%" stop-color="#f6f6f3"/><stop offset="100%" stop-color="#fff"/></radialGradient></defs><circle cx="200" cy="202" r="194" fill="#24462d" opacity=".06"/><circle cx="200" cy="197" r="191" fill="url(#'+prefix+'-surface)" stroke="#e4e8e0" stroke-width="2"/><circle cx="200" cy="200" r="171" fill="#fff" stroke="#e8ebe4" stroke-width="2"/>'+groups+'<path d="M81.21 318.79 L318.79 81.21 M200 200 L318.79 318.79" stroke="#fff" stroke-width="9" fill="none" pointer-events="none"/><path d="M81.21 318.79 L318.79 81.21 M200 200 L318.79 318.79" stroke="#648f72" stroke-width="3" stroke-dasharray="2 7" stroke-linecap="round" fill="none" pointer-events="none"/><circle cx="200" cy="200" r="5" fill="#648f72" stroke="#fff" stroke-width="2" pointer-events="none"/></svg>';
}
function renderCurrentPlate(){
 $('#plate').innerHTML=renderPlate(state.items);
 $('#plate').removeAttribute('style');
 const extras=Object.entries(state.items).filter(([id])=>['fruit','fat'].includes(foods.find(f=>f.id===id)?.cat));

 $('#plate-extras').innerHTML=extras.length?'<span class="extras-title">Para acompañar</span><div class="extras-foods">'+extras.map(([id,q])=>{
  const f=foods.find(f=>f.id===id);
  return '<div class="extra-food"><div class="companion-servings">'+portionServings([[id,q]]).map((serving,index)=>companionServing(id,serving.fraction,index)).join('')+'</div><span>'+f.name+'<small>'+q+' '+(q===1?'porción':'porciones')+' · '+Math.round(f.g*q)+' g</small></span></div>';
 }).join('')+'</div>':'';
}
function selectPlateGroup(cat){
 category=cat;search='';$('#search').value='';
 document.querySelectorAll('[data-cat]').forEach(b=>{b.classList.toggle('selected',b.dataset.cat===cat);b.setAttribute('aria-pressed',String(b.dataset.cat===cat))});
 renderCatalog();$('.catalog').scrollIntoView({behavior:'smooth',block:'start'});
 toast('Elige '+({veg:'verduras',protein:'proteínas',carb:'carbohidratos'}[cat])+' para tu plato');
}

function update(){const t=totals(),entries=Object.entries(state.items);$('#kcal').textContent=Math.round(t.k);$('#protein').textContent=t.p.toFixed(1)+' g';$('#carbs').textContent=t.c.toFixed(1)+' g';$('#fat').textContent=t.f.toFixed(1)+' g';$('#target').value=state.target;$('#reference-label').textContent=state.target+' kcal';$('#energy-fill').style.width=Math.min(t.k/state.target*100,100)+'%';$('#energy-fill').style.background=t.k>state.target?'#dba259':'#95b663';
renderCurrentPlate();
$('#selected-foods').innerHTML=entries.map(([id,q])=>{const f=foods.find(f=>f.id===id);return '<div class="selected-row">'+cutoutVisual(f.id,"selected-cutout")+'<div class="selected-name"><strong>'+f.name+'</strong><small>'+Math.round(q*f.g)+' g · '+Math.round(q*f.k)+' kcal</small></div><div class="quantity"><button data-change="'+id+'" data-delta="-0.5" aria-label="Reducir porción de '+f.name+'">−</button><span>'+q+'</span><button data-change="'+id+'" data-delta="0.5" aria-label="Aumentar porción de '+f.name+'" '+(q>=10?'disabled':'')+'>+</button></div><button class="remove" data-remove="'+id+'" aria-label="Quitar '+f.name+'">×</button></div>'}).join('');
const cats=entries.map(([id])=>foods.find(f=>f.id===id).cat);let title='Un buen plato empieza con variedad',note='Agrega alimentos para descubrir su aporte.';
if(entries.length){if(t.k>state.target){title='Por encima de tu referencia';note='Tu plato supera la referencia en '+Math.round(t.k-state.target)+' kcal. Revisa las porciones según tus necesidades; más calorías no significa una comida mala.'}else if(!cats.includes('veg')){title='Un poco de color le vendría bien';note='Prueba con ensalada, brócoli o zanahoria para incluir verduras.'}else if(!cats.includes('protein')){title='Dale un lugar a la proteína';note='Puedes sumar pescado, huevo, pollo o menestras.'}else if(!cats.includes('carb')){title='Completa tu plato con energía';note='Prueba una porción de papa, quinua, arroz o camote.'}else{title='¡Tu plato tiene variedad!';note='Incluyes verduras, proteína y una fuente de carbohidratos. Ajusta las porciones a tus necesidades.'}}
$('#advice').classList.toggle('high',entries.length>0&&t.k>state.target);$('#advice').innerHTML='<span>✧</span><div><strong>'+title+'</strong><p>'+note+'</p></div>';$('#save').disabled=!entries.length;$('#clear').disabled=!entries.length;$('#saved-count').textContent=saved.length;document.querySelectorAll('[data-meal]').forEach(b=>{b.classList.toggle('selected',b.dataset.meal===state.meal);b.setAttribute('aria-pressed',String(b.dataset.meal===state.meal))});persist()}
function add(id){const q=state.items[id]||0;if(q>=10){toast('Puedes usar hasta 10 porciones por alimento.');return}state.items[id]=q+1>10?10:q+1;renderCatalog();update()}
$('#food-grid').addEventListener('click',e=>{const b=e.target.closest('[data-add]');if(b)add(b.dataset.add)});
$('.categories').addEventListener('click',e=>{const b=e.target.closest('[data-cat]');if(!b)return;category=b.dataset.cat;document.querySelectorAll('[data-cat]').forEach(x=>{x.classList.toggle('selected',x===b);x.setAttribute('aria-pressed',String(x===b))});renderCatalog()});
$('#search').addEventListener('input',e=>{search=e.target.value;renderCatalog()});
$('.meal-switch').addEventListener('click',e=>{const b=e.target.closest('[data-meal]');if(!b)return;state.meal=b.dataset.meal;update();toast('Plato etiquetado como '+state.meal.toLowerCase())});
$('#selected-foods').addEventListener('click',e=>{const r=e.target.closest('[data-remove]'),b=e.target.closest('[data-change]');if(r)delete state.items[r.dataset.remove];else if(b){const id=b.dataset.change;state.items[id]=Math.min(10,state.items[id]+Number(b.dataset.delta));if(state.items[id]<=0)delete state.items[id]}else return;update();renderCatalog()});
$('#target').addEventListener('input',e=>{const n=Number(e.target.value);if(!Number.isFinite(n)||n<200||n>1500){e.target.value=state.target;toast('Elige una referencia entre 200 y 1500 kcal.');return}state.target=n;update()});
$('#clear').addEventListener('click',()=>{state.items={};update();renderCatalog();toast('Plato listo para empezar de nuevo')});
function writeSaved(){try{localStorage.setItem('mi-plato-saved-v1',JSON.stringify(saved));return true}catch{toast('No se pudo guardar: revisa el almacenamiento del navegador.');return false}}
$('#save').addEventListener('click',()=>{if(!Object.keys(state.items).length)return;const item={id:Date.now(),meal:state.meal,items:{...state.items},target:state.target,date:new Date().toLocaleDateString('es-PE')};saved.unshift(item);if(!writeSaved()){saved.shift();return}update();toast('Tu plato se guardó en Mis platos ♡')});
function openModal(title,body){$('#modal-title').textContent=title;$('#modal-body').innerHTML=body;$('#modal').showModal()}
$('#close-modal').addEventListener('click',()=>$('#modal').close());$('#modal').addEventListener('click',e=>{if(e.target===$('#modal')){const r=$('#modal').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#modal').close()}});
function showSaved(){openModal('Mis platos guardados',saved.length?saved.map(s=>{const items=validItems(s.items),t=totals(items);return '<article class="saved-entry"><strong>'+(['Desayuno','Almuerzo','Cena'].includes(s.meal)?s.meal:'Mi plato')+' · '+Math.round(t.k)+' kcal</strong><p>'+Object.entries(items).map(([id,q])=>foods.find(f=>f.id===id).name+' × '+q).join(' · ')+'</p><div class="saved-actions"><button data-load="'+s.id+'">Cargar plato</button><button data-delete="'+s.id+'">Eliminar</button></div></article>'}).join(''):'<p>Aún no tienes platos guardados. Elige ingredientes y pulsa «Guardar mi plato» para conservar tu combinación.</p>')}
$('#open-saved').addEventListener('click',showSaved);
$('#modal-body').addEventListener('click',e=>{const b=e.target.closest('[data-load]'),d=e.target.closest('[data-delete]');if(b){const s=saved.find(s=>String(s.id)===b.dataset.load);if(!s)return;state={items:validItems(s.items),meal:['Desayuno','Almuerzo','Cena'].includes(s.meal)?s.meal:'Almuerzo',target:Number.isFinite(s.target)&&s.target>=200&&s.target<=1500?s.target:650};update();renderCatalog();$('#modal').close();$('#constructor').scrollIntoView({behavior:'smooth'});toast('Plato recuperado')}if(d){const previous=saved;saved=saved.filter(s=>String(s.id)!==d.dataset.delete);if(!writeSaved()){saved=previous;return}$('#modal').close();update();showSaved()}});

const recipeInfo=[{"id":"costa","title":"Pescado con sabor a casa","label":"ALMUERZO · DE LA COSTA","description":"Pescado a la plancha, papa y una ensalada fresca.","why":"Verduras, proteína y un tubérculo de casa.","meal":"Almuerzo"},{"id":"andes","title":"Quinua que te acompaña","label":"ALMUERZO · SABOR ANDINO","description":"Pollo a la plancha, quinua y brócoli al vapor.","why":"Grano andino, proteína y vegetales.","meal":"Almuerzo"},{"id":"veggie","title":"Menestras de toda la vida","label":"ALMUERZO · OPCIÓN VEGETAL","description":"Lentejas con arroz, ensalada y un toque de palta.","why":"Las menestras aportan proteína y carbohidratos.","meal":"Almuerzo"},{"id":"desayuno","title":"Un desayuno de casa","label":"DESAYUNO · PARA EMPEZAR","description":"Huevo sancochado, camote, palta y papaya fresca.","why":"Proteína y fruta para una mañana variada.","meal":"Desayuno"},{"id":"casero","title":"Pollo, arroz y mucho color","label":"ALMUERZO · DE TODOS LOS DÍAS","description":"Pollo con arroz, brócoli y zanahoria, con aceite de oliva.","why":"Una combinación sencilla con dos verduras.","meal":"Almuerzo"},{"id":"cena","title":"Quinua con huevo y ensalada","label":"CENA · FÁCIL DE PREPARAR","description":"Quinua graneada con huevo, ensalada y palta.","why":"Una idea sin carne que puedes ajustar a tu hambre.","meal":"Cena"}];
function renderRecipes(){
 $('.recipe-grid').innerHTML=recipeInfo.map(r=>{
  const items=recipes[r.id],t=totals(items);
  const portions=Object.entries(items).map(([id,q])=>{const f=foods.find(f=>f.id===id);return f.name+' '+Math.round(q*f.g)+' g'}).join(' · ');
  return '<article class="recipe example-dish"><div class="recipe-photo-plate">'+renderPlate(items,'recipe-'+r.id,false)+'</div><div class="recipe-body"><span class="recipe-label">'+r.label+'</span><h3>'+r.title+'</h3><p>'+r.description+'</p><div class="recipe-nutrition"><strong>≈ '+Math.round(t.k)+' kcal</strong><span>'+Math.round(t.p)+' g de proteína</span></div><p class="recipe-why">'+r.why+'</p><details class="recipe-portions"><summary>Ver porciones</summary><p>'+portions+'</p></details><button class="use-recipe" data-recipe="'+r.id+'">Usar este plato ＋</button></div></article>';
 }).join('');
}
renderRecipes();
$('.hero-photo').innerHTML=renderPlate(recipes.andes,'hero',false);
$('.recipe-grid').addEventListener('click',e=>{
 const b=e.target.closest('[data-recipe]');if(!b)return;
 const r=recipeInfo.find(r=>r.id===b.dataset.recipe);
 state.items={...recipes[r.id]};state.meal=r.meal;
 category='all';search='';$('#search').value='';
 document.querySelectorAll('[data-cat]').forEach(x=>{x.classList.toggle('selected',x.dataset.cat==='all');x.setAttribute('aria-pressed',String(x.dataset.cat==='all'))});
 update();renderCatalog();$('#constructor').scrollIntoView({behavior:'smooth'});
 toast('Plato de '+r.meal.toLowerCase()+' listo. Ajusta las porciones a tu gusto.');
});
$('#plate').addEventListener('click',e=>{const s=e.target.closest('[data-sector]');if(s)selectPlateGroup(s.dataset.sector)});
$('#plate').addEventListener('keydown',e=>{const s=e.target.closest('[data-sector]');if(s&&(e.key==='Enter'||e.key===' ')){e.preventDefault();selectPlateGroup(s.dataset.sector)}});
function escapeText(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}

$('#photo-credits').addEventListener('click',()=>openModal('Sobre las imágenes','<p>Los alimentos de las tarjetas y del plato son <strong>imágenes generadas con IA</strong>, con estilo fotográfico y fondo transparente. No incluyen platos, cubiertos ni un ambiente alrededor.</p><p>Son ilustrativas: el tamaño que ves en el plato no representa un peso exacto. Consulta los gramos y las porciones junto a cada alimento.</p><div class="ingredient-previews">'+foods.map(f=>'<div>'+cutoutVisual(f.id)+'<span>'+f.name+'</span></div>').join('')+'</div>'));

function sources(){openModal('Fuentes y cómo calculamos','<p>Los valores del catálogo son <strong>estimaciones educativas por porción comestible</strong>. No son mediciones de tu receta ni una reproducción exacta de una tabla oficial.</p><p>Calculamos cada nutriente multiplicando el valor de la porción por la cantidad elegida y sumando todos los ingredientes. El peso corresponde a alimentos listos para comer; el huevo no incluye cáscara. El aceite, los aliños y las salsas deben añadirse por separado.</p><p>La referencia inicial de <strong>650 kcal es un ejemplo editable</strong>, no una meta recomendada. El indicador compara únicamente energía y presencia de grupos; no evalúa toda la calidad de la dieta, sodio, alergias ni necesidades clínicas.</p><ul><li><a href="https://www.gob.pe/institucion/ins/informes-publicaciones/4231115-tablas-peruanas-de-composicion-de-alimentos" target="_blank" rel="noopener noreferrer">INS: Tablas Peruanas de Composición de Alimentos</a>. Consulta de referencia para alimentos del Perú.</li><li><a href="https://www.who.int/news-room/fact-sheets/detail/healthy-diet" target="_blank" rel="noopener noreferrer">OMS: alimentación saludable</a>. Contexto sobre variedad, vegetales y menestras.</li></ul><p>La clasificación es práctica: las menestras también aportan carbohidratos y la quinua también contiene proteínas. Si necesitas un plan personal, consulta con un nutricionista.</p>')}
$('#sources').addEventListener('click',sources);$('#footer-sources').addEventListener('click',sources);renderCatalog();update();
