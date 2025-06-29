import { RouterService } from './services/RouterService.js';
import { AuthModel } from './models/AuthModel.js';
import { NotificationModel } from './models/NotificationModel.js';
import { registerRoutes } from './routes/router.js';

class App {
    constructor() {
        this.router = new RouterService();
        this.authModel = new AuthModel();
        this.notificationModel = new NotificationModel();
        // Kita akan mengambil elemen ini lagi di dalam init untuk memastikan
        this.notificationButton = null; 
    }

    async init() {
        registerRoutes(this.router, this);
        this.router.init();
        this.setupMobileMenu();
        this.updateAuthUI();
        this.checkAuth();
        this._initNotificationButton();
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.getElementById('nav-links');
        
        if (mobileMenuBtn.dataset.listenerAttached) return;

        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Logika menu lainnya...
        document.addEventListener('click', (event) => {
            if (!event.target.closest('#mobile-menu-btn') && 
                !event.target.closest('#nav-links') && 
                navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        navLinks.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });
        
        mobileMenuBtn.dataset.listenerAttached = 'true';
    }

    updateAuthUI() {
        const authNavLink = document.getElementById('auth-nav-link');
        const notificationButton = document.getElementById('notification-button');
        if (!authNavLink || !notificationButton) return;
        
        if (this.authModel.isAuthenticated()) {
            authNavLink.innerHTML = '<i class="fas fa-sign-out-alt" aria-hidden="true"></i> Logout';
            authNavLink.href = '#logout';
            authNavLink.onclick = (e) => {
                e.preventDefault();
                this.handleLogout();
            };
            notificationButton.style.display = 'block';
        } else {
            authNavLink.innerHTML = '<i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login';
            authNavLink.href = '#login';
            authNavLink.onclick = null;
            notificationButton.style.display = 'none';
        }
    }

    async handleLogout() {
        try {
            // Kita tidak perlu unsubscribe saat logout jika tidak diminta
            // await this._unsubscribe(); 
            await this.authModel.logout();
            this.updateAuthUI();
            this.router.navigate('login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    checkAuth() {
        const currentRoute = this.router.getCurrentRoute();
        const isAuthRoute = currentRoute === 'login' || currentRoute === 'logout';
        
        if (!this.authModel.isAuthenticated() && !isAuthRoute) {
            this.router.navigate('login');
        } else if (this.authModel.isAuthenticated() && currentRoute === 'login') {
            this.router.navigate('home');
        }
    }

    _initNotificationButton() {
        // --- PERBAIKAN UTAMA: MEMBERSIHKAN EVENT LISTENER SECARA PAKSA ---
        const oldButton = document.getElementById('notification-button');
        if (!oldButton) return;

        // 1. Buat klon dari tombol. Proses ini tidak menyalin event listener.
        const newButton = oldButton.cloneNode(true);

        // 2. Ganti tombol lama dengan tombol baru yang bersih di dalam DOM.
        oldButton.parentNode.replaceChild(newButton, oldButton);

        // 3. Simpan referensi ke tombol baru dan tambahkan SATU listener.
        this.notificationButton = newButton;
        this.notificationButton.addEventListener('click', async () => {
            const subscription = await this.notificationModel.registerServiceWorker().then(reg => reg.pushManager.getSubscription());
            if (subscription) {
                await this._unsubscribe();
            } else {
                await this._subscribe();
            }
        });
        // --- AKHIR PERBAIKAN ---

        this._updateNotificationButtonUI();
    }

    async _updateNotificationButtonUI() {
        const subscription = await this.notificationModel.registerServiceWorker().then(reg => reg.pushManager.getSubscription());
        if (subscription) {
            this.notificationButton.innerHTML = '<i class="fas fa-bell-slash"></i>';
            this.notificationButton.setAttribute('aria-label', 'Nonaktifkan Notifikasi');
        } else {
            this.notificationButton.innerHTML = '<i class="fas fa-bell"></i>';
            this.notificationButton.setAttribute('aria-label', 'Aktifkan Notifikasi');
        }
    }

    async _subscribe() {
        // Tambahkan dialog konfirmasi yang sudah ada
        const result = confirm("Apakah Anda yakin ingin mengaktifkan notifikasi?");
        if (!result) return;

        try {
            const permission = await this.notificationModel.requestNotificationPermission();
            if (permission !== 'granted') {
                alert('Izin notifikasi tidak diberikan.');
                return;
            }

            const registration = await this.notificationModel.registerServiceWorker();
            const subscription = await this.notificationModel.createSubscription(registration);
            await this.notificationModel.subscribeToNotifications(subscription);
            
            console.log('Successfully subscribed to push notifications.');
            this._updateNotificationButtonUI();
        } catch (error) {
            console.error('Failed to subscribe:', error);
            alert('Gagal berlangganan notifikasi.');
        }
    }

    async _unsubscribe() {
        // Tambahkan dialog konfirmasi yang sudah ada
        const result = confirm("Apakah Anda yakin ingin menonaktifkan notifikasi?");
        if (!result) return;
        
        try {
            const registration = await this.notificationModel.registerServiceWorker();
            const subscription = await registration.pushManager.getSubscription();

            if (subscription) {
                await this.notificationModel.unsubscribeFromNotifications(subscription.endpoint);
                await subscription.unsubscribe();
                
                console.log('Successfully unsubscribed from push notifications.');
                this._updateNotificationButtonUI();
            }
        } catch (error) {
            console.error('Failed to unsubscribe:', error);
            alert('Gagal berhenti berlangganan notifikasi.');
        }
    }
}

export default App;