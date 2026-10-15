/* Extra per-item personalization fields and selected design preview. */
(()=>{'use strict';
 const form=document.querySelector('#pc-form');if(!form)return;
 const $=id=>document.getElementById(id);
 const params=new URLSearchParams(location.search);
 const designParam=params.get('design');
 const notes=$('pc-notes');
 const decoration=['studio-method','studio-placement','studio-style','studio-finish'];
 const blockTag='--- Additional personalization options ---';
 function priorOptions(){const val=notes.value;const ix=val.indexOf(blockTag);if(ix<0)return null;const tail=val.slice(ix+blockTag.length);const obj={};for(const line of tail.split('\n')){const n=line.indexOf(': ');if(n>0)obj[line.slice(0,n).trim()]=line.slice(n+2).trim();}return obj;}
 const existing=priorOptions();if(existing){for(const [field,label] of [['studio-method','Method'],['studio-placement','Placement'],['studio-style','Style'],['studio-finish','Finish']]){const el=$(field);if(el){const opt=[...el.options].find(x=>x.value===existing[label]);if(opt)el.value=existing[label];}}}
 document.querySelectorAll('[data-swatch]').forEach(btn=>btn.addEventListener('click',()=>{const color=$('pc-colors');color.value=btn.dataset.swatch;document.querySelectorAll('[data-swatch]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));color.dispatchEvent(new Event('input',{bubbles:true}));}));
 const field=$('pc-text'),preview=$('pc-preview');if(field&&preview){field.addEventListener('input',()=>{preview.dataset.changed='yes'});}
 let selected={};
 const editUid=params.get('edit');if(editUid){try{const list=JSON.parse(localStorage.getItem('spiders-basket')||'[]');const p=list.find(x=>x.uid===editUid);if(p){const match=String(p.notes||'').match(/Selected design: ([^\n]+)/);if(match)selected.name=match[1];const idMatch=String(p.notes||'').match(/Design reference ID: ([a-f0-9]{16})/);if(idMatch)selected.id=idMatch[1];}}catch{}}
 const chosen=designParam||selected.id;
 if(chosen){fetch('data/designs.json').then(r=>{if(!r.ok)throw Error('Catalog unavailable');return r.json()}).then(items=>{
  const design=items.find(p=>p.id===chosen);if(!design)return;
  selected={id:design.id,name:design.name};
  const box=$('studio-design-selection');if(box){box.hidden=false;box.replaceChildren();const h=document.createElement('strong');h.textContent='Your chosen design: '+design.name;const a=document.createElement('a');a.href='design.html?id='+encodeURIComponent(design.id);a.textContent='See artwork details →';box.append(h,a);}
  const img=$('pc-image');const holder=img?.parentElement;if(img&&holder&&design.sprite){img.hidden=true;const previous=holder.querySelector('.studio-customized-sprite');previous?.remove();const sp=design.sprite;const el=document.createElement('div');el.className='studio-customized-sprite';el.setAttribute('role','img');el.setAttribute('aria-label',design.name+' saved artwork preview');el.style.backgroundImage='url("'+encodeURI(sp.src).replace(/"/g,'%22')+'")';el.style.backgroundSize=(sp.cols*100)+'% '+(sp.rows*100)+'%';el.style.backgroundPosition=(sp.x/(sp.cols-1)*100)+'% '+(sp.y/(sp.rows-1)*100)+'%';holder.insertBefore(el,holder.firstChild);}
 }).catch(err=>console.warn('Could not show selected design',err));}
 form.addEventListener('submit',()=>{
  // This runs before the existing basket handler; retain each choice in the quote notes.
  const existing=notes.value.split('\n\n'+blockTag)[0];
  const extra=[blockTag,
   'Method: '+$('studio-method').value,
   'Placement: '+$('studio-placement').value,
   'Style: '+$('studio-style').value,
   'Finish: '+$('studio-finish').value];
  if(selected.name)extra.push('Selected design: '+selected.name);
  if(selected.id)extra.push('Design reference ID: '+selected.id);
  notes.value=existing.trim()+'\n\n'+extra.join('\n');
 },true);
})();