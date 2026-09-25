import CaseStudy from './CaseStudy';
import { DataTable, Shot } from './ArticleLayout';

export default function SmsComparison() {
  return <CaseStudy slug="sms-spam-model-comparison"
    designVisual={<Shot src="/img/sms-matrix.webp" alt="Teaching illustration of converting example SMS messages into a term-document count matrix" w={1024} h={559} caption="Original baseline-repository illustration: vocabulary columns turn example messages into a numerical bag-of-words representation." />}
    evaluationVisual={<Shot src="/img/sms-comparison.webp" alt="Reported spam recall: probabilistic baseline 94.1%, random forest 84.9%, bagging 90.3%, boosting 47.6%" w={1200} h={675} caption="Regenerated from the documented comparison. The recall gap explains why similar-looking accuracy figures can hide very different missed-spam rates." />}
    summary={['This two-stage text-classification study compares a probabilistic baseline with random-forest, bagging, and boosting approaches on 5,572 SMS messages. The strongest balanced result was 98.9% accuracy and 0.956 F1 from the probabilistic classifier.', 'The comparison is an extension of a Udacity Supervised Learning exercise. Both repository phases are presented together because the important result is the tradeoff between catching spam and incorrectly blocking legitimate messages.']}
    data={['The UCI SMS Spam Collection contains 5,572 messages labeled spam or ham. The documented split is 75% training and 25% testing with a fixed random seed.', 'A bag-of-words vocabulary is fitted to the training messages and used to transform the test messages. The dataset is imbalanced and historical; near-duplicate messages may make a random split easier than genuinely new traffic.']}
    approach={['Load messages and encode the spam/ham target.', 'Create the documented seeded training/test split.', 'Build a sparse bag-of-words representation from training text.', 'Train the baseline and three comparison models on the same feature representation.', 'Compare accuracy, precision, recall, and F1 on the documented test split.']}
    design="A shared text representation and split make the four approaches comparable within this exercise. Precision measures how often a flagged message is actually spam; recall measures how much spam is caught. F1 combines the two, making missed spam visible even when overall accuracy looks high."
    evaluation={<><p>These are the reported test-split figures in the comparison repository. Perfect precision for one model means no false positives were observed on this test set, not a guarantee about future messages.</p><DataTable caption="Reported SMS classifier comparison" headers={['Approach', 'Accuracy', 'Precision', 'Recall', 'F1']} rows={[
      ['Probabilistic text classifier', '0.989', '0.972', '0.941', '0.956'],
      ['Random forest', '0.980', '1.000', '0.849', '0.918'],
      ['Bagging', '0.976', '0.918', '0.903', '0.910'],
      ['Boosting', '0.927', '0.957', '0.476', '0.635'],
    ]} /></>}
    findings={['The probabilistic baseline achieved the strongest reported F1 and recall.', 'The random forest traded lower recall for no observed false positives on this split.', 'Boosting missed more than half of spam messages despite 92.7% overall accuracy.', 'The preferred model depends on the relative cost of a blocked legitimate message and a missed spam message.']}
    recommendation="Retain the probabilistic classifier as the strongest balanced baseline in this study. Consider the random forest only when false positives are substantially more costly, and verify that tradeoff on fresh representative messages before deployment."
    limitations={['The small historical dataset may not represent current spam language.', 'Near duplicates can inflate apparent robustness under a random split.', 'Bag-of-words discards word order and broader message context.', 'Production use requires drift monitoring, multilingual evaluation, adversarial testing, and sender context.']}
    stack={['Python', 'pandas', 'scikit-learn', 'CountVectorizer', 'Multinomial Naive Bayes', 'Random Forest', 'AdaBoost']}
    contribution="I completed the baseline implementation and ensemble comparison as an extension of the Udacity supervised-learning exercise. Comparing the same task across four metrics showed why a simple model can remain the best-supported choice even when more elaborate alternatives are available."
  />;
}
