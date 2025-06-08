<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../../../service/AuthService';

const email = ref('');
const password = ref('');
const checked = ref(false);
const loading = ref(false);
const error = ref('');
const router = useRouter();

const onLogin = async () => {
    error.value = '';
    loading.value = true;
    try {
        // Call your AuthService login method
        const user = await AuthService.login({
            email: email.value,
            password: password.value
        });

        // Save token if needed (e.g., localStorage/sessionStorage)
        if (user && user.token) {
            localStorage.setItem('token', user.token);
        }
        // Optionally, handle 'remember me'
        if (checked.value) {
            localStorage.setItem('remember_email', email.value);
        } else {
            localStorage.removeItem('remember_email');
        }
        // Redirect to home or dashboard
        router.push('/');
    } catch (err) {
        error.value = err.message || 'Login failed. Please try again.';
    } finally {
        loading.value = false;
    }
};

// Optionally prefill email if 'remember me' is used before
if (localStorage.getItem('remember_email')) {
    email.value = localStorage.getItem('remember_email');
    checked.value = true;
}
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <!-- SVG and header omitted for brevity, keep as in your code -->
                        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-16 shrink-0 mx-auto">
                            <!-- SVG path ... -->
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to PrimeLand!</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <div>
                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <div class="flex items-center justify-between mt-2 mb-8 gap-8">
                            <div class="flex items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <span class="font-medium no-underline ml-2 text-right cursor-pointer text-primary">Forgot password?</span>
                        </div>
                        <Button
                            label="Sign In"
                            class="w-full"
                            :loading="loading"
                            @click="onLogin"
                        ></Button>
                        <div v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>