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
        this.notificationButton = document.getElementById('notification-button');
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
        
        // Handle menu button click
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenuBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (event) => {
            if (!event.target.closest('#mobile-menu-btn') && 
                !event.target.closest('#nav-links') && 
                navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Close menu when clicking on a link
        navLinks.addEventListener('click', (event) => {
            if (event.target.tagName === 'A') {
                navLinks.classList.remove('active');
                mobileMenuBtn.classList.remove('active');
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
            }
        });

        // Handle escape key
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
            this.notificationButton.style.display = 'block';
        } else {
            authNavLink.innerHTML = '<i class="fas fa-sign-in-alt" aria-hidden="true"></i> Login';
            authNavLink.href = '#login';
            authNavLink.onclick = null;
            authNavLink.classList.remove('logout');
            this.notificationButton.style.display = 'none';
        }
    }

    async handleLogout() {
        try {
            await this._unsubscribe();
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

    async _initNotificationButton() {
        this.notificationButton.addEventListener('click', async () => {
            const subscription = await this.notificationModel.registerServiceWorker().then(reg => reg.pushManager.getSubscription());
            if (subscription) {
                await this._unsubscribe();
            } else {
                await this._subscribe();
            }
        });
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

document.addEventListener('DOMContentLoaded', async () => {
    const app = new App();
    window.app = app; // expose app instance to window
    await app.init();

    window.navigateToPage = (page) => {
        app.router.navigate(page);
    };

    window.showRegisterForm = () => {
        document.getElementById('register-section').style.display = 'block';
    };
});

export default App;