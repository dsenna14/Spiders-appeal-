(()=>{'use strict';
const c=(window.SPIDERS_DATA?.categories||[]).find(c=>c.id==='custom-nails');
const list=[...new Map((c?.items||[]).map(p=>[p.sourceUrl,p])).values()];
const el=id=>document.getElementById(id),safe=s=>String(s??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
const search=el('nail-search'),style=el('nail-style'),sort=el('nail-sort'),grid=el('nail-grid'),ref=el('nail-design');
ref.append(new Option('Use my own idea','my-own'));
for(const p of list)ref.append(new Option(p.title,p.id));
const choose=id=>{ref.value=id;el('nail-request').scrollIntoView({behavior:'smooth',block:'start'});};
function draw(){
 const q=search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
 let a=list.filter(p=>(!style.value||p.style===style.value)&&q.every(w=>[p.title,p.style,p.description,...(p.tags||[])].join(' ').toLowerCase().includes(w)));
 if(sort.value==='name')a.sort((x,y)=>x.title.localeCompare(y.title));
 if(sort.value==='price-asc')a.sort((x,y)=>x.sourcePriceUSD-y.sourcePriceUSD);
 if(sort.value==='price-desc')a.sort((x,y)=>y.sourcePriceUSD-x.sourcePriceUSD);
 grid.replaceChildren();
 for(const p of a){
   const card=document.createElement('article');card.className='nail-card';
   const photo=document.createElement('a');photo.className='nail-image';photo.href=p.sourceUrl;photo.target='_blank';photo.rel='noopener noreferrer';photo.setAttribute('aria-label','Open source listing and photos for '+p.title);
   if(p.image){const im=document.createElement('img');im.src=p.image;im.alt=p.title+' — Joyee Nails third-party reference photo';im.loading='lazy';im.decoding='async';im.onerror=()=>{im.remove();photo.innerHTML='<div class="nail-no-photo">Open original Joyee Nails photo ↗</div>';};photo.append(im)}
   else photo.innerHTML='<div class="nail-no-photo">See verified source photos ↗</div>';
   const body=document.createElement('div');body.className='nail-body';
   const tag=document.createElement('span');tag.className='nail-meta';tag.textContent=p.style;
   const h=document.createElement('h3');h.textContent=p.title;
   const desc=document.createElement('p');desc.textContent=p.description.split('. Third-party')[0];
   const price=document.createElement('p');price.textContent='Joyee reference: $'+p.sourcePriceUSD.toFixed(2)+' USD';
   const actions=document.createElement('div');actions.className='nail-actions';
   const quote=document.createElement('button');quote.type='button';quote.className='button';quote.textContent='Request similar';quote.addEventListener('click',()=>choose(p.id));
   const source=document.createElement('a');source.className='button secondary';source.href=p.sourceUrl;source.target='_blank';source.rel='noopener noreferrer';source.textContent='Original listing ↗';
   actions.append(quote,source);body.append(tag,h,desc,price,actions);card.append(photo,body);grid.append(card);
 }
 el('nail-status').textContent=a.length+' of '+list.length+' verified source designs. Each appears once.';
}
for(const x of [search,style,sort])x.addEventListener(x===search?'input':'change',draw);
draw();
const selected=new URLSearchParams(location.search).get('design');if(list.some(p=>p.id===selected))ref.value=selected;
el('nail-form').addEventListener('submit',e=>{
e.preventDefault();
const selected=ref.value,p=list.find(p=>p.id===selected),qty=Number(el('nail-qty').value);
if(!Number.isInteger(qty)||qty<1||qty>100){el('nail-message').textContent='Enter a quantity between 1 and 100.';return;}
let current=[];try{current=JSON.parse(localStorage.getItem('spiders-basket')||'[]');if(!Array.isArray(current))current=[]}catch(e){current=[]}
if(current.length>=100){el('nail-message').textContent='Basket full. Remove an item and try again.';return;}
const details=[
'Reference design: '+(p?.title||'My own idea'),
p?'Source listing (reference only): '+p.sourceUrl:'',
'Shape: '+el('nail-shape').value,
'Length: '+el('nail-length').value,
'Size: '+el('nail-size').value,
'Colors: '+(el('nail-colors').value||'Please recommend'),
'Notes: '+el('nail-notes').value.trim(),
'Third-party reference only. Production, rights and costs must be confirmed before any sale.'
].filter(Boolean).join('\n');
current.push({uid:'sc-nails-'+Date.now().toString(36),productId:p?.id||'custom-nails-own',title:'Custom Nails — '+(p?.title||'Original concept'),category:'Custom Nails',qty,material:'Press-on nail set — source and feasibility to confirm',size:el('nail-length').value+' / '+el('nail-shape').value+' / '+el('nail-size').value,text:'',font:'Recommend a font',colors:el('nail-colors').value.trim(),deadline:el('nail-date').value,notes:details.slice(0,1500)});
try{localStorage.setItem('spiders-basket',JSON.stringify(current));location.href='basket.html'}catch(e){el('nail-message').textContent='Could not save basket on this device. Please use the contact form instead.'}
});
})();
