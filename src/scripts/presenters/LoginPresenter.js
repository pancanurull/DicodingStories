export class LoginPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }    async loginUser(credentials) {
        try {
            // Validasi input
            if (!credentials.email || !credentials.password) {
                throw new Error('Email dan password harus diisi');
            }

            this.view.showLoginLoading();
            
            // Paksa spinner minimal 2 detik, maksimal 3 detik
            const start = Date.now();
            const result = await this.model.login(credentials);
            const elapsed = Date.now() - start;
            
            if (elapsed < 2000) {
                await new Promise(r => setTimeout(r, 2000 - elapsed));
            } else if (elapsed > 3000) {
                // do nothing, sudah cukup lama
            }

            // FIX: Cek result.success, bukan result.loginResult
            if (result.success) {
                // Simpan token dan user
                this.model.storageService.saveToken(this.model.getAuthToken());
                this.model.storageService.saveUser(result.user);
                this.view.navigateToStories();
            } else {
                this.view.showLoginError(result.message);
            }
        } catch (error) {
            console.error('Login error:', error);
            this.view.showLoginError(error.message);
        } finally {
            this.view.hideLoginLoading();
        }
    }

    async registerUser(userData) {
        try {
            this.view.showRegisterLoading();
            // Paksa spinner minimal 2 detik, maksimal 3 detik
            const start = Date.now();
            const result = await this.model.register(userData);
            const elapsed = Date.now() - start;
            if (elapsed < 2000) {
                await new Promise(r => setTimeout(r, 2000 - elapsed));
            } else if (elapsed > 3000) {
                // do nothing
            }
            if (result.success) {
                this.view.showRegisterSuccess(result.message);
                this.view.hideRegisterForm();
            } else {
                this.view.showRegisterError(result.message);
            }
        } catch (error) {
            console.error('Registration error:', error);
            this.view.showRegisterError(error.message);
        } finally {
            this.view.hideRegisterLoading();
        }
    }
}