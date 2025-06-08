<script setup>
import StreamingAccountService from '@/service/StreamingAccountService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const streamingAccounts = ref([]);
const loading = ref(false);
const toast = useToast();

async function fetchAccounts() {
    loading.value = true;
    try {
        streamingAccounts.value = await StreamingAccountService.list();
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 4000 });
    }
    loading.value = false;
}

async function deleteAccount(id) {
    try {
        await StreamingAccountService.delete(id);
        toast.add({ severity: 'success', summary: 'Deleted', detail: 'Account deleted', life: 2000 });
        fetchAccounts();
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 4000 });
    }
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return d.toLocaleString();
}

// Add Streaming Account (YouTube Only)
async function addYoutubeAccount() {
    try {
        const res = await StreamingAccountService.getYoutubeAuthUrl();
        if (res.url) {
            window.location.href = res.url; // Redirect to Google OAuth
        } else {
            toast.add({ severity: 'error', summary: 'Error', detail: 'No URL returned from server', life: 4000 });
        }
    } catch (err) {
        toast.add({ severity: 'error', summary: 'Error', detail: err.message, life: 4000 });
    }
}

onMounted(fetchAccounts);
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <div class="font-semibold text-xl">Streaming Accounts</div>
            <Button icon="pi pi-youtube" label="Add" @click="addYoutubeAccount" />
        </div>
        <DataTable :value="streamingAccounts" :loading="loading" :rows="5" :paginator="false" responsiveLayout="scroll">
            <Column field="provider" header="Provider" style="width: 20%">
                <template #body="slotProps">
                    <span class="capitalize">{{ slotProps.data.provider }}</span>
                </template>
            </Column>
            <Column field="accountName" header="Account Name" style="width: 30%"></Column>
            <Column field="expiresAt" header="Expires At" style="width: 30%">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.expiresAt) }}
                </template>
            </Column>
            <Column header="Action" style="width: 20%">
                <template #body="slotProps">
                    <Button icon="pi pi-trash"
                        severity="danger"
                        type="button"
                        class="p-button-text"
                        @click="deleteAccount(slotProps.data.id)"
                    />
                </template>
            </Column>
        </DataTable>
        <Toast />
    </div>
</template>