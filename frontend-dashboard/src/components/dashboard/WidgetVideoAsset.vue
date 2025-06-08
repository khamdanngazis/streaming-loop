<script setup>
import VideoAssetService from '@/service/VideoAssetService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const videoAssets = ref([]);
const loading = ref(false);
const showUploadDialog = ref(false);
const selectedFile = ref(null);
const uploading = ref(false);
const toast = useToast();

async function fetchAssets() {
    loading.value = true;
    try {
        videoAssets.value = await VideoAssetService.list();
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Error', detail: e.message, life: 4000 });
    }
    loading.value = false;
}

function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    return (bytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB';
}
function formatDate(iso) {
    return new Date(iso).toLocaleString();
}

// Upload flow
async function handleUpload() {
    if (!selectedFile.value) return;
    uploading.value = true;
    try {
        // 1. Upload file to worker
        const uploadRes = await VideoAssetService.uploadVideo(selectedFile.value);
        // 2. Add video asset to main API
        await VideoAssetService.addAsset(uploadRes);
        toast.add({ severity: 'success', summary: 'Upload Success', detail: 'Video uploaded successfully', life: 3000 });
        showUploadDialog.value = false;
        selectedFile.value = null;
        fetchAssets();
    } catch (e) {
        toast.add({ severity: 'error', summary: 'Upload Error', detail: e.message, life: 4000 });
    }
    uploading.value = false;
}

onMounted(fetchAssets);
</script>

<template>
    <div class="card">
        <div class="flex justify-between items-center mb-4">
            <div class="font-semibold text-xl">Video Assets</div>
            <Button icon="pi pi-upload" label="Upload Video" @click="showUploadDialog = true" />
        </div>
        <DataTable :value="videoAssets" :loading="loading" :rows="5" :paginator="false" responsiveLayout="scroll">
            <Column field="originalName" header="Name" style="width: 30%" />
            <Column field="size" header="Size" style="width: 15%">
                <template #body="slotProps">
                    {{ formatSize(slotProps.data.size) }}
                </template>
            </Column>
            <Column field="createdAt" header="Uploaded" style="width: 25%">
                <template #body="slotProps">
                    {{ formatDate(slotProps.data.createdAt) }}
                </template>
            </Column>
            <Column header="Preview" style="width: 20%">
                <template #body="slotProps">
                    <video
                        v-if="slotProps.data.url || slotProps.data.path"
                        :src="slotProps.data.url || (slotProps.data.path.startsWith('http') ? slotProps.data.path : `http://localhost:4000${slotProps.data.path}`)"
                        width="80"
                        height="45"
                        controls
                        style="background: #222"
                    ></video>
                </template>
            </Column>
            <Column header="Action" style="width: 10%">
                <template #body="slotProps">
                    <a
                        :href="slotProps.data.url || (slotProps.data.path.startsWith('http') ? slotProps.data.path : `http://localhost:4000${slotProps.data.path}`)"
                        target="_blank"
                        rel="noopener"
                    >
                        <Button icon="pi pi-download" type="button" class="p-button-text" />
                    </a>
                </template>
            </Column>
        </DataTable>
        <!-- Upload dialog -->
        <Dialog v-model:visible="showUploadDialog" modal header="Upload Video" :closable="true" :style="{width: '400px'}">
            <div class="flex flex-col gap-4">
                <input type="file" accept="video/*" @change="e => selectedFile = e.target.files[0]" />
                <Button
                    icon="pi pi-upload"
                    label="Upload"
                    :disabled="!selectedFile || uploading"
                    :loading="uploading"
                    @click="handleUpload"
                />
            </div>
        </Dialog>
        <Toast />
    </div>
</template>