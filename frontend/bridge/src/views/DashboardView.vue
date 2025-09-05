<template>
  <div class="dashboard">
    <header class="dashboard-header">
      <h1>Dashboard</h1>
      <div class="user-info">
        <span>Welcome, {{ fullName }}!</span>
        <button @click="handleLogout" class="logout-button">
          Logout
        </button>
      </div>
    </header>

    <main class="dashboard-content">
      <div class="welcome-card">
        <h2>Admin Dashboard</h2>
        <p>Welcome to the admin control panel, {{ fullName }}!</p>
        
        <div class="admin-profile">
          <h3>Admin Profile</h3>
          <div class="profile-details">
            <p><strong>Username:</strong> {{ user.username }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Role:</strong> {{ user.role }}</p>
            <p><strong>Status:</strong> <span class="status active">Active</span></p>
          </div>
        </div>

        <div class="admin-section">
          <h3>Admin Functions</h3>
          <div class="admin-grid">
            <div class="admin-card">
              <h4>Event Management</h4>
              <p>Create and manage events</p>
              <button class="admin-button" disabled>Coming Soon</button>
            </div>
            <div class="admin-card">
              <h4>User Management</h4>
              <p>View and manage users</p>
              <button class="admin-button" disabled>Coming Soon</button>
            </div>
            <div class="admin-card">
              <h4>Analytics</h4>
              <p>View system analytics</p>
              <button class="admin-button" disabled>Coming Soon</button>
            </div>
            <div class="admin-card">
              <h4>Settings</h4>
              <p>System configuration</p>
              <button class="admin-button" disabled>Coming Soon</button>
            </div>
          </div>
        </div>

        <div class="quick-actions">
          <h3>Quick Actions</h3>
          <div class="action-buttons">
            <button @click="goToHome" class="action-button secondary">
              View Public Site
            </button>
            <button @click="handleLogout" class="action-button danger">
              Logout
            </button>
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
const fullName = computed(() => authStore.fullName);
const isAdmin = computed(() => authStore.isAdmin);

const handleLogout = async () => {
  await authStore.logout();
  router.push('/');
};

const goToHome = () => {
  router.push('/');
};

onMounted(() => {
  // Initialize auth state from localStorage
  authStore.initializeAuth();
  
  // If not authenticated, redirect to login
  if (!authStore.isAuthenticated) {
    router.push('/login');
  }
  
  // If not admin, redirect to home
  if (!authStore.isAdmin) {
    router.push('/');
  }
});
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.dashboard-header {
  background: white;
  padding: 20px 40px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-header h1 {
  margin: 0;
  color: #333;
  font-size: 28px;
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

.dashboard-content {
  padding: 40px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-card {
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.welcome-card h2 {
  color: #333;
  margin-bottom: 16px;
  font-size: 24px;
}

.welcome-card p {
  color: #666;
  margin-bottom: 24px;
  font-size: 16px;
}

.admin-profile {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e9ecef;
}

.admin-profile h3 {
  color: #333;
  margin-bottom: 16px;
  font-size: 20px;
}

.profile-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
}

.profile-details p {
  margin: 0;
  padding: 8px 0;
  color: #555;
}

.status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.active {
  background: #d4edda;
  color: #155724;
}

.admin-section {
  margin-top: 30px;
  padding: 30px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.admin-section h3 {
  color: #333;
  margin-bottom: 20px;
  font-size: 24px;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.admin-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.admin-card h4 {
  color: #333;
  margin-bottom: 8px;
  font-size: 18px;
}

.admin-card p {
  color: #666;
  margin-bottom: 16px;
  font-size: 14px;
}

.admin-button {
  background: #667eea;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s ease;
}

.admin-button:hover:not(:disabled) {
  background: #5a6fd8;
}

.admin-button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

.quick-actions {
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #e9ecef;
}

.quick-actions h3 {
  color: #333;
  margin-bottom: 16px;
  font-size: 20px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.action-button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-button.secondary {
  background: #6c757d;
  color: white;
}

.action-button.secondary:hover {
  background: #5a6268;
}

.action-button.danger {
  background: #dc3545;
  color: white;
}

.action-button.danger:hover {
  background: #c82333;
}

@media (max-width: 768px) {
  .dashboard-header {
    padding: 20px;
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .dashboard-content {
    padding: 20px;
  }

  .welcome-card {
    padding: 24px;
  }

  .profile-details {
    grid-template-columns: 1fr;
  }
}
</style>
