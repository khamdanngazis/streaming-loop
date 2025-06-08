<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AppConfigurator from './AppConfigurator.vue';

const { toggleMenu, toggleDarkMode, isDarkTheme } = useLayout();
const router = useRouter();

const isLoggedIn = !!localStorage.getItem('token');
const showProfileDropdown = ref(false);

function logout() {
    localStorage.removeItem('token');
    // Optionally remove other storage keys here
    router.push({ name: 'login' });
    showProfileDropdown.value = false;
}

function toggleProfileDropdown() {
    showProfileDropdown.value = !showProfileDropdown.value;
}

function hideProfileDropdown() {
    showProfileDropdown.value = false;
}

// Optional: Hide dropdown when clicking outside
function handleClickOutside(event) {
    const profileBtn = document.getElementById('profile-btn');
    const dropdown = document.getElementById('profile-dropdown');
    if (
        dropdown &&
        !dropdown.contains(event.target) &&
        profileBtn &&
        !profileBtn.contains(event.target)
    ) {
        hideProfileDropdown();
    }
}
if (typeof window !== 'undefined') {
    window.addEventListener('click', handleClickOutside);
}
</script>

<template>
    <div class="layout-topbar">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleMenu">
                <i class="pi pi-bars"></i>
            </button>
            <router-link to="/" class="layout-topbar-logo">
                <!-- SVG and branding -->
                <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <!-- SVG path ... -->
                </svg>
                <span>ST Loop</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
                <div class="relative">
                    <button
                        v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
                        type="button"
                        class="layout-topbar-action layout-topbar-action-highlight"
                    >
                        <i class="pi pi-palette"></i>
                    </button>
                    <AppConfigurator />
                </div>
            </div>

            <button
                class="layout-topbar-menu-button layout-topbar-action"
                v-styleclass="{ selector: '@next', enterFromClass: 'hidden', enterActiveClass: 'animate-scalein', leaveToClass: 'hidden', leaveActiveClass: 'animate-fadeout', hideOnOutsideClick: true }"
            >
                <i class="pi pi-ellipsis-v"></i>
            </button>

            <div class="layout-topbar-menu hidden lg:block">
                <div class="layout-topbar-menu-content flex items-center gap-2">
                    <div class="relative">
                        <button
                            id="profile-btn"
                            type="button"
                            class="layout-topbar-action flex items-center gap-2"
                            @click.stop="toggleProfileDropdown"
                        >
                            <i class="pi pi-user"></i>
                            <span>Profile</span>
                        </button>
                        <div
                            v-if="showProfileDropdown"
                            id="profile-dropdown"
                            class="absolute right-0 mt-2 w-40 bg-white dark:bg-surface-900 border border-gray-200 dark:border-surface-700 rounded shadow-lg z-50"
                        >
                            <button
                                v-if="isLoggedIn"
                                class="block w-full text-left px-4 py-2 hover:bg-surface-100 dark:hover:bg-surface-800"
                                @click="logout"
                            >
                                <i class="pi pi-sign-out mr-2"></i> Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
#profile-dropdown {
    min-width: 10rem;
}
</style>