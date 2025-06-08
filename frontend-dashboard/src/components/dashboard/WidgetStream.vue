<script setup>
import StreamingAccountService from '@/service/StreamingAccountService';
import StreamService from '@/service/StreamService';
import VideoAssetService from '@/service/VideoAssetService';
import { useToast } from 'primevue/usetoast';
import { onMounted, ref } from 'vue';

const streams = ref([]);
const loading = ref(false);
const toast = useToast();

const videoAssets = ref([]);
const accounts = ref([]);
const showCreateDialog = ref(false);
const creating = ref(false);
const stopping = ref(false);
const form = ref({
  videoAssetId: '',
  streamAccountId: '',
  title: '',
  description: '',
  schedule: '',
  privacy: 'private',
  loop: true,
});

async function fetchStreams() {
  loading.value = true;
  try {
    streams.value = await StreamService.list();
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Stream Error', detail: e?.message || e, life: 4000 });
  }
  loading.value = false;
}

async function loadAssetsAndAccounts() {
  videoAssets.value = await VideoAssetService.list();
  accounts.value = await StreamingAccountService.list();
}

async function handleCreateStream() {
  creating.value = true;
  try {
    await StreamService.create(form.value);
    toast.add({ severity: 'success', summary: 'Stream Created', detail: 'Stream successfully created', life: 3000 });
    showCreateDialog.value = false;
    await fetchStreams();
    // Reset form
    form.value = {
      videoAssetId: '',
      streamAccountId: '',
      title: '',
      description: '',
      schedule: '',
      privacy: 'private',
      loop: true,
    };
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Create Error', detail: e?.message || e, life: 4000 });
  }
  creating.value = false;
}

async function handleStopStream(streamId) {
  creating.stopping = true;
  try {
    await StreamService.stop(streamId);
    toast.add({ severity: 'success', summary: 'Stream Stopped', detail: 'Stream has been stopped.', life: 3000 });
    await fetchStreams();
  } catch (e) {
    toast.add({ severity: 'error', summary: 'Stop Error', detail: e?.message || e, life: 4000 });
  }
  creating.stopping = false;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

onMounted(async () => {
  await fetchStreams();
  await loadAssetsAndAccounts();
});
</script>

<template>
  <div class="card">
    <div class="flex justify-between items-center mb-4">
      <div class="font-semibold text-xl">Active Streams</div>
      <Button icon="pi pi-plus" label="Create Stream" @click="showCreateDialog = true" />
    </div>
    <DataTable :value="streams" :loading="loading" responsiveLayout="scroll">
      <Column field="title" header="Title" style="width: 20%"></Column>
      <Column field="description" header="Description" style="width: 20%"></Column>
      <Column field="schedule" header="Schedule" style="width: 15%">
        <template #body="slotProps">
          {{ formatDate(slotProps.data.schedule) }}
        </template>
      </Column>
      <Column field="status" header="Status" style="width: 8%">
        <template #body="slotProps">
          <span :class="{
            'text-green-500': slotProps.data.status === 'running',
            'text-red-500': slotProps.data.status !== 'running'
          }">
            {{ slotProps.data.status }}
          </span>
        </template>
      </Column>
      <Column field="privacy" header="Privacy" style="width: 7%"></Column>
      <Column field="rtmpUrl" header="RTMP URL" style="width: 15%">
        <template #body="slotProps">
          <span class="font-mono select-all text-xs">{{ slotProps.data.rtmpUrl }}</span>
        </template>
      </Column>
      <Column field="streamKey" header="Stream Key" style="width: 12%">
        <template #body="slotProps">
          <span class="font-mono select-all text-xs">{{ slotProps.data.streamKey }}</span>
        </template>
      </Column>
      <Column field="watchingUrl" header="Watch" style="width: 8%">
        <template #body="slotProps">
          <a :href="slotProps.data.watchingUrl" target="_blank" class="text-blue-600 underline">Open</a>
        </template>
      </Column>
      <Column header="Action" style="width: 7%">
        <template #body="slotProps">
          <Button
            v-if="slotProps.data.status === 'running'"
            icon="pi pi-stop"
            class="p-button-danger p-button-sm"
            @click="handleStopStream(slotProps.data.id)"
            :loading="stopping"
            :disabled="stopping"
            label="Stop"
          />
        </template>
      </Column>
    </DataTable>
    <!-- Create Stream Dialog -->
    <Dialog v-model:visible="showCreateDialog" modal header="Create Stream" :closable="true" :style="{width: '400px'}">
      <div class="flex flex-col gap-4">
        <div>
          <label class="block mb-1">Video Asset</label>
          <Dropdown
            v-model="form.videoAssetId"
            :options="videoAssets"
            optionLabel="originalName"
            optionValue="id"
            placeholder="Select Video"
            class="w-full"
          />
        </div>
        <div>
          <label class="block mb-1">Account</label>
          <Dropdown
            v-model="form.streamAccountId"
            :options="accounts"
            optionLabel="accountName"
            optionValue="id"
            placeholder="Select Account"
            class="w-full"
          />
        </div>
        <div>
          <label class="block mb-1">Title</label>
          <InputText v-model="form.title" class="w-full" />
        </div>
        <div>
          <label class="block mb-1">Description</label>
          <Textarea v-model="form.description" class="w-full" autoResize />
        </div>
        <div>
          <label class="block mb-1">Schedule</label>
          <InputText v-model="form.schedule" class="w-full" placeholder="2025-06-07T06:55:00+07:00" />
        </div>
        <div>
          <label class="block mb-1">Privacy</label>
          <Dropdown
            v-model="form.privacy"
            :options="['private', 'public', 'unlisted']"
            class="w-full"
          />
        </div>
        <div>
          <Checkbox v-model="form.loop" :binary="true" inputId="loop" />
          <label for="loop" class="ml-2">Loop Video</label>
        </div>
        <Button
          icon="pi pi-check"
          label="Create"
          :loading="creating"
          :disabled="creating"
          @click="handleCreateStream"
        />
      </div>
    </Dialog>
    <Toast />
  </div>
</template>