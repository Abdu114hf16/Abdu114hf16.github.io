/**
 * Spam filtering for the contact form, kept out of the component so it can be
 * exercised directly and so Contact.tsx stays a file that only exports a
 * component.
 *
 * Two mechanisms, neither of which costs a real sender anything:
 *
 *   the honeypot   FormSubmit drops any post whose _honey field is non-empty.
 *                  The field is rendered off-screen rather than display:none,
 *                  because a script that reads the stylesheet skips the latter.
 *   the clock      Nobody fills four fields in three seconds. Scripted posts
 *                  take milliseconds.
 *
 * Deliberately not FormSubmit's _captcha. That puts a reCAPTCHA interstitial in
 * front of every genuine sender on the site's only conversion surface. Flip
 * _captcha to "true" in Contact.tsx if spam actually starts arriving; these two
 * filters are the version that costs nothing until then.
 *
 * Both run client-side, so with JavaScript off the form still posts and the
 * relay's own _honey check stands on its own.
 */

const MIN_FILL_MS = 3000;

export function looksAutomated(honeyValue: string, elapsedMs: number): boolean {
  return honeyValue !== '' || elapsedMs < MIN_FILL_MS;
}
