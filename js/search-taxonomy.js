/* Spider's Creations search vocabulary. One source of truth for shop, gallery and site search. */
(function () {
  'use strict';
  const fold = value => String(value == null ? '' : value)
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[_–—-]+/g, ' ').replaceAll('/', ' ').replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ').trim();

  const aliases = {
    birthday: ['birthday','birthdays','bday','b day','birthday party','birthday gift','celebration','milestone'],
    birthdays: ['birthday','birthdays','bday','birthday party','celebration'],
    bday: ['birthday','birthdays','bday','birthday party','celebration'],
    wedding: ['wedding','bridal','bride','groom','marriage','anniversary'],
    graduation: ['graduation','graduate','grad','class of','commencement'],
    patriots: ['patriots','new england patriots','ne patriots'],
    pats: ['patriots','new england patriots','pats'],
    fishing: ['fishing','fish','angler','bass','fluke','ocean'],
    anime: ['anime','manga','dragon ball','one piece','demon slayer'],
    phonecase: ['phone case','iphone case','mobile cover'],
    tumblers: ['tumbler','tumblers','drinkware','cup'],
    puzzles: ['puzzle','puzzles','jigsaw']
  };

  function fields(p) {
    return fold([
      p.name,p.title,p.description,p.tagline,p.category,p.collection,p.group,
      p.team,p.level,p.kind,p.productCategory,p.theme,p.occasion,
      ...(Array.isArray(p.tags) ? p.tags : []),
      ...(Array.isArray(p.keywords) ? p.keywords : [])
    ].filter(Boolean).join(' '));
  }

  function canBeBirthdayGift(p) {
    const title=fold(p.title||'');
    if (!title || /memorial|funeral|sympathy|urn|save the date|condolence|retirement/.test(title)) return false;
    // Every product is still a customizable quote request, not a premade birthday item.
    return /custom|personalized|photo|name|gift|party|favor|birthday|celebrat|tumbler|cup|coin|chain|puzzle|balloon|medal|plaque|tag|case|coaster|board|glass|engraved|printed|canvas|keyring|sports|golf|shirt|sticker|3d/.test(title);
  }

  function isTeamFriendly(p) {
    const title=fold(p.title||'');
    return /\b(team|sports?|football|nfl|jersey|fan|helmet)\b|hype chain/.test(title);
  }

  function termsFor(p,kind) {
    let base=fields(p);
    if(kind==='product' && canBeBirthdayGift(p)) base+=' birthday birthdays bday birthday gifts party celebration';
    if(kind==='product' && isTeamFriendly(p)) base+=' team inspired patriots new england patriots nfl';
    return base;
  }

  function matches(p,query,kind='design') {
    const words=fold(query).split(' ').filter(Boolean);
    if(!words.length)return true;
    const content=termsFor(p,kind);
    return words.every(w=>(aliases[w]||[w]).some(a=>content.includes(fold(a))));
  }

  function score(p,query,kind='design') {
    const q=fold(query);
    if(!q)return 0;
    const title=fold(p.name||p.title),team=fold(p.team),category=fold(p.category);
    if(title.includes(q)||team.includes(q))return 100;
    if(category===q)return 60;
    if(fields(p).includes(q))return 40;
    return matches(p,q,kind)?10:0;
  }

  function diversify(items,categoryOf,limit) {
    const pools=new Map(),result=[];
    for(const item of items){
      const key=categoryOf(item)||'other';
      if(!pools.has(key))pools.set(key,[]);
      pools.get(key).push(item);
    }
    for(const pool of pools.values())if(pool.length)result.push(pool.shift());
    while(result.length<limit){
      let added=false;
      for(const pool of pools.values()){
        if(pool.length){result.push(pool.shift());added=true;if(result.length>=limit)break;}
      }
      if(!added)break;
    }
    return result.slice(0,limit);
  }
  window.SpidersSearch=Object.freeze({fold,fields,matches,score,diversify});
})();
