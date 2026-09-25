import CaseStudy from './CaseStudy';
import Gallery from '../../components/Gallery';

export default function Eventia() {
  return <CaseStudy slug="eventia" designTitle="System Design"
    summary={['Eventia is a four-person graduation project that brings event creation, licensing workflows, attendee engagement, messaging, and oversight into a shared platform. An AI assistant supports the experience as one feature within the wider workflow.', 'My contribution focused on backend and relational-database development and supporting the assistant integration. The project demonstrates coordinated workflows and data foundations; it does not report production-scale operation or an authorized government integration.']}
    data={['The relational model connects events, license applications, vendors, attendees, and role-specific workflows. Different roles need access to related records with different permissions.', 'The platform models a licensing process as understood during the graduation project. It is not an authorized integration with the Saudi Conventions and Exhibitions General Authority, and the assistant has no approval authority.']}
    approach={['Map event creation, coordination, licensing, and oversight into role-specific workflows.', 'Represent shared records and relationships in the database.', 'Connect server-side workflow handling to organizer, vendor, attendee, and authority-facing views.', 'Support communication and analytics around the same event records.', 'Integrate an AI assistant as supporting guidance within the product.']}
    design="The application groups models, views, forms, lifecycle hooks, and templates around a shared event-management domain. Role-aware request handling determines access to related records. Keeping database relationships and workflow permissions aligned is more important than simply hiding controls in the interface."
    designVisual={<Gallery items={[
      { src: '/img/eventia-1.webp', alt: 'Eventia interface showing the graduation-project event workflow', w: 960, h: 1280 },
      { src: '/img/eventia-2.webp', alt: 'Eventia management and dashboard views from the project report', w: 960, h: 1280 },
    ]} />}
    evaluation={<p>The report, screenshots, and public source demonstrate the implemented workflows and relational structure. They do not establish production uptime, load capacity, a full security review, or benchmarked assistant quality. The deployment is undergoing a hosting transition, so the portfolio links to the source and report rather than an unverified live demo.</p>}
    findings={['Event coordination benefits from shared records instead of disconnected role-specific documents.', 'Relational design and access rules shape how each role can participate in the same event.', 'Licensing, communication, and attendee engagement are the core workflow; the assistant is supporting functionality.']}
    recommendation="Review the report and source to understand the team workflow and database foundations. A production release would need operational testing, permission review, assistant evaluation, and any required authorized integrations."
    limitations={['Academic team project; no production-scale reliability or performance is claimed.', 'The licensing workflow is a project representation, not an authorized authority integration.', 'The AI assistant has no published quality benchmark.', 'Available implementation safeguards do not constitute a full application security review.']}
    stack={['Django', 'Python', 'MySQL', 'Gemini API', 'JavaScript']}
    contribution="Delivered by a four-person university team. My own contribution focused on backend and relational-database development and on supporting the integration of the Gemini-powered AI assistant. I collaborated with the team to connect these components to the platform's multi-role event-management workflows. The main takeaway was how closely useful database design depends on understanding responsibilities and permissions."
  />;
}
