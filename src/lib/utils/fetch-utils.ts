export async function fetchWithCache<T>(
  url: string,
  options: RequestInit = {},
  revalidate = 86400
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    next: {
      revalidate,
      tags: [url],
    },
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchWithNoCache<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    cache: 'no-store',
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}