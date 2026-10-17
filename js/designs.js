/* Spider's Creations — real-asset catalog (no inferred pricing, no dummy checkout). */
(() => {
  'use strict';
  const STORE_KEY = 'spiders-project-v1';
  const FAVORITES_KEY = 'spiders-favorite-designs-v1';
  const $ = (s,root=document) => root.querySelector(s);
  const all = (s,root=document) => [...root.querySelectorAll(s)];
  const params = () => new URLSearchParams(location.search);
  const folded = value => String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().trim();
  const text = (node,value) => { if(node) node.textContent=String(value??''); };
  function readJSON(key,fallback){try {const value=JSON.parse(localStorage.getItem(key));return value??fallback;}catch{return fallback;}}
  function saveJSON(key,value){try{localStorage.setItem(key,JSON.stringify(value));return true;}catch{return false;}}
  const favorites = new Set((Array.isArray(readJSON(FAVORITES_KEY,[])) ? readJSON(FAVORITES_KEY,[]) : []).filter(x=>typeof x==='string'));
  function toggleFavorite(id){if(favorites.has(id))favorites.delete(id);else favorites.add(id);saveJSON(FAVORITES_KEY,[...favorites]);return favorites.has(id);}
  function button(tag,classes,label){const el=document.createElement(tag);el.className=classes;el.textContent=label;return el;}
  function imageTile(p,detail=false){
    if(!p.sprite){const img=document.createElement('img');img.src=detail?p.image:p.thumb;img.alt=p.name+' design preview';img.loading=detail?'eager':'lazy';img.decoding='async';return img;}
    const s=p.sprite, tile=document.createElement('span');
    tile.className=detail?'design-sprite detail-sprite':'design-sprite';
    tile.setAttribute('role','img');tile.setAttribute('aria-label',p.name+' design preview');
    tile.style.backgroundImage='url("'+encodeURI(s.src).replace(/"/g,'%22')+'")';
    tile.style.backgroundSize=(s.cols*100)+'% '+(s.rows*100)+'%';
    tile.style.backgroundPosition=(s.x/(s.cols-1)*100)+'% '+(s.y/(s.rows-1)*100)+'%';
    return tile;
  }
  const PRODUCT_IDS={'hypechains':'hypechains-1','puzzles':'puzzles-1','boards':'boards-1','phone-cases':'phone-cases-1'};
  const designHref=p=>p.productCategory?'product-customize.html?id='+encodeURIComponent(PRODUCT_IDS[p.productCategory])+'&design='+encodeURIComponent(p.id):'design.html?id='+encodeURIComponent(p.id);
  function createCard(p){
    const card=document.createElement('article');card.className='design-card';
    const picture=document.createElement('a');picture.className='design-card-image';picture.href=designHref(p);picture.setAttribute('aria-label','View '+p.name);
    picture.append(imageTile(p));
    const fav=button('button','design-heart',favorites.has(p.id)?'♥':'♡');fav.type='button';fav.setAttribute('aria-label',favorites.has(p.id)?'Remove from favorites':'Save to favorites');fav.setAttribute('aria-pressed',String(favorites.has(p.id)));
    fav.addEventListener('click',()=>{const val=toggleFavorite(p.id);fav.textContent=val?'♥':'♡';fav.setAttribute('aria-pressed',String(val));fav.setAttribute('aria-label',val?'Remove from favorites':'Save to favorites');if($('#favorites-only')?.checked)renderCatalog();});
    card.append(picture,fav);
    const body=document.createElement('div');body.className='design-card-body';
    const family=p.productCategory?({'hypechains':'Hype Chain','puzzles':'Puzzle','boards':'Cutting Board','phone-cases':'Phone Case'}[p.productCategory]||'Custom'):(p.kind==='coin-concept'?'Coin Design':'Tumbler Design');
    const type=button('p','design-card-type',(p.category||'Custom')+' • '+family);
    const title=document.createElement('h3');const link=document.createElement('a');link.href=picture.href;link.textContent=p.name;title.append(link);
    const foot=document.createElement('div');foot.className='design-card-foot';
    const tier=button('span','design-price-note','Price on request');const view=document.createElement('a');view.href=picture.href;view.textContent='Personalize →';view.className='design-view';
    foot.append(tier,view);body.append(type,title,foot);card.append(body);return card;
  }
  const state={q:params().get('q')||'',group:params().get('group')||'',category:params().get('category')||'',team:params().get('team')||'',level:params().get('level')||'',sort:params().get('sort')||'default',favorites:params().get('saved')==='1',limit:36};
  let DATA=[];
  function putParam(url,name,val){if(val)url.searchParams.set(name,val);else url.searchParams.delete(name);}
  function syncURL(){const url=new URL(location.href);for(const field of ['q','group','category','team','level'])putParam(url,field,state[field]);putParam(url,'sort',state.sort!=='default'?state.sort:'');putParam(url,'saved',state.favorites?'1':'');history.replaceState(null,'',url.pathname+url.search+url.hash);}
  function fillSelect(select,options,value,prefix){if(!select)return;select.replaceChildren(new Option(prefix,''));for(const item of options)select.append(new Option(item,item));select.value=options.includes(value)?value:'';}
  function eligible(p,ignore){
    if(!ignore?.has('group') && state.group && p.group!==state.group)return false;
    if(!ignore?.has('category') && state.category && p.category!==state.category)return false;
    if(!ignore?.has('team') && state.team && p.team!==state.team)return false;
    if(!ignore?.has('level') && state.level && p.level!==state.level)return false;
    if(state.favorites && !favorites.has(p.id))return false;
    if(state.q){const search=folded([p.name,p.group,p.category,p.team,p.level].join(' '));const terms=folded(state.q).split(/\s+/).filter(Boolean);if(!terms.every(t=>search.includes(t)))return false;}
    return true;
  }
  const byName=(a,b)=>a.name.localeCompare(b.name,undefined,{sensitivity:'base'});
  function updateSelects(){
    const groupSelect=$('#group-filter'),categorySelect=$('#category-filter'),teamSelect=$('#team-filter');
    fillSelect(groupSelect,[...new Set(DATA.map(p=>p.group))].sort(),state.group,'All collections');
    const categories=[...new Set(DATA.filter(p=>!state.group||p.group===state.group).map(p=>p.category))].sort();
    fillSelect(categorySelect,categories,state.category,'All categories');
    const teams=[...new Set(DATA.filter(p=>(!state.group||p.group===state.group)&&(!state.category||p.category===state.category)).map(p=>p.team).filter(Boolean))].sort();
    fillSelect(teamSelect,teams,state.team,'All teams');
    $('#level-filter').value=state.level;
  }
  function renderQuickCategories(){
    const container=$('#quick-categories');if(!container)return;
    container.replaceChildren();const known=['NFL','NBA','MLB','NHL','Anime Inspired','Wildlife Animals','Psychedelic Trippy','Sports Outdoors','Flowers Botanical','Football','Basketball','Baseball','Hockey','Soccer','Other Sports','Graduation','Celebrations','Fantasy & Medieval','Animals & Nature','Sports & Fishing','Animals','Floral & Botanical','Fishing & Coastal','Anime & Fantasy','Psychedelic & Abstract','Holidays & Celebrations'];
    const counts=new Map();for(const p of DATA)counts.set(p.category,(counts.get(p.category)||0)+1);
    const allLink=button('button','catalog-chip'+(!state.category?' is-active':''),'All designs');allLink.type='button';allLink.addEventListener('click',()=>{state.category='';state.team='';state.group='';state.limit=36;refresh();});container.append(allLink);
    for(const category of known.filter(k=>counts.has(k))){const pill=button('button','catalog-chip'+(state.category===category?' is-active':''),category);pill.type='button';pill.addEventListener('click',()=>{state.category=state.category===category?'':category;state.group=['NFL','NBA','MLB','NHL'].includes(state.category)?'Hype Chains':['Football','Basketball','Baseball','Hockey','Soccer','Other Sports'].includes(state.category)?'Sports':(['Graduation','Celebrations','Fantasy & Medieval','Animals & Nature','Sports & Fishing'].includes(state.category)?'Coins':(state.category?'Themes':''));state.team='';state.level='';state.limit=36;refresh();});container.append(pill);}
  }
  function renderCatalog(){
    const grid=$('#design-grid');if(!grid)return;
    const filtered=DATA.filter(p=>eligible(p));
    if(state.sort==='name-asc')filtered.sort(byName);
    if(state.sort==='name-desc')filtered.sort((a,b)=>byName(b,a));
    if(state.sort==='category')filtered.sort((a,b)=>a.category.localeCompare(b.category)||byName(a,b));
    const visible=filtered.slice(0,state.limit);
    grid.replaceChildren(...visible.map(createCard));
    $('#catalog-empty').hidden=filtered.length!==0;
    const more=$('#load-more');more.hidden=filtered.length<=state.limit;
    text($('#shown-count'),'Choose a design to view details or personalize it.');
    text($('#results-status'),filtered.length?'Browse your matching designs below.':'No designs match these filters. Try another style.');
    const active=$('#active-filters');active.replaceChildren();
    for(const [key,label] of [['q','Search'],['group','Collection'],['category','Category'],['team','Team'],['level','Level']]){
      if(!state[key])continue;
      const tag=button('button','filter-pill',`${label}: ${state[key]} ×`);tag.type='button';tag.addEventListener('click',()=>{state[key]='';if(key==='group'){state.category='';state.team='';}if(key==='category')state.team='';state.limit=36;refresh();});active.append(tag);
    }
  }
  function refresh(){updateSelects();renderQuickCategories();renderCatalog();syncURL();}
  function startBrowse(){
    text($('#total-designs'),'Create something personal');
    $('#catalog-query').value=state.q;
    $('#catalog-sort-select').value=state.sort;
    $('#favorites-only').checked=state.favorites;
    $('#catalog-search').addEventListener('submit',e=>{e.preventDefault();state.q=$('#catalog-query').value.trim().slice(0,150);state.limit=36;refresh();});
    let debounce;
    $('#catalog-query').addEventListener('input',()=>{clearTimeout(debounce);debounce=setTimeout(()=>{state.q=$('#catalog-query').value.trim().slice(0,150);state.limit=36;refresh();},250);});
    for(const [id,field] of [['group-filter','group'],['category-filter','category'],['team-filter','team'],['level-filter','level'],['catalog-sort-select','sort']]){
      $('#'+id).addEventListener('change',e=>{state[field]=e.target.value;if(field==='group'){state.category='';state.team='';}if(field==='category')state.team='';state.limit=36;refresh();});
    }
    $('#favorites-only').addEventListener('change',e=>{state.favorites=e.target.checked;state.limit=36;refresh();});
    $('#clear-filters').addEventListener('click',reset);
    $('#reset-search').addEventListener('click',reset);
    $('#load-more').addEventListener('click',()=>{state.limit+=36;renderCatalog();});
    refresh();
  }
  function reset(){Object.assign(state,{q:'',group:'',category:'',team:'',level:'',sort:'default',favorites:false,limit:36});$('#catalog-query').value='';$('#favorites-only').checked=false;$('#catalog-sort-select').value='default';refresh();}
  function basketAdd(p,details,quantity){
    let saved=readJSON(STORE_KEY,[]);if(!Array.isArray(saved))saved=[];
    saved=saved.filter(x=>x&&typeof x.name==='string'&&Number.isInteger(x.quantity)&&x.quantity>0);
    const prefix=`Design #${p.id} · `;
    const label=p.name.slice(0,130);
    const existing=saved.find(x=>x.name===label&&typeof x.details==='string'&&x.details.startsWith(prefix)&&x.details===details);
    if(existing)existing.quantity=Math.min(100000,existing.quantity+quantity);
    else {if(saved.length>=100)return {ok:false,message:'Your project basket is full. Remove an item to add another.'};saved.push({name:label,details,quantity});}
    const ok=saveJSON(STORE_KEY,saved);
    if(ok){const n=saved.reduce((acc,x)=>acc+x.quantity,0);all('[data-cart-count]').forEach(el=>text(el,n));}
    return {ok,message:ok?'Added to your project basket. You can continue browsing or request a quote.':'Browser storage is unavailable; please send your instructions through the contact form.'};
  }
  function startDetail(){
    const id=params().get('id');const p=DATA.find(item=>item.id===id);if(p?.productCategory){location.replace(designHref(p));return;}
    if(!p){text($('#detail-title'),'Design not found');text($('#breadcrumb-name'),'Not found');text($('#detail-category'),'INVALID DESIGN LINK');$('#design-request-form').hidden=true;return;}
    document.title=p.name+' | Spiders Creations';text($('#detail-title'),p.name);text($('#breadcrumb-name'),p.name);text($('#detail-category'),`${p.category} / ${p.kind==='coin-concept'?'Coin':'Tumbler'} concept`);
    const img=$('#detail-image');if(p.sprite){img.hidden=true;img.insertAdjacentElement('afterend',imageTile(p,true));}else{img.src=p.image;img.alt=p.name+' original saved design preview';}
    if(p.kind==='coin-concept'){
      text($('.detail-description'),'Explore this saved coin design, then provide the diameter, preferred finish, quantity, and wording. We will confirm materials, tooling, and a quote before accepting an order.');
      text($('#design-size').previousElementSibling,'Preferred coin size');
      $('#design-size').replaceChildren(new Option('Not sure — please advise','Not sure'),new Option('38 mm','38 mm'),new Option('40 mm','40 mm'),new Option('50 mm','50 mm'),new Option('Other custom diameter','Custom diameter'));
      text($('#design-color').previousElementSibling,'Preferred metal color or finish');
      $('#design-color').placeholder='Example: antiqued brass, silver tone';
    }
    const meta=$('#detail-meta');meta.replaceChildren();for(const value of [p.group,p.category,p.team,p.level].filter(Boolean)){const label=button('span','meta-pill',value);meta.append(label);}
    const fav=$('#favorite-detail');function favUpdate(){const is=favorites.has(p.id);fav.textContent=is?'♥ Saved design':'♡ Save design';fav.setAttribute('aria-pressed',String(is));}favUpdate();fav.addEventListener('click',()=>{toggleFavorite(p.id);favUpdate();});
    $('#design-request-form').addEventListener('submit',event=>{
      event.preventDefault();const form=event.currentTarget;
      if(!form.reportValidity())return;
      const size=$('#design-size').value;
      const color=$('#design-color').value.trim().slice(0,60)||'To be confirmed';
      const custom=$('#design-name').value.trim().slice(0,120)||'None';
      const notes=$('#design-notes').value.trim().slice(0,1000)||'None';
      const n=Number($('#design-quantity').value);
      if(!Number.isInteger(n)||n<1||n>1000){text($('#add-status'),'Enter a quantity between 1 and 1,000.');return;}
      const details=`Design #${p.id} · Group: ${p.group} / ${p.category}\nSize: ${size}\nPreferred color: ${color}\nPersonal text: ${custom}\nInstructions: ${notes}\nDesign file: ${p.sourceFile}`;
      const result=basketAdd(p,details,n);text($('#add-status'),result.message);
      if(result.ok){$('#add-status').classList.add('success');}
    });
    const others=DATA.filter(x=>x.id!==p.id&&x.category===p.category).slice(0,4);$('#related-grid').replaceChildren(...others.map(createCard));
    const similar=$('#related-grid').closest('section');if(!others.length)similar.hidden=true;
  }
  function fail(error){const info='The design catalog could not load. Verify data/designs.json is deployed along with the image folders.';const host=$('#results-status')||$('#detail-title');text(host,info);console.error(error);}
  Promise.allSettled([
    fetch('data/designs.json',{cache:'default'}).then(r=>{if(!r.ok)throw Error('Original artwork unavailable');return r.json()}),
    fetch('data/grok-designs.json',{cache:'default'}).then(r=>{if(!r.ok)throw Error('Grok artwork unavailable');return r.json()})
  ]).then(([original,imported])=>{
    const legacy=original.status==='fulfilled'&&Array.isArray(original.value)?original.value:[];
    const fresh=imported.status==='fulfilled'&&Array.isArray(imported.value?.designs)?imported.value.designs:[];
    DATA=[...legacy,...fresh].filter(x=>x&&x.id&&x.name);
    if(!DATA.length)throw Error('No artwork catalogs could load');
    if(document.body.dataset.designPage==='browse')startBrowse();else startDetail();
  }).catch(fail);
})();
