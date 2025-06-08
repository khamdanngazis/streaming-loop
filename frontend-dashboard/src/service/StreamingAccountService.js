const BASE_URL = 'http://localhost:3000/api/streaming-account';
const YOUTUBE_AUTH_URL = 'http://localhost:3000/auth/youtube';

function getAuthHeader() {
    const token = localStorage.getItem('token');
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    };
}

export default {
    async list() {
        const res = await fetch(BASE_URL, {
            method: 'GET',
            headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },
    async delete(id) {
        const res = await fetch(`${BASE_URL}/${id}`, {
            method: 'DELETE',
            headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    },
    async getYoutubeAuthUrl() {
        const res = await fetch(YOUTUBE_AUTH_URL, {
            method: 'GET',
            headers: getAuthHeader(),
        });
        if (!res.ok) throw new Error(await res.text());
        return await res.json();
    }
};