<script setup>
import StreamingAccount from '@/components/dashboard/StreamingAccount.vue';
import WidgetStream from '@/components/dashboard/WidgetStream.vue';
import WidgetVideoAsset from '@/components/dashboard/WidgetVideoAsset.vue';
</script>

<template>
    <div class="grid grid-cols-12 gap-8">

        <div class="col-span-12 xl:col-span-6">
            <StreamingAccount />
        </div>
        <div class="col-span-12 xl:col-span-6">
            <WidgetVideoAsset />
        </div>
        
        <div class="col-span-12 xl:col-span-12">
            <WidgetStream />
        </div>
    </div>
</template>
