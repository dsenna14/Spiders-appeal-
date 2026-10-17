/* Category photo map. Existing site photography is preferred.
   External images are inspiration, not completed Spider's Creations orders. */
window.SPIDERS_CATEGORY_IMAGES=Object.freeze({
tumblers:"images/collection-tumblers.webp",boards:"images/collection-kitchenware.webp",
magnets:"https://images.unsplash.com/photo-1487770931682-b80013ed9cc9?auto=format&fit=crop&w=900&q=82",
keychains:"https://images.unsplash.com/photo-1676276550349-580c49631496?auto=format&fit=crop&w=900&q=82",
golf:"https://images.unsplash.com/photo-1722374046676-628b15b67c9c?auto=format&fit=crop&w=900&q=82",
sportsgear:"https://images.unsplash.com/photo-1672523197594-b7c6824b498d?auto=format&fit=crop&w=900&q=82",
coins:"images/custom-coin.jpg",medals:"images/collection-medals.webp",awards:"images/collection-trophies.webp",
glassware:"images/collection-glassware.webp",
coasters:"https://images.unsplash.com/photo-1721738778012-c1b09dcfa69c?auto=format&fit=crop&w=900&q=82",
lighters:"images/collection-lighters.webp",engraving:"images/slate-portrait.jpg",
bottles:"images/collection-liquor-bottles.webp",wedding:"images/collection-wedding.webp",
ornaments:"https://images.unsplash.com/photo-1735377159911-547a234c9e32?auto=format&fit=crop&w=900&q=82",
pets:"https://images.unsplash.com/photo-1682969651476-6fb48aba8b03?auto=format&fit=crop&w=900&q=82",
canvas:"images/collection-canvas.webp",printing:"images/collection-printing.webp",
patches:"images/collection-apparel.webp",printing3d:"images/3d-collection.jpg",
transfers:"images/collection-transfers.webp",gifts:"images/wedding-favors.jpg",
metal:"images/coin.jpg",promo:"images/printing.jpg",
wraps:"images/tumblers.jpg",
puzzles:"https://images.unsplash.com/photo-1735380675901-4867fad9d670?auto=format&fit=crop&w=900&q=82"
});
window.spidersCategoryPhoto=id=>window.SPIDERS_CATEGORY_IMAGES[id]||"images/printing.jpg";
window.spidersPhotoFallback=(img)=>{img.onerror=null;img.src="images/printing.jpg";};
