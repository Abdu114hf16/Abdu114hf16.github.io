import CaseStudy from './CaseStudy';
import { Shot } from './ArticleLayout';
import Gallery from '../../components/Gallery';

export default function DigitRecognition() {
  return <CaseStudy slug="handwritten-digit-recognition"
    dataVisual={<Gallery items={[
      { src: '/img/digit-example-1.webp', alt: 'MNIST image labeled five from the saved notebook', w: 417, h: 433, caption: 'Original notebook example: a small grayscale benchmark image labeled 5.' },
      { src: '/img/digit-example-2.webp', alt: 'MNIST image labeled zero from the saved notebook', w: 417, h: 433, caption: 'Original notebook example labeled 0. Benchmark images are relatively clean and centered.' },
    ]} />}
    designVisual={<Shot src="/img/digit-preprocessing.webp" alt="Drawing preparation through 28 by 28 grayscale conversion, normalization and digit classification" w={1200} h={675} caption="Explanatory flow based on the notebook. Compatible input preparation connects user drawings to the trained model." />}
    evaluationVisual={<Shot src="/img/digit-demo.webp" alt="Original handwritten-digit drawing interface showing an example prediction for a drawn two" w={1440} h={748} caption="Original repository screenshot. The confidence shown for one drawing is not a test-accuracy score." />}
    summary={['A convolutional neural network recognizes handwritten digits, while an interactive drawing interface connects custom input to prediction. The project links a clean benchmark workflow to the practical question of preparing a user drawing for the same model.', 'The public notebook demonstrates the training and inference workflow. A separately documented final evaluation is needed before quoting a definitive accuracy figure; benchmark results alone would not establish reliable performance on photographs or different handwriting distributions.']}
    data={['The model uses MNIST grayscale digit images represented at 28 × 28 pixels across ten classes. Inputs are normalized before training.', 'Custom drawings are resized, color-inverted where needed, and normalized to the model representation. Alignment, stroke thickness, background, and centering may differ from the benchmark images.']}
    approach={['Prepare normalized grayscale benchmark inputs.', 'Train a convolutional classifier to learn local visual patterns.', 'Inspect training and validation behavior in the notebook.', 'Apply the corresponding resizing and normalization to custom drawings.', 'Expose prediction through a drawing interface and inspect individual examples.']}
    design="The inference path must reproduce the training representation: drawing → grayscale/resize → optional inversion → normalization → class prediction. Convolutional features help model spatial patterns, but do not remove the need for compatible input preparation."
    evaluation={<p>The saved notebook passes the official MNIST test split as validation data during training. That split was therefore monitored during development. The README's accuracy claim is not established by a separate saved evaluation in the notebook, so this project reports functionality and scope rather than presenting an unsupported final score. Custom-drawing performance should be evaluated separately from the benchmark.</p>}
    findings={['Input preparation is part of the prediction system, not a cosmetic interface step.', 'A centered benchmark image and an arbitrary drawing may have different distributions.', 'The interactive interface makes individual failures inspectable but does not measure broad reliability.']}
    recommendation="Use the interface to explore inference and investigate where input preprocessing fails. A stronger evaluation would reserve an independent final set, report per-class errors, and collect a separate custom-handwriting test set."
    limitations={['MNIST images are cleaner and more consistently centered than real photographs.', 'The interface is an inference demonstration, not a production OCR service.', 'No accuracy guarantee is made for Arabic-Indic numerals, photographs, or different handwriting distributions.', 'The saved validation workflow does not establish an untouched final holdout result.']}
    stack={['Python', 'TensorFlow', 'Keras', 'NumPy', 'Pillow', 'Gradio', 'MNIST']}
    contribution="I developed the convolutional-classification workflow and connected it to an interactive drawing interface. The practical lesson was that the preprocessing boundary between training and user input deserves as much attention as the model architecture."
  />;
}
