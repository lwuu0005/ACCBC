<template>
  <div class="home">
    <header class="home-header">
      <h1>Ticket Booking System</h1>
      <div class="user-info" v-if="isAuthenticated">
        <span>Welcome, {{ fullName }}!</span>
        <button @click="handleLogout" class="logout-button">
          Logout
        </button>
      </div>
      <div class="auth-buttons" v-else>
        <router-link to="/login" class="auth-button login-button">Login</router-link>
        <router-link to="/register" class="auth-button register-button">Register</router-link>
      </div>
    </header>

    <main class="home-content">
      <div class="welcome-section">
        <h2>Welcome to Our Ticket Booking Platform</h2>
        <p>Discover and book tickets for amazing events happening around you.</p>
        
        <div v-if="isAuthenticated" class="user-dashboard">
          <div class="user-card">
            <h3>Your Account</h3>
            <div class="user-details">
              <p><strong>Username:</strong> {{ user?.username }}</p>
              <p><strong>Email:</strong> {{ user?.email }}</p>
              <p><strong>Role:</strong> {{ user?.role }}</p>
            </div>
            
            <div class="user-actions">
              <button @click="goToProfile" class="action-button">
                Update Profile
              </button>
            </div>
          </div>
        </div>

        <div v-else class="guest-section">
          <h3>Get Started</h3>
          <p>Create an account to start booking tickets for events.</p>
          <div class="cta-buttons">
            <router-link to="/register" class="cta-button primary">
              Create Account
            </router-link>
            <router-link to="/login" class="cta-button secondary">
              Sign In
            </router-link>
          </div>
        </div>
      </div>

      <div class="features-section">
        <h3>Features</h3>
        <div class="features-grid">
          <div class="feature-card">
            <h4>Easy Booking</h4>
            <p>Simple and intuitive ticket booking process</p>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useAuthStore } from '../stores/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const user = computed(() => authStore.user);
const isAuthenticated = computed(() => authStore.isAuthenticated);
const fullName = computed(() => authStore.fullName);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};

const goToProfile = () => {
  // For now, just show an alert. Later we can create a profile page
  alert('Profile management coming soon!');
};

onMounted(() => {
  // Initialize auth state from localStorage
  authStore.initializeAuth();
});
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.home-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
}

.home-header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
  font-weight: 700;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info span {
  color: #666;
  font-weight: 500;
}

.logout-button {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.logout-button:hover {
  background: #c82333;
}

.auth-buttons {
  display: flex;
  gap: 12px;
}

.auth-button {
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.login-button {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.login-button:hover {
  background: #667eea;
  color: white;
}

.register-button {
  background: #667eea;
  color: white;
  border: 2px solid #667eea;
}

.register-button:hover {
  background: #5a6fd8;
}

.home-content {
  padding: 60px 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.welcome-section h2 {
  color: #333;
  margin-bottom: 16px;
  font-size: 32px;
  font-weight: 700;
}

.welcome-section p {
  color: #666;
  font-size: 18px;
  margin-bottom: 40px;
}

.user-dashboard {
  margin-top: 40px;
}

.user-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 30px;
  text-align: left;
  max-width: 500px;
  margin: 0 auto;
}

.user-card h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

.user-details p {
  margin: 12px 0;
  color: #555;
  font-size: 16px;
}

.user-actions {
  margin-top: 30px;
  text-align: center;
}

.action-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.action-button:hover {
  background: #5a6fd8;
}

.guest-section h3 {
  color: #333;
  margin-bottom: 16px;
  font-size: 24px;
}

.guest-section p {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
}

.cta-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-button {
  padding: 14px 28px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  transition: all 0.2s ease;
  display: inline-block;
}

.cta-button.primary {
  background: #667eea;
  color: white;
}

.cta-button.primary:hover {
  background: #5a6fd8;
  transform: translateY(-2px);
}

.cta-button.secondary {
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;
}

.cta-button.secondary:hover {
  background: #667eea;
  color: white;
}

.features-section {
  background: white;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.features-section h3 {
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
  text-align: center;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
}

.feature-card {
  text-align: center;
  padding: 20px;
}

.feature-card h4 {
  color: #333;
  margin-bottom: 12px;
  font-size: 20px;
}

.feature-card p {
  color: #666;
  font-size: 14px;
  line-height: 1.6;
}

@media (max-width: 768px) {
  .home-header {
    padding: 20px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .home-content {
    padding: 40px 20px;
  }

  .welcome-section {
    padding: 30px 20px;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .cta-button {
    width: 200px;
  }
}
</style>
