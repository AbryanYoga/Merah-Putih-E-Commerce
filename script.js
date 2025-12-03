// Menunggu hingga seluruh konten HTML selesai dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {

    // --- BAGIAN 1: DATA PRODUK & KERANJANG ---
    const products = [
        {
            id: 1,
            name: 'Kemeja Batik',
            price: 250000,
            image: 'atasan.webp',
            description: 'Kemeja batik tradisional dengan motif khas Indonesia. Terbuat dari bahan katun berkualitas tinggi yang nyaman dipakai sepanjang hari.'
        },
        {
            id: 2,
            name: 'Kebaya',
            price: 850000,
            image: 'kebaya.jpg',
            description: 'Kebaya tradisional dengan desain elegan. Terbuat dari bahan brokat berkualitas tinggi yang cocok untuk acara formal.'
        },
        {
            id: 3,
            name: 'Kain Batik',
            price: 550000,
            image: 'kain.jpg',
            description: 'Kain batik berkualitas tinggi dengan motif tradisional. Cocok untuk dijadikan bahan pakaian atau dekorasi rumah.'
        },
        {
            id: 4,
            name: 'Dompet',
            price: 120000,
            image: 'dompet.webp',
            description: 'Dompetberkualitas tinggi dengan desain elegan. Cocok untuk menyimpan uang dan kartu dengan aman.'
        },
        {
            id: 5,
            name: 'Blangkon',
            price: 80000,
            image: 'blangkon.jpg',
            description: 'Blangkon tradisional Jawa yang terbuat dari bahan berkualitas tinggi. Cocok untuk melengkapi penampilan tradisional Anda.'
        }
    ];

    let cart = [];

    // --- BAGIAN 2: MEMILIH ELEMEN-ELEMEN HTML ---
    const productListContainer = document.getElementById('product-list');
    
    const pages = {
        beranda: document.getElementById('page-beranda'),
        detailProduk: document.getElementById('page-detail-produk'),
        keranjang: document.getElementById('page-keranjang'),
        checkout: document.getElementById('page-checkout')
    };

    const navLinks = {
        beranda: document.getElementById('nav-beranda'),
        keranjang: document.getElementById('nav-keranjang')
    };

    const cartCountElement = document.getElementById('cart-count');
    const cartItemsContainer = document.getElementById('cart-items-container');
    const cartTotalPriceElement = document.getElementById('cart-total-price');

    // --- BAGIAN 3: FUNGSI-FUNGSI UTAMA ---

    function showPage(pageName) {
        Object.values(pages).forEach(page => page.classList.add('hidden'));
        if (pages[pageName]) {
            pages[pageName].classList.remove('hidden');
        }
    }

    function formatRupiah(number) {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
    }
    
    function renderProducts() {
        productListContainer.innerHTML = '';
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.setAttribute('data-product-id', product.id);
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p class="price">${formatRupiah(product.price)}</p>
            `;
            productItem.addEventListener('click', () => showProductDetail(product.id));
            productListContainer.appendChild(productItem);
        });
    }

    function showProductDetail(productId) {
        const product = products.find(p => p.id === productId);
        if (product) {
            document.getElementById('detail-gambar').src = product.image;
            document.getElementById('detail-nama').textContent = product.name;
            document.getElementById('detail-harga').textContent = formatRupiah(product.price);
            document.getElementById('detail-deskripsi').textContent = product.description;
            
            const addToCartBtn = document.getElementById('add-to-cart-btn');
            addToCartBtn.setAttribute('data-product-id', product.id);

            const checkoutNowBtn = document.getElementById('checkout-now-btn');
            checkoutNowBtn.setAttribute('data-product-id', product.id);

            showPage('detailProduk');
        }
    }

    function renderCart() {
        cartItemsContainer.innerHTML = '';
        let totalPrice = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Keranjang Anda kosong.</p>';
        } else {
            cart.forEach(item => {
                const cartItemElement = document.createElement('div');
                cartItemElement.className = 'cart-item';
                cartItemElement.innerHTML = `
                    <div class="cart-item-info">
                        <h4>${item.name}</h4>
                        <p>${formatRupiah(item.price)} x ${item.quantity}</p>
                    </div>
                    <div class="cart-item-actions">
                        <button class="remove-from-cart-btn" data-product-id="${item.id}">Hapus</button>
                    </div>
                `;
                cartItemsContainer.appendChild(cartItemElement);
                totalPrice += item.price * item.quantity;
            });
        }
        
        cartTotalPriceElement.textContent = formatRupiah(totalPrice);
        cartCountElement.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
    
    function addToCart(productId, silent = false) {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            const product = products.find(p => p.id === productId);
            if (product) {
                cart.push({ ...product, quantity: 1 });
            }
        }
        
        if (!silent) {
            alert('Produk ditambahkan ke keranjang!');
        }
        renderCart();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        renderCart();
    }

    // --- BAGIAN 4: EVENT LISTENERS (PENGATUR AKSI) ---

    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinksContainer = document.getElementById('nav-links');

    hamburgerBtn.addEventListener('click', () => {
        navLinksContainer.classList.toggle('nav-active');
    });

    navLinks.beranda.addEventListener('click', (e) => {
        e.preventDefault();
        showPage('beranda');
        navLinksContainer.classList.remove('nav-active');
    });

    navLinks.keranjang.addEventListener('click', (e) => {
        e.preventDefault();
        renderCart();
        showPage('keranjang');
        navLinksContainer.classList.remove('nav-active');
    });



    document.getElementById('add-to-cart-btn').addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        addToCart(productId);
    });

    document.getElementById('checkout-now-btn').addEventListener('click', (e) => {
        const productId = parseInt(e.target.getAttribute('data-product-id'));
        addToCart(productId, true);
        showPage('checkout');
    });

    document.getElementById('back-to-home-btn').addEventListener('click', () => {
        showPage('beranda');
    });
    
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('remove-from-cart-btn')) {
            const productId = parseInt(e.target.getAttribute('data-product-id'));
            removeFromCart(productId);
        }
    });

    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length > 0) {
            showPage('checkout');
        } else {
            alert('Keranjang Anda kosong. Silakan belanja dulu.');
        }
    });

    document.getElementById('payment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const nama = document.getElementById('nama').value;
        const alamat = document.getElementById('alamat').value;

        if (nama && alamat) {
            alert(`Terima kasih, ${nama}!
Pesanan Anda akan segera dikirim ke:
${alamat}

Pembayaran berhasil disimulasikan.`);
            
            cart = [];
            renderCart();
            document.getElementById('payment-form').reset();
            
            // Kembali ke beranda
            showPage('beranda');
        } else {
            alert('Harap isi semua field yang wajib diisi.');
        }
    });

    // --- BAGIAN 5: INISIALISASI ---
    renderProducts();
    showPage('beranda');
});
