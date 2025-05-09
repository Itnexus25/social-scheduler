export const API_URL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Helper function for making GET requests to the API.
 * @param endpoint The API endpoint, e.g., "/auth/status"
 * @returns The parsed JSON data from the response.
 */
export async function fetchFromAPI(endpoint: string): Promise<any> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`API error: ${response.status} - ${errorData?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch Error:', error);
    throw new Error('Failed to connect to API.');
  }
}

/**
 * Helper function for making POST requests to the API.
 * @param endpoint The API endpoint, e.g., "/auth/login"
 * @param data The data payload to be sent in the body of the request.
 * @returns The parsed JSON data from the response.
 */
export async function postToAPI(endpoint: string, data: any): Promise<any> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`API error: ${response.status} - ${errorData?.message || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Post Error:', error);
    throw new Error('Failed to send data to API.');
  }
}