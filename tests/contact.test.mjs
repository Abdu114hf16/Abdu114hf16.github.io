import test from 'node:test';
import assert from 'node:assert/strict';
import { looksAutomated } from '../src/pages/contactGuard.ts';
import { sendContactMessage } from '../src/pages/contactTransport.ts';

test('honeypot and timing guard reject automated inputs at the boundary', () => {
  assert.equal(looksAutomated('', 2999), true);
  assert.equal(looksAutomated('', 3000), false);
  assert.equal(looksAutomated('filled', 9000), true);
});
test('only an explicit service acceptance counts as success', async () => {
  const signal = new AbortController().signal;
  for (const body of [{ success: true }, { success: 'true' }]) {
    await assert.doesNotReject(sendContactMessage({ message: 'test' }, signal, async () => Response.json(body)));
  }
  for (const body of [{ success: false }, { success: 'false' }, {}, null]) {
    await assert.rejects(sendContactMessage({}, signal, async () => Response.json(body)), /did not confirm/);
  }
  await assert.rejects(sendContactMessage({}, signal, async () => new Response('', { status: 503 })), /could not accept/);
  await assert.rejects(sendContactMessage({}, signal, async () => { throw new Error('offline'); }), /offline/);
});
