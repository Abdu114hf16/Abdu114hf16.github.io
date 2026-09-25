import { profile } from '../data/profile.ts';

export async function sendContactMessage(fields: Record<string, string>, signal: AbortSignal, fetcher: typeof fetch = fetch) {
  const response = await fetcher(`https://formsubmit.co/ajax/${profile.email}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(fields), signal,
  });
  if (!response.ok) throw new Error('The form service could not accept the message.');
  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('success' in data) || (data.success !== true && data.success !== 'true')) {
    throw new Error('The form service did not confirm acceptance.');
  }
}
