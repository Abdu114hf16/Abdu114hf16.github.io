import CaseStudy from './CaseStudy';
import { DataTable, Shot } from './ArticleLayout';

export default function MedicalCost() {
  return <CaseStudy slug="medical-cost-prediction" title="What Makes Medical Insurance Expensive?"
    summary={[
      'An interaction-aware regression model improved holdout R² from 0.807 to 0.909 and reduced RMSE from $5,956 to $4,085 on a public medical-cost teaching dataset. Capturing how smoking status and BMI interact was more useful here than simply choosing a more complex model.',
      'Feature-attribution analysis made the predictions inspectable. This is an educational study of associations in recorded charges: the evidence does not support using the model to set premiums or grant or deny coverage.',
    ]}
    data={['The public Medical Cost Personal dataset contains 1,338 records and seven columns: annual charges and six attributes covering age, sex, BMI, children, smoking status, and region.', 'Exploratory analysis examined distributions and subgroup relationships before feature construction. The dataset is small and lacks detailed health history, claims behavior, and fine-grained geography. Its charges must not be confused with an insurer-calibrated premium.']}
    dataVisual={<Shot src="/img/mcp-age.webp" alt="Annual charges versus age, grouped by smoking status" w={880} h={550} caption="Charges occupy different bands by smoking status across age. This is an association within the teaching dataset, not medical causality." />}
    approach={['Frame annual cost estimation and prediction explanation as separate evaluation questions.', 'Explore the data and identify differences in the smoking/BMI relationship.', 'Establish a linear-regression baseline, then add interaction features.', 'Compare model families using reported holdout R² and RMSE.', 'Interpret individual and overall predictions with feature attribution.']}
    design="Interaction features let the relationship between BMI and predicted charges vary with smoking status. A transparent regression can therefore represent a pattern that a purely additive baseline misses. The seeded train/test split provides the reported comparison; feature-attribution analysis describes how the fitted model uses its inputs."
    designVisual={<Shot src="/img/mcp-interaction.webp" alt="Annual charges versus BMI, grouped by smoking status" w={880} h={550} caption="The contrasting BMI patterns motivate an interaction term rather than one shared additive effect." />}
    evaluation={<><p>All values below are reported holdout results. R² measures explained variation; RMSE is an error magnitude in dollars, not a promised error for each person.</p><DataTable caption="Reported holdout comparison" headers={['Approach', 'R²', 'RMSE']} rows={[
      ['Additive linear baseline', '0.807', '$5,956'], ['Interaction-aware linear regression', '0.909', '$4,085'], ['Random forest', '0.882', '$4,664'],
    ]} /></>}
    evaluationVisual={<Shot src="/img/mcp-shap.webp" alt="Feature-attribution plot for the medical-cost model" w={880} h={550} caption="Attributions explain the fitted prediction, rather than establishing why a medical condition or expense occurs." />}
    findings={['Capturing the smoking/BMI interaction improved the reported holdout fit and error over the additive baseline.', 'The interaction-aware regression outperformed the compared random forest on this split.', 'Smoking-related features, BMI, and age are important model signals in this dataset.', 'An explanation of a prediction does not establish that its use is appropriate for an individual decision.']}
    recommendation="Use the notebook to study feature design, model comparison, and explainability. Evaluate any new application on appropriate independent data and assess subgroup performance rather than transferring these scores to a real pricing system."
    limitations={['Educational use only: this model must not be used to price or deny coverage.', 'The teaching dataset is small and simplified compared with an insurer portfolio.', 'Observed associations do not establish medical causality.', 'The reported holdout comparison is not evidence of external validation, fairness, or calibration across populations.']}
    stack={['Python', 'pandas', 'scikit-learn', 'statsmodels', 'SHAP', 'Jupyter Notebook']}
    contribution="I completed the data exploration, regression comparison, interaction-feature design, and explanation workflow, drawing on foundations learned through Udacity. The project reinforced that useful feature design can matter more than model complexity, and that explaining a model includes explaining the decisions it cannot support."
  />;
}
