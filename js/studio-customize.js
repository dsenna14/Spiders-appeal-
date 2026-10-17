/* Spider's Creations — item personalization, live summary and real saved artwork picker. */
(()=>{
 'use strict';
 const form=document.getElementById('pc-form');if(!form)return;
 const $=id=>document.getElementById(id);
 const params=new URLSearchParams(location.search);
 const stored=()=>{try{const value=JSON.parse(localStorage.getItem('spiders-basket')||'[]');return Array.isArray(value)?value:[]}catch{return[]}};
 const draft=params.get('edit')?stored().find(x=>x.uid===params.get('edit')):null;
 const all=(window.SPIDERS_DATA?.categories||[]).flatMap(c=>(c.items||[]).map(p=>({...p,category:c.id,collection:c.name})));
 const chosenProduct=all.find(p=>p.id===(draft?.productId||params.get('id')));
 if(!chosenProduct)return;
 const category=chosenProduct.category,notes=$('pc-notes'),name=$('pc-text'),preview=$('pc-preview');
 const idKey='--- Additional personalization options ---';
 const controlNames=[['studio-method','Method'],['studio-placement','Placement'],['studio-style','Style'],['studio-finish','Finish']];
 const readStoredOptions=()=>{const val=notes.value||'';const index=val.indexOf(idKey);if(index<0)return {};const map={};for(const line of val.slice(index+idKey.length).split('\n')){const i=line.indexOf(': ');if(i>0)map[line.slice(0,i).trim()]=line.slice(i+2).trim()}return map};
 const options=readStoredOptions();for(const [id,label] of controlNames){const el=$(id);if(el&&options[label]&&[...el.options].some(x=>x.value===options[label]))el.value=options[label]}
 const back=$('studio-back-to-collection');if(back){back.href='collection.html?category='+encodeURIComponent(category);back.textContent='← Back to '+chosenProduct.collection}
 const recommend={
  hypechains:{materials:['Printed plastic','PLA/PETG plastic','Metal-look finish','Customer-supplied blank'],size:'Pendant height, chain length and preferred weight',tip:'Hype chain artwork is a design concept. Choose your team-inspired theme, name, number, pendant size and finish.'},
  puzzles:{materials:['Printed cardboard','Wood','Acrylic'],size:'Puzzle dimensions and preferred piece count',tip:'For photo puzzles, choose the photo, dimensions, piece count and packaging style.'},
  'phone-cases':{materials:['Printed plastic','Clear hard case','White hard case','Customer-supplied blank'],size:'Exact iPhone/Android model and generation',tip:'Provide your exact phone model to confirm the camera opening and fit.'},
  balloons:{materials:['Latex balloon','Foil balloon','Helium-filled','Air-filled'],size:'Balloon diameter, count, bouquet or arch length',tip:'Tell us the event date, theme, pickup/delivery preference and balloon quantity.'},
  tumblers:{materials:['Stainless steel','Powder-coated stainless steel','Customer-supplied blank'],size:'e.g. 20 oz, 30 oz, 40 oz; handle or straw preference',tip:'For full-wrap artwork, tell us the tumbler model and capacity so we can confirm fit.'},
  wraps:{materials:['Stainless steel','Powder-coated stainless steel','Customer-supplied blank'],size:'e.g. 20 oz skinny, 30 oz or handled 40 oz',tip:'Printed artwork may differ by tumbler coating and curved surface.'},
  boards:{materials:['Wood','Bamboo','Walnut','Maple','Customer-supplied blank'],size:'e.g. 12 × 9 in or preferred board dimensions',tip:'Names, family recipes and monograms are popular starting points. Wood grain affects engraving contrast.'},
  coins:{materials:['Brass/metal','Antique brass','Copper','Stainless steel'],size:'e.g. 38 mm or 40 mm diameter',tip:'Include preferred diameter, relief depth, edge style and whether both sides need artwork.'},
  medals:{materials:['Brass/metal','Gold-tone metal','Silver-tone metal','Acrylic'],size:'e.g. 50 mm diameter and ribbon length',tip:'Include winner names, dates and ribbon requests in your notes.'},
  golf:{materials:['Printed golf ball','Acrylic','Metal','Fabric'],size:'Golf ball / bag tag / towel / accessory size',tip:'For golf balls, share a high-resolution logo or monogram and your preferred ball brand.'},
  sportsgear:{materials:['Wood','Metal','Leather','Printed plastic','Customer-supplied blank'],size:'Ball, bat, puck or display-item model',tip:'Sporting equipment is customized for decoration and gifting; playing suitability is confirmed separately.'},
  keychains:{materials:['Stainless steel','Acrylic','Wood','Leather','Printed plastic'],size:'e.g. 2 in diameter or preferred length',tip:'Please specify the keyring shape, engraving side and any image or name details.'},
  magnets:{materials:['Flexible magnetic material','Acrylic','Wood','Printed plastic'],size:'e.g. 2 × 3 in or custom shape',tip:'Tell us whether your magnet is for a fridge, display or a branded giveaway.'},
  glassware:{materials:['Glass','Frosted glass','Customer-supplied blank'],size:'e.g. wine glass, rocks glass, 16 oz mug',tip:'Single-color line artwork typically reproduces more clearly with etched glass.'},
  lighters:{materials:['Brass/metal','Stainless steel','Customer-supplied blank'],size:'Exact lighter case model and engraving surface',tip:'Share the lighter or case model before we confirm compatibility.'},
  printing3d:{materials:['Printed plastic','PLA','PETG','ABS/ASA'],size:'Exact dimensions, model or printer-fit requirements',tip:'Provide measurements and intended use for custom 3D prints; load-bearing parts require suitability review.'},
  apparel:{materials:['Fabric','Cotton','Polyester blend'],size:'Garment sizes and quantities by size',tip:'Share garment color, size range and front/back print placement.'},
  printing:{materials:['Fabric','Paper','Canvas','Acrylic'],size:'Print dimensions or garment sizes',tip:'Send your highest-quality original artwork for a cleaner printed result.'},
  patches:{materials:['Leather','Leatherette','Fabric'],size:'Patch diameter, garment or hat style',tip:'Logos and text must suit the patch size and engraving/transfer process.'}
 };
 const suggestion=recommend[category];if(suggestion){const material=$('pc-material'),old=material.value;material.replaceChildren(new Option('Please recommend','Discuss options'));for(const item of suggestion.materials)material.append(new Option(item,item));if(old&&[...material.options].some(x=>x.value===old))material.value=old;const size=$('pc-size');if(size)size.placeholder=suggestion.size;const hint=document.createElement('p');hint.className='studio-category-tip';hint.textContent=suggestion.tip;const intro=$('pc-description');intro?.insertAdjacentElement('afterend',hint)}
 const toneMap={'Black & gold':'#f0ce93','Navy blue':'#c9dbfc','Rose gold':'#f4c7ba','Emerald green':'#b6f5d7','Burgundy':'#fac5d7','White & silver':'#f8f8f5'};
 let selected={id:'',name:''};if(params.get('design'))selected.id=params.get('design');if(draft){const match=String(draft.notes||'').match(/Design reference ID: ([^\s\n]+)/);if(match)selected.id=match[1];const nameMatch=String(draft.notes||'').match(/Selected design: ([^\n]+)/);if(nameMatch)selected.name=nameMatch[1]}
 const showSelection=design=>{
  selected={id:design.id,name:design.name};const img=$('pc-image'),holder=img?.parentElement;if(holder){holder.querySelector('.studio-customized-sprite')?.remove();if(img)img.hidden=true;const sp=design.sprite;if(sp){const el=document.createElement('div');el.className='studio-customized-sprite';el.setAttribute('role','img');el.setAttribute('aria-label',design.name+' artwork inspiration');el.style.backgroundImage='url("'+encodeURI(sp.src).replace(/"/g,'%22')+'")';el.style.backgroundSize=(sp.cols*100)+'% '+(sp.rows*100)+'%';el.style.backgroundPosition=(sp.x/(sp.cols-1)*100)+'% '+(sp.y/(sp.rows-1)*100)+'%';holder.insertBefore(el,holder.firstChild)}}
  const box=$('studio-design-selection');if(box){box.hidden=false;box.replaceChildren();const text=document.createElement('strong');text.textContent='Selected artwork: '+design.name;const see=document.createElement('a');see.href=design.productCategory?'shop.html?type='+encodeURIComponent(category)+'#shop-designs':'design.html?id='+encodeURIComponent(design.id);see.textContent='View design details →';const clear=document.createElement('button');clear.type='button';clear.className='studio-remove-design';clear.textContent='Choose without this design';clear.addEventListener('click',()=>{selected={id:'',name:''};holder?.querySelector('.studio-customized-sprite')?.remove();if(img)img.hidden=false;box.hidden=true;const u=new URL(location.href);u.searchParams.delete('design');history.replaceState(null,'',u.pathname+u.search);drawPicker();updateSummary()});box.append(text,see,clear)}
  const u=new URL(location.href);u.searchParams.set('design',design.id);history.replaceState(null,'',u.pathname+u.search);drawPicker();updateSummary()
 };
 let designs=[];
 const picker=$('studio-choose-design'),pickerItems=$('studio-design-picker-items');
 const drawPicker=()=>{if(!pickerItems||!picker)return;const filtered=designs.filter(p=>p.id!==selected.id).slice(0,7);picker.hidden=filtered.length===0;pickerItems.replaceChildren();for(const p of filtered){const btn=document.createElement('button');btn.type='button';btn.className='studio-pick-art';btn.setAttribute('aria-label','Use '+p.name);const sprite=p.sprite,thumb=document.createElement('span');thumb.className='studio-pick-sprite';thumb.setAttribute('role','img');thumb.setAttribute('aria-label',p.name+' saved design');thumb.style.backgroundImage='url("'+encodeURI(sprite.src).replace(/"/g,'%22')+'")';thumb.style.backgroundSize=(sprite.cols*100)+'% '+(sprite.rows*100)+'%';thumb.style.backgroundPosition=(sprite.x/(sprite.cols-1)*100)+'% '+(sprite.y/(sprite.rows-1)*100)+'%';const label=document.createElement('span');label.textContent=p.name;btn.append(thumb,label);btn.addEventListener('click',()=>showSelection(p));pickerItems.append(btn)}};
 if(['tumblers','wraps','coins'].includes(category)){fetch('data/designs.json').then(r=>{if(!r.ok)throw Error('Designs not available');return r.json()}).then(all=>{const coin=category==='coins';const array=all.filter(p=>p.sprite&&(coin?p.kind==='coin-concept':p.kind!=='coin-concept'));const picks=[],seen=new Set();for(const p of array){if(!seen.has(p.category)){seen.add(p.category);picks.push(p)}}designs=[...picks,...array.filter(p=>!picks.some(x=>x.id===p.id))];if(selected.id){const item=all.find(p=>p.id===selected.id&&(coin?p.kind==='coin-concept':p.kind!=='coin-concept'));if(item)showSelection(item)}drawPicker()}).catch(err=>console.warn('Artwork picker unavailable',err))}
 if(['hypechains','puzzles','boards','phone-cases'].includes(category)){
  fetch('data/grok-designs.json').then(r=>{if(!r.ok)throw Error('New designs unavailable');return r.json()}).then(payload=>{
    designs=(payload.designs||[]).filter(p=>p.productCategory===category&&p.sprite);
    if(selected.id){const matched=designs.find(p=>p.id===selected.id);if(matched)showSelection(matched)}
    drawPicker();
    const allLink=picker?.querySelector('a');if(allLink){allLink.href='shop.html?type='+encodeURIComponent(category)+'#shop-designs';allLink.textContent='More '+chosenProduct.collection+' designs →'}
  }).catch(err=>console.warn('Could not load imported designs',err));
 }
 function updateSummary(){const heading=$('studio-summary-item'),details=$('studio-summary-details'),qty=$('studio-summary-qty');if(heading)heading.textContent=chosenProduct.title;if(qty)qty.textContent=$('pc-qty')?.value||'1';if(details){const bits=[];if(name.value.trim())bits.push('Text: '+name.value.trim().slice(0,40));if($('pc-size')?.value.trim())bits.push('Size: '+$('pc-size').value.trim().slice(0,42));if($('pc-material')?.value!=='Discuss options')bits.push($('pc-material').value);if($('studio-method')?.value!=='Please recommend')bits.push($('studio-method').value);if(selected.name)bits.push('Artwork: '+selected.name);details.textContent=bits.length?bits.join(' · '):'Choose your preferences above'}
  if(preview){const tone=toneMap[$('pc-colors')?.value]||'#f4ede1';preview.style.color=tone;const placement=$('studio-placement')?.value;preview.style.left=placement==='Edge / rim'?'8%':'10%';preview.style.right=placement==='Edge / rim'?'auto':'10%';preview.style.bottom=placement==='Edge / rim'?'12%':'7%';preview.style.maxWidth='82%'}
 }
 for(const el of form.querySelectorAll('input,select,textarea')){el.addEventListener('change',updateSummary);el.addEventListener('input',updateSummary)}
 document.querySelectorAll('[data-swatch]').forEach(btn=>btn.addEventListener('click',()=>{const color=$('pc-colors');color.value=btn.dataset.swatch;document.querySelectorAll('[data-swatch]').forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));color.dispatchEvent(new Event('input',{bubbles:true}))}));
 form.addEventListener('submit',()=>{
  // Capture runs before the existing quote-basket handler so every personalization option travels with the project.
  const clean=notes.value.split('\n\n'+idKey)[0].trim();const extra=[idKey,...controlNames.map(([id,label])=>label+': '+$(id).value)];if(selected.id)extra.push('Selected design: '+selected.name,'Design reference ID: '+selected.id);notes.value=clean+'\n\n'+extra.join('\n');
 },true);
 updateSummary();
})();