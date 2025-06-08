<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();

onMounted(() => {
    // You can get provider (e.g., youtube) via query param
    const provider = route.query.provider || 'account';
    toast.add({
        severity: 'success',
        summary: 'Connected!',
        detail: `Your ${provider} has been connected successfully!`,
        life: 3000
    });
    // Optionally, refresh list or redirect
    setTimeout(() => {
        router.push({ name: 'dashboard' }); // or wherever is suitable
    }, 2000);
});
</script>

<template>
    <div class="flex flex-col items-center justify-center h-full">
        <i class="pi pi-check-circle text-6xl text-green-500 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2">Authentication Success</h2>
        <p>You may now close this window or wait to be redirected.</p>
        <Toast />
    </div>
</template>