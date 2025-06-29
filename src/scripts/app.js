import { RouterService } from './services/RouterService.js';
import { HomeView } from './views/HomeView.js';
import { StoriesView } from './views/StoriesView.js';
import { AddStoryView } from './views/AddStoryView.js';
import { LoginView } from './views/LoginView.js';
import { AuthModel } from './models/AuthModel.js';
import { NotificationModel } from './models/NotificationModel.js';
import SavedStoriesView from './views/SavedStoriesView.js';
import { registerRoutes } from './routes/router.js';

class App {
    constructor() {
        this.router = new RouterService();
        this.authModel = new AuthModel();
        this.notificationModel = new NotificationModel();
    }

    async init() {
        registerRoutes(this.router, this);
        this.router.init();
        this.setupMobileMenu();
        this.updateAuthUI();
        this.checkAuth();

        // HAPUS INI: Jangan inisialisasi notifikasi di sini
        // if (this.authModel.isAuthenticated()) {
        //     await this.initNotifications();
        // }
    }

    setupMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const navLinks = document.getElementById('nav-links');
        
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

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
    }

    updateAuthUI() {
        const authNavItem = document.getElementById('auth-nav-item');
        const authNavLink = document.getElementById('auth-nav-link');
        
        if (!authNavItem || !authNavLink) return;
        
        if (this.authModel.isAuthenticated()) {
            authNavLink.innerHTML = '<i class="fas fa-sign-out-alt" aria-hidden="true"></i> Logout';
            authNavLink.href = '#logout';
            authNavLink.onclick = (e) => {
                e.preventDefault();
                this.handleLogout();
            };
            authNavLink.classList.add('logout');
        } else {
            authNavLink.innerHTML = '<i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login';
            authNavLink.href = '#login';
            authNavLink.onclick = null;
            authNavLink.classList.remove('logout');
        }
    }

    async handleLogout() {
        try {
            await this.authModel.logout();
            this.updateAuthUI();
            this.router.navigate('login');
            
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.ready;
                const subscription = await registration.pushManager.getSubscription();
                if (subscription) {
                    await this.notificationModel.unsubscribeFromNotifications(subscription.endpoint);
                }
            }
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

    // Ganti nama initNotifications menjadi handleSubscribeClick agar lebih jelas
    async handleSubscribeClick() {
        try {
            const permission = await this.notificationModel.checkNotificationPermission();
            
            if (permission === 'default') {
                const result = await this.notificationModel.requestNotificationPermission();
                if (result !== 'granted') return false; // Kembalikan false jika izin ditolak
            } else if (permission !== 'granted') {
                return false; // Kembalikan false jika sudah diblokir
            }
            
            const registration = await this.notificationModel.registerServiceWorker();
            const subscription = await this.notificationModel.createSubscription(registration);
            await this.notificationModel.subscribeToNotifications(subscription);
            
            console.log('Push notifications subscribed');
            return true; // Kembalikan true jika berhasil
        } catch (error) {
            console.error('Notification setup failed:', error);
            throw error; // Lempar error agar bisa ditangkap di index.html
        }
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    window.app = new App();
    await window.app.init();

    window.navigateToPage = (page) => {
        window.app.router.navigate(page);
    };
    
    window.showRegisterForm = () => {
        document.getElementById('register-section').style.display = 'block';
    };
});

App.prototype.updateOnlineStatus = function() {
    // ... (kode tetap sama)
};

export default App;