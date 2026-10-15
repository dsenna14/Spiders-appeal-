/* Unified shopping/quote basket across both storefront catalog implementations. */
(() => {
 'use strict';
 const KEY='spiders-basket';
 const safe=()=>{try{const d=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(d)?d.filter(x=>x&&typeof x.title==='string'&&Number.isFinite(Number(x.qty))&&Number(x.qty)>0).slice(0,100):[]}catch{return[]}};
 const save=list=>{try{localStorage.setItem(KEY,JSON.stringify(list));return true}catch{return false}};
 const describe=x=>[x.title,`Quantity: ${Number(x.qty)||1}`,x.size&&`Size: ${x.size}`,x.material&&`Material: ${x.material}`,x.text&&`Personal text: ${x.text}`,x.font&&`Font: ${x.font}`,x.colors&&`Colors: ${x.colors}`,x.deadline&&`Requested date: ${x.deadline}`,x.notes&&`Instructions: ${x.notes}`].filter(Boolean).join('\n');
 const update=()=>{
   const arr=safe(), count=arr.reduce((s,x)=>s+Number(x.qty),0);
   document.querySelectorAll('[data-cart-count]').forEach(el=>{
      const oldCount=(()=>{try{const d=JSON.parse(localStorage.getItem('spiders-project-v1')||'[]');return Array.isArray(d)?d.reduce((sum,it)=>sum+(Number(it.quantity)||0),0):0}catch{return 0}})();
      el.textContent=String(oldCount+count);
   });
   const section=document.querySelector('#product-types-basket'), host=document.querySelector('#product-types-basket-items');
   if(section&&host){
      section.hidden=arr.length===0;host.replaceChildren();
      for(const [i,item] of arr.entries()){
         const article=document.createElement('article');article.className='basket-item';
         const h=document.createElement('h3');h.textContent=item.title;
         const p=document.createElement('p');p.className='basket-details';p.textContent=describe(item);
         const edit=document.createElement('a');edit.className='text-link';edit.href='/product-customize.html?edit='+encodeURIComponent(item.uid||'');edit.textContent='Edit options';
         const remove=document.createElement('button');remove.type='button';remove.className='text-link';remove.textContent='Remove';remove.addEventListener('click',()=>{const next=safe();next.splice(i,1);if(save(next))update()});
         article.append(h,p,edit,remove);host.append(article);
      }
      const empty=document.querySelector('#basket-empty');if(empty)empty.hidden=!!arr.length||!!document.querySelector('#basket-items')?.children.length;
      const clear=document.querySelector('#basket-clear');if(clear)clear.hidden=!arr.length&&!document.querySelector('#basket-items')?.children.length;
      const request=document.querySelector('#basket-request');if(request&&arr.length)request.textContent='Request My Quote';
   }
   const summary=document.querySelector('#basket-summary');if(summary&&arr.length){
       const extra='Additional product-type requests:\n\n'+arr.map(describe).join('\n\n');
       // Main storefront initialized summary from its own basket before this bridge script.
       const base=summary.value||'';if(!base.includes('Additional product-type requests:'))summary.value=(base?base+'\n\n':'')+extra;
       const label=document.querySelector('#basket-summary-label');if(label)label.hidden=false;
   }
 };
 document.addEventListener('DOMContentLoaded',()=>{
   update();
   const clear=document.querySelector('#basket-clear');
   clear?.addEventListener('click',()=>{save([]);queueMicrotask(update)});
   window.addEventListener('storage',update);
 });
})();