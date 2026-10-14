(function storefrontPages(){
"use strict";
const S=window.SpidersStore,{cats,products,$,esc,param,byCat,byId,img,a,basket,saved,catUrl,productUrl,pageHead,sectionHead,itemCard}=S;
const options=(arr)=>arr.map(v=>`<option value="${esc(v)}">${esc(v)}</option>`).join("");
const line=(title,label,html)=>`<div class="field"><label for="${esc(title)}">${esc(label)}</label>${html}</div>`;
function designs(){
return `<main id="main">${pageHead("Design library","Browse real saved product reference photographs and search professional team names for original design inquiries.")}<section class="section container">
${sectionHead("Earlier saved concepts","19 distinct example photographs","These are saved category concepts from an earlier Spider's Creations package. The larger tumbler and coin archives are not yet hosted here.")}
<div class="gallery-grid">${cats.map(c=>`<figure class="gallery-item"><a href="${catUrl(c.id)}">${img(c.image,c.name+" saved concept photo")}</a><figcaption>${esc(c.name)} · <a class="underline-link" href="${catUrl(c.id)}">Browse</a></figcaption></figure>`).join("")}</div>
<hr class="line-divider">${sectionHead("Sports team names","Find a league and team","Use this directory to describe a custom team-inspired design. This is not an offer of official licensed team merchandise.")}
<div class="toolbar"><select id="league-filter" aria-label="Select a league">${options(Object.keys(S.dataset.teams))}</select><div class="search-box"><label class="sr-only" for="team-query">Search teams</label><input id="team-query" type="search" placeholder="Find your professional team…"><button type="button" id="team-search-button">Find</button></div></div>
<p class="mini-stat" id="teams-count"></p><div id="teams-list" class="filter-pills"></div><p class="notice">League and team names are used for browsing requests only. Official logos, copyrighted artwork and trademarks require permission before commercial reproduction.</p>
</section></main>`;
}
function customize(){
const requested=byId(param("id"))||products[0],cat=byCat(requested.category);
return `<main id="main">${pageHead("Customize your creation","Pick the item, add your wording, size, colors and details, then save it in your quote basket.")}
<section class="section container"><div class="split">
<div><div class="detail-image" id="preview-image">${img(cat.image,cat.name+" concept photo")}<div class="preview-text" id="preview-text">Your Name</div></div><p class="print-note">Live text preview is illustrative, not a manufacturing proof. We confirm artwork and placement before production.</p><p class="notice">Have your own picture or logo? Attach it on the quote request page after adding this item to your basket.</p></div>
<div class="panel"><span class="eyebrow">Personalization studio</span><h2>Make it yours</h2><form id="customizer-form">
${line("custom-item","Product type",`<select id="custom-item" name="productId">${cats.map(c=>`<optgroup label="${esc(c.name)}">${c.items.map(i=>`<option value="${i.id}">${esc(i.title)}</option>`).join("")}</optgroup>`).join("")}</select>`)}
<div class="form-grid">
${line("custom-size","Size / capacity",`<select id="custom-size" name="size">${options(["Please recommend","Small","Medium","Large","20 oz","30 oz","40 oz","38 mm coin","40 mm coin","50 mm coin","Custom dimensions"])}</select>`)}
${line("custom-material","Material / finish",`<select id="custom-material" name="material">${options(["Please recommend","Stainless steel","Brass","Aluminum","Wood","Glass","Acrylic","PLA or PETG plastic","Slate","Fabric","Black matte finish","Silver tone","Gold tone"])}</select>`)}
<div class="field full"><label for="custom-text">Name, wording or message</label><input type="text" name="text" id="custom-text" maxlength="160" placeholder="Enter your name or phrase"></div>
${line("custom-font","Text style",`<select id="custom-font" name="font">${["classic","script","bold"].map((v,i)=>`<option value="${v}">${["Classic serif","Elegant script","Bold block"][i]}</option>`).join("")}</select>`)}
<div class="field"><label for="custom-color">Preferred colors</label><input type="text" name="colors" id="custom-color" maxlength="120" placeholder="Gold, teal, pink…"></div>
<div class="field"><label for="custom-quantity">Quantity</label><input type="number" name="qty" min="1" max="10000" id="custom-quantity" value="1" required></div>
<div class="field"><label for="custom-deadline">Needed by (optional)</label><input type="date" id="custom-deadline" name="deadline"></div>
<div class="field full"><label for="custom-notes">Artwork and design details</label><textarea name="notes" id="custom-notes" maxlength="2500" placeholder="Size, theme, placement, engraving details, team inspiration…"></textarea></div></div>
<p class="notice" style="margin-top:18px">Your request is free. No prices, delivery dates or completed orders are assumed.</p>
<div class="buttons"><button class="btn" type="submit" id="add-project">Add to quote basket →</button><a class="btn secondary" href="/basket.html">See basket</a></div></form></div></div></section></main>`;
}
function basketPage(){
const entries=basket();
return `<main id="main">${pageHead("Quote basket","Review your custom requests. No payment is collected by this website.")}
<section class="section container"><div class="split"><div class="panel"><h2>${entries.length} saved ${entries.length===1?"item":"items"}</h2>
${entries.length?entries.map((item,i)=>`<div class="cart-item"><div><h3>${esc(item.title)}</h3><p>Qty ${esc(item.qty)} · ${esc(item.size)} · ${esc(item.material)}</p><p>${esc(item.text||"No custom text")} · ${esc(item.colors||"No color specified")}</p><p>${esc((item.notes||"").slice(0,220))}</p></div><div class="cart-actions"><a class="link-button" href="/customize.html?id=${encodeURIComponent(item.productId)}&edit=${encodeURIComponent(item.uid)}">Edit</a><button class="link-button" type="button" data-remove="${i}">Remove</button></div></div>`).join("")+`<div class="buttons"><a class="btn" href="/quote.html">Request pricing →</a><button class="btn secondary" id="clear-basket" type="button">Clear basket</button></div>`:`<div class="empty">Your basket is empty. ${a("/shop.html","Browse product categories →")}</div>`}</div>
<aside class="panel"><span class="eyebrow">How it works</span><h2>Custom ordering</h2><p>1. Choose a product type.</p><p>2. Add text, material, finish, quantity and notes.</p><p>3. Attach artwork when submitting a quote request.</p><p>4. Approve the reviewed options and final price before paying.</p><p class="notice">Basket details are saved only in this browser, not to an account.</p></aside></div></section></main>`;
}
function quote(){
const b=basket();const summary=b.map((p,i)=>`${i+1}. ${p.title} x${p.qty}; ${p.size}; ${p.material}; Text: ${p.text}; Colors: ${p.colors}; Notes: ${p.notes}`).join("\n");
return `<main id="main">${pageHead("Get a custom quote","Tell us the design and quantity you want. We will discuss what's feasible and confirm pricing before any payment.")}
<section class="section container"><div class="split">
<div class="panel"><h2>Tell us your idea</h2><form id="quote-form" name="project-request" method="POST" action="/thank-you.html" data-netlify="true" netlify-honeypot="bot-field" enctype="multipart/form-data">
<input type="hidden" name="form-name" value="project-request"><p class="sr-only"><label>Leave this field blank <input name="bot-field"></label></p>
<div class="form-grid">
${line("customer-name","Full name",`<input name="customer_name" id="customer-name" autocomplete="name" required maxlength="100">`)}
${line("customer-email","Email address",`<input name="email" id="customer-email" type="email" autocomplete="email" required>`)}
${line("customer-phone","Phone (optional)",`<input name="phone" id="customer-phone" type="tel" autocomplete="tel">`)}
${line("customer-delivery","Delivery preference",`<select name="delivery" id="customer-delivery">${options(["Discuss options","Local pickup inquiry","Shipping inquiry"])}</select>`)}
${line("customer-date","Requested completion date",`<input type="date" name="needed_by" id="customer-date">`)}
${line("customer-category","Main project category",`<select id="customer-category" name="category"><option value="">General request</option>${cats.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join("")}</select>`)}
<div class="field full"><label for="customer-message">Design description</label><textarea name="message" id="customer-message" required minlength="8" maxlength="5000" placeholder="What would you like made? Include all specifications you know."></textarea></div>
<div class="field full"><label for="customer-artwork">Attach a reference photo, logo or artwork (optional)</label><input name="artwork" id="customer-artwork" type="file" accept="image/*,.pdf,.svg,.ai,.eps"><span class="helper">10 MB maximum. Only submit files you have the right to use.</span></div></div>
<input type="hidden" name="basket" id="basket-json"><div class="notice" style="margin:22px 0">Quote request only. No payment card data is collected. Netlify Forms delivery and notifications must be verified after publishing.</div>
<button type="submit" class="btn">Submit my request →</button></form></div>
<aside class="panel"><span class="eyebrow">Your selected ideas</span><h2>Quote basket</h2>${b.length?`<p>${b.length} customized entries:</p><pre style="white-space:pre-wrap;overflow-wrap:anywhere;color:#dacdbd;font-size:13px">${esc(summary)}</pre>`:`<p>Your basket is empty. Describe the project in the request form, or ${a("/shop.html","browse the store")} first.</p>`}<div class="buttons">${a("/basket.html","Edit basket →")}</div></aside></div></section></main>`;
}
function savedPage(){
const list=saved().map(byId).filter(Boolean);return `<main id="main">${pageHead("My saved ideas","Favorites and basket drafts are saved in this browser only; this is not an online account.")}
<section class="section container">${sectionHead("Saved for later",`${list.length} favorite products`,"Tap Save on products while browsing. Favorites remain on this device unless browser data is cleared.")}
${list.length?`<div class="grid">${list.map(itemCard).join("")}</div>`:`<div class="empty">No saved favorites yet. ${a("/shop.html","Browse products →")}</div>`}
<div class="buttons"><a class="btn secondary" href="/basket.html">Open basket (${basket().length}) →</a></div></section></main>`;
}
function about(){
return `<main id="main">${pageHead("About Spider's Creations","A custom goods and creative designs storefront, built around personalized gifts.")}
<section class="section container"><div class="split"><div><span class="eyebrow">Craftsmanship and creativity</span><h2 style="font-family:Georgia,serif;font-weight:400;font-size:47px">Ideas turned into something personal.</h2><p>Spider's Creations brings together custom engraving, artwork, drinkware, printing, gifts and 3D printing inquiries in one place.</p><p>Because every custom project is different, materials, production possibilities, legal artwork rights, timing and price are reviewed before we accept an order.</p><div class="buttons"><a href="/quote.html" class="btn">Tell us your idea</a><a href="/shop.html" class="btn secondary">Browse collections</a></div></div><div class="detail-image">${img("/images/slate-portrait.jpg","Reference slate engraving")}</div></div></section></main>`;
}
function faq(){
const questions=[
["How do I customize a product?","Select a product category and item, open Customize, enter your text, size, colors, materials, quantity and design notes, and add your idea to the quote basket."],
["Is there a working credit card checkout?","No. This storefront collects custom quote inquiries. Secure online payments require verified pricing, tax, shipping settings, and a connected payment provider before activation."],
["Can I add my own artwork?","Yes. Upload your photo or artwork on the quote request form. Files are not stored in your browser basket."],
["Do you make official team merchandise?","This site shows league and team names as filters for customer inquiries. It does not claim official licensing. Protected logos and designs can only be produced when permitted."],
["Can I order in bulk?","You can enter your desired quantity up to 10,000 pieces. Availability, bulk pricing and timelines are confirmed individually."],
["When will an order ship?","Shipping, local pickup, and production timing are discussed during the quote process. No dates or prices are guaranteed on the website."],
["What is My Saved Ideas?","It is a simple collection of favorites saved locally in your phone's browser, not an authenticated customer account."],
["Can I pay with installment plans?","Payment methods and plans are not configured. They will only be displayed when a payment provider and business terms are fully connected and tested."]
];return `<main id="main">${pageHead("Frequently asked questions","Answers about customization, quotes, artwork, delivery, payments and your saved ideas.")}
<section class="section container" style="max-width:900px">${questions.map(([q,answer])=>`<details class="panel" style="margin-bottom:12px"><summary style="font-weight:750;cursor:pointer">${esc(q)}</summary><p style="margin:15px 0 0">${esc(answer)}</p></details>`).join("")}
<div class="buttons"><a class="btn" href="/quote.html">Ask us a question</a></div></section></main>`;
}
function legal(type){
const privacy=type==="privacy";
return `<main id="main">${pageHead(privacy?"Privacy":"Terms and ordering","Information about this custom inquiry storefront.")}
<section class="section container legal"><h2>${privacy?"Information you submit":"Custom products and pricing"}</h2>
<p>${privacy?"You may provide contact information, project notes and optional artwork when requesting a quote. Submissions are handled by our website provider and must be configured by the store operator. Avoid sending sensitive information such as payment card numbers.":"Product images are reference concepts, not proof of in-stock merchandise. Sizes, materials, price, delivery dates, shipping, cancellation policies, and payment methods must be confirmed for each project."}</p>
<h2>${privacy?"Local browser storage":"Artwork and brand rights"}</h2><p>${privacy?"Your favorites and quote basket are stored in your browser, not synced to an online account. Clearing browser data removes them.":"You must have permission to use supplied artwork and protected logos. Team and league names are included solely to make inquiry categories easier to find. We do not claim affiliation with professional teams."}</p>
<h2>Questions</h2><p>Use the ${a("/quote.html","contact and quote form")} to ask questions before placing an order.</p></section></main>`;
}
function success(){return `<main id="main"><section class="container not-found"><span class="eyebrow">Custom quote request</span><h1>Thanks for reaching out.</h1><p>If the form was accepted by the hosting provider, your request has been submitted for review. Confirm delivery in Netlify's form dashboard.</p><a href="/" class="btn">Go to homepage →</a></section></main>`}
function missing(){return `<main id="main"><section class="container not-found"><span class="eyebrow">Page not found</span><h1>We couldn't find that page.</h1><a class="btn" href="/">Return home →</a></section></main>`}
window.SpidersPages={designs,customize,basketPage,quote,savedPage,about,faq,legal,success,missing};
})();