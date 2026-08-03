import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { Download, Mail, Phone, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';
import Panel from '../components/Panel';
import Reveal from '../components/Reveal';
import { useSeo } from '../hooks/useSeo';
import s from './Contact.module.css';

export default function Contact() {
  useSeo('Contact', 'Get in touch with Abdullah Alshammari for collaborations, opportunities, or just to connect.');
  const [params] = useSearchParams();
  const sent = params.get('sent') === '1';
  const banner = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (sent) banner.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [sent]);

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
            <p ref={banner} className={s.success} hidden={!sent}>
              Thanks! Your message has been sent. I will get back to you soon.
            </p>
            <form
              className={s.form}
              action="https://formsubmit.co/abdullah.tecch@gmail.com"
              method="POST"
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
          </Panel>
        </Reveal>
      </div>
    </main>
  );
}
