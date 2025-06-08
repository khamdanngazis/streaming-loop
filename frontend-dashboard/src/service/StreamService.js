const API_URL = 'http://localhost:3000/api/stream';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

export default {
  async list() {
    const res = await fetch(API_URL, {
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },
  async create({ videoAssetId, streamAccountId, title, description, schedule, privacy, loop }) {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({
        videoAssetId,
        streamAccountId,
        title,
        description,
        schedule,
        privacy,
        loop,
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },
  async stop(streamId) {
    const res = await fetch(`${API_URL}/${streamId}/stop`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    if (!res.ok) throw new Error(await res.text());
    return await res.json();
  },
};