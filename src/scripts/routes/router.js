// router.js
// Semua route aplikasi didefinisikan di sini

import { HomeView } from '../views/HomeView.js';
import { StoriesView } from '../views/StoriesView.js';
import { AddStoryView } from '../views/AddStoryView.js';
import { LoginView } from '../views/LoginView.js';
import SavedStoriesView from '../views/SavedStoriesView.js';

export function registerRoutes(router, app) {
  router.addRoute('home', async () => {
    const homeView = new HomeView();
    await homeView.render();
    app.updateAuthUI();
  });

  router.addRoute('stories', async () => {
    const storiesView = new StoriesView();
    await storiesView.render();
    app.updateAuthUI();
  });

  router.addRoute('add-story', async () => {
    const addStoryView = new AddStoryView();
    await addStoryView.render();
    app.updateAuthUI();
  });

  router.addRoute('login', async () => {
    const loginView = new LoginView();
    await loginView.render();
    app.updateAuthUI();
  });

  router.addRoute('logout', async () => {
    await app.handleLogout();
  });

  router.addRoute('saved-stories', async () => {
    const savedStoriesView = new SavedStoriesView();
    await savedStoriesView.render();
    app.updateAuthUI();
  });

  router.addRoute('', async () => {
    router.navigate('home');
  });
}
