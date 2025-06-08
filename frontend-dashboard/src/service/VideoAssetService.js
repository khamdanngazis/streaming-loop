const API_BASE = 'http://localhost:3000/api/video';
const UPLOAD_URL = 'http://localhost:4000/upload';

// Helper for Authorization
function getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
    };
}

export default {
    async list() {
        const res = await fetch(API_BASE, {
            method: 'GET',
            headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },
    async uploadVideo(file) {
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch(UPLOAD_URL, {
            method: 'POST',
            headers: getAuthHeader(), // Only Authorization, don't add Content-Type for multipart
            body: formData,
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },
    async addAsset(data) {
        const res = await fetch(API_BASE, {
            method: 'POST',
            headers: {
                ...getAuthHeader(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    }
};