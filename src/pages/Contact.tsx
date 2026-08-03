import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router';
import { Download, Mail, Phone, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';
import Panel from '../components/Panel';
import Reveal from '../components/Reveal';
import { useSeo } from '../hooks/useSeo';
import { looksAutomated } from './contactGuard';
import s from './Contact.module.css';

const EMAIL = 'abdullah.tecch@gmail.com';

export default function Contact() {
  useSeo('Contact', 'Get in touch with Abdullah Alshammari for collaborations, opportunities, or just to connect.');
  const [params] = useSearchParams();
  const sent = params.get('sent') === '1';
  const banner = useRef<HTMLParagraphElement>(null);
  const openedAt = useRef(Date.now());
  const [blocked, setBlocked] = useState(false);

  useEffect(() => {
    if (sent) banner.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [sent]);

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    const honey = e.currentTarget.elements.namedItem('_honey');
    const value = honey instanceof HTMLInputElement ? honey.value : '';
    if (looksAutomated(value, Date.now() - openedAt.current)) {
      e.preventDefault();
      setBlocked(true);
    }
  }

  return (
    <main id="main" tabIndex={-1} className="wrap">
      <section className={s.head}>
        <p className="eyebrow">
          channel <b>·</b> open
        </p>
        <h1>Get in Touch</h1>
        <p className={s.lede}>Feel free to reach out for collaborations, opportunities, or just to connect.</p>
      </section>

      <div className={s.grid}>
        <Reveal>
          <Panel eyebrow="endpoints" title="Contact Information" className={s.panelReset}>
            <dl className={s.info}>
              <dt>
                <Mail size={17} aria-hidden="true" /> Email
              </dt>
              <dd>
                <a href="mailto:abdullah.tecch@gmail.com">abdullah.tecch@gmail.com</a>
              </dd>
              <dt>
                <Phone size={17} aria-hidden="true" /> Phone
              </dt>
              <dd>
                <a href="tel:+966538845755">0538845755</a>
              </dd>
              <dt>
                <LinkedinIcon size={17} aria-hidden /> LinkedIn
              </dt>
              <dd>
                <a href="https://linkedin.com/in/alshammaridev" target="_blank" rel="noopener noreferrer">
                  linkedin.com/in/alshammaridev
                </a>
              </dd>
              <dt>
                <GithubIcon size={17} aria-hidden /> GitHub
              </dt>
              <dd>
                <a href="https://github.com/Abdu114hf16" target="_blank" rel="noopener noreferrer">
                  github.com/Abdu114hf16
                </a>
              </dd>
              <dt>
                <Download size={17} aria-hidden="true" /> CV
              </dt>
              <dd>
                <a href="/docs/Abdullah_Alshammari_CV.pdf" download>
                  Abdullah_Alshammari_CV.pdf
                </a>
              </dd>
            </dl>
          </Panel>
        </Reveal>

        <Reveal delay={80}>
          <Panel eyebrow="send message" title="Send a Message" className={s.panelReset}>
            {/* Honest wording: ?sent=1 means the relay accepted the post, which
                is not the same as the mail landing, so the note names a fallback
                instead of promising delivery. */}
            <p ref={banner} className={s.success} hidden={!sent}>
              Thanks, your message is on its way. If you have not heard back within a few days, email{' '}
              <a href={`mailto:${EMAIL}`}>{EMAIL}</a> directly.
            </p>
            <form
              className={s.form}
              action={`https://formsubmit.co/${EMAIL}`}
              method="POST"
              onSubmit={handleSubmit}
            >
              <input type="hidden" name="_subject" value="New message from your portfolio" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_next" value="https://alshammari.dev/contact?sent=1" />
              <input
                type="text"
                name="_honey"
                className={s.honey}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" placeholder="Your full name" required />

              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" placeholder="you@example.com" required />

              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" defaultValue="general">
                <option value="general">General</option>
                <option value="opportunity">Opportunity</option>
                <option value="collaboration">Collaboration</option>
                <option value="other">Other</option>
              </select>

              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" placeholder="Write your message here..." required />

              <button type="submit" className={s.submit}>
                <Send size={16} aria-hidden="true" /> Send
              </button>
            </form>

            {/* Rendered only when blocked, rather than an existing node that gains
                role="alert": screen readers announce an alert reliably when the
                node is inserted, not when a role is added to one already there. */}
            {blocked && (
              <p className={s.blocked} role="alert">
                That looked automated, so it was not sent. If that is wrong, email{' '}
                <a href={`mailto:${EMAIL}`}>{EMAIL}</a> and it will reach me.
              </p>
            )}

            {/* The form depends on a third-party relay that can fail quietly, so
                the route that does not is always on screen next to it. */}
            <p className={s.fallback}>
              Prefer not to use a form? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a> directly.
            </p>
          </Panel>
        </Reveal>
      </div>
    </main>
  );
}
