(function storefrontBase(){
"use strict";
const dataset=window.SPIDERS_DATA||{categories:[],teams:{}};
const cats=dataset.categories, products=cats.flatMap(c=>c.items.map(p=>({...p,image:c.image,emoji:c.emoji})));
const $=(q)=>document.querySelector(q);
const $$=(q)=>[...document.querySelectorAll(q)];
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const param=k=>new URLSearchParams(location.search).get(k)||"";
const byCat=id=>cats.find(c=>c.id===id);
const byId=id=>products.find(p=>p.id===id);
const img=(src,alt,opts="")=>`<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" ${opts}>`;
const a=(href,title)=>`<a href="${esc(href)}">${esc(title)}</a>`;
const productUrl=id=>"/product.html?id="+encodeURIComponent(id);
const catUrl=id=>"/collections/"+id+".html";
const fromStorage=(key)=>{try{const v=JSON.parse(localStorage.getItem("spiders-"+key)||"[]");return Array.isArray(v)?v:[]}catch{return[]}};
const toStorage=(key,value)=>{try{localStorage.setItem("spiders-"+key,JSON.stringify(value));return true}catch{return false}};
const basket=()=>fromStorage("basket");
const saved=()=>fromStorage("favorites");
const sectionHead=(label,title,subtitle)=>`<div class="section-header"><div><span class="eyebrow">${esc(label)}</span><h2>${esc(title)}</h2><p>${esc(subtitle)}</p></div></div>`;
const card=c=>`<article class="category-card"><a class="card-media" href="${catUrl(c.id)}">${img(c.image,c.name+" saved concept photograph")}<span class="flag">${c.items.length} options</span></a><div class="card-copy"><h3>${a(catUrl(c.id),c.name)}</h3><p>${esc(c.tagline)}</p><a href="${catUrl(c.id)}" class="gold-link">Explore category →</a></div></article>`;
const itemCard=p=>`<article class="product-card"><div class="card-copy"><span class="eyebrow">${esc(p.collection)}</span><h3 style="margin-top:12px">${a(productUrl(p.id),p.title)}</h3><p>Made to order · Personalized quote required</p><div class="flex space-between"><a class="gold-link" href="${productUrl(p.id)}">Product details →</a><button type="button" class="link-button" data-fav="${esc(p.id)}">♡ Save</button></div></div></article>`;
function header(){
const amount=basket().reduce((sum,p)=>sum+(Number(p.qty)||1),0);
return `<a href="#main" class="skip-link">Skip to main content</a>
<div class="announcement">Custom made gifts · Personal engraving · Massachusetts</div>
<header class="header"><div class="container header-top">
<a href="/" class="brand" aria-label="Spider's Creations homepage"><span class="brand-mark" aria-hidden="true">✦</span><span class="brand-title">SPIDER'S<strong>CREATIONS</strong></span></a>
<nav class="header-nav" aria-label="Primary navigation">
<a href="/">Home</a><a href="/shop.html">Shop</a><a href="/collections/tumblers.html">Tumblers</a><a href="/collections/coins.html">Coins</a><a href="/designs.html">Design library</a><a href="/customize.html">Customize</a><a href="/about.html">About</a></nav>
<div class="header-tools"><a href="/shop.html" class="icon-button" aria-label="Search">⌕</a><a href="/basket.html" class="icon-button" aria-label="Quote basket">▣<span class="cart-badge">${amount}</span></a><button type="button" id="menu-button" class="icon-button menu-button" aria-label="Menu" aria-expanded="false">☰</button></div></div>
<div class="mega-menu"><nav class="container mega-inner" aria-label="Collections">${cats.slice(0,13).map(c=>`<a href="${catUrl(c.id)}">${esc(c.name)}</a>`).join("")}</nav></div>
<nav id="mobile-nav" class="mobile-drawer" aria-label="Mobile navigation">${[["/","Home"],["/shop.html","Shop all"],["/designs.html","Design library"],["/customize.html","Customize"],["/my-projects.html","Saved ideas"],["/basket.html","Quote basket"],["/quote.html","Contact / quote"],["/about.html","About us"]].map(([h,t])=>a(h,t)).join("")}</nav>
</header>`;
}
function footer(){
return `<footer class="footer"><div class="container"><div class="footer-layout">
<div><a href="/" class="brand"><span class="brand-mark">✦</span><span class="brand-title">SPIDER'S<strong>CREATIONS</strong></span></a><p>Custom gifts, full-wrap tumblers, challenge coins, laser engraving, printing and 3D creations.</p><p>Products are made to order. Availability, materials and prices are confirmed with a quote.</p></div>
<div><h3>Shop</h3>${a("/shop.html","All collections")}${a("/collections/tumblers.html","Tumblers")}${a("/collections/coins.html","Challenge coins")}${a("/collections/printing3d.html","3D printing")}${a("/designs.html","Design concepts")}</div>
<div><h3>Help</h3>${a("/customize.html","Personalize")}${a("/basket.html","Quote basket")}${a("/quote.html","Request a quote")}${a("/faq.html","Frequently asked questions")}${a("/my-projects.html","My saved ideas")}</div>
<div><h3>Company</h3>${a("/about.html","About Spider's Creations")}${a("/privacy.html","Privacy")}${a("/terms.html","Terms")}${a("/quote.html","Contact")}</div></div>
<div class="foot-bottom">© ${new Date().getFullYear()} Spider's Creations. Independent custom design service, not affiliated with professional sports leagues or franchises.</div></div></footer>`;
}
function pageHead(title,subtitle,crumb="Shop"){
document.title=title+" | Spider's Creations";
return `<section class="page-head"><div class="container"><p class="breadcrumbs">${a("/","Home")} / ${a("/shop.html",crumb)} / ${esc(title)}</p><span class="eyebrow">Personalized • Custom made</span><h1>${esc(title)}</h1><p>${esc(subtitle)}</p></div></section>`;
}
function home(){
document.title="Spider's Creations | Custom Gifts, Tumblers & Engraving";
return `<main id="main"><section class="hero"><div class="container hero-layout"><div class="hero-copy">
<span class="eyebrow">Personalized gifts • Original craftsmanship</span>
<h1>YOU THINK IT.<br><em>WE CREATE IT.</em></h1>
<p>From personalized tumblers and challenge coins to engraved gifts, 3D printing and custom designs. Find something you love, then make it yours.</p>
<div class="buttons"><a href="/shop.html" class="btn">Shop the collections →</a><a href="/customize.html" class="btn secondary">Create something custom</a></div>
<p class="print-note">Custom quotes · No credit card required to inquire</p></div>
<div class="hero-visual">${img("/images/board.jpg","Example custom engraved hardwood serving board","loading='eager'")}<div class="hero-corner">✦ Made personal</div></div></div></section>
<div class="container stats-strip"><div><strong>${cats.length}</strong><small>Product collections</small></div><div><strong>${products.length}</strong><small>Product types</small></div><div><strong>One of one</strong><small>Made your way</small></div></div>
<section class="section container">${sectionHead("Shop by collection","Create something worth keeping","Find the right custom product category with organized options and personalization pages.")}<div class="grid">${cats.slice(0,12).map(card).join("")}</div><div class="buttons"><a href="/shop.html" class="btn secondary">See all ${cats.length} collections →</a></div></section>
<section class="section muted"><div class="container">${sectionHead("Professional sports design requests","For every kind of fan","Choose from major professional leagues, find your team, and request a lawful custom design.")}<div class="grid three">${["NFL","NBA","MLB","NHL","MLS"].map(league=>`<a class="category-card" style="padding:25px" href="/designs.html?league=${league}"><span class="eyebrow">${league}</span><h3 style="font-size:27px;margin:12px 0">Team-inspired designs</h3><p>Browse team names and request personalization.</p><span class="gold-link">Find your team →</span></a>`).join("")}</div></div></section>
<section class="section container"><div class="banner"><div><span class="eyebrow">Have something different in mind?</span><h2>Bring your idea to us.</h2><p>Photos, names, artwork and memories — your project starts with a conversation.</p></div><a href="/quote.html" class="btn">Request a quote →</a></div></section></main>`;
}
function shop(){
return `<main id="main">${pageHead("Shop all collections","Find the perfect customizable product, browse by category or search a specific item.")}<section class="section container">
<form id="shop-search" role="search" class="toolbar"><div class="search-box"><label class="sr-only" for="shop-query">Search products</label><input type="search" id="shop-query" placeholder="Find tumblers, fishing, coins, weddings, 3D prints…" value="${esc(param("q"))}" maxlength="160"><button type="submit">Search</button></div><select id="shop-category" aria-label="Choose product category"><option value="">All categories</option>${cats.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select></form>
<div class="filter-pills" id="shop-pills"></div><div id="shop-collections" class="grid"></div><div id="shop-subheading"></div><div id="shop-products" class="grid"></div><div class="empty" id="shop-empty" hidden>No matching products. <a class="underline-link" href="/quote.html">Ask for a custom item →</a></div>
</section></main>`;
}
function collection(c){
return `<main id="main">${pageHead(c.name,c.tagline)}<section class="section container"><div class="split"><div class="detail-image">${img(c.image,c.name+" reference photograph")}</div><div class="panel">
<span class="eyebrow">Custom-made collection</span><h2>${esc(c.name)}</h2><p>${esc(c.tagline)}. Choose a product type and tell us how you'd like to personalize it. We'll review materials, artwork, price, and timing.</p>
<div class="buttons"><a href="/customize.html?id=${c.items[0].id}" class="btn">Start personalizing →</a><a href="/quote.html?category=${c.id}" class="btn secondary">Ask a question</a></div>
<div class="notice" style="margin-top:22px">Category photos show previous concepts, not guaranteed stock. Final orders require approval of a quote.</div></div></div>
<hr class="line-divider">${sectionHead("Choose a starting point","Items you can personalize","Select a product below for details, text, color, material and quantity options.")}
<div class="grid">${c.items.map(itemCard).join("")}</div></section></main>`;
}
function productPage(p){
const c=byCat(p.category);
return `<main id="main">${pageHead(p.title,"Made to order · Product inquiry",c.name)}<section class="section container"><div class="split product-detail"><div><div class="detail-image">${img(c.image,c.name+" representative custom product")}</div><p class="print-note">Representative category photograph. Final item varies with your requirements.</p></div>
<div><span class="eyebrow">${esc(c.name)}</span><h1>${esc(p.title)}</h1><span class="eyebrow">Price on request</span><p>${esc(p.description)}</p><div class="notice">There is no paid checkout. We confirm your material, design rights, production schedule, quantity and final price before accepting an order.</div>
<div class="buttons"><a class="btn" href="/customize.html?id=${p.id}">Customize this item →</a><button type="button" class="btn secondary" data-fav="${p.id}">♡ Save idea</button></div>
<div class="detail-meta">✓ Personalized text and design requests<br>✓ Multiple materials, colors, sizes and quantities<br>✓ Optional reference artwork at quote submission</div></div></div></section></main>`;
}
const Store={dataset,cats,products,$,$$,esc,param,byCat,byId,img,a,productUrl,catUrl,fromStorage,toStorage,basket,saved,sectionHead,card,itemCard,header,footer,pageHead,home,shop,collection,productPage};
window.SpidersStore=Store;
})();