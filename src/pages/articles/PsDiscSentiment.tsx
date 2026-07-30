import { Link } from 'react-router';
import ArticleLayout, { Section, TechStack } from './ArticleLayout';
import s from './PsDiscSentiment.module.css';

/** PlayStation shape marks: part of the project's own brand, kept scoped. */
function Marks({ size }: { size?: 'sm' }) {
  return (
    <span className={size === 'sm' ? `${s.marks} ${s.marksSm}` : s.marks} aria-hidden="true">
      <span className={s.mT}>&#9651;</span>
      <span className={s.mC}>&#9711;</span>
      <span className={s.mX}>&#10005;</span>
      <span className={s.mS}>&#9723;</span>
    </span>
  );
}

const DASH_ROUTE = '/projects/playstation-disc-sentiment/dashboard';

export default function PsDiscSentiment() {
  return (
    <ArticleLayout
      meta={{
        title: "Sentiment Analysis for People About PlayStation's Disc Decision",
        seoTitle: "Sentiment Analysis for People About PlayStation's Disc Decision",
        lede: 'The mood clearly leans negative, but exactly how negative, and how does it stack up against the positive and neutral voices? Let the data answer instead of the gut.',
        hero: { src: '/img/hero-ps.webp', alt: 'PlayStation end of discs sentiment analysis', w: 720, h: 240 },
      }}
    >
      <Section title="Introduction">
        <p>
          On 1 July 2026, PlayStation announced that new games would stop shipping on physical discs from January
          2028. The post spread fast and pulled in over a million views within days, so there was no shortage of
          reactions to measure. For a community that has bought boxed games for nearly thirty years, this was
          never going to be a quiet update, and within hours the replies, quotes and mentions were pouring in. I
          wanted to move past the anecdotes and measure the reaction properly: did the majority really react
          negatively, and by how much compared to the positive and neutral reactions?
        </p>
        <img
          className={s.introShot}
          src="/img/ps-tweet.webp"
          alt="PlayStation announcement post with over one million views"
          width="840"
          height="621"
          loading="lazy"
        />
      </Section>

      <Section title="Problem Statement">
        <p>
          Public reaction to a moment like this is huge, messy and short lived. Instead of taking a quick glance
          and deciding the reaction is bad, let us run a sentiment analysis that tells us, using data and not gut
          feeling, how negative it really is and by exactly how much.
        </p>
      </Section>

      <Section title="Solution">
        <h3>Data Collection</h3>
        <p>
          We collect the public reaction tweets from the first days of the announcement on X (Twitter), along with
          their details such as likes and retweets. Using TwitterAPI.io instead of the official API kept the cost
          low while still pulling direct replies, quote tweets and wider mentions of the post, which combined into
          a large sample of the conversation.
        </p>
        <h3>Data Cleaning</h3>
        <p>
          The raw pull is noisy, so we de-duplicate every reaction by its tweet id, drop deleted or empty bodies,
          and keep a single clean row per tweet carrying its text, language, timestamp and engagement. That left a
          tidy dataset of 56,677 unique reactions ready to score.
        </p>
        <h3>Sentiment Analysis</h3>
        <p>
          With the data clean, we score every reaction in Python by running a pre-trained NLP model. Because
          roughly a fifth of the reactions are not in English, the optimal choice here is a multilingual,
          tweet-tuned model: CardiffNLP's XLM-RoBERTa. It reads English, Spanish, Portuguese, French, Arabic and
          more on equal footing, and labels each reaction positive, neutral or negative with a confidence score.
        </p>
        <h3>Feature Engineering and Dashboard</h3>
        <p>
          From the model output we engineer the fields the report needs: a sentiment label, a signed sentiment
          score from minus one to plus one, per class probabilities, and helper columns for language and day.
          Those features feed a Power BI style dashboard that turns the numbers into something anyone can slice
          and explore, which you can try live below.
        </p>
      </Section>

      <Section title="Tech Stack">
        <TechStack
          items={['Python', 'Sentiment Analysis - XLM-RoBERTa', 'Pandas', 'Transformers', 'NLP', 'Hugging Face', 'Power BI']}
        />
      </Section>

      <h2 className={s.tryit}>
        Try It Your Own! <Marks size="sm" />
      </h2>

      <div className={s.cta}>
        <div className={s.ctaInfo}>
          <Marks />
          <div>
            <p className={s.ctaTitle}>Interactive Sentiment Dashboard</p>
            <div className={s.mini}>
              <span className={s.miniNeg} style={{ width: '63%' }} />
              <span className={s.miniNeu} style={{ width: '27%' }} />
              <span className={s.miniPos} style={{ width: '10%' }} />
            </div>
            <p className={s.miniLbl}>
              63% negative · 27% neutral · 10% positive&nbsp; | &nbsp;56,677 reactions, clickable filters,
              PlayStation Remote
            </p>
          </div>
        </div>
        <Link className={s.launch} to={DASH_ROUTE} target="_blank" rel="noopener">
          Full View
        </Link>
      </div>

      <Section title="Conclusion">
        <p>The end of PlayStation discs post landed as a clear, around the world rejection. Of the 56,677 reactions:</p>
        <ul>
          <li>63% were negative reactions.</li>
          <li>27% were neutral reactions.</li>
          <li>10% were positive.</li>
        </ul>
        <p>
          An average sentiment of -0.44 on a scale of [-1, +1]. The negative camp outnumbers the positive one by
          more than 500%, in other words there were over six times as many negative reactions as positive ones.
        </p>
        <p>Most hype led by this tweet: "the final nail in the coffin of the company I once loved" at +22K likes.</p>
      </Section>

      <Section title="Takeaway">
        <p>This project was my dive into social sentiment analysis, and it taught me a lot:</p>
        <ul>
          <li>Tweets collection.</li>
          <li>Finding the right pre-trained AI model that is multilingual and tweet-tuned.</li>
          <li>
            The insight only lands if people can touch it. Pairing a Python pipeline with an interactive, on brand
            dashboard turns a plain CSV into something a stakeholder will actually explore.
          </li>
        </ul>
      </Section>

      <Section title="Resources">
        <div className={s.resCard}>
          <p>Explore the interactive dashboard:</p>
          <Link className={s.launch} to={DASH_ROUTE} target="_blank" rel="noopener">
            Open the Interactive Dashboard
          </Link>
        </div>
      </Section>
    </ArticleLayout>
  );
}
