document.addEventListener('DOMContentLoaded', () => {

    //DATA PRODUK
    const products = [
        { id: 1, name: 'Kain Tenun', image: 'kain.jpg', price: 250000, description: 'Kain tenun tradisional dengan motif khas Indonesia yang indah dan elegan.' },
        { id: 2, name: 'Kebaya', image: 'kebaya.jpg', price: 450000, description: 'Kebaya modern dengan desain yang elegan dan bahan berkualitas tinggi.' },
        { id: 3, name: 'Blangkon', image: 'blangkon.jpg', price: 150000, description: 'Blangkon asli dari Yogyakarta dengan kualitas terbaik.' },
        { id: 4, name: 'Dompet Kulit', image: 'dompet.webp', price: 200000, description: 'Dompet kulit asli dengan ukiran yang unik dan tahan lama.' },
        { id: 5, name: 'Atasan Batik', image: 'atasan.webp', price: 300000, description: 'Atasan batik dengan motif modern yang cocok untuk berbagai acara.' }
    ];

    let cart = [];
    let userBalance = 5000000; // Saldo awal

    //ELEMEN HTML
    const productListContainer = document.getElementById('product-list');
    
    const pages = {
        beranda: document.getElementById('page-beranda'),
        detailProduk: document.getElementById('page-detail-produk'),
        keranjang: document.getElementById('page-keranjang'),
        checkout: document.getElementById('page-checkout'),
        nota: document.getElementById('page-nota')
    };

    const navLinks = {
        beranda: document.getElementById('nav-beranda'),
        keranjang: document.getElementById('nav-keranjang')
    };

    const balanceAmountElement = document.getElementById('balance-amount');
    const cartCountElement = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceElement = document.getElementById('cart-total-price');

    //FUNGSI UTAMA
    
    function showPage(pageName) {
        Object.values(pages).forEach(page => page.classList.add('hidden'));
        if (pages[pageName]) {
            pages[pageName].classList.remove('hidden');
            window.scrollTo(0, 0);
        }
    }

    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', { 
            style: 'currency', 
            currency: 'IDR', 
            minimumFractionDigits: 0 
        }).format(number);
    }

    function renderBalance() {
        balanceAmountElement.textContent = formatRupiah(userBalance);
    }

    function renderProducts() {
        productListContainer.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">${formatRupiah(product.price)}</p>
                    <a href="#" class="view-detail-btn" data-id="${product.id}">
                        <i class="fas fa-eye"></i> Lihat Detail
                    </a>
                </div>
            `;
            
            productItem.querySelector('.view-detail-btn').addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                showProductDetail(product.id);
            });
            
            productListContainer.appendChild(productItem);
        });
    }

    function showProductDetail(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        pages.detailProduk.innerHTML = `
            <button class="back-button" id="back-to-beranda-btn">
                <i class="fas fa-arrow-left"></i> Kembali
            </button>
            <div class="detail-container">
                <div class="detail-img">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="detail-info">
                    <h1>${product.name}</h1>
                    <p class="price">${formatRupiah(product.price)}</p>
                    <h3>Deskripsi Produk</h3>
                    <p>${product.description}</p>
                    <button class="add-to-cart-btn" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Tambahkan ke Keranjang
                    </button>
                </div>
            </div>
        `;

        pages.detailProduk.querySelector('#back-to-beranda-btn').addEventListener('click', () => {
            showPage('beranda');
        });

        pages.detailProduk.querySelector('.add-to-cart-btn').addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.dataset.id);
            addToCart(id);
        });

        showPage('detailProduk');
    }

    function getCartTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div style="text-align: center; padding: 3rem;">
                    <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #ddd; margin-bottom: 1rem;"></i>
                    <p style="font-size: 1.2rem; color: #999;">Keranjang Anda masih kosong</p>
                </div>
            `;
            cartTotalPriceElement.textContent = formatRupiah(0);
            return;
        }

        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}">
                    <div class="cart-item-details">
                        <h4>${item.name}</h4>
                        <p>${formatRupiah(item.price)}</p>
                    </div>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="decrease-qty" data-id="${item.id}">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                        <button class="increase-qty" data-id="${item.id}">+</button>
                    </div>
                    <button class="remove-from-cart-btn" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Event listeners untuk quantity controls
        document.querySelectorAll('.decrease-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const item = cart.find(i => i.id === id);
                if (item && item.quantity > 1) {
                    item.quantity--;
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.increase-qty').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const item = cart.find(i => i.id === id);
                if (item) {
                    item.quantity++;
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                const newQty = parseInt(e.currentTarget.value);
                const item = cart.find(i => i.id === id);
                if (item && newQty > 0) {
                    item.quantity = newQty;
                    renderCart();
                }
            });
        });

        document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = parseInt(e.currentTarget.dataset.id);
                removeFromCart(id);
            });
        });

        cartTotalPriceElement.textContent = formatRupiah(getCartTotal());
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    function addToCart(productId) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push({ ...product, quantity: 1 });
            }
        }
        
        renderCart();
        alert('Produk berhasil ditambahkan ke keranjang!');
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    function updateCheckoutInfo() {
        const total = getCartTotal();
        const remaining = userBalance - total;

        document.getElementById('checkout-balance').textContent = formatRupiah(userBalance);
        document.getElementById('checkout-total').textContent = formatRupiah(total);
        document.getElementById('checkout-remaining').textContent = formatRupiah(remaining);
        document.getElementById('cod-total').textContent = formatRupiah(total);

        const remainingElement = document.getElementById('checkout-remaining');
        if (remaining < 0) {
            remainingElement.style.color = '#c0392b';
        } else {
            remainingElement.style.color = '#27ae60';
        }
    }

    function showNota(orderData) {
        document.getElementById('nota-order-id').textContent = `MP-${Date.now()}`;
        document.getElementById('nota-date').textContent = new Date().toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        document.getElementById('nota-nama').textContent = orderData.nama;
        document.getElementById('nota-email').textContent = orderData.email;
        document.getElementById('nota-telepon').textContent = orderData.telepon;
        document.getElementById('nota-alamat').textContent = orderData.alamat;
        document.getElementById('nota-payment').textContent = orderData.paymentMethod;
        document.getElementById('nota-total-price').textContent = formatRupiah(orderData.total);

        const tbody = document.querySelector('#nota-items-table tbody');
        tbody.innerHTML = '';
        
        orderData.items.forEach(item => {
            const row = tbody.insertRow();
            row.innerHTML = `
                <td>${item.name}</td>
                <td>${item.quantity}</td>
                <td>${formatRupiah(item.price)}</td>
                <td>${formatRupiah(item.price * item.quantity)}</td>
            `;
        });

        showPage('nota');
    }

    // --- EVENT LISTENERS ---

    // Navigasi
    navLinks.beranda.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('beranda');
    });

    navLinks.keranjang.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        showPage('keranjang');
    });

    // Checkout button
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Keranjang Anda masih kosong!');
            return;
        }
        updateCheckoutInfo();
        showPage('checkout');
    });

    // Payment method toggle
    document.querySelectorAll('input[name="payment-type"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const method = e.target.value;
            
            // Hide all payment details
            document.getElementById('payment-detail-saldo').classList.add('hidden');
            document.getElementById('payment-detail-bank').classList.add('hidden');
            document.getElementById('payment-detail-ewallet').classList.add('hidden');
            document.getElementById('payment-detail-cod').classList.add('hidden');

            // Show selected payment detail
            if (method === 'saldo') {
                document.getElementById('payment-detail-saldo').classList.remove('hidden');
                updateCheckoutInfo();
            } else if (method === 'bank') {
                document.getElementById('payment-detail-bank').classList.remove('hidden');
            } else if (method === 'ewallet') {
                document.getElementById('payment-detail-ewallet').classList.remove('hidden');
            } else if (method === 'cod') {
                document.getElementById('payment-detail-cod').classList.remove('hidden');
                updateCheckoutInfo();
            }
        });
    });

    // Payment form submit
    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();

        const nama = document.getElementById('nama').value.trim();
        const email = document.getElementById('email').value.trim();
        const telepon = document.getElementById('telepon').value.trim();
        const alamat = document.getElementById('alamat').value.trim();
        const paymentType = document.querySelector('input[name="payment-type"]:checked').value;
        
        if (!nama || !email || !telepon || !alamat) {
            alert('Mohon lengkapi semua data yang diperlukan!');
            return;
        }

        const total = getCartTotal();
        let paymentMethod = '';
        let paymentSuccess = false;

        if (paymentType === 'saldo') {
            paymentMethod = 'Saldo E-Commerce';
            if (userBalance >= total) {
                userBalance -= total;
                paymentSuccess = true;
            } else {
                alert('Saldo Anda tidak mencukupi!');
                return;
            }
        } else if (paymentType === 'bank') {
            const selectedBank = document.querySelector('input[name="bank"]:checked');
            if (!selectedBank) {
                alert('Pilih bank terlebih dahulu!');
                return;
            }
            paymentMethod = `Transfer Bank ${selectedBank.value.toUpperCase()}`;
            paymentSuccess = true;
        } else if (paymentType === 'ewallet') {
            const selectedEwallet = document.querySelector('input[name="ewallet"]:checked');
            if (!selectedEwallet) {
                alert('Pilih e-wallet terlebih dahulu!');
                return;
            }
            paymentMethod = selectedEwallet.value.charAt(0).toUpperCase() + selectedEwallet.value.slice(1);
            paymentSuccess = true;
        } else if (paymentType === 'cod') {
            paymentMethod = 'COD (Bayar di Tempat)';
            paymentSuccess = true;
        }

        if (paymentSuccess) {
            const orderData = {
                nama,
                email,
                telepon,
                alamat,
                paymentMethod,
                total,
                items: [...cart]
            };

            showNota(orderData);
            
            // Reset
            cart = [];
            renderCart();
            renderBalance();
            document.getElementById('payment-form').reset();
        }
    });

    // Nota buttons
    document.getElementById('print-nota-btn').addEventListener('click', () => {
        window.print();
    });

    document.getElementById('back-to-home-btn').addEventListener('click', () => {
        showPage('beranda');
    });

    // --- INISIALISASI ---
    renderProducts();
    renderBalance();
    renderCart();
    showPage('beranda');
});
