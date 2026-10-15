/* Spider's Creations: accessible unified browse/help/customize pages. No mock prices. */
(() => {
 'use strict';
 const root=document.querySelector('[data-hub]');if(!root)return;
 const params=new URLSearchParams(location.search);
 const $=(s,p=document)=>p.querySelector(s);
 const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const data=window.SPIDERS_DATA||{categories:[]};
 const cats=data.categories||[];
 const products=cats.flatMap(c=>(c.items||[]).map(p=>({...p,collection:c.name,category:c.id,image:c.image,emoji:c.emoji||'✦'})));
 const storeKey='spiders-basket';
 const readCart=()=>{try{const a=JSON.parse(localStorage.getItem(storeKey)||'[]');return Array.isArray(a)?a:[]}catch{return[]}};
 const storeCart=a=>{try{localStorage.setItem(storeKey,JSON.stringify(a));return true}catch{return false}};
 const productURL=id=>'product-customize.html?id='+encodeURIComponent(id);
 const designURL=id=>'design.html?id='+encodeURIComponent(id);
 const norm=s=>String(s||'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
 const extra=[['tumblers','collection-tumblers.webp'],['coins','collection-awards.webp'],['engraving','collection-awards.webp'],['boards','collection-kitchenware.webp'],['glassware','collection-glassware.webp'],['awards','collection-trophies.webp'],['medals','collection-medals.webp'],['wedding','collection-wedding.webp'],['printing','collection-printing.webp'],['patches','collection-apparel.webp'],['lighters','collection-lighters.webp'],['bottles','collection-liquor-bottles.webp'],['canvas','collection-canvas.webp'],['printing3d','collection-gaming.webp'],['transfers','collection-transfers.webp'],['gifts','collection-wedding.webp'],['metal','collection-awards.webp'],['promo','collection-printing.webp'],['wraps','collection-tumblers.webp']];
 const imageMap=Object.fromEntries(extra.map(([k,v])=>[k,'images/'+v]));
 const rules={
  tumblers:[['Sizes & drinkware styles',/\b(20|30|40)\s?oz\b|straw|insulated|bottle|cup|skinny/i],['Sports & team designs',/sport|team|football|basketball|baseball|hockey|soccer/i],['Fishing & outdoors',/fish|coastal|camp|outdoor|boat/i],['Animals, flowers & artwork',/wildlife|animal|floral|botan|psychedelic|abstract|nature/i]],
  coins:[['Military & first responders',/military|veteran|firefighter|responder|police/i],['Milestones & awards',/graduat|retire|birthday|annivers|recognition|celebrat/i],['Fantasy & historical',/fantasy|medieval|viking|norse|dragon/i],['Animals & nature',/animal|wildlife|nature/i]],
  engraving:[['Metal engraving',/metal|brass|steel|business card|plate|tag|jewelry/i],['Wood & keepsakes',/wood|box|keepsake/i],['Photos & portraits',/photo|slate|portrait/i]],
  boards:[['Boards & serving pieces',/cutting|board|charcuterie|butcher|tray/i],['Coasters & home gifts',/coaster|housewarm|gift/i]],
  glassware:[['Wine & champagne',/wine|champagne|stemless/i],['Beer, mugs & whiskey',/whiskey|beer|mug|coffee/i],['Gift sets & serving',/gift|set|pitcher/i]],
  awards:[['Sports & tournaments',/sport|championship|tournament/i],['Work & recognition',/employee|recognition|retirement|desk/i],['Plaques & specialty awards',/plaque|wood|metal|crystal/i]],
  medals:[['Sports & races',/sport|marathon|race|tournament/i],['Graduation & achievements',/graduation|participation|event/i],['Commemorative medals',/coin|commemorative|ribbon/i]],
  wedding:[['Wedding day details',/wedding|signage|ring|save.the.date/i],['Wedding party gifts',/bridesmaid|groomsmen/i],['Other celebrations',/anniversary|graduation|baby|favors/i]],
  printing:[['Clothing',/shirt|hoodie|apparel/i],['Photos & art',/canvas|photo|poster|artwork/i],['Labels & packaging',/label|packaging/i]],
  patches:[['Patches & hats',/patch|hat/i],['Uniforms & team wear',/uniform|team|work|jacket|shirt/i]],
  lighters:[['Engraved metal cases',/engraved|metal|flip.top|case/i],['Custom sleeves & gifts',/sleeve|accessory|commemorative|logo/i]],
  bottles:[['Engraved bottles',/bottle|engraving|monogram/i],['Display & artwork',/display|label|presentation/i]],
  canvas:[['Photos & portraits',/family|photo|portrait|pet|memorial/i],['Home & business art',/sport|landscape|business|wall/i]],
  printing3d:[['Gaming accessories',/ps5|console|controller|gaming/i],['Desk & home organizers',/stand|organizer|cable|clip|holder/i],['Custom prints & parts',/figurine|replacement|keychain|custom|plastic/i]],
  transfers:[['Apparel transfers',/dtf|apparel|heat|gang/i],['Decals & labels',/uv|decal|vinyl|sticker|label/i]],
  gifts:[['Celebrations & holidays',/graduation|birthday|holiday|mother|father/i],['Appreciation & memorial',/teacher|memorial|welcome|corporate/i],['Personal keepsakes',/keychain|gift/i]],
  metal:[['Coins & medallions',/coin|token|medal/i],['Engraved plates & relief',/brass|plate|metal|relief|engraving/i]],
  promo:[['Branded gifts',/tumbler|keychain|coaster|giveaway|gift/i],['Business & team awards',/award|employee|anniversary/i]],
  magnets:[['Photo & keepsake magnets',/photo|name|fridge|acrylic|wedding|date/i],['Sports & branded magnets',/sport|logo|toolbox|business/i],['Useful magnetic accessories',/opener|calendar|board/i]],
  keychains:[['Metal & engraved keychains',/metal|engraved|opener/i],['Photo & acrylic keychains',/photo|acrylic|wood|name/i],['Teams, pets & promo',/pet|team|business|golf|bag|graduat/i]],
  golf:[['Personalized golf balls',/golf ball|monogram|logo/i],['Golf gear & accessories',/towel|bag tag|marker|divot|tee/i],['Tournament & gift sets',/tournament|gift|challenge coin/i]],
  sportsgear:[['Baseballs, bats & softballs',/baseball|softball|bat/i],['Football, basketball & soccer',/football|basketball|soccer/i],['Hockey & sports display',/hockey|display|plate/i],['Team awards & accessories',/team|coach|water bottle|bag tag|medal/i]],
  pets:[['Custom pet identification',/tag|leash|name/i],['Pet portraits & photo gifts',/portrait|tumbler|canvas/i],['Memorials & keepsakes',/memorial|bowl/i]],
  ornaments:[['Family & holiday ornaments',/family|holiday|christmas|photo/i],['Wedding & milestone keepsakes',/wedding|graduation|baby/i],['Memorial ornaments',/memorial|pet/i]],
  coasters:[['Slate & wood coasters',/slate|wood|coaster/i],['Entertaining & bar accessories',/bar|serving|holder/i],['Events & branded gifts',/wedding|business|family/i]],
  wraps:[['Major league sports',/nfl|nba|mlb|nhl|mls|football|basketball|hockey|soccer|baseball/i],['Fishing, wildlife & outdoors',/fish|boat|camp|nature|pet|animal/i],['Creative & holiday themes',/floral|psychedelic|anime|fantasy|holiday|floral/i]]
 };
 const groupFor=p=>((rules[p.category]||[]).find(([,re])=>re.test(p.title))||['Other personalized options'])[0];
 const grouped=ps=>{const m=new Map();for(const p of ps){const g=groupFor(p);if(!m.has(g))m.set(g,[]);m.get(g).push(p)}return m};
 const unique=[];
 for(const c of cats)if(!unique.some(x=>x.id===c.id))unique.push(c);
 function categoryCard(c,ps){
  const image=imageMap[c.id]||'';
  const groups=grouped(ps);
  const children=[...groups].map(([name,list])=>`<section class="hub-subgroup"><h3>${escape(name)} <span class="result-count">(${list.length})</span></h3><ul>${list.map(p=>`<li><a href="${productURL(p.id)}" aria-label="Customize ${escape(p.title)}">${escape(p.title)} <span>Customize →</span></a></li>`).join('')}</ul></section>`).join('');
  return `<article id="group-${escape(c.id)}" class="hub-collection"><div class="hub-collection-head"><a class="hub-collection-image" href="collection.html?category=${encodeURIComponent(c.id)}">${image?`<img src="${escape(image)}" alt="${escape(c.name)} category example" loading="lazy" decoding="async">`:`<span class="hub-category-illustration" aria-hidden="true">${escape(c.emoji||"✦")}</span>`}</a><div><p class="eyebrow">MADE PERSONAL FOR YOU</p><h2><a href="collection.html?category=${encodeURIComponent(c.id)}">${escape(c.name)}</a></h2><p>${escape(c.tagline||'Made to order and personalized to your requirements.')}</p><a href="collection.html?category=${encodeURIComponent(c.id)}" class="text-link">Explore this collection →</a></div></div><div class="hub-subgroups">${children}</div></article>`;
 }
 function showProducts(){
  const host=$('#types-collections'),input=$('#types-search'),chips=$('#types-chips'),status=$('#types-status'),picker=$('#types-category-select');
  if(!host||!input||!chips)return;
  let active=unique.some(c=>c.id===params.get('category'))?params.get('category'):'';
  input.value=params.get('q')||'';
  if(picker){picker.innerHTML='<option value="">All collections</option>'+unique.map(c=>'<option value="'+escape(c.id)+'">'+escape(c.name)+'</option>').join('');picker.value=active;picker.addEventListener('change',()=>{active=picker.value;draw()});}
  const draw=()=>{
   const q=norm(input.value.trim());const words=q.split(/\s+/).filter(Boolean);
   const matched=unique.map(c=>[c,(c.items||[]).filter(p=>words.every(w=>norm([p.title,p.description,c.name,c.tagline].join(' ')).includes(w)))]).filter(([c,items])=>(!active||c.id===active)&&items.length);
   chips.replaceChildren();if(picker)picker.value=active;
   const addChip=(label,value,count)=>{const b=document.createElement('button');b.type='button';b.textContent=label+(count!==null?' ('+count+')':'');b.setAttribute('aria-pressed',String(active===value));b.addEventListener('click',()=>{active=value;draw();});chips.append(b)};
   addChip('All collections','',null);
   for(const c of unique)addChip(c.name,c.id,null);
   host.innerHTML=matched.map(([c,ps])=>categoryCard(c,ps)).join('');
   const n=matched.reduce((t,[,p])=>t+p.length,0);
   status.textContent=n?'Choose a product below, then personalize it.':'No products match your search.';
   if(!n)host.innerHTML='<div class="hub-cta"><h2>No matching product types</h2><p>Try a different search or describe your custom project.</p><a class="button" href="contact.html">Request something custom →</a></div>';
   const url=new URL(location.href);if(input.value.trim())url.searchParams.set('q',input.value.trim());else url.searchParams.delete('q');if(active)url.searchParams.set('category',active);else url.searchParams.delete('category');history.replaceState(null,'',url.pathname+url.search);
  };
  input.addEventListener('input',draw);draw();
 }
 function designPreview(p){
  const div=document.createElement('div');div.className='hub-card-image';
  if(p.sprite){const s=p.sprite,span=document.createElement('span');span.className='design-sprite';span.setAttribute('role','img');span.setAttribute('aria-label',p.name+' preview');span.style.backgroundImage='url('+JSON.stringify(s.src)+')';span.style.backgroundSize=(s.cols*100)+'% '+(s.rows*100)+'%';span.style.backgroundPosition=(s.x/(s.cols-1)*100)+'% '+(s.y/(s.rows-1)*100)+'%';div.append(span)}
  else{const img=document.createElement('img');img.src=p.thumb||p.image;img.loading='lazy';img.alt=p.name+' design example';div.append(img)}
  return div;
 }
 function searchFind(){
  const input=$('#find-query'),category=$('#find-category'),mode=$('#find-mode'),status=$('#find-status'),pHost=$('#find-products'),dHost=$('#find-designs');
  const state={limit:24,designs:[],loaded:false};
  input.value=params.get('q')||'';mode.value=['all','products','designs'].includes(params.get('type'))?params.get('type'):'all';
  const allNames=[...new Set([...unique.map(c=>c.name),...unique.map(c=>c.id)])].sort();
  category.innerHTML='<option value="">All categories</option>'+unique.map(c=>'<option value="'+escape(c.id)+'">'+escape(c.name)+'</option>').join('');category.value=unique.some(c=>c.id===params.get('category'))?params.get('category'):'';
  const draw=()=>{
    const terms=norm(input.value).split(/\s+/).filter(Boolean),pick=mode.value,cat=category.value;
    const matched=products.filter(p=>(!cat||p.category===cat)&&terms.every(t=>norm(p.title+' '+p.description+' '+p.collection).includes(t)));
    const dm=state.designs.filter(p=>(!cat||(cat==='tumblers'&&p.kind!=='coin-concept')||(cat==='coins'&&p.kind==='coin-concept')||(cat==='wraps'&&p.kind!=='coin-concept')||(!['tumblers','coins','wraps'].includes(cat)&&norm(p.category+' '+p.group).includes(norm(cat))))&&terms.every(t=>norm([p.name,p.category,p.group,p.team,p.level].join(' ')).includes(t)));
    let seen=new Set();pHost.replaceChildren(...(pick==='designs'?[]:matched.slice(0,24)).map(p=>{
      const node=document.createElement('article');node.className='hub-card';const img=document.createElement('div');img.className='hub-card-image';if(!seen.has(p.category)){seen.add(p.category);const im=document.createElement('img');im.src=imageMap[p.category]||'';if(im.src&&!imageMap[p.category]){img.innerHTML='<div class="hub-placeholder" role="img" aria-label="'+escape(p.collection)+' item">'+escape(p.emoji)+'<br><small>'+escape(p.collection)+'</small></div>'}else{im.alt=p.collection+' category photo';im.loading='lazy';img.append(im)}}else{img.innerHTML='<div class="hub-placeholder" role="img" aria-label="'+escape(p.collection)+' item">'+escape(p.emoji)+'<br><small>'+escape(p.collection)+'</small></div>'}const body=document.createElement('div');body.className='hub-card-body';body.innerHTML='<p class="mini">'+escape(p.collection)+'</p><h3>'+escape(p.title)+'</h3><p>Choose options, quantity and design preferences.</p><a class="button" href="'+productURL(p.id)+'">Customize →</a>';node.append(img,body);return node;
    }));
    dHost.replaceChildren(...(pick==='products'?[]:dm.slice(0,state.limit)).map(p=>{const node=document.createElement('article');node.className='hub-card';const a=document.createElement('a');a.href=designURL(p.id);a.append(designPreview(p));const body=document.createElement('div');body.className='hub-card-body';body.innerHTML='<p class="mini">'+escape(p.category)+'</p><h3><a href="'+designURL(p.id)+'">'+escape(p.name)+'</a></h3><a class="button" href="'+designURL(p.id)+'">View & personalize →</a>';node.append(a,body);return node}));
    $('#find-products-section').hidden=pick==='designs'||!matched.length;$('#find-designs-section').hidden=pick==='products'||!dm.length;
    $('#find-more').hidden=dm.length<=state.limit;
    $('#find-empty').hidden=matched.length+dm.length>0;
    status.textContent=matched.length+dm.length?'Choose a product or design to personalize.':'Search products and designs above.';
    const url=new URL(location.href);for(const [key,val] of [['q',input.value.trim()],['type',pick!=='all'?pick:''],['category',cat]])val?url.searchParams.set(key,val):url.searchParams.delete(key);history.replaceState(null,'',url.pathname+url.search);
  };
  $('#unified-search').addEventListener('submit',e=>{e.preventDefault();state.limit=24;draw()});
  input.addEventListener('input',()=>{state.limit=24;draw()});category.addEventListener('change',()=>{state.limit=24;draw()});mode.addEventListener('change',()=>{state.limit=24;draw()});
  $('#find-clear').addEventListener('click',()=>{input.value='';category.value='';mode.value='all';state.limit=24;draw();input.focus()});
  $('#find-more').addEventListener('click',()=>{state.limit+=24;draw()});
  draw();
  fetch('data/designs.json').then(r=>{if(!r.ok)throw Error('Catalog not available');return r.json()}).then(a=>{state.designs=Array.isArray(a)?a:[];state.loaded=true;draw()}).catch(()=>{state.loaded=true;draw();status.textContent+=' (Design gallery not loaded. Try Designs & Photos.)'});
 }
 function customizeProduct(){
   const id=params.get('id'),edit=params.get('edit'),entries=readCart();
   const draft=edit?entries.find(p=>p.uid===edit):null;
   const p=products.find(x=>x.id===(draft?.productId||id));
   if(!p){$('#pc-title').textContent='Product not found';$('#pc-description').textContent='Choose an existing product from the full catalog.';$('#pc-form').hidden=true;$('#pc-message').innerHTML='<a class="button" href="product-types.html">Browse products →</a>';return}
   $('#pc-title').textContent=p.title;$('#pc-description').textContent=p.description||'Tell us your preferred size, material, personalization and quantity.';$('#pc-category').textContent=p.collection;
   const img=$('#pc-image');if(imageMap[p.category]){img.src=imageMap[p.category];img.alt=p.collection+' category reference photo'}else{img.hidden=true;const icon=document.createElement('div');icon.className='studio-product-illustration';icon.textContent=p.emoji||'✦';icon.setAttribute('aria-label',p.title);img.after(icon)}
   document.title='Customize '+p.title+' | Spider\'s Creations';
   if(draft){for(const [key,val] of [['material',draft.material],['size',draft.size],['text',draft.text],['font',draft.font],['colors',draft.colors],['qty',draft.qty],['deadline',draft.deadline],['notes',draft.notes]]){const el=$('#pc-'+key);if(el&&val!=null){el.value=val}}$('#pc-submit').textContent='Save Changes to This Item →'}
   const text=$('#pc-text'),preview=$('#pc-preview'),font=$('#pc-font');
   const updatePreview=()=>{preview.textContent=text.value.trim().slice(0,100)||'YOUR DESIGN';preview.style.fontFamily=font.value==='Script'||font.value==='Handwritten'?'cursive':font.value==='Classic serif'?'Georgia,serif':'system-ui,sans-serif';};text.addEventListener('input',updatePreview);font.addEventListener('change',updatePreview);updatePreview();
   $('#pc-form').addEventListener('submit',e=>{
     e.preventDefault();if(!e.currentTarget.reportValidity())return;
     const newItem={uid:draft?.uid||'sc-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,9),productId:p.id,title:p.title,category:p.collection,qty:Number($('#pc-qty').value),material:$('#pc-material').value,size:$('#pc-size').value.trim().slice(0,90),text:text.value.trim().slice(0,160),font:font.value,colors:$('#pc-colors').value.trim().slice(0,90),deadline:$('#pc-deadline').value,notes:$('#pc-notes').value.trim().slice(0,1500)};
     if(!Number.isInteger(newItem.qty)||newItem.qty<1||newItem.qty>10000){$('#pc-message').textContent='Enter a valid quantity from 1 to 10,000.';return}
     const next=entries.filter(x=>x&&x.uid!==draft?.uid);if(next.length>=100){$('#pc-message').textContent='Your quote basket is full. Please remove something first.';return};next.push(newItem);
     if(!storeCart(next)){$('#pc-message').textContent='Your device could not save the basket. Please use the direct project request form.';return};location.assign('basket.html');
   });
 }
 if(root.dataset.hub==='products')showProducts();
 if(root.dataset.hub==='find')searchFind();
 if(root.dataset.hub==='customize-product')customizeProduct();
})();
