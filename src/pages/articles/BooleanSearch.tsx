import CaseStudy from './CaseStudy';
import { Shot } from './ArticleLayout';

export default function BooleanSearch() {
  return <CaseStudy slug="boolean-search-engine"
    designVisual={<Shot src="/img/boolean-flow.webp" alt="Illustration of AND intersection and OR union over two posting sets" w={1200} h={675} caption="Illustrative example: data occurs in A and B; model occurs in B and C. AND returns B; OR returns A, B, and C. These are example identifiers, not measured query results." />}
    summary={[
      'This academic information-retrieval project organizes the headlines and short descriptions of 209,527 news records into an inverted index. Each normalized term maps to the document identifiers containing it, enabling repeated searches without scanning the complete collection.',
      'AND queries intersect term postings, while OR queries unite them. The result is an inspectable retrieval design for exact Boolean matching. The public artifacts do not support a universal sub-100-microsecond claim, so this project report emphasizes verified scope and functionality.',
    ]}
    data={['The project presentation documents a corpus of 209,527 news records. The indexed content is the headline and short description, rather than complete article bodies.', 'Text is normalized to lowercase, tokenized, and filtered before indexing. Query normalization must match document preprocessing so identical words map to the same vocabulary entry.']}
    approach={['Normalize and tokenize the searchable document fields.', 'Build a term-to-document inverted index.', 'Normalize query terms using the same representation.', 'Use set intersection for AND and set union for OR.', 'Keep index construction and query execution separate when evaluating performance.']}
    design="The index trades one-time preparation and additional memory for direct access to term postings. For an AND query, only document identifiers shared by all requested terms qualify. For an OR query, an identifier qualifies if any requested term occurs. Results express membership rather than ranked relevance."
    evaluation={<><p>The presentation establishes the collection size and demonstrates Boolean query results. Its timings vary by query, and several exceed 100 microseconds. The README, presentation, and current code describe differing preprocessing or posting representations, so their timing figures should not be treated as one reproducible benchmark.</p><p>A comparable benchmark should pin the corpus and code revision, record hardware and runtime, warm the index, repeat a defined query set, and report a distribution of retrieval times separately from index construction. That benchmark is not claimed here.</p></>}
    findings={['An inverted index makes repeated queries operate on term postings rather than every original document.', 'AND and OR encode different information needs and produce different result sets.', 'Query composition and posting-set sizes influence retrieval cost.', 'Timing figures require environment and implementation context to be meaningful.']}
    recommendation="Use this design as a foundation for exact, explainable retrieval over a static collection. Add relevance ranking or other search capabilities only when the intended information need requires them and their behavior can be evaluated."
    limitations={['Basic Boolean retrieval does not rank result relevance.', 'Phrase search, fuzzy matching, semantic retrieval, and distributed indexing are not claimed.', 'The public benchmark artifacts do not establish a single comparable runtime environment.', 'Memory demand and query cost depend on vocabulary, collection size, and query composition.']}
    stack={['Python', 'NLTK', 'Inverted Index', 'Set Operations', 'Jupyter Notebook']}
    contribution="I implemented this academic CSC484 retrieval project, including document preparation, indexing, query operations, and reporting. It reinforced the value of choosing a data structure around the repeated operation—and documenting performance in a way another reader can actually compare."
  />;
}
