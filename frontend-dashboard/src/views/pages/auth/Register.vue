<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import AuthService from '../../../service/AuthService';

const name = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');
const router = useRouter();

const onRegister = async () => {
    error.value = '';
    if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match.';
        return;
    }
    loading.value = true;
    try {
        await AuthService.register({
            name: name.value,
            email: email.value,
            password: password.value
        });
        // Optionally, redirect to login page after registration
        router.push('/login');
    } catch (err) {
        error.value = err.message || 'Registration failed. Please try again.';
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-20 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <svg viewBox="0 0 54 40" fill="none" xmlns="http://www.w3.org/2000/svg" class="mb-8 w-16 shrink-0 mx-auto">
                            <!-- SVG path ... -->
                        </svg>
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Create your account</div>
                        <span class="text-muted-color font-medium">Register to continue</span>
                    </div>

                    <div>
                        <label for="name1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Name</label>
                        <InputText id="name1" type="text" placeholder="Full name" class="w-full md:w-[30rem] mb-8" v-model="name" />

                        <label for="email1" class="block text-surface-900 dark:text-surface-0 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="text" placeholder="Email address" class="w-full md:w-[30rem] mb-8" v-model="email" />

                        <label for="password1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <label for="confirmPassword1" class="block text-surface-900 dark:text-surface-0 font-medium text-xl mb-2">Confirm Password</label>
                        <Password id="confirmPassword1" v-model="confirmPassword" placeholder="Confirm Password" :toggleMask="true" class="mb-4" fluid :feedback="false"></Password>

                        <Button
                            label="Register"
                            class="w-full mt-4"
                            :loading="loading"
                            @click="onRegister"
                        ></Button>
                        <div v-if="error" class="text-red-500 mt-4 text-center">{{ error }}</div>
                        <div class="mt-4 text-center">
                            <span class="text-muted-color">Already have an account?</span>
                            <router-link to="/login" class="text-primary font-medium ml-2">Sign In</router-link>
                        </div>
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