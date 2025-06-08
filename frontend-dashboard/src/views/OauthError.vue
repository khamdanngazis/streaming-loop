<script setup>
import { useToast } from 'primevue/usetoast';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const toast = useToast();

onMounted(() => {
    toast.add({
        severity: 'error',
        summary: 'OAuth Error',
        detail: route.query.error || 'Unknown error occurred.',
        life: 4000
    });
    // Optionally, redirect after a short delay
    setTimeout(() => {
        router.push({ name: 'dashboard' });
    }, 3000);
});
</script>

<template>
    <div class="flex flex-col items-center justify-center h-full">
        <i class="pi pi-times-circle text-6xl text-red-500 mb-4"></i>
        <h2 class="text-2xl font-bold mb-2">Authentication Failed</h2>
        <p>{{ $route.query.error || 'Unknown error occurred.' }}</p>
        <Toast />
    </div>
</template>