/* Spider's Creations — customer-facing collection pages. Never invent inventory or prices. */
(() => {
 'use strict';
 const main=document.querySelector('main[data-collection]');if(!main)return;
 const $=selector=>document.querySelector(selector);
 const params=new URLSearchParams(location.search);
 const categories=window.SPIDERS_DATA?.categories||[];
 const cat=categories.find(c=>c.id===params.get('category'));
 const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const normalized=s=>String(s||'').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const productLink=id=>'product-customize.html?id='+encodeURIComponent(id);
 const designLink=(id,coin)=>'product-customize.html?id='+encodeURIComponent(coin?'coins-1':'tumblers-1')+'&design='+encodeURIComponent(id);
 const photoMap={tumblers:'collection-tumblers.webp',coins:'collection-awards.webp',engraving:'collection-signs-decor.webp',boards:'collection-kitchenware.webp',glassware:'collection-glassware.webp',awards:'collection-trophies.webp',medals:'collection-medals.webp',wedding:'collection-wedding.webp',printing:'collection-printing.webp',patches:'collection-apparel.webp',lighters:'collection-lighters.webp',bottles:'collection-liquor-bottles.webp',canvas:'collection-canvas.webp',printing3d:'collection-gaming.webp',transfers:'collection-transfers.webp',gifts:'collection-wedding.webp',metal:'collection-awards.webp',promo:'collection-printing.webp',wraps:'collection-tumblers.webp',coasters:'collection-kitchenware.webp'};
 // Product groupings are merchandising navigation only. Each product appears in exactly one subgroup.
 const rules={
  tumblers:[['Tumblers by size',/\b(20|30|40)\s*oz\b|skinny|insulated|handled|straw/i],['Sports & teams',/sport|team|football|basketball|hockey|baseball|soccer/i],['Fishing & outdoors',/fish|camp|coast|boat|outdoor/i],['Animals & botanicals',/wildlife|animal|floral|botanic/i],['Creative styles',/psychedelic|abstract|fantasy|anime|holiday|photo/i]],
  boards:[['Cutting & butcher boards',/cutting|butcher|recipe/i],['Serving & charcuterie',/charcuterie|serving|tray/i],['Home & gift sets',/coaster|housewarm|gift|logo/i]],
  coins:[['Military & first responders',/military|veteran|firefight|police|responder/i],['Graduation & milestones',/gradua|retire|birthday|annivers|recognition/i],['Fantasy & history',/fantasy|viking|norse|medieval|dragon/i],['Animals & wildlife',/animal|wildlife|nature/i]],
  magnets:[['Photo & personal magnets',/photo|name|fridge|acrylic/i],['Occasions & events',/wedding|save.the.date/i],['Team & business magnets',/business|sport|logo|car|toolbox/i],['Magnetic accessories',/opener|calendar/i]],
  keychains:[['Engraved & metal',/engraved|metal|opener/i],['Photos & names',/acrylic|wood|name|photo/i],['Sports, pets & teams',/pet|team|golf|bag/i],['Business & gifts',/business|graduat/i]],
  golf:[['Golf balls & sets',/ball|monogram/i],['Bag tags & markers',/bag tag|marker|divot/i],['Towels & accessories',/towel|tee|accessory/i],['Tournament & team gifts',/tournament|logo|gift/i]],
  sportsgear:[['Baseball & softball',/baseball|softball|bat/i],['Football, soccer & basketball',/football|soccer|basketball/i],['Hockey & display pieces',/hockey|display|puck/i],['Coaches & team accessories',/coach|team|bottle|tag|medal|name plate/i]],
  engraving:[['Photos & keepsakes',/photo|portrait|slate|box/i],['Metal & plates',/metal|business|brass|plate/i],['Accessories & jewelry',/tag|jewelry|handle/i]],
  glassware:[['Wine & champagne',/wine|champagne/i],['Beer & whiskey',/beer|whiskey|mug/i],['Sets & special gifts',/set|pitcher|coffee/i]],
  awards:[['Sports awards',/sport|champion|tournament/i],['Work & recognition',/employee|recognition|retirement/i],['Custom plaques & specialty',/plaque|metal|wood|crystal|desk/i]],
  medals:[['Sports & races',/sport|race|marathon|tournament/i],['Graduation & events',/graduation|participation|event/i],['Commemorative medals',/coin|commemorative|ribbon/i]],
  wedding:[['Wedding details',/wedding|ring|save.the.date|signage/i],['Wedding party gifts',/bridesmaid|groomsmen/i],['Milestones & celebrations',/annivers|graduat|baby|favor/i]],
  printing:[['Wearables',/shirt|hoodie/i],['Art & photos',/canvas|photo|poster|artwork/i],['Labels & packaging',/label|packaging/i]],
  printing3d:[['Gaming & consoles',/ps5|console|controller|gaming/i],['Desk & home',/desk|organizer|cable|stand/i],['Models & custom parts',/figurine|part|replacement|keychain/i]],
  patches:[['Patches & hats',/patch|hat/i],['Clothing & uniforms',/uniform|jacket|shirt|team/i]],
  pets:[['Tags & identification',/tag|leash|name/i],['Portraits & gifts',/portrait|tumbler|canvas/i],['Memorials & keepsakes',/memorial|bowl|ornament/i]],
  ornaments:[['Family & holiday',/family|holiday|christmas|snowflake/i],['Wedding, baby & graduation',/wedding|baby|graduation/i],['Photo & pets',/pet|photo/i],['Remembrance',/memorial/i]],
  coasters:[['Coaster sets',/coaster|slate|wood/i],['Bar & serving',/bar|drink|serving/i],['Wedding & business',/wedding|business|family/i]],
  canvas:[['Portraits & memories',/family|pet|portrait|memorial|photo/i],['Walls & decor',/sport|landscape|business|wall/i]],
  transfers:[['Apparel transfers',/dtf|heat|gang|apparel/i],['UV decals & labels',/uv|vinyl|sticker|label/i]],
  lighters:[['Engraved lighter cases',/engraved|metal|case|flip.top/i],['Accessories & gifts',/sleeve|commemorative|logo|accessory/i]],
  bottles:[['Engraved bottles',/engraving|bottle|monogram/i],['Presentation gifts',/display|label|presentation/i]],
  wraps:[['Pro-sports inspired styles',/nfl|nba|mlb|nhl|mls|sport|football|basketball|hockey|soccer|baseball/i],['Outdoors & fishing',/fish|boat|camp|nature|pet|animal/i],['Creative themes',/floral|psychedelic|anime|fantasy|holiday/i]],
  promo:[['Branded drinkware & gifts',/tumbler|keychain|coaster|gift|giveaway/i],['Awards & recognition',/award|employee|annivers/i]],
  metal:[['Coins & tokens',/coin|token|medal/i],['Metal plates & relief work',/plate|relief|brass|metal|engraving/i]],
  gifts:[['Birthdays & holidays',/birth|holiday|mother|father/i],['Recognition & appreciation',/teacher|memorial|corporate|welcome/i],['Keepsakes',/graduat|keychain|gift/i]]
 };
 const subcategory=p=>((rules[cat.id]||[]).find(([label,pattern])=>pattern.test(p.title))||['More ways to personalize'])[0];
 const groups=new Map();for(const item of cat?.items||[]){const key=subcategory(item);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(item)}
 if(!cat){document.title='Find a custom product | Spider\'s Creations';$('#collection-name').textContent='Find a product that fits your idea.';$('#collection-intro').textContent='This collection could not be found. Choose from our current custom products instead.';$('#collection-crumb').textContent='All products';$('#collection-hero-visual').textContent='✦';$('#collection-products').innerHTML='<a class="button collection-gold-button" href="product-types.html">Browse all products →</a>';$('#collection-status').textContent='';$('#collection-more').hidden=true;return;}
 const title=cat.name;document.title=title+' | Create Your Own | Spider\'s Creations';$('#collection-name').textContent=title;$('#collection-crumb').textContent=title;$('#collection-intro').textContent=cat.tagline||'Personalized gifts and custom pieces, made just for you.';
 const hero=$('#collection-hero-visual');const image=photoMap[cat.id];if(image){const i=document.createElement('img');i.src='images/'+image;i.alt=title+' personalization example';i.decoding='async';hero.replaceChildren(i)}else{hero.textContent=cat.emoji||'✦';hero.classList.add('collection-icon-only')}
 if(!['tumblers','coins','wraps'].includes(cat.id)){$('#collection-designs-link').href='find.html?q='+encodeURIComponent(title);$('#collection-designs-link').textContent='Find inspiration'}
 $('#collection-request-link').href='contact.html?project='+encodeURIComponent(title);
 const search=$('#collection-search'),filters=$('#collection-groups'),host=$('#collection-products'),more=$('#collection-more'),status=$('#collection-status');
 let active=groups.has(params.get('group'))?params.get('group'):'';let max=12;
 const makeCard=(item,index,examples)=>{
  const article=document.createElement('article');article.className='collection-product';
  const link=document.createElement('a');link.href=productLink(item.id);link.className='collection-product-visual';link.setAttribute('aria-label','Customize '+item.title);
  if(examples?.[index]){const concept=examples[index],sp=concept.sprite;if(sp){const tile=document.createElement('span');tile.className='collection-art-sprite';tile.setAttribute('role','img');tile.setAttribute('aria-label',concept.name+' artwork inspiration');tile.style.backgroundImage='url("'+encodeURI(sp.src).replace(/"/g,'%22')+'")';tile.style.backgroundSize=(sp.cols*100)+'% '+(sp.rows*100)+'%';tile.style.backgroundPosition=(sp.x/(sp.cols-1)*100)+'% '+(sp.y/(sp.rows-1)*100)+'%';link.append(tile);const badge=document.createElement('small');badge.textContent='Design inspiration';link.append(badge)}}
  if(!link.childNodes.length){link.classList.add('collection-illustration');const symbol=document.createElement('span');symbol.setAttribute('aria-hidden','true');symbol.textContent=cat.emoji||'✦';symbol.style.setProperty('--card-hue',String((index*37+18)%70));const label=document.createElement('small');label.textContent='Personalized product idea';link.append(symbol,label)}
  const body=document.createElement('div');body.className='collection-product-body';const mini=document.createElement('p');mini.className='eyebrow';mini.textContent=subcategory(item);const name=document.createElement('h3');const a=document.createElement('a');a.href=productLink(item.id);a.textContent=item.title;name.append(a);const sub=document.createElement('p');sub.textContent='Customize the design, wording, material and finish to suit your occasion.';const button=document.createElement('a');button.className='button collection-gold-button';button.href=productLink(item.id);button.textContent='Customize this item →';body.append(mini,name,sub,button);article.append(link,body);return article;
 };
 let inspirational=[];const uniqueExamples=[];
 function draw(){const q=normalized(search.value).trim().split(/\s+/).filter(Boolean);const list=(cat.items||[]).filter(p=>(!active||subcategory(p)===active)&&q.every(w=>normalized([p.title,p.description,subcategory(p)].join(' ')).includes(w)));host.replaceChildren(...list.slice(0,max).map((p,i)=>makeCard(p,i,inspirational)));more.hidden=list.length<=max;status.textContent=list.length?'Choose an item below to start customizing.':'No matching items. Try another search or style.';filters.replaceChildren();const createBtn=(text,key)=>{const b=document.createElement('button');b.type='button';b.className='collection-filter';b.setAttribute('aria-pressed',String(active===key));b.textContent=text;b.addEventListener('click',()=>{active=key;max=12;const u=new URL(location.href);key?u.searchParams.set('group',key):u.searchParams.delete('group');history.replaceState(null,'',u.pathname+u.search);draw()});filters.append(b)};createBtn('All products','');for(const key of groups.keys())createBtn(key,key)}
 search.addEventListener('input',()=>{max=12;draw()});more.addEventListener('click',()=>{max+=12;draw()});draw();
 if(['tumblers','coins','wraps'].includes(cat.id)){
  fetch('data/designs.json').then(r=>{if(!r.ok)throw Error('Designs unavailable');return r.json()}).then(data=>{
   if(!Array.isArray(data))return;const isCoin=cat.id==='coins';const pool=data.filter(p=>p.sprite&&(isCoin?p.kind==='coin-concept':p.kind!=='coin-concept'));
   const picks=[],seen=new Set();for(const p of pool){if(seen.has(p.category))continue;picks.push(p);seen.add(p.category);if(picks.length===6)break}inspirational=pool.filter(p=>!picks.some(x=>x.id===p.id)).slice(0,cat.items.length);draw();
   const section=$('#collection-artwork'),grid=$('#collection-artwork-grid');section.hidden=!picks.length;grid.replaceChildren();for(const p of picks){const el=document.createElement('a');el.className='collection-art-card';el.href=designLink(p.id,isCoin);const sp=p.sprite;const thumb=document.createElement('span');thumb.className='collection-art-sprite';thumb.setAttribute('role','img');thumb.setAttribute('aria-label',p.name);thumb.style.backgroundImage='url("'+encodeURI(sp.src).replace(/"/g,'%22')+'")';thumb.style.backgroundSize=(sp.cols*100)+'% '+(sp.rows*100)+'%';thumb.style.backgroundPosition=(sp.x/(sp.cols-1)*100)+'% '+(sp.y/(sp.rows-1)*100)+'%';const name=document.createElement('strong');name.textContent=p.name;const detail=document.createElement('span');detail.textContent='Personalize this design →';el.append(thumb,name,detail);grid.append(el)}
  }).catch(err=>{console.warn('Could not load design inspiration',err)})
 }
})();