const http = require('http');

// Test if the dev server is running
http.get('http://localhost:3000', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // Check if both components are in the HTML
    const hasFeaturedProducts = data.includes('FEATURED') && data.includes('INNOVATIONS');
    const hasPremiumSelection = data.includes('Premium Selection');
    const hasProductSlider = data.includes('Trending');
    
    // Check if both sections have the required classes for scrolling
    const hasScrolling = data.includes('overflow-x-auto');
    const hasAnimation = data.includes('requestAnimationFrame') || data.includes('scrollContainer');
    const hasGradientClasses = (data.match(/bg-gradient-to-r/g) || []).length >= 2;
    
    console.log('✓ Dev server is responding');
    console.log('✓ FeaturedProducts section found:', hasFeaturedProducts);
    console.log('✓ ProductSlider/Premium Selection section found:', hasPremiumSelection);
    console.log('✓ Scroll containers found:', hasScrolling);
    console.log('✓ Gradient classes fixed:', hasGradientClasses ? 'YES (bg-gradient-to-r/l)' : 'NO');
    
    if (hasFeaturedProducts && hasPremiumSelection && hasGradientClasses) {
      console.log('\n✅ Both sections appear to be configured correctly');
    }
  });
}).on('error', (e) => {
  console.log('❌ Dev server not responding:', e.message);
});
