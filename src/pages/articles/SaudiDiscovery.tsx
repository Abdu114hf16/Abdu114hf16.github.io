import CaseStudy from './CaseStudy';
import Gallery from '../../components/Gallery';
import { Shot } from './ArticleLayout';

export default function SaudiDiscovery() {
  return <CaseStudy slug="interactive-saudi-arabia-discovery" designTitle="System Design"
    dataVisual={<Gallery items={[
      { src: '/img/saudi-1.webp', alt: 'Saudi Discovery Arabic landing page in light mode', w: 1124, h: 629, caption: 'Original project report: Arabic-first landing page in light mode.' },
      { src: '/img/saudi-2.webp', alt: 'Saudi Discovery Arabic landing page in dark mode', w: 1124, h: 631, caption: 'The same browsing experience in the project dark theme.' },
      { src: '/img/saudi-3.webp', alt: 'Arabic region gallery with search, categories and region cards', w: 1124, h: 624, caption: 'Search and category filters provide complementary entry points into regional content.' },
    ]} />}
    designVisual={<Gallery items={[
      { src: '/img/saudi-5.webp', alt: 'Saudi Discovery content-management dashboard listing region records', w: 1124, h: 620, caption: 'Public report screenshot of the administrative content list and CRUD actions.' },
      { src: '/img/saudi-6.webp', alt: 'Arabic administrative form for adding a region and its media', w: 1124, h: 629, caption: 'The create workflow collects region content and image references.' },
      { src: '/img/saudi-7.webp', alt: 'Arabic administrative form prefilled for updating a region', w: 1124, h: 631, caption: 'The update workflow reuses the existing relational record.' },
    ]} />}
    evaluationVisual={<Shot src="/img/saudi-4.webp" alt="Saudi region detail page with narrative content, facts and image gallery" w={999} h={1129} caption="Original region-detail screenshot extracted from the repository's redacted report. The former live deployment is offline." />}
    summary={['This individually completed academic project organizes Saudi regional and cultural content into an Arabic-first browsing experience. Visitors can search and filter regions, inspect detail pages and galleries, and switch themes through responsive right-to-left layouts.', 'An administrative workflow supports creating, reading, updating, and deleting content backed by a relational database. The project is supporting evidence of database and product foundations; its original public deployment is offline.']}
    data={['The content model stores regional descriptions and related image references for browsing and administration. Consistent character encoding and Arabic-aware presentation connect the database to the RTL interface.', 'Prepared database statements and output escaping address important input/output boundaries. Cultural-content accuracy is inherited from its sources and was not independently verified as part of the build.']}
    approach={['Define a relational content model and region detail structure.', 'Connect server-rendered browsing pages to database queries.', 'Implement Arabic search, category filters, and result feedback.', 'Add authenticated administrative CRUD workflows and image handling.', 'Test responsive RTL presentation, themes, and form behavior.']}
    design="Landing, gallery, and region-detail pages share database access. Session-guarded administrative pages manage the same content through create/update/delete operations. Parameterized queries separate query structure from input values; escaped output helps preserve the intended HTML boundary."
    evaluation={<p>The public source and redacted project report document browsing, filtering, detail pages, and administrative workflows. The repository identifies the project as individually completed coursework. The former deployment is offline, so the source and report are the available review artifacts. No production reliability or comprehensive security certification is claimed.</p>}
    findings={['Arabic RTL layout affects navigation, content alignment, and form interaction throughout the interface.', 'A shared relational model connects public browsing and administrative editing.', 'Search and category filters provide complementary ways to navigate regional content.']}
    recommendation="Use the report and repository to examine the content model and end-to-end workflow. A public relaunch would require current deployment configuration, content review, and application-security testing."
    limitations={['Academic coursework rather than a service operated at production scale.', 'The original demo is offline.', 'Prepared statements and escaping do not constitute a full application-security review.', 'Content accuracy depends on the underlying sources.']}
    stack={['PHP', 'MySQL', 'PDO', 'JavaScript', 'HTML', 'CSS', 'Arabic RTL']}
    contribution="I completed the design, implementation, testing, and documentation individually as university coursework. The project strengthened my understanding of how relational data, server-side workflows, and language-aware interfaces work together."
  />;
}
