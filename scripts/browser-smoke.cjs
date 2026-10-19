/* Browser-level smoke checks for the real static storefront.
   Run via node scripts/browser-smoke.cjs after installing Playwright and serving the site. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const BASE=process.env.SPIDERS_TEST_BASE||'http://127.0.0.1:8765';
const available=['/usr/bin/google-chrome','/usr/bin/google-chrome-stable','/usr/bin/chromium'].find(x=>fs.existsSync(x));
const options={headless:true,args:['--no-sandbox','--disable-dev-shm-usage']};
if(available)options.executablePath=available;
const wait=(page,selector)=>page.locator(selector).first().waitFor({state:'visible',timeout:25000});
(async()=>{
const browser=await chromium.launch(options);
const page=await browser.newPage({viewport:{width:390,height:844}});
const problems=[];
page.on('pageerror',e=>problems.push(e.message));
async function go(path){await page.goto(BASE+'/'+path,{waitUntil:'domcontentloaded'});}
async function expectCards(selector,minimum){await page.waitForFunction(([sel,min])=>document.querySelectorAll(sel).length>=min,[selector,minimum],{timeout:25000});}
try{
 await go('index.html');
 await wait(page,'#studio-category-grid .studio-category-card[data-category="hypechains"]');
 await page.waitForFunction(()=>document.querySelector('#studio-category-select')?.options.length>20);
 for(const key of ['hypechains','puzzles','boards','phone-cases','balloons','magnets']){
  assert(await page.locator('#studio-category-select option[value="'+key+'"]').count(),'Missing homepage category '+key);
 }
 assert(await page.locator('.studio-category-card[data-category="hypechains"] img').count(),'Hype chain homepage photo missing');
 assert(await page.locator('.studio-category-card[data-category="magnets"] img').count(),'Magnet must have a photo, not an emoji');
 await page.locator('#studio-category-select').selectOption('hypechains');
 assert.equal(await page.locator('#studio-category-grid .studio-category-card:not([hidden])').count(),1,'Homepage selector should isolate category');
 await page.locator('#studio-search-field').fill('birthday');
 await Promise.all([page.waitForURL(/find\.html\?q=birthday/),page.locator('.studio-search button').click()]);
 await wait(page,'#find-products .hub-card');
 await wait(page,'#find-designs .hub-card');
 assert(await page.locator('#find-products .hub-card').count()>20,'Birthday should show relevant products across collections');
 await go('index.html');
 await Promise.all([page.waitForURL(/collection\.html\?category=hypechains/),page.locator('.studio-category-card[data-category="hypechains"]').click()]);
 await wait(page,'#collection-artwork:not([hidden]) .collection-art-card');
 assert(await page.locator('#collection-artwork .collection-art-card').count()>=10,'Hype chain saved artwork should load');
 const shopHref=await page.locator('#collection-designs-link').getAttribute('href');
 assert(shopHref.includes('type=hypechains'),'Our Designs link should be category-specific');
 await page.locator('#collection-designs-link').click();
 await page.waitForURL(/shop\.html\?type=hypechains/);
 await wait(page,'#studio-shop-grid .studio-design-card');
 assert.equal(await page.locator('#studio-shop-type').inputValue(),'hypechains','Hype chain category should be preselected');
 const hypeLabels=await page.locator('.studio-design-category').allTextContents();
 assert(hypeLabels.every(x=>/Hype Chain/i.test(x)),'Shop is leaking other product categories into Hype Chains');
 await page.locator('#studio-shop-grid .studio-design-card .studio-design-actions .button').first().click();
 await page.waitForURL(/product-customize\.html/);
 await wait(page,'#studio-design-selection:not([hidden])');
 assert((await page.locator('#studio-design-selection').innerText()).includes('Selected artwork'),'Artwork selection failed');
 await page.locator('#pc-text').fill('CUSTOM NAME');
 await page.locator('#pc-qty').fill('2');
 await page.locator('#pc-submit').click();
 await page.waitForURL(/basket\.html/,{timeout:18000});
 assert((await page.locator('body').innerText()).includes('CUSTOM NAME'),'Custom quote basket lost personalization');
 await go('shop.html');
 await expectCards('#studio-shop-grid .studio-design-card',20);
 const mixed=await page.locator('.studio-design-category').allTextContents();
 assert(new Set(mixed.slice(0,12).map(t=>t.split('/')[0].trim())).size>=4,'All-products shop not interleaved');
 for(const [type,label] of [['puzzles','Custom Puzzles'],['boards','Cutting Boards'],['phone-cases','Phone Cases']]){
  await go('shop.html?type='+type);
  await wait(page,'#studio-shop-grid .studio-design-card');
  assert.equal(await page.locator('#studio-shop-type').inputValue(),type,'Type filter was not selected: '+type);
  const captions=await page.locator('.studio-design-category').allTextContents();
  assert(captions.every(x=>x.startsWith(label)),'Wrong designs appeared for '+type);
 }
 await go('designs.html?category=NFL');
 try{await wait(page,'#design-grid .design-card')}catch(e){
  const diagnostics=await page.evaluate(()=>({url:location.href,body:document.body?.dataset,
   grid:document.querySelector('#design-grid')?.innerHTML?.slice(0,1300),
   status:document.querySelector('#results-status')?.textContent,
   category:document.querySelector('#category-filter')?.value,
   group:document.querySelector('#group-filter')?.value,
   selectCount:document.querySelector('#category-filter')?.options.length,
   errors:[...document.querySelectorAll('script[src]')].map(x=>x.src)
  }));
  console.error('GALLERY_DIAGNOSTIC',JSON.stringify({diagnostics,problems}));throw e;
 }
 const first=await page.locator('.design-card-image').first().getAttribute('href');
 assert(first?.includes('product-customize.html?id=hypechains-'),'Legacy gallery not linked to hype chain customizer');
 if(problems.length)throw Error('Uncaught browser errors: '+problems.join(' | '));
 console.log('PASS: home global search/photos, Hype Chains, category-only shop, design choice, basket and rotated shop listings.');
}finally{await browser.close()}
})().catch(err=>{console.error(err);process.exitCode=1});
