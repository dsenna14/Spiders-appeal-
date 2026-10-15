(function storefrontRuntime(){
"use strict";
const S=window.SpidersStore,P=window.SpidersPages;
if(!S||!P){document.addEventListener("DOMContentLoaded",()=>{const el=document.getElementById("app");if(el)el.textContent="Sorry, the storefront could not load. Please refresh the page."});return}
const {cats,products,$,$$,esc,param,byCat,byId,card,itemCard,basket,saved,toStorage}=S;
const toast=msg=>{document.querySelector("#store-toast")?.remove();const el=document.createElement("div");el.id="store-toast";el.className="toast";el.setAttribute("role","status");el.textContent=msg;document.body.append(el);setTimeout(()=>el.remove(),3600)};
function route(){
const path=location.pathname.split("/").filter(Boolean);
const page=path.at(-1)||"index.html";
if(page==="index.html")return S.home();
if(page==="shop.html"||page==="product-types.html")return S.shop();
if(path.includes("collections"))return byCat(page.replace(/\.html$/,""))?S.collection(byCat(page.replace(/\.html$/,""))):P.missing();
if(page==="product.html")return byId(param("id"))?S.productPage(byId(param("id"))):P.missing();
if(page==="customize.html"||page==="product-customize.html")return P.customize();
if(page==="basket.html")return P.basketPage();
if(page==="quote.html"||page==="contact.html")return P.quote();
if(page==="designs.html")return P.designs();
if(page==="my-projects.html")return P.savedPage();
if(page==="about.html")return P.about();
if(page==="faq.html")return P.faq();
if(page==="privacy.html")return P.legal("privacy");
if(page==="terms.html")return P.legal("terms");
if(page==="thank-you.html")return P.success();
return P.missing();
}
function navigation(){
const btn=$("#menu-button"),menu=$("#mobile-nav");
btn?.addEventListener("click",()=>{const open=menu.classList.toggle("open");btn.setAttribute("aria-expanded",String(open))});
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&menu?.classList.contains("open")){menu.classList.remove("open");btn.setAttribute("aria-expanded","false");btn.focus()}});
}
function favorites(){
$("[data-fav]").forEach(b=>{if(b.dataset.favoriteBound==="1")return;b.dataset.favoriteBound="1";const id=b.dataset.fav;if(saved().includes(id))b.textContent="♥ Saved";b.addEventListener("click",()=>{const list=saved(),idx=list.indexOf(id);if(idx>=0)list.splice(idx,1);else list.push(id);if(toStorage("favorites",list)){b.textContent=idx>=0?"♡ Save":"♥ Saved";toast(idx>=0?"Removed from saved ideas":"Saved to My Ideas");}else toast("Could not save this item on your device.")})});
}
function shopFilters(){
const input=$("#shop-query"),select=$("#shop-category"),pills=$("#shop-pills"),list=$("#shop-collections"),sub=$("#shop-products"),heading=$("#shop-subheading"),empty=$("#shop-empty");
if(!input)return;
select.value=byCat(param("category"))?param("category"):"";
const update=()=>{
const q=input.value.trim().toLocaleLowerCase(),category=select.value;
const featured=cats.filter(c=>(!category||c.id===category)&&[c.name,c.tagline,...c.items.map(i=>i.title)].join(" ").toLocaleLowerCase().includes(q));
const matches=products.filter(p=>(!category||p.category===category)&&[p.title,p.description,p.collection].join(" ").toLocaleLowerCase().includes(q));
list.innerHTML=featured.map(card).join("");
const show=!!q||!!category;
heading.innerHTML=show?`<h2 style="font-size:27px;margin-top:34px">Matching product ideas (${matches.length})</h2>`:"";
sub.innerHTML=show?matches.map(itemCard).join(""):"";
empty.hidden=featured.length+matches.length>0;
pills.innerHTML=[{id:"",name:"All collections"},...cats.slice(0,9)].map(c=>`<button type="button" class="chip ${category===c.id?"active":""}" data-category="${c.id}">${esc(c.name)}</button>`).join("");
const params=new URLSearchParams();if(q)params.set("q",input.value.trim());if(category)params.set("category",category);
history.replaceState(null,"","/product-types.html"+(params.size?"?"+params.toString():""));
favorites();
};
input.addEventListener("input",update);
$("#shop-search").addEventListener("submit",e=>{e.preventDefault();update()});
select.addEventListener("change",update);
pills.addEventListener("click",e=>{const b=e.target.closest("[data-category]");if(b){select.value=b.dataset.category;update()}});
update();
}
function teamFilters(){
const league=$("#league-filter"),input=$("#team-query"),list=$("#teams-list"),count=$("#teams-count");if(!league)return;
const teams=S.dataset.teams||{};
if(teams[param("league")])league.value=param("league");
const update=()=>{const q=input.value.trim().toLocaleLowerCase();const match=(teams[league.value]||[]).filter(t=>t.toLocaleLowerCase().includes(q));list.innerHTML=match.map(t=>`<a class="chip" href="/product-customize.html?id=wraps-1&team=${encodeURIComponent(t)}">${esc(t)} →</a>`).join("");count.textContent=match.length+" teams in "+league.value;};
league.addEventListener("change",update);input.addEventListener("input",update);$("#team-search-button").addEventListener("click",update);update();
}
function customizing(){
const form=$("#customizer-form");if(!form)return;
const select=$("#custom-item"),input=$("#custom-text"),style=$("#custom-font"),preview=$("#preview-text"),cover=$("#preview-image img"),editUid=param("edit");
const draft=editUid?basket().find(x=>x.uid===editUid):null;
const selected=draft?.productId||byId(param("id"))?.id||products[0]?.id;
const pick=id=>{const p=byId(id);if(!p)return;select.value=p.id;const c=byCat(p.category);cover.src=c.image;cover.alt=c.name+" custom product concept";};
pick(selected);
if(draft){
$("#custom-size").value=draft.size;
$("#custom-material").value=draft.material;
$("#custom-text").value=draft.text;
$("#custom-font").value=draft.font||"classic";
$("#custom-color").value=draft.colors||"";
$("#custom-quantity").value=draft.qty;
$("#custom-deadline").value=draft.deadline||"";
$("#custom-notes").value=draft.notes||"";
$("#add-project").textContent="Update saved project →";
}else if(param("team"))$("#custom-notes").value="Team inspiration: "+param("team");
const update=()=>{preview.textContent=input.value.trim()||"Your Name";preview.className="preview-text "+style.value};
input.addEventListener("input",update);style.addEventListener("change",update);select.addEventListener("change",()=>pick(select.value));update();
form.addEventListener("submit",e=>{
e.preventDefault();if(!form.reportValidity())return;
const f=Object.fromEntries(new FormData(form));
const p=byId(f.productId);if(!p){toast("Choose a valid product first.");return}
const next={uid:draft?.uid||"sc-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),productId:p.id,title:p.title,category:byCat(p.category).name,size:f.size,material:f.material,text:f.text.trim(),font:f.font,colors:f.colors.trim(),qty:Math.min(10000,Math.max(1,Number(f.qty)||1)),deadline:f.deadline||"",notes:f.notes.trim()};
const entries=basket();if(draft){const index=entries.findIndex(x=>x.uid===draft.uid);if(index>=0)entries[index]=next;else entries.push(next)}else entries.push(next);
if(toStorage("basket",entries))location.assign("/basket.html");else toast("Storage is unavailable. Please use the quote form directly.");
});
}
function basketActions(){
$$("[data-remove]").forEach(btn=>btn.addEventListener("click",()=>{const next=basket();next.splice(Number(btn.dataset.remove),1);toStorage("basket",next);render()}));
$("#clear-basket")?.addEventListener("click",()=>{if(confirm("Clear all items in your quote basket?")){toStorage("basket",[]);render()}});
}
function submitQuote(){
const form=$("#quote-form");if(!form)return;
const category=param("category");if(byCat(category))$("#customer-category").value=category;
const hidden=$("#basket-json");
hidden.value=JSON.stringify(basket());
form.addEventListener("submit",e=>{const file=$("#customer-artwork").files?.[0];if(file&&file.size>10*1024*1024){e.preventDefault();toast("Please choose an artwork file smaller than 10 MB.");return}hidden.value=JSON.stringify(basket())});
}
function render(){
const root=$("#app");if(!root)return;
root.innerHTML=S.header()+route()+S.footer();
navigation();shopFilters();teamFilters();customizing();basketActions();favorites();submitQuote();
}
document.addEventListener("DOMContentLoaded",render);
})();