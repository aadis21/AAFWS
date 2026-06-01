/**
 * AAFWS Shared Admin API Utility
 */

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:'
  ? 'http://localhost:5000/api'
  : 'https://aawfs-backend.onrender.com/api';

// Redirect to login if not authenticated (exclude the login page itself)
function checkAuth() {
  const token = localStorage.getItem('admin_token');
  const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/admin/' || window.location.pathname === '/admin';
  
  if (!token && !isLoginPage) {
    window.location.href = 'index.html';
  } else if (token && isLoginPage) {
    window.location.href = 'dashboard.html';
  }
}

// Get authorization headers
function getAuthHeaders() {
  const token = localStorage.getItem('admin_token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// Fetch helper with token injection and error handling
async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token');
  
  const headers = options.headers || {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Set JSON content type by default unless it's a FormData object (for uploads)
  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  
  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle unauthorized response (e.g. token expired)
    if (response.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/admin/' || window.location.pathname === '/admin';
      if (!isLoginPage) {
        window.location.href = 'index.html';
      }
      throw new Error('Session expired. Please log in again.');
    }
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong.');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

// Toast Notifications System
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  
  let icon = '✓';
  if (type === 'error') icon = '✗';
  if (type === 'warning') icon = '⚠';
  if (type === 'info') icon = 'ℹ';

  toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
  container.appendChild(toast);

  // Auto remove after 4 seconds
  setTimeout(() => {
    toast.style.animation = 'toastIn 0.3s reverse';
    toast.addEventListener('animationend', () => {
      toast.remove();
    });
  }, 4000);
}

// Admin logout
function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  window.location.href = 'index.html';
}

// Initialize admin sidebar details
function initAdminProfile() {
  const adminNameElement = document.getElementById('admin-profile-name');
  const adminEmailElement = document.getElementById('admin-profile-email');
  const adminAvatarElement = document.getElementById('admin-profile-avatar');
  
  const userStr = localStorage.getItem('admin_user');
  if (userStr) {
    const user = JSON.parse(userStr);
    if (adminNameElement) adminNameElement.textContent = user.name || 'Admin';
    if (adminEmailElement) adminEmailElement.textContent = user.email || '';
    if (adminAvatarElement && user.name) {
      adminAvatarElement.textContent = user.name.charAt(0).toUpperCase();
    }
  }
}

// Setup notification count badge on top header
async function loadUnreadNotificationCount() {
  try {
    const res = await apiRequest('/admin/notifications');
    const badge = document.getElementById('notification-badge-count');
    if (badge) {
      if (res.unreadCount > 0) {
        badge.textContent = res.unreadCount;
        badge.style.display = 'block';
      } else {
        badge.style.display = 'none';
      }
    }
  } catch (err) {
    console.error('Failed to load notifications count:', err);
  }
}

// Page load initialization
document.addEventListener('DOMContentLoaded', () => {
  checkAuth();
  initAdminProfile();
  
  // Only fetch notification badge if user is logged in
  if (localStorage.getItem('admin_token')) {
    loadUnreadNotificationCount();
    // Poll for notifications every 30 seconds
    setInterval(loadUnreadNotificationCount, 30000);
  }
});
