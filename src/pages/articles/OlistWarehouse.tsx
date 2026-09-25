import CaseStudy from './CaseStudy';
import { DataTable, Shot } from './ArticleLayout';
import Gallery from '../../components/Gallery';

export default function OlistWarehouse() {
  return <CaseStudy slug="olist-data-warehouse" designTitle="Warehouse Architecture"
    summary={[
      'This data engineering project transforms the public Brazilian Olist e-commerce data into a local sales warehouse. It connects source profiling, dimensional design, SQL ETL, data-quality validation, and reusable analytical views in one documented workflow.',
      'The implemented model contains an order-item sales fact table and four dimensions. Five quality queries check the loaded data, while two reporting views expose monthly sales and customer revenue. The project independently applies concepts learned through DataCamp’s Associate Data Engineer in SQL track.',
    ]}
    data={[
      'The raw schema holds the imported Olist source tables. This version focuses on sales and order items; payment and review fact models are outside its scope. The raw layer is kept separate from the warehouse transformations.',
      'The fact grain is one row per order item, identified by the pair of order and item identifiers. Customer records use an order-specific identifier, while customer_unique_id is used when analyzing returning customers.',
      'Required customer, product, seller, and purchase-date keys are validated separately from optional date roles. Empty date strings are converted to null values before casting, so missing approval or delivery dates are not silently treated as real dates.',
    ]}
    dataVisual={<Gallery items={[
      { src: '/img/olist-workspace.webp', alt: 'Olist PostgreSQL workspace showing separate raw and warehouse schemas and sales queries', w: 1600, h: 1071, caption: 'Original development workspace: source tables, warehouse tables, and analytical SQL.' },
      { src: '/img/olist-structure.webp', alt: 'Numbered SQL files for profiling, schema creation, loading, validation, indexing and reporting', w: 582, h: 670, caption: 'The numbered SQL workflow separates each implementation concern. The closing validation file is reserved rather than implemented.' },
    ]} />}
    approach={[
      'Profile the imported source tables to understand keys, dates, completeness, and the order-item grain.',
      'Define the warehouse schema, surrogate keys, relationships, uniqueness constraints, and non-negative measures.',
      'Load customer, product, seller, and date dimensions; join product categories to their English translations.',
      'Load the sales fact table by resolving source identifiers to dimension keys and preserving optional date values.',
      'Run quality and source-reconciliation queries, inspect date-filtered query plans, and expose reusable reporting views.',
    ]}
    design="The sales fact table references customer, product, seller, and date dimensions. The date dimension plays five roles: purchase, shipping limit, approval, delivery, and estimated delivery. A unique order/item constraint protects the grain, foreign keys enforce relationships, and non-negative checks guard price and freight measures."
    designVisual={<><Shot src="/img/olist-schema.webp" alt="Olist star schema: fact_sales connected to customer, product, seller and date dimensions" w={1512} h={992} caption="Original project ERD. The implemented SQL DDL is authoritative for physical types and constraints." /><Gallery items={[
      { src: '/img/olist-etl.webp', alt: 'SQL INSERT SELECT statements loading the Olist dimension tables', w: 1040, h: 1580, caption: 'Dimension-loading SQL keeps transformations explicit and separate from the raw source layer.' },
      { src: '/img/olist-quality.webp', alt: 'Five SQL data-quality checks covering required keys, duplicates, orphan customers, negative values and row-count reconciliation', w: 1146, h: 1268, caption: 'Original quality script with its recorded outcomes. These are documented project results, not a fresh database run for this portfolio.' },
    ]} /></>}
    evaluation={<><p>The source repository records the following quality outcomes. The checks provide evidence about the loaded warehouse’s integrity without implying that every possible business rule has been tested.</p><DataTable caption="Documented warehouse quality checks" headers={['Check', 'Recorded result']} rows={[
      ['Required dimension keys', 'No null required keys'],
      ['Order/item grain', 'No duplicate pairs'],
      ['Customer relationship', 'No orphan customer references'],
      ['Price and freight', 'No negative-value violations'],
      ['Source versus fact rows', 'Counts match'],
    ]} /><p>The indexing script adds a purchase-date index and inspects year- and month-filtered aggregations with execution plans. No quantified speed improvement is claimed because reproducible before/after timing results are not included.</p></>}
    findings={[
      'An explicit order-item grain keeps sales measures and joins interpretable.',
      'Role-playing dates support multiple operational timelines without duplicating the calendar model.',
      'Repeat-customer analysis requires the stable customer identifier, rather than the per-order identifier.',
      'Monthly-sales and customer-revenue views reuse the warehouse relationships instead of duplicating reporting joins.',
    ]}
    recommendation="Use the warehouse as a local analytical foundation for sales trends, product categories, sellers, customer behavior, and delivery analysis. The implemented reporting views provide a clear next connection point for a BI tool."
    limitations={[
      'This is a local SQL warehouse project, not an operated production data platform.',
      'Loads are full rebuilds from a clean warehouse; incremental loading and slowly changing dimensions are future work.',
      'Payments and reviews are imported source domains but are not modeled as additional fact tables in this version.',
      'The closing validation file is reserved. The implemented quality evidence comes from the documented quality script.',
      'Execution plans are included, but a reproducible performance benchmark or orchestration layer is not claimed.',
    ]}
    stack={['PostgreSQL', 'SQL', 'DBeaver', 'DBML', 'Dimensional Modeling', 'ETL', 'EXPLAIN ANALYZE']}
    contribution="I implemented the local schema, loading scripts, validation queries, and reporting views as a practical application of data-engineering concepts learned through DataCamp. The central takeaway was to define grain and integrity rules first, then make loading and reporting decisions traceable to that model."
  />;
}
