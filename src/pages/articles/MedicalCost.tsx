import ArticleLayout, { Bq, BtnRow, ResourceLink, Section, Shot, SrcCard, TechStack } from './ArticleLayout';

export default function MedicalCost() {
  return (
    <ArticleLayout
      meta={{
        title: 'What Makes Medical Insurance Expensive?',
        seoTitle: 'Medical Insurance Cost Prediction',
        lede: 'What shapes an annual insurance bill, and why two customers can be priced so differently.',
        hero: { src: '/img/hero-mic.webp', alt: 'Medical insurance cost prediction project banner', w: 900, h: 514 },
      }}
    >
      <Section title="Introduction">
        <p>
          Every premium has to balance two needs. It must cover the cost a customer is likely to incur, and it
          must be explainable when that customer, or a regulator, asks why the number is what it is. This project
          looks at both sides using a public dataset of medical charges, following the CRISP-DM process from
          business understanding through to a working model.
        </p>
      </Section>

      <Section title="Problem Statement">
        <p>
          Insurers need to price premiums that cover expected medical costs without overcharging customers. A
          price is only useful, though, if it can be justified to the person who pays it and to the regulator who
          reviews it. The goal is therefore twofold: predict annual cost accurately, and explain how every
          prediction was reached.
        </p>
      </Section>

      <Section title="Solution">
        <p>
          The work followed the CRISP-DM process, so every step had a purpose and fed the next. It began with the
          business question itself: an insurer needs a price that is both accurate and easy to justify. That goal
          shaped every choice that followed.
        </p>
        <p>
          Next came the data. A public set of customer records covered age, sex, BMI, number of children, smoking
          status and region. Exploring it revealed the patterns that matter most, above all the way smoking and a
          high BMI combine to drive cost far higher than either does alone. Those findings guided how the data was
          cleaned and which features were built.
        </p>
        <p>
          With the groundwork in place, a linear regression model was trained to predict the annual cost, and SHAP
          values were layered on top to explain each prediction. Linear regression was chosen on purpose: its
          logic can be read and defended, not hidden inside a black box.
        </p>
        <p>
          The model was tested against a clear target (&ge; 80%). On data it had never seen, it explained about
          91% of the variation in cost, comfortably past the goal, and it edged out more complex models while
          staying far easier to read. The factors it leaned on also made business sense, with smoking, BMI and age
          pushing cost up exactly as expected, which confirmed the model was learning real patterns rather than
          noise.
        </p>
      </Section>

      <Section title="Tech Stack">
        <TechStack items={['ML', 'Python', 'EDA', 'Data Cleaning', 'Linear Regression', 'Ridge', 'Lasso', 'SHAP', 'R2 = 0.91']} />
      </Section>

      <Section title="Answering Business Questions with Data">
        <Bq n={1} q="Can annual cost be predicted accurately enough to set premiums?">
          <p>
            Yes. A linear model that captures the right factors explains about 91% of the variation in annual
            cost, with a typical error of roughly $4,100 per customer. That is accurate enough to support real
            pricing decisions.
          </p>
        </Bq>
        <Bq n={2} q="What drives medical cost the most?">
          <p>
            Smoking, but rarely on its own. The combination of smoking and a high BMI outweighs every other
            factor, followed by age. The chart below ranks how much each factor pushes a prediction up or down, in
            dollars.
          </p>
          <Shot src="/img/mcp-shap.webp" alt="Feature importance for predicted medical cost" w={880} h={550} />
        </Bq>
        <Bq n={3} q="How does cost change with age, and does smoking shift it?">
          <p>
            Cost rises steadily with age for everyone, yet smokers sit on a far higher band at every age. A young
            smoker can be charged more than an older non-smoker. Age matters, and smoking matters more.
          </p>
          <Shot src="/img/mcp-age.webp" alt="Annual charges versus age, split by smoking status" w={880} h={550} />
        </Bq>
        <Bq n={4} q="Does BMI affect everyone equally?">
          <p>
            No, and this was the most valuable insight. For non-smokers, BMI barely moves the bill. For smokers, a
            higher BMI raises it sharply. Capturing that interaction is what lifted the model from 81% to 91% of
            the variation explained.
          </p>
          <Shot
            src="/img/mcp-interaction.webp"
            alt="Annual charges versus BMI, split by smoking status"
            w={880}
            h={550}
          />
        </Bq>
        <Bq n={5} q="Can a single customer's price be explained?">
          <p>
            Yes. Shapley values break any individual estimate into the exact dollar contribution of each
            attribute, so a specific price can be defended line by line to a customer or a regulator.
          </p>
        </Bq>
      </Section>

      <Section title="Conclusion">
        <p>
          The simple, transparent model explained 91% of the variation in cost, while a more complex Random Forest
          explained 88%. In other words, R&sup2; of 0.91 means the model accounts for 91 percent of why bills
          differ from one customer to the next, and the linear model did this slightly better while staying easy
          to read. When a price has to be justified, a model you can explain is worth more than a black box that
          scores no higher.
        </p>
      </Section>

      <Section title="Takeaway">
        <p>
          This project pushed me into techniques that were new to me, the CRISP-DM framework and Shapley values
          among them. Writing the post itself for both technical and non-technical readers was its own lesson in
          storytelling and stakeholder communication. A few things I am keeping with me:
        </p>
        <ul>
          <li>CRISP-DM is a genuinely helpful structure for taking a machine learning project from start to finish.</li>
          <li>Shapley values are a powerful way to interpret a model, especially a simple one like regression.</li>
          <li>
            SHAP brings useful visualizations, such as the waterfall and beeswarm plots, that make both individual
            and overall explanations easy to read.
          </li>
          <li>A simple model is sometimes far better than a complex one, in accuracy and in clarity alike.</li>
        </ul>
      </Section>

      <Section title="Source">
        <SrcCard intro="Everything below lives in the public repository:">
          <ul>
            <li>
              <strong>medical-cost-prediction.ipynb</strong> the full CRISP-DM notebook, from EDA to the saved
              model.
            </li>
            <li>
              <strong>data/insurance.csv</strong> the dataset, 1,338 records.
            </li>
            <li>
              <strong>medical_cost_model.joblib</strong> the trained model, ready to reuse. It explains about 91%
              of the variation in annual cost (R&sup2; 0.91), with a typical error near $4,100.
            </li>
            <li>
              <strong>README.md</strong> the full technical details: methodology, results and how to run it.
            </li>
          </ul>
          <BtnRow>
            <ResourceLink kind="repo" href="https://github.com/Abdu114hf16/medical-insurance-cost-prediction">
              View Repository
            </ResourceLink>
          </BtnRow>
        </SrcCard>
      </Section>
    </ArticleLayout>
  );
}
