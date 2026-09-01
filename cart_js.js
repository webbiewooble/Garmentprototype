    let cartItems = JSON.parse(localStorage.getItem('kocan_cart') || '[]');
    let currentSelectedSize = null;

    const saveCart = () => {
      localStorage.setItem('kocan_cart', JSON.stringify(cartItems));
      updateCartBadge();
      renderCartDrawer();
    };

    const updateCartBadge = () => {
      const cartBadge = document.getElementById('cart-badge');
      const cartDrawerCount = document.getElementById('cart-drawer-count');
      const count = cartItems.length;
      if (cartBadge) {
        cartBadge.textContent = count;
        if (count > 0) {
          cartBadge.classList.remove('opacity-0');
        } else {
          cartBadge.classList.add('opacity-0');
        }
      }
      if (cartDrawerCount) cartDrawerCount.textContent = count;
    };

    const selectSize = (btn) => {
      document.querySelectorAll('.size-btn').forEach(b => {
        b.classList.remove('border-black', 'bg-black', 'text-white');
        b.classList.add('border-gray-200', 'text-black');
      });
      btn.classList.remove('border-gray-200', 'text-black');
      btn.classList.add('border-black', 'bg-black', 'text-white');
      currentSelectedSize = btn.innerText;
    };

    const addToCart = (productId) => {
      const product = allProducts.find(p => p.id === productId);
      if (!product) return;
      if (!currentSelectedSize && product.sizes && product.sizes.length > 0) {
        alert('Please select a size first.');
        return;
      }
      cartItems.push({
        cartId: Date.now().toString(),
        productId: product.id,
        size: currentSelectedSize || 'M'
      });
      saveCart();
      openCartDrawer();
    };

    const buyNow = (productId) => {
      const product = allProducts.find(p => p.id === productId);
      if (!product) return;
      if (!currentSelectedSize && product.sizes && product.sizes.length > 0) {
        alert('Please select a size first.');
        return;
      }
      cartItems.push({
        cartId: Date.now().toString(),
        productId: product.id,
        size: currentSelectedSize || 'M'
      });
      saveCart();
      openCheckoutModal();
    };

    const removeFromCart = (cartId) => {
      cartItems = cartItems.filter(item => item.cartId !== cartId);
      saveCart();
    };

    const renderCartDrawer = () => {
      const container = document.getElementById('cart-items-container');
      const subtotalEl = document.getElementById('cart-subtotal');
      if (!container) return;
      
      if (cartItems.length === 0) {
        container.innerHTML = `
          <div class="flex flex-col items-center justify-center py-12 text-center text-gray-400">
            <svg class="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
            <p class="font-bold text-xs uppercase tracking-widest">Your cart is empty</p>
          </div>
        `;
        subtotalEl.textContent = '£0';
        return;
      }

      let subtotal = 0;
      container.innerHTML = cartItems.map(item => {
        const product = allProducts.find(p => p.id === item.productId);
        if(!product) return '';
        subtotal += product.price;
        return `
          <div class="flex gap-4 border-b border-gray-100 pb-4">
            <div class="w-20 h-24 bg-gray-100 flex-shrink-0 cursor-pointer" onclick="window.location.hash='#product/${product.slug}'; closeCartDrawer();">
              <img src="${product.images[0]}" class="w-full h-full object-cover object-top" alt="${product.name}">
            </div>
            <div class="flex-1 flex flex-col justify-between py-1">
              <div>
                <h4 class="font-bold text-sm leading-tight hover:underline cursor-pointer" onclick="window.location.hash='#product/${product.slug}'; closeCartDrawer();">${product.name}</h4>
                <p class="text-[11px] font-bold text-gray-500 uppercase tracking-widest mt-1">Size: ${item.size}</p>
              </div>
              <div class="flex justify-between items-end">
                <span class="font-black text-black">${formatGBP(product.price)}</span>
                <button onclick="removeFromCart('${item.cartId}')" class="text-[10px] uppercase font-bold tracking-widest text-red-500 hover:text-red-700 transition">Remove</button>
              </div>
            </div>
          </div>
        `;
      }).join('');
      
      subtotalEl.textContent = formatGBP(subtotal);
      
      const checkoutTotalEl = document.getElementById('checkout-total');
      if (checkoutTotalEl) {
        checkoutTotalEl.textContent = formatGBP(subtotal);
      }
    };

    // Cart Drawer Toggle
    const openCartDrawer = () => {
      const cartDrawer = document.getElementById('cart-drawer');
      const cartBackdrop = document.getElementById('cart-drawer-backdrop');
      renderCartDrawer();
      cartBackdrop.classList.remove('hidden');
      cartDrawer.classList.remove('hidden');
      void cartDrawer.offsetWidth; // Reflow
      cartBackdrop.classList.remove('opacity-0', 'pointer-events-none');
      cartDrawer.classList.remove('translate-x-full');
      document.body.classList.add('modal-open');
    };
    
    const closeCartDrawer = () => {
      const cartDrawer = document.getElementById('cart-drawer');
      const cartBackdrop = document.getElementById('cart-drawer-backdrop');
      if(!cartDrawer) return;
      cartBackdrop.classList.add('opacity-0', 'pointer-events-none');
      cartDrawer.classList.add('translate-x-full');
      setTimeout(() => {
        cartBackdrop.classList.add('hidden');
        if(!document.getElementById('mobile-drawer').classList.contains('translate-x-0') && !document.getElementById('search-overlay').classList.contains('opacity-0') === false && !document.getElementById('checkout-modal').classList.contains('opacity-100')) {
           document.body.classList.remove('modal-open');
        }
      }, 300);
    };

    // Checkout Modal Toggle
    const openCheckoutModal = () => {
      closeCartDrawer();
      const checkoutModal = document.getElementById('checkout-modal');
      const checkoutBackdrop = document.getElementById('checkout-modal-backdrop');
      checkoutBackdrop.classList.remove('hidden');
      checkoutModal.classList.remove('hidden');
      void checkoutModal.offsetWidth;
      checkoutBackdrop.classList.remove('opacity-0', 'pointer-events-none');
      checkoutModal.classList.remove('opacity-0', 'pointer-events-none');
      document.body.classList.add('modal-open');
    };
    
    const closeCheckoutModal = () => {
      const checkoutModal = document.getElementById('checkout-modal');
      const checkoutBackdrop = document.getElementById('checkout-modal-backdrop');
      checkoutBackdrop.classList.add('opacity-0', 'pointer-events-none');
      checkoutModal.classList.add('opacity-0', 'pointer-events-none');
      setTimeout(() => {
        checkoutBackdrop.classList.add('hidden');
        document.body.classList.remove('modal-open');
      }, 300);
    };

    const handleCheckout = (e) => {
      e.preventDefault();
      alert('Payment successful! Thank you for your order.');
      cartItems = [];
      saveCart();
      closeCheckoutModal();
    };

    window.addToCart = addToCart;
    window.buyNow = buyNow;
    window.selectSize = selectSize;
    window.openCartDrawer = openCartDrawer;
    window.closeCartDrawer = closeCartDrawer;
    window.openCheckoutModal = openCheckoutModal;
    window.closeCheckoutModal = closeCheckoutModal;
    window.handleCheckout = handleCheckout;
    
    // Add event listeners on mount
    document.addEventListener('DOMContentLoaded', () => {
      const cartBtn = document.getElementById('cart-btn');
      if (cartBtn) cartBtn.addEventListener('click', openCartDrawer);
      
      const cartClose = document.getElementById('cart-close');
      if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
      
      const cartBackdrop = document.getElementById('cart-drawer-backdrop');
      if (cartBackdrop) cartBackdrop.addEventListener('click', closeCartDrawer);
      
      const checkoutBackdrop = document.getElementById('checkout-modal-backdrop');
      if (checkoutBackdrop) checkoutBackdrop.addEventListener('click', closeCheckoutModal);

      updateCartBadge();
    });
