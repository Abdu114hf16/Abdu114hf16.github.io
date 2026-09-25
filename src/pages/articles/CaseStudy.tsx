import type { ReactNode } from 'react';
import { bySlug } from '../../data/projects';
import ArticleLayout, { BtnRow, ResourceLink, Section, TechStack } from './ArticleLayout';

interface Props {
  slug: string; title?: string; designTitle?: string; summary: string[]; data: string[]; approach: string[]; design: string;
  evaluation: ReactNode; findings: string[]; recommendation: string; limitations: string[];
  stack: string[]; contribution: string; dataVisual?: ReactNode; designVisual?: ReactNode; evaluationVisual?: ReactNode;
}
export default function CaseStudy(p: Props) {
  const project = bySlug(p.slug);
  if (!project) throw new Error(`Project metadata missing: ${p.slug}`);
  return <ArticleLayout slug={p.slug} meta={p.title ? { title: p.title, seoTitle: project.title, lede: project.outcome } : undefined}>
    <Section title="Executive Summary">{p.summary.map(text => <p key={text}>{text}</p>)}</Section>
    <Section title="Business Question"><p>{project.businessQuestion}</p></Section>
    <Section title="Data and Quality">{p.data.map(text => <p key={text}>{text}</p>)}{p.dataVisual}</Section>
    <Section title="Approach"><ol>{p.approach.map(step => <li key={step}>{step}</li>)}</ol></Section>
    <Section title={p.designTitle ?? 'Analytical Design'}><p>{p.design}</p>{p.designVisual}</Section>
    <Section title="Evaluation">{p.evaluation}{p.evaluationVisual}</Section>
    <Section title="Findings"><ul>{p.findings.map(finding => <li key={finding}>{finding}</li>)}</ul></Section>
    <Section title="Practical Use"><p>{p.recommendation}</p></Section>
    <Section title="Limitations and Responsible Use"><ul>{p.limitations.map(limit => <li key={limit}>{limit}</li>)}</ul></Section>
    <Section title="Tech Stack"><TechStack items={p.stack} /></Section>
    {project.resources.length > 0 && <Section title="Resources"><BtnRow>{project.resources.map(r => <ResourceLink key={r.href} kind={r.kind} href={r.href}>{r.label}</ResourceLink>)}</BtnRow></Section>}
    <Section title="My Contribution and Takeaway"><p>{p.contribution}</p></Section>
  </ArticleLayout>;
}
