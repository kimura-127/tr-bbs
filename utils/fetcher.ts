export const fetcher = async (url: string, options?: RequestInit) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    const error = new Error('APIリクエストに失敗しました');
    throw error;
  }
  return res.json();
};
