import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { FileText, Mail, Send } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../components/BrandIcons';
import Panel from '../components/Panel';
import Reveal from '../components/Reveal';
import { profile } from '../data/profile';
import { useSeo } from '../hooks/useSeo';
import { looksAutomated } from './contactGuard';
import { sendContactMessage } from './contactTransport';
import s from './Contact.module.css';

export default function Contact() {
  useSeo('Contact');
  const openedAt = useRef(Date.now());
  const controller = useRef<AbortController | null>(null);
  const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  useEffect(() => () => controller.current?.abort(), []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (controller.current) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    if (looksAutomated(String(data.get('_honey') ?? ''), Date.now() - openedAt.current)) {
      setError('This submission was blocked by the spam guard. Please try again or use the email link below.');
      setStatus('error');
      return;
    }
    const request = new AbortController();
    controller.current = request;
    setStatus('pending');
    const timeout = window.setTimeout(() => request.abort(), 15000);
    try {
      await sendContactMessage(Object.fromEntries([...data].map(([key, value]) => [key, String(value)])), request.signal);
      setStatus('success');
      form.reset();
    } catch {
      setError('The form service could not confirm acceptance. Your message is still here; retry or email me directly.');
      setStatus('error');
    } finally {
      clearTimeout(timeout);
      controller.current = null;
    }
  }

  return (
    <main id="main" tabIndex={-1} className="wrap">
      <section className={s.head}><p className="eyebrow">channel <b>·</b> open</p><h1>Let's Build Better Decisions with Data</h1><p className={s.lede}>I am open to graduate and entry-level opportunities across data science, business intelligence, data analytics, data engineering, and applied AI. You are welcome to reach out about relevant roles, projects, or professional collaboration.</p></section>
      <div className={s.grid}>
        <Reveal><Panel eyebrow="endpoints" title="Contact Information" className={s.panelReset}><dl className={s.info}>
          <dt><Mail size={17} aria-hidden="true" />Email</dt><dd><a href={`mailto:${profile.email}`}>{profile.email}</a></dd>
          <dt><LinkedinIcon size={17} aria-hidden />LinkedIn</dt><dd><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">linkedin.com/in/alshammaridev</a></dd>
          <dt><GithubIcon size={17} aria-hidden />GitHub</dt><dd><a href={profile.github} target="_blank" rel="noopener noreferrer">github.com/Abdu114hf16</a></dd>
          <dt><FileText size={17} aria-hidden="true" />CV</dt><dd><Link to="/cv">View CV</Link></dd>
        </dl></Panel></Reveal>
        <Reveal><Panel eyebrow="send message" title="Send a Message" className={s.panelReset}>
          <form className={s.form} action={`https://formsubmit.co/${profile.email}`} method="POST" onSubmit={handleSubmit} aria-busy={status === 'pending'}>
            <input type="hidden" name="_subject" value="New message from your portfolio" />
            <input type="hidden" name="_template" value="table" /><input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" className={s.honey} tabIndex={-1} autoComplete="off" aria-hidden="true" />
            <label htmlFor="name">Name</label><input type="text" id="name" name="name" autoComplete="name" placeholder="Your full name" required disabled={status === 'pending'} />
            <label htmlFor="email">Email</label><input type="email" id="email" name="email" autoComplete="email" placeholder="you@example.com" required disabled={status === 'pending'} />
            <label htmlFor="subject">Subject</label><select id="subject" name="subject" defaultValue="Career Opportunity" disabled={status === 'pending'}>{['Career Opportunity', 'Project Collaboration', 'Professional Networking', 'Website Feedback', 'Other'].map(subject => <option key={subject}>{subject}</option>)}</select>
            <label htmlFor="message">Message</label><textarea id="message" name="message" placeholder="Write your message here..." required disabled={status === 'pending'} />
            <button type="submit" className={s.submit} disabled={status === 'pending'}><Send size={16} aria-hidden="true" />{status === 'pending' ? 'Sending…' : 'Send message'}</button>
          </form>
          <div role="status" aria-live="polite" aria-atomic="true">{status === 'pending' ? <p className={s.fallback}>Waiting for the form service to respond…</p> : status === 'success' ? <p className={s.success}>The form service accepted your message. If you do not hear back, please email me directly.</p> : null}</div>
          {status === 'error' && <p role="alert" className={s.blocked}>{error}</p>}
          <p className={s.fallback}>Prefer not to use a form? Email <a href={`mailto:${profile.email}`}>{profile.email}</a> directly.</p>
        </Panel></Reveal>
      </div>
    </main>
  );
}
