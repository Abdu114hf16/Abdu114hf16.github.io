import CaseStudy from './CaseStudy';
import { DataTable, Shot } from './ArticleLayout';
import Gallery from '../../components/Gallery';

export default function DonorOutreach() {
  return <CaseStudy slug="optimizing-donor-outreach"
    dataVisual={<Gallery items={[
      { src: '/img/donor-report-1.webp', alt: 'Original report distributions of capital gain and capital loss before transformation', w: 1089, h: 520, caption: 'Before transformation: highly skewed continuous inputs in the census data.' },
      { src: '/img/donor-report-2.webp', alt: 'Capital gain and capital loss distributions after logarithmic transformation', w: 1089, h: 520, caption: 'After transformation: the original report visualizes the changed feature scale.' },
    ]} />}
    designVisual={<Gallery items={[
      { src: '/img/donor-report-3.webp', alt: 'Original model-family comparison of training time, accuracy and F-score', w: 1249, h: 823, caption: 'Original pre-tuning comparison. Training-subset sizes and the reported test split have different roles.' },
      { src: '/img/donor-report-4.webp', alt: 'Feature weights from the selected model in the original report', w: 889, h: 490, caption: 'Feature weights describe the fitted income classifier, not willingness to donate.' },
    ]} />}
    evaluationVisual={<Shot src="/img/donor-comparison.webp" alt="Reported F0.5 improves from 0.7029 before tuning to 0.7223 after tuning" w={1200} h={675} caption="Regenerated from the saved report values in the table above. Evaluation limitations still apply." />}
    summary={[
      'This CharityML project explores how classification can prioritize outreach when contacting every prospect is costly. The saved report contains 45,222 census records and uses income above $50,000 as a proxy for potential donor capacity, not an observed donation outcome.',
      'After preparation and model-family comparison, a boosting classifier was tuned with cross-validation. The optimized model reported 85.68% test accuracy and an F0.5 score of 0.7223. These results describe the exercise; they do not establish campaign response or realized savings.',
    ]}
    data={[
      'The saved analysis contains 11,208 records above the income threshold and 34,014 at or below it. The documented split uses 36,177 training and 9,045 testing records.',
      'Preparation includes logarithmic transformation of skewed continuous features, numerical scaling, and categorical encoding. Scaling is performed before the split in the supplied workflow, and test data informs model-family comparison. These are limitations of the reported evaluation, not a pristine independent holdout design.',
    ]}
    approach={['Profile the target imbalance and numerical/categorical attributes.', 'Transform skewed continuous variables, encode categories, and scale numerical features.', 'Compare classifier families against a simple prediction baseline.', 'Select a precision-oriented objective and tune the chosen boosting model with cross-validation.', 'Compare the reported results before and after tuning and examine the limits of the income proxy.']}
    design="F0.5 weights precision more heavily than recall: a false positive means spending outreach effort on someone outside the exercise's income-defined target. The workflow compares classification families before tuning a boosting model. A stronger future evaluation would fit all preprocessing on training folds and reserve a separate final test set after model selection."
    evaluation={<><p>The saved report documents the following test-split results. Cross-validation was used for parameter search; the figures below are the reported test results after that selection process.</p><DataTable caption="Reported boosting-model results before and after tuning" headers={['Model', 'Accuracy', 'F0.5']} rows={[
      ['Unoptimized', '84.83%', '0.7029'], ['Optimized', '85.68%', '0.7223'],
    ]} /></>}
    findings={['The precision-weighted score improved after tuning, alongside accuracy.', 'Class imbalance makes a single accuracy figure insufficient for the outreach decision.', 'Income eligibility measures the exercise target; willingness to donate remains unknown.']}
    recommendation="The study supports comparing models against a clearly defined outreach objective. Any real campaign should first validate the approach against consented, observed donation outcomes and actual contact costs."
    limitations={['Census income is a proxy for capacity, not willingness or likelihood to donate.', 'Demographic targeting may reinforce historical inequities; real use requires consent, fairness analysis, policy review, calibration, and campaign-outcome evaluation.', 'Pre-split scaling and repeated test-split use limit the independence of the reported scores.', 'No live nonprofit commissioned the exercise, and no reduction in mailing cost was measured.']}
    stack={['Python', 'pandas', 'NumPy', 'scikit-learn', 'AdaBoost', 'Jupyter Notebook']}
    contribution="Project based on Udacity's CharityML exercise; analysis and implementation completed by Abdullah Alshammari. The main takeaway was to choose evaluation metrics around the decision being supported, then clearly explain what the training target can and cannot tell a stakeholder."
  />;
}
