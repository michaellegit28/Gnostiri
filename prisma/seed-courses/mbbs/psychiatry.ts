import { prisma, seedMbbsCourse, type SubjectSeed } from "./spine";
import type { LessonContent } from "@/types/lesson";

const PLACEHOLDER: LessonContent = { blocks: [] };

// ---------------------------------------------------------------------------
// LESSON 1 — Motivation & emotion (fully authored)
// ---------------------------------------------------------------------------
function lesson1(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a motive and distinguish drive-reduction, incentive and arousal-based accounts of motivation; name the primary biological motives and the homeostatic mechanisms that regulate them; say what an emotion consists of and compare the James-Lange, Cannon-Bard, Schachter-Singer two-factor and Lazarus appraisal theories; describe how emotions are expressed and recognised, and the display rules that modulate expression; and recognise how motivated behaviour and emotional life change in depression, schizophrenia, dementia and substance use.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the first lesson of PSYT 306 and assumes no prior medical study. A physiology-level familiarity with the hypothalamus, the autonomic nervous system and the reward pathway will make the material easier to picture, but every idea here is stated self-containedly.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Motive",
        text: "An internal state that activates, directs and sustains behaviour toward a goal. A motive supplies the energy for behaviour, its direction, and its persistence once it has started.",
      },
      {
        type: "paragraph",
        text: "Motivation and emotion are two halves of one problem. Motivation is behaviour aimed at a goal; emotion is the evaluation of whether that goal matters and whether you are getting closer to it. Hold that pairing together and the rest of this course falls into place, because psychiatric disorders are overwhelmingly disorders of these two systems. Depression is a collapse of the ability to anticipate reward — anhedonia. Mania is the same motivational engine turning too fast. Addiction is a permanent re-weighting of motivation toward a substance and away from everything that used to compete with it. Schizophrenia is a disturbance in which stimuli feel significant and meaningful at all.",
      },

      { type: "heading", level: 2, text: "Primary motives: homeostasis and what lies beyond it" },
      {
        type: "paragraph",
        text: "The primary biological motives are the ones whose satisfaction keeps the internal environment viable: hunger, thirst, the need for sleep, temperature regulation, elimination of waste, avoidance of pain, and sexual motivation. Walter Cannon's concept of homeostasis (1926) is the organising idea — the body defends certain variables around a set point, and a deviation from that set point produces both a physiological correction and a drive state that pushes the organism into action.",
      },
      {
        type: "table",
        headers: ["Motive", "Regulated variable and mechanism", "Behaviour the drive produces", "Notes for clinical practice"],
        rows: [
          ["Hunger", "Blood glucose, leptin (from adipose tissue), ghrelin (from the stomach), insulin, peptide YY from the gut", "Food seeking and eating, ending when satiety signals arrive", "Hypothalamic arcuate nucleus integrates the signals; lateral hypothalamus drives feeding, ventromedial signals satiety (the simple two-centre account is now superseded by a network model)"],
          ["Thirst", "Plasma osmolality, blood volume, angiotensin II", "Drinking; seekingSalt and water repletion", "Osmoreceptor neurons in the hypothalamus trigger both drinking and ADH release from the posterior pituitary"],
          ["Sleep", "Homeostatic sleep pressure (adenosine) and circadian phase", "Sleep-onset, sleep maintenance, sleepiness", "Chronic partial sleep deprivation is common in mania, depression, anxiety and withdrawal states and worsens all of them"],
          ["Temperature", "Core temperature set point in the hypothalamus", "Shivering, sweating, vasomotor change, seeking shade or warmth", "Fever is the same set-point machinery reset by pyrogens, which is why a febrile patient feels cold until the set point falls"],
          ["Sex", "Hormonal state plus central motivation circuits, especially mesolimbic dopamine", "Courtship and sexual behaviour", "Motivation is separable from ability: loss of libido is common in depression, and medications such as SSRIs and antipsychotics impair it as a side effect"],
          ["Avoidance of pain and harm", "Nociceptive input plus fear circuitry in the amygdala", "Escape, avoidance, protective guarding", "Chronic pain and depression amplify each other — the same descending modulatory pathways are involved"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Homeostasis is not literally one set point per variable. Body weight, for example, is defended but the 'set point' drifts with diet and adiposity, which is why maintained weight loss is physiologically resisted. In obesity the leptin signal is present but the hypothalamus stops responding to it — a signalling failure rather than a hormone deficiency, so leptin injections do not treat it.",
      },

      { type: "heading", level: 2, text: "Three theories of motivation" },
      {
        type: "paragraph",
        text: "No single account explains why people study medicine at three in the morning when they are neither hungry nor cold. Three traditions divide the explanatory work between them.",
      },
      {
        type: "table",
        headers: ["Theory", "Core claim", "What it explains well", "Where it struggles"],
        rows: [
          ["Drive-reduction (Clark Hull, 1943)", "A physiological need creates an internal drive, and behaviour is motivated by the need to reduce that drive", "Eating, drinking, thermoregulation — anything with a clear tissue deficit", "Curiosity, play and exploration increase tension rather than reducing it; people deliberately watch horror films"],
          ["Incentive theory", "Behaviour is pulled by the expected value of the goal, not pushed by an internal deficit", "Working for money, for status, for a qualification; addiction's pull toward a drug", "Says little about why an organism without any deficit acts at all; goal value is often learned and culturally shaped"],
          ["Arousal / optimal-level theory (Hebb, Berlyne)", "Organisms act to keep arousal near an optimal level: raise it when bored, lower it when overstimulated", "Sensation-seeking at one extreme and withdrawal at the other; why noise and crowding amplify distress", "Defining and measuring 'arousal' independently of the behaviour it is meant to explain"],
        ],
      },
      {
        type: "paragraph",
        text: "The Yerkes-Dodson law (1908) sits on top of arousal theory: performance rises with arousal up to an optimum and then falls. The practical content is real — an examinee with no arousal at all performs badly, and so does one in a panic — but the inverted-U shape is a heuristic, not a law, and the optimum shifts with task difficulty. Difficult, unfamiliar tasks are done best at lower arousal; well-rehearsed simple tasks tolerate high arousal.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Yerkes-Dodson is frequently misquoted as 'some stress helps, stress is good for you'. It does not say that. It says that physiological arousal interacts with task difficulty and that beyond the optimum, performance degrades. Telling a frightened patient to 'relax' may help; telling them their anxiety is useful rarely does, and in an anxiety disorder the arousal is itself the problem, not the fuel.",
      },

      { type: "heading", level: 2, text: "Maslow's hierarchy: useful idea, weak evidence" },
      {
        type: "paragraph",
        text: "Abraham Maslow (1943) proposed that motives are arranged in a hierarchy: physiological needs, then safety, then love and belonging, then esteem, then self-actualisation at the top. The appeal is that it reframes motivation as a system rather than a list, and that it explains why a starving student finds it hard to care about philosophy. Critically, the evidence for a strict five-step ladder is weak; people routinely pursue esteem and creativity while hungry or unsafe, and the 'hierarchy' has never been demonstrated as a fixed sequence. Later work on self-determination theory (Deci and Ryan) offers a better-tested alternative: needs for autonomy, competence and relatedness predict wellbeing across cultures.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never use a hierarchy of needs to ration compassion in a clinic. The claim 'their safety needs are met, so anxiety must be about esteem' has no evidential standing. Treat a patient's distress on the terms they bring it.",
      },

      { type: "heading", level: 2, text: "What an emotion is" },
      {
        type: "definition",
        term: "Emotion",
        text: "A coordinated episode of change in several systems at once: a subjective feeling, a pattern of physiological arousal, an expressive facial and vocal display, an action tendency, and a cognitive appraisal of what has happened. An emotion is short-lived, has a cause (real or imaginary), and serves to prioritise one course of action over others.",
      },
      {
        type: "paragraph",
        text: "Three boundaries keep the word useful. A mood is longer-lasting and diffuse — it often has no identifiable trigger. An affect is the observable, momentary expression, the part another person can see. Temperament is the stable, lifelong bias in emotional reactivity that is visible from infancy. In a mental status examination you record all three separately: the felt mood (what the patient reports), the observed affect (what you observe, including its range, congruence and reactivity), and the underlying temperament.",
      },

      { type: "heading", level: 2, text: "Theories of emotion" },
      {
        type: "table",
        headers: ["Theory", "Sequence proposed", "Illustration", "Standing today"],
        rows: [
          ["James-Lange (1884-85)", "Stimulus, then bodily response, then feeling", "You meet the bear, your heart races and your muscles tense, and because the body has done those things you feel afraid", "The order is too slow and too rigid — a bodily response alone does not make an emotion — but it established that feeling is inseparable from physiology"],
          ["Cannon-Bard (1927)", "Stimulus triggers thalamic relay to cortex and body simultaneously", "The bodily arousal and the felt fear happen at the same time, in parallel", "Correct in rejecting the strict James-Lange order; the simultaneous-broadcast detail is oversimplified"],
          ["Schachter-Singer two-factor (1962)", "Arousal, then a cognitive label applied to that arousal", "The same racing heart is labelled 'fear' on a dark road and 'attraction' on a suspension bridge", "Partly supported: arousal must be explained, and misattribution demonstrably shifts emotional experience — the misattribution-of-arousal paradigm"],
          ["Lazarus appraisal (1991)", "Appraisal of significance comes first and can be automatic", "You feel afraid because you have evaluated the stimulus as a threat before any bodily change", "Best supported by neuroimaging: subcortical threat circuits (especially the amygdala) evaluate danger faster than conscious awareness"],
        ],
      },
      {
        type: "paragraph",
        text: "The working synthesis used in psychiatry is the component process model: an event is appraised for relevance, implication, coping potential and normative significance, and each of those appraisals feeds feeling, physiology, expression and action. This is why two patients can receive the same diagnosis and have entirely different emotional responses, and why cognitive therapy — which changes the appraisal — changes the feeling.",
      },

      { type: "heading", level: 2, text: "Expression and recognition" },
      {
        type: "paragraph",
        text: "Charles Darwin argued that emotional expressions are evolved and cross-culturally recognisable, and Paul Ekman's studies in pre-literate societies provided the strongest evidence: photographs of posed facial expressions were named above chance using a restricted set of emotion terms. The usual list of basic emotions — happiness, sadness, fear, anger, surprise and disgust — is a research convention, not a biological census, and the mapping from facial movement to emotion label is far from one-to-one. Expression is also governed by display rules, culturally taught norms about which feelings may be shown, to whom, and how strongly, and those rules matter directly in the consulting room.",
      },
      {
        type: "example",
        text: "A patient is told their biopsy is malignant. They smile, say 'it's fine, these things happen' and ask about the parking. The smile is not evidence that they are coping well. It is a display rule in operation — a learned, often gendered, injunction against visible distress. The correct next step is not to accept the verbal report at face value but to name the discrepancy gently ('this must be hard to hear; how are you actually feeling?') and let the patient set the pace of disclosure.",
      },

      { type: "heading", level: 2, text: "Clinical relevance: when motivation and emotion change" },
      {
        type: "table",
        headers: ["Phenomenon", "What it is", "Disorders where it is prominent", "Why it matters"],
        rows: [
          ["Anhedonia", "Loss of pleasure or of the capacity to anticipate reward, distinct from simple 'sadness'", "Depressive disorders, schizophrenia (a negative symptom), Parkinson's disease, stimulant withdrawal", "It is a core diagnostic symptom and predicts poor outcome; it must be asked about directly, because patients rarely use the word"],
          ["Apathy", "Loss of motivation and goal-directed behaviour, with relatively preserved mood", "Schizophrenia, frontal lobe damage, Parkinson's disease, dementia", "Apathy without sadness should not be called depression; treating it as depression mislabels the patient"],
          ["Affective flattening", "Reduced range and intensity of expressed emotion, with reduced responsiveness", "Schizophrenia (negative symptom), depression with retardation, parkinsonism", "Reduced expression does not mean reduced inner feeling — never infer feeling from the face alone"],
          ["Emotional lability", "Rapid, exaggerated swings in affect with little trigger", "Pseudobulbar affect after stroke, dementia, mania, borderline personality organisation", "Document the trigger, duration and direction of swings; lability is often mistaken for 'unstable personality'"],
          ["Alexithymia", "Difficulty identifying and describing feelings in words", "Common in depression, anxiety, eating disorders, autism, somatic symptom disorders", "It changes how you interview: ask about behaviour and bodily sensation rather than emotion words"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Confusing negative reinforcement with punishment. Negative reinforcement strengthens a behaviour by removing something aversive — a patient who avoids the shopping centre and therefore stops panicking is being negatively reinforced for avoidance. Punishment reduces behaviour. Almost every persistence of a phobia is negative reinforcement doing the work, not punishment, and that is why graded exposure rather than sanctions is the treatment.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating 'flat affect' as 'no feeling'. Reduced expression is a motor performance, not a read-out of inner experience. Patients with Parkinsonian side effects or psychosis-related flattening typically report feeling a great deal, and assuming otherwise leads to under-treated depression and under-involved families.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading Maslow as a licence for moral judgement. The hierarchy is descriptive, weakly evidenced, and not a rule about who deserves care. Patients do not need adequate food before their anxiety is legitimate.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient stops using the bus because travelling makes her panic, and her panic has now gone away. Which motivational principle maintains the avoidance, and what does it imply for treatment?",
        answer: "Negative reinforcement: removing the feared stimulus removes the anxiety, so the avoidance behaviour is strengthened. Because the behaviour is maintained by relief rather than by the fear itself, the treatment is graded exposure with response prevention — deliberately staying in the situation until anxiety habituates — not reassurance or lectures about safety.",
        explanation: "This is the Mowrer two-factor account applied to clinical practice: fear is acquired by classical conditioning and maintained by operant avoidance. If the mechanism were punishment or habit, sanctions would be plausible; they are not.",
      },
      {
        type: "question",
        prompt: "According to the Schachter-Singer two-factor theory, what exactly produces the quality of an emotion?",
        answer: "A state of physiological arousal plus a cognitive label attributed to it. The same undifferentiated arousal can be experienced as fear, anger or attraction depending on how the situation is interpreted, which is why misattributing arousal (a bridge, an injection) changes the reported feeling.",
        explanation: "Two-factor theory separates arousal from label. Modern appraisal theory goes further and places the appraisal before the arousal, but both agree that interpretation is inseparable from feeling.",
      },
      {
        type: "question",
        prompt: "How do mood, affect and temperament differ in a mental status examination?",
        answer: "Mood is the sustained, subjective emotional state as reported by the patient over days or weeks. Affect is the observable moment-to-moment expression, described by its range, intensity, congruence with the reported mood, and reactivity. Temperament is the lifelong constitutional bias in emotional reactivity, assessed from history rather than from the current episode.",
        explanation: "They can dissociate: a patient with parkinsonian side effects may have flat affect with a severely depressed mood, and a patient with cyclothymic temperament may have reactive affect and a chronically unstable mood.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Motives are internal states that activate, direct and sustain behaviour; the primary biological ones are homeostatic, while incentive and arousal accounts explain what homeostasis cannot. Emotion is a multi-component episode with a feeling, a physiological pattern, an expression and an appraisal, and the major theories disagree mainly about the order in which those components occur. Expression is shaped by culturally learned display rules, so a patient's face is not a reliable report of their feeling.",
      },
      {
        type: "paragraph",
        text: "Next: learning and cognition. You will see how the same motivational machinery is shaped by conditioning — how fears are acquired and maintained, how reinforcement schedules control behaviour, and why the removal of anxiety, rather than its punishment, is what makes avoidance so sticky.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which statement best describes drive-reduction theory?",
        options: [
          "Behaviour is motivated by the expected value of an external goal such as money or status.",
          "A physiological need produces an internal drive, and behaviour continues until the drive is reduced.",
          "Behaviour is maintained by a schedule of reinforcement intermittently delivered by the environment.",
          "Behaviour arises from the need to keep arousal at an optimal level, which may mean seeking stimulation rather than reducing it.",
        ],
        correctIndex: 1,
        explanation: "Hull's drive-reduction account ties motivation to tissue needs — hunger, thirst, temperature — and to the reduction of the tension they create. Incentive theory is the external-goal option and arousal theory is the last option.",
      },
      {
        type: "mcq",
        stem: "A patient on an antipsychotic shows little facial expression but reports pervasive misery and hopelessness. Which interpretation is correct?",
        options: [
          "Affective flattening means the reported mood is unlikely to be genuine and should be discounted.",
          "The report is inconsistent with the observed affect, so the patient is probably malingering.",
          "Reduced expression is a motor performance that may accompany preserved or severe inner feeling, and the mood must be assessed independently.",
          "Affective flattening is a sign of mania and requires urgent sedation.",
        ],
        correctIndex: 2,
        explanation: "Flattened affect is a negative symptom and a parkinsonian side effect; it says nothing about subjective experience. Inferring feeling from the face is the commonest error, and it under-treats depression in psychosis.",
      },
      {
        type: "mcq",
        stem: "In the Schachter-Singer two-factor theory of emotion, which pair of ingredients produces the emotional experience?",
        options: [
          "Physiological arousal and a cognitive label attributed to it",
          "A facial display followed by feedback from the facial muscles",
          "A thalamic broadcast to cortex and body at the same instant",
          "An appraisal of coping potential before any bodily change",
        ],
        correctIndex: 0,
        explanation: "Two-factor theory is arousal plus label. The facial-feedback option is closest to James-Lange, the simultaneous broadcast to Cannon-Bard, and appraisal-first to Lazarus.",
      },
      {
        type: "mcq",
        stem: "Which statement about the Yerkes-Dodson relationship is correct?",
        options: [
          "Performance improves monotonically as arousal increases, so more stress is always better.",
          "Performance is best at very low arousal, because arousal only degrades thinking.",
          "Performance rises with arousal to an optimum and then falls, and the optimum is lower for difficult tasks.",
          "The relationship has been demonstrated only in animals and does not apply to human cognition.",
        ],
        correctIndex: 2,
        explanation: "The inverted-U is a heuristic: moderate arousal helps, excessive arousal degrades performance, and hard, unfamiliar tasks tolerate less arousal than rehearsed ones.",
      },
      {
        type: "mcq",
        stem: "Which set of findings would most strongly suggest a primary motivational disorder rather than a mood disorder?",
        options: [
          "Low mood, anhedonia, early morning waking and diurnal variation",
          "Loss of goal-directed behaviour with comparatively preserved sadness, after frontal lobe injury",
          "Euphoria, decreased need for sleep and pressure of speech",
          "Recurrent intrusive thoughts relieved by checking, with recognised excess",
        ],
        correctIndex: 1,
        explanation: "Apathy without prominent sadness, particularly after frontal or basal ganglia damage, points to a disorder of the motivational system rather than of mood. Option A is the classic depressive picture, C is mania and D is obsessive-compulsive disorder.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 2 — Learning & cognition (fully authored)
// ---------------------------------------------------------------------------
function lesson2(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the elements of classical conditioning and the phenomena of acquisition, extinction, spontaneous recovery, generalisation and discrimination; distinguish positive and negative reinforcement from punishment and explain why the distinction matters clinically; compare the four schedules of reinforcement and their effect on resistance to extinction; outline the four processes of observational learning and the concept of reciprocal determinism; and describe attention, language and problem-solving well enough to apply them in behavioural and cognitive therapy.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 1 (Motivation and emotion). You need the drive and arousal ideas from that lesson, and above all the distinction between removing an aversive stimulus and applying a punishment.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Learning",
        text: "A relatively durable change in behaviour or knowledge that results from experience, rather than from maturation, fatigue, injury or a transient drug effect. The durability is the part that distinguishes learning from performance.",
      },
      {
        type: "paragraph",
        text: "Learning is the mechanism by which psychiatric disorder is built and the mechanism by which it is dismantled. A phobia is a learned association between a neutral cue and intense fear; a panic attack becomes a disorder when the attacks themselves become a conditioned cue for further attacks; a compulsion is maintained because it buys relief. Every psychological treatment with real evidence rests on learning theory: exposure dismantles a conditioned fear response, behavioural activation re-establishes contact with reinforcement, and contingency management changes what behaviour pays. Learn the principles here once and the therapy lessons later will make sense rather than feel arbitrary.",
      },

      { type: "heading", level: 2, text: "Classical conditioning: learning associations between events" },
      {
        type: "paragraph",
        text: "Pavlov's dogs established the canonical paradigm. An unconditioned stimulus (the sight and smell of food) reliably produces an unconditioned response (salivation). A neutral stimulus (a bell) is paired with the unconditioned stimulus; after enough pairings the neutral stimulus becomes a conditioned stimulus, and it now produces a conditioned response on its own.",
      },
      {
        type: "table",
        headers: ["Element", "Definition", "In Pavlov's experiment", "In a spider phobia"],
        rows: [
          ["Unconditioned stimulus (UCS)", "Stimulus that reliably elicits a response without prior learning", "Food in the mouth", "The sight of the spider at close quarters"],
          ["Unconditioned response (UCR)", "The unlearned response to the UCS", "Salivation", "Fear and escape"],
          ["Conditioned stimulus (CS)", "Previously neutral stimulus that now elicits the response after pairing", "The bell", "Any spider, a picture of one, even the word"],
          ["Conditioned response (CR)", "The learned response elicited by the CS", "Salivation to the bell alone", "Fear, avoidance, anticipatory anxiety"],
        ],
      },
      {
        type: "paragraph",
        text: "Five phenomena govern how robustly the association forms, and each one maps onto a clinical fact. Acquisition is strongest when the CS reliably precedes the UCS and is close to it in time — a single intense pairing can be enough, which is why one dog bite can produce a lifelong fear. Extinction occurs when the CS is repeatedly presented without the UCS, and is the basis of exposure therapy. Spontaneous recovery is the return of the extinguished response after a delay, which is why patients are taught to expect setbacks after treatment rather than to read them as failure. Stimulus generalisation is the transfer of the response to similar stimuli — after a road traffic accident, cars, engines, motorway signposts and the smell of fuel all acquire the power to frighten. Stimulus discrimination is the learned narrowing of the response to the reliable cue, and it is what a graded exposure hierarchy builds deliberately.",
      },
      {
        type: "example",
        text: "A woman panics in a supermarket queue and is taken to hospital; nothing is found. Two weeks later she panics in a queue at the post office. The queue, the heat, the crowding and the bodily sensation of standing still have all become conditioned cues. This is how panic disorder with agoraphobia develops: the panic is originally physiological, but the situations in which it occurred become danger signals in their own right, and avoidance of those situations is negatively reinforced by the relief it produces.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Counterconditioning is the deliberate replacement of a conditioned fear response with an incompatible one, and systematic desensitisation applies it: the patient is taught relaxation and then exposed to the feared stimulus in a hierarchy ordered from mild to severe, remaining relaxed throughout. It remains the historical template from which modern graded exposure developed.",
      },

      { type: "heading", level: 2, text: "Operant conditioning: learning from consequences" },
      {
        type: "paragraph",
        text: "Edward Thorndike's law of effect stated that behaviour followed by a satisfying consequence is more likely to recur, and B. F. Skinner's operant analysis made consequences the central explanatory unit. The four-way classification below is the vocabulary that every behavioural formulation depends on.",
      },
      {
        type: "table",
        headers: ["Contingency", "Effect on behaviour", "Definition", "Clinical example"],
        rows: [
          ["Positive reinforcement", "Increases it", "A desirable stimulus is delivered after the behaviour", "Attention, comfort and reassurance follow a self-harm attempt, making help-seeking that is entangled with harm more likely to recur"],
          ["Negative reinforcement", "Increases it", "An aversive stimulus is removed or avoided after the behaviour", "Checking the lock removes anxiety, so checking is repeated — and avoidance of leaving the house removes the panic, so avoidance is repeated"],
          ["Positive punishment", "Decreases it", "An aversive stimulus follows the behaviour", "A painful injection after an overdose attempt; rarely justified and rarely effective in sustained behaviour change"],
          ["Negative punishment", "Decreases it", "A desirable stimulus is removed after the behaviour", "Loss of visiting privileges after an incident — the operative mechanism in behavioural contracts on inpatient units"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Negative reinforcement is not punishment. It strengthens behaviour. The two most common exam and clinical errors in this whole lesson are (a) calling the removal of anxiety a punishment, and (b) thinking that because checking reduces anxiety it must be a reasonable coping strategy. It reduces anxiety today and entrenches the disorder over years — the defining criterion of negative reinforcement.",
      },
      {
        type: "paragraph",
        text: "Escape learning produces a behaviour that terminates an ongoing aversive state; avoidance learning produces a behaviour that prevents it from starting. Avoidance is the more clinically important of the two because it never extinguishes the fear: the patient stops encountering the situation, so the expectation that the situation is dangerous is never tested and never disconfirmed. That single sentence is the rationale for exposure and response prevention.",
      },
      {
        type: "paragraph",
        text: "Schedules of reinforcement account for why some behaviours are extremely resistant to extinction. Continuous reinforcement (every response rewarded) produces rapid learning and rapid extinction. Intermittent reinforcement — and variable-ratio schedules in particular — produces behaviour that persists through long stretches of non-reward.",
      },
      {
        type: "table",
        headers: ["Schedule", "Rule", "Effect on response rate", "Effect on extinction"],
        rows: [
          ["Fixed interval (FI)", "Reward for the first response after a fixed time has elapsed", "Scalloped: little responding just after reward, rising as the interval ends", "Moderate"],
          ["Variable interval (VI)", "Reward for the first response after an unpredictable interval", "Steady, moderate rate", "High"],
          ["Fixed ratio (FR)", "Reward after a fixed number of responses", "High rate with a post-reinforcement pause", "Moderate"],
          ["Variable ratio (VR)", "Reward after an unpredictable number of responses", "Very high, steady rate", "Very high — the most extinction-resistant schedule"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Slot machines are variable-ratio devices, and so is addiction's relationship with the drug-seeking environment. Variable-ratio reinforcement explains why a behaviour that is rewarded only occasionally — gambling, checking, reassurance-seeking out of an intermittent payoff — is harder to give up than one rewarded every time.",
      },

      { type: "heading", level: 2, text: "Observational learning and social cognition" },
      {
        type: "paragraph",
        text: "Albert Bandura showed that much learning occurs by watching, with no direct reinforcement of the learner at all, and that the model's consequences matter to the observer. His Social Learning Theory specifies four processes: attention (the observer must notice the behaviour), retention (it must be encoded in memory, often verbally), motor reproduction (the observer must be physically able to perform it), and motivation (the observer must expect a valued outcome, including vicarious reinforcement — seeing the model rewarded — or vicarious punishment).",
      },
      {
        type: "paragraph",
        text: "Bandura's later construct of reciprocal determinism places person, behaviour and environment in a two-way causal loop: people choose environments, environments shape people, and behaviour changes both. This is why a purely environmental behaviourism is inadequate as a model of psychiatric disorder — and also why a purely trait-based model is inadequate. Modelled mastery, in which the observer watches someone similar succeed, is the strongest single ingredient of self-efficacy, and self-efficacy predicts treatment adherence and outcome in depression, chronic pain and substance dependence.",
      },

      { type: "heading", level: 2, text: "Attention, language and problem-solving" },
      {
        type: "table",
        headers: ["Domain", "What it covers", "Relevance in psychiatry"],
        rows: [
          ["Selective attention", "Focusing on one stimulus stream while filtering others; the cocktail party effect is the demonstration", "Impaired in depression and anxiety, where attention locks onto threat-relevant material; in ADHD; after traumatic brain injury"],
          ["Sustained attention / vigilance", "Maintaining focus over time; degrades with fatigue and sleep loss", "Deteriorates in delirium and dementia before memory does, and is what acute withdrawal impairs"],
          ["Divided attention", "Attending to two streams simultaneously", "Impaired in delirium and in dementia; the basis of dual-task gait testing"],
          ["Language", "Comprehension and production; Broca's area in the left inferior frontal gyrus for production, Wernicke's in the superior temporal gyrus for comprehension", "Expressive vs receptive dysphasia after stroke; pressured speech in mania; poverty of speech in schizophrenia; concrete interpretation in intellectual disability and autism"],
          ["Problem-solving", "Converting a goal state from the present state: algorithms (exhaustive, guaranteed) versus heuristics (efficient, imperfect)", "Heuristics are the cognitive therapist's target; impaired problem-solving predicts relapse in depression and psychosis"],
          ["Insight learning", "Sudden restructuring of the problem rather than trial and error", "Kohler's chimpanzees; insight-based psychotherapy is named by analogy but is not the same phenomenon"],
        ],
      },
      {
        type: "paragraph",
        text: "Two functional obstacles recur. Functional fixedness is the tendency to see objects only in their usual function, and it is what makes a patient unable to imagine any use for an empty bottle other than the one that harms them. Mental set is the tendency to apply a strategy that has worked before regardless of whether it fits the current problem, and it is the mechanism by which an entrenched avoidance response is applied to new situations that never warranted it.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing every behaviour change to conditioning. Conditioning is powerful and general, but it does not explain language acquisition, insight, or the fact that patients deliberately do things they dislike because of a long-term goal. Operant accounts of inpatient behaviour fail when staff assume a contingency is present when it is not.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Delivering intermittent reinforcement by accident. A ward that responds quickly to reprimands but slowly to calm cooperation has accidentally placed the disturbed behaviour on a variable-ratio schedule and made it more resistant. Consistency, not severity, is what changes behaviour.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using Watson's Little Albert experiment as evidence that phobias are all acquired. The study is ethically indefensible by modern standards, was never replicated with adequate controls, and its arithmetic has been questioned. It is historically important; it is not proof, and the finding that phobias cluster on evolutionarily relevant stimuli (snakes, heights, water) argues for prepared learning rather than blank-slate conditioning.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A man with obsessive-compulsive disorder checks the gas hob twenty times each night. His partner reassures him each time. Explain in operant terms what is being reinforced, and by whom.",
        answer: "The checking is negatively reinforced by the immediate reduction in anxiety, so it is strengthened by the relief it produces. The partner's reassurance is positively reinforcing of the checking in a second loop: it produces social comfort, which makes the checking more likely to recur and increasingly dependent on the partner's presence. Both loops therefore increase the frequency of the behaviour.",
        explanation: "This is why compulsive checking is treated by blocking the reassurance as well as the checking. If only the anxiety-reduction loop is addressed, the partner substitution loop remains and the symptom survives in a modified form.",
      },
      {
        type: "question",
        prompt: "Why does a variable-ratio schedule produce behaviour more resistant to extinction than a fixed-ratio schedule?",
        answer: "Because the organism cannot predict which response will be rewarded, so each response is followed by uncertainty that maintains responding, and a long run of non-rewarded responses is not informative about whether reinforcement has stopped. With a fixed ratio the run of responses can be counted, and a missing reward after the expected count is a reliable signal that reinforcement has ended.",
        explanation: "Prediction is the key. Any schedule that makes reward unpredictable keeps behaviour alive through the drought; that is precisely the structure of gambling and of intermittent drug availability.",
      },
      {
        type: "question",
        prompt: "Name the four processes Bandura identifies as necessary for observational learning.",
        answer: "Attention, retention, motor reproduction and motivation. The observer must notice the behaviour, encode it in memory, be physically capable of performing it, and expect a valued outcome — including vicarious reinforcement from observing the model's consequences.",
        explanation: "Modelling ADHD children or teaching social skills to patients with psychosis uses exactly these steps, and failure at any one of them explains why a modelled demonstration sometimes fails.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Classical conditioning explains how cues acquire emotional meaning, including the pairing of a panic attack with the place it happened; operant conditioning explains how consequences stamp behaviour in or out, and negative reinforcement of avoidance is the mechanism that makes anxiety disorders persistent. Schedules of reinforcement determine how extinction-resistant a behaviour will be. Observational learning adds a social route, and attention, language and problem-solving are the cognitive capacities that determine how a patient can engage with any of it.",
      },
      {
        type: "paragraph",
        text: "Next: memory and thinking. You will see how the associations formed by conditioning are encoded, stored and retrieved, how those systems break down in amnesia and dementia, and how the heuristics of everyday thinking become the cognitive distortions targeted in therapy.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient's panic attack while travelling on a bus now makes her unable to queue anywhere. Which phenomenon best explains the spread from buses to queues?",
        options: [
          "Stimulus discrimination",
          "Spontaneous recovery",
          "Stimulus generalisation",
          "Higher-order conditioning",
        ],
        correctIndex: 2,
        explanation: "Generalisation transfers the conditioned response from the original cue to similar cues. Discrimination would narrow rather than widen the response; spontaneous recovery is the return of an extinguished response after a delay; higher-order conditioning is conditioning a new cue to an already conditioned cue.",
      },
      {
        type: "mcq",
        stem: "Which of the following is negative reinforcement?",
        options: [
          "A patient is detained after an assault.",
          "A patient's partner stops criticising when he agrees to treatment.",
          "A patient is given a voucher for each clean urine sample.",
          "A patient's leave is withdrawn after he returns intoxicated.",
        ],
        correctIndex: 1,
        explanation: "Negative reinforcement removes an aversive stimulus (the criticism) and thereby increases the probability of agreeing to treatment. Detention and withdrawal of leave are punishment; the voucher is positive reinforcement, the basis of contingency management.",
      },
      {
        type: "mcq",
        stem: "Which schedule of reinforcement produces the highest resistance to extinction?",
        options: ["Fixed interval", "Fixed ratio", "Variable ratio", "Continuous reinforcement"],
        correctIndex: 2,
        explanation: "Variable ratio is the most extinction-resistant because reward is unpredictable, so a run of non-reward provides no information that reinforcement has ended. Continuous reinforcement produces the fastest extinction.",
      },
      {
        type: "mcq",
        stem: "According to the two-factor theory of avoidance learning, a phobia is maintained primarily by which mechanism?",
        options: [
          "Positive punishment of the feared behaviour",
          "Negative reinforcement through successful avoidance",
          "Classical conditioning of a new unconditioned stimulus",
          "Habituation of the unconditioned response",
        ],
        correctIndex: 1,
        explanation: "Mowrer's two-factor account: fear is acquired by classical conditioning, then maintained by operant avoidance, each episode of which is negatively reinforced by the relief it brings. Treatment therefore removes the avoidance rather than punishing it.",
      },
      {
        type: "mcq",
        stem: "Which pairing of cognitive deficit and disorder is most accurate?",
        options: [
          "Attention deteriorates before memory in delirium, and delirium is the differential that must be excluded in acute confusion in an elderly inpatient.",
          "Deterioration of sustained attention is specific to schizophrenia and never occurs in delirium.",
          "Language disorders only arise from left-hemisphere stroke, not from psychiatric illness.",
          "Problem-solving ability is unaffected by psychotic illness because it is crystallised rather than fluid.",
        ],
        correctIndex: 0,
        explanation: "Attention is the first and most sensitive faculty lost in delirium, which is why attention is tested before memory in the cognitive examination. Attention is impaired in many conditions, language is affected by psychiatric disorder, and problem-solving is impaired in depression and psychosis.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 3 — Memory & thinking (fully authored)
// ---------------------------------------------------------------------------
function lesson3(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: describe the stages of memory and the working-memory model with its components; distinguish declarative from non-declarative long-term memory and the brain systems that support them; explain how encoding depth, consolidation, and retrieval cues determine whether a memory is available; account for forgetting in terms of decay, interference and retrieval failure and apply these to amnesia, Korsakoff syndrome and dementia; and describe how concepts are formed, how deductive and inductive reasoning differ, and which heuristics and biases underlie the cognitive distortions targeted in therapy.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (Learning and cognition). Conditioning is a form of memory — an association that has been stored and can be retrieved — and the memory systems described here are the substrate for everything learned there.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Memory",
        text: "The capacity to encode, store and retrieve information from past experience. It is not one faculty but several separable systems, which is why a patient can lose the ability to form new memories while retaining the ability to learn a new motor skill.",
      },
      {
        type: "diagram",
        diagramId: "memory-stages",
        caption: "The Atkinson-Shiffrin model: sensory registers feed the short-term store through attention, the short-term store feeds long-term memory through encoding, and retrieval works back the other way.",
      },
      {
        type: "paragraph",
        text: "The single most clinically useful idea in this lesson is that memory is reconstructive, not reproductive. You do not play back a recording; you rebuild an event from fragments, schemas and current emotional state every time you recall it. That is why memory changes with retelling, why two eyewitnesses can disagree sincerely, and why 'she is inconsistent, therefore she is lying' is not a valid inference. Reconstructive memory also explains the mechanism of effective psychotherapy: each retrieval is a window during which a memory can be re-encoded, which is the basis of reconsolidation-based treatments.",
      },

      { type: "heading", level: 2, text: "From perception to storage: the three stages" },
      {
        type: "table",
        headers: ["Stage", "Duration", "Capacity", "How information enters and leaves it"],
        rows: [
          ["Sensory register", "Iconic under half a second; echoic up to 2-3 seconds", "Effectively unlimited but decays almost immediately", "Enters automatically as stimulation; leaves either by decay or by selective attention"],
          ["Short-term store", "About 15-30 seconds without rehearsal", "George Miller's 7 plus or minus 2 items; modern estimates are closer to 4 chunks", "Enters via attention; leaves by decay or displacement, or by rehearsal into long-term store"],
          ["Long-term store", "From minutes to a lifetime", "Effectively unlimited", "Enters via elaborative encoding and consolidation; leaves by retrieval failure or by interference"],
        ],
      },
      {
        type: "paragraph",
        text: "Chunking is the operation that expands the short-term store: the number 1-9-4-8-1-9-8-9 is eight units, but read as two dates it is two. This is why digit span is tested forwards and backwards in the mental status examination — a normal forward digit span of six or more with a backward span of four or more indicates an intact short-term store and intact attention.",
      },
      {
        type: "paragraph",
        text: "Baddeley and Hitch replaced the unitary short-term store with the working-memory model, and the replacement has held up for four decades. It comprises the central executive (attention and control), the phonological loop (speech-based material, subvocally rehearsed), the visuospatial sketchpad (visual and spatial material), and, added in 2000, the episodic buffer (a limited store that integrates the two subsystems with long-term memory into a coherent episode). The evidence for separateness is clinical and experimental: articulatory suppression (repeating 'the the the') selectively disrupts the loop, and dual-task paradigms show that a verbal and a spatial span task can be performed together far better than two verbal or two spatial ones.",
      },

      { type: "heading", level: 2, text: "Long-term memory: more than one system" },
      {
        type: "table",
        headers: ["System", "Contents", "Key brain structures", "How it is tested clinically"],
        rows: [
          ["Episodic", "Personal events situated in time and place — the 'mental time travel' system", "Medial temporal lobe, especially hippocampus; also diencephalon via the mamillary bodies", "'What did you eat for breakfast? Where did you wake up yesterday?'"],
          ["Semantic", "Facts, word meanings, concepts without autobiographical context", "Anterior and inferolateral temporal cortex", "Vocabulary, naming, category fluency, general knowledge questions"],
          ["Procedural", "Motor and cognitive skills — riding a bicycle, touch typing", "Basal ganglia and cerebellum, with motor cortex", "Practise a task rather than recall a fact: copying a drawing, learning a sequence"],
          ["Priming and classical conditioning", "Non-conscious sensitivity to previous exposure", "Perirhinal cortex and neocortex for priming; cerebellum and amygdala for conditioning", "Word-stem completion tasks; the eyeblink and fear-conditioning paradigms"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Patient H.M., who had bilateral medial temporal resection for intractable epilepsy in 1953, lost the ability to form new episodic and semantic memories but could still learn a difficult motor task — and did not remember practising it. That dissociation established the existence of separable long-term systems, and it is the reason we ask patients to learn a new task rather than to recall a new fact when we want to test non-declarative function.",
      },

      { type: "heading", level: 2, text: "Encoding, storage and retrieval" },
      {
        type: "paragraph",
        text: "Craik and Lockhart's levels-of-processing account holds that depth of analysis at encoding, rather than intention or exposure time, predicts later recall. Judging a word for its font is shallow and is forgotten quickly; judging whether it rhymes with a target is deeper; generating a sentence that uses it is deeper still, and is remembered best. Elaborative encoding — connecting new material to what you already know — is the most robust manipulation known, which is why self-explanation beats re-reading.",
      },
      {
        type: "paragraph",
        text: "Storage and retrieval are separate operations, and their separation is clinically decisive. Consolidation converts a fragile hippocampal trace into a stable cortical one over days to years, and sleep — particularly slow-wave sleep with its hippocampal replay — performs much of that work. Children's early memories show a retrograde gradient in many amnesias: recent memories are lost first, older ones survived, because the older ones have been consolidated longer.",
      },
      {
        type: "table",
        headers: ["Failure", "Mechanism", "Clinical picture"],
        rows: [
          ["Encoding failure", "Material never got processed deeply enough to store", "The patient was not attending — this is inattention, not amnesia, and is the hallmark of delirium"],
          ["Storage failure", "The trace is lost or cannot be consolidated", "Anterograde amnesia after hippocampal damage; the early storage failure in Alzheimer's disease"],
          ["Retrieval failure", "The trace is present but cannot be accessed", "Tip-of-the-tongue states; retrieval improves with cues, recognition beats recall, and the feeling of knowing is preserved"],
        ],
      },
      {
        type: "paragraph",
        text: "Retrieval is cue-dependent, and the principle of encoding specificity (Tulving) says that recall is best when the retrieval cues match the encoding context. Godden and Baddeley's divers who learned a word list underwater recalled it best underwater. Mood congruence and state dependence follow the same logic: memory is better when the mood at recall matches the mood at encoding, which is one mechanism by which depressed patients preferentially retrieve unhappy memories and thereby keep the depression going.",
      },

      { type: "heading", level: 2, text: "Forgetting: five accounts" },
      {
        type: "table",
        headers: ["Account", "Claim", "Evidence", "Where it applies"],
        rows: [
          ["Trace decay", "The trace fades with the passage of time alone", "The Ebbinghaus forgetting curve is steep early then flattens; but time alone is difficult to isolate experimentally", "Sensory and short-term stores; plausible as a contributor in long-term forgetting but rarely sufficient"],
          ["Interference", "Other material disrupts access: retroactive (new disrupts old) and proactive (old disrupts new)", "Robust and easy to demonstrate with paired-associate learning", "Clinical pattern: names, appointments and word-finding, all disrupted by similar prior material"],
          ["Retrieval failure", "Absent or mismatched cues rather than lost storage", "Cued recall is better than free recall; recognition is better than recall", "Tip-of-the-tongue, blocked names, and the 'it will come to me later' phenomenon"],
          ["Motivated forgetting", "Unpleasant material is actively pushed out of awareness", "Contested; suppression is possible but the effects are limited and the concept is easily misused", "Explored in psychodynamic accounts; must never be used to explain discrepancies in forensic history"],
          ["Amnesia", "Pathological loss of memory from brain injury, disease, substances or dissociation", "Anterograde and retrograde amnesia; Korsakoff syndrome; transient global amnesia; dissociative amnesia", "The differential for any complaint of memory loss — and delirium must always be excluded first"],
        ],
      },
      {
        type: "definition",
        term: "Korsakoff syndrome",
        text: "The chronic amnesic state that follows Wernicke encephalopathy, itself caused by thiamine (vitamin B1) deficiency, usually in alcohol dependence or malnutrition. The acute triad is confusion, ataxia and ophthalmoplegia (only a minority show all three); the chronic state is severe anterograde amnesia with confabulation — the patient fills memory gaps with plausible, sincerely believed fabrications. It is treated by giving parenteral thiamine before any glucose load, and it is prevented rather than reversed.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Thiamine before glucose. A hypoglycaemic, malnourished patient is a real risk, but a glucose load in thiamine deficiency can precipitate Wernicke encephalopathy. Parenteral thiamine comes first in the acutely confused, alcohol-dependent or malnourished patient; oral thiamine is absorbed too poorly to count as acute treatment.",
      },
      {
        type: "paragraph",
        text: "In dementia the pattern differs again. In Alzheimer's disease the earliest deficit is episodic — recent events, conversations and appointments are lost while remote memory and procedural skill survive for years. In vascular dementia the picture is patchy and stepwise. In frontotemporal dementia early changes are behavioural and in language rather than episodic. Ask a patient with memory complaints what they had for yesterday's breakfast, which day it is, and what their address is: the last is overlearned semantic material and stays intact until late, so a patient who misses all three but knows their address reliably is describing an episodic, not a semantic, failure.",
      },

      { type: "heading", level: 2, text: "Thinking: concepts, reasoning and problem-solving" },
      {
        type: "paragraph",
        text: "Concepts are the categories by which thought is organised, and Rosch's work showed that people classify against prototypes rather than against defining lists of features: a robin is a 'better bird' than a penguin, faster and more reliably, even though both satisfy the definition. Graded membership explains why psychiatric categories are so hard to draw — a patient with five depressive symptoms and mild impairment sits at the edge of a prototype, and that is a feature of the domain, not a failure of the clinician.",
      },
      {
        type: "table",
        headers: ["Mode", "Direction", "Strength", "Psychiatric relevance"],
        rows: [
          ["Deductive reasoning", "From general premises to a specific, logically certain conclusion", "Valid or invalid in principle; Wason's selection task shows people systematically fail to seek disconfirming evidence", "Confirmation bias drives premature diagnostic closure and sustains delusional reasoning"],
          ["Inductive reasoning", "From specific instances to a general conclusion", "Probabilistic, never certain; the strength depends on sample size and representativeness", "Overgeneralisation from a single humiliation to 'everyone rejects me' is a classic cognitive distortion"],
          ["Analogical reasoning", "From a familiar domain to an unfamiliar one", "Depends on mapping structure rather than surface features", "Used deliberately in psychoeducation — the brain as a computer, or as a muscle"],
          ["Problem-solving", "From a current state to a goal state through operators", "Algorithms guarantee an answer; heuristics are fast and usually adequate", "Means-ends analysis is the basis of problem-solving therapy in depression"],
        ],
      },
      {
        type: "paragraph",
        text: "Heuristics are economy devices, not errors: they work because the environments that shaped them rewarded speed. They are also predictable in their failure modes. Availability judges likelihood by how easily examples come to mind — after a news story about suicide, clinicians over-estimate its prevalence. Representativeness judges likelihood by resemblance to a stereotype, ignoring base rates. Anchoring and adjustment locks onto an initial figure insufficiently — which is why a discharging clinician's handover disproportionately shapes your estimate of risk. Confirmation bias then seeks evidence that fits the anchor and discounts what contradicts it.",
      },
      {
        type: "table",
        headers: ["Cognitive distortion (Beck)", "The error", "How it sounds in the room"],
        rows: [
          ["All-or-nothing thinking", "Situations are categorised in absolute extremes with no middle", "'If I don't get full marks I have failed completely.'"],
          ["Catastrophising", "The worst possible outcome is treated as the most likely", "'This chest pain is obviously a heart attack.'"],
          ["Overgeneralisation", "A single negative event is taken as a never-ending pattern", "'I failed this exam, so I will fail everything.'"],
          ["Mental filtering", "Negative details are magnified and positives discounted", "The patient recalls only the one critical comment in an otherwise positive appraisal"],
          ["Mind-reading", "Others' thoughts are asserted without evidence", "'I know my consultant thinks I'm wasting their time.'"],
          ["Emotional reasoning", "Feeling is treated as evidence about reality", "'I feel useless, therefore I am useless.'"],
          ["'Should' statements", "Rigid internal rules whose breach produces guilt", "'I shouldn't need help with this.'"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "These distortions are not pathology. They are normal thinking under stress, amplified. Naming one with a patient is an intervention: 'I noticed we both just predicted the worst outcome as though it were the certain one' invites examination of the inference rather than debate about the conclusion.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Calling a memory lapse 'dementia'. In an acute change over hours or days with impaired attention and fluctuating consciousness, the diagnosis is delirium until proven otherwise, and delirium is a medical emergency. Delirium and dementia coexist commonly — dementia is the single strongest risk factor — so excluding delirium does not exclude the dementia that follows.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confabulating the patient is not the same as lying. A patient with Korsakoff syndrome produces confident fabrications because the retrieval signal is absent, not because they intend to deceive. Treating the fabrications as deliberate destroys the therapeutic relationship and misses the preventable cause.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating inconsistent recall as evidence of unreliability. Reconstructive memory changes across retrievals; every retelling is a fresh re-encoding. In forensic contexts this is decisive, and it is one reason police interviewing of complainants avoids repeated leading questioning.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient with recent-onset dementia is asked to copy a complex drawing and performs badly, but after practice improves markedly and remembers nothing of practising. What systems are impaired and what is preserved?",
        answer: "The episodic system is impaired — nothing of the practice session is retained. The preserved improvement in drawing performance, without any memory of practising, indicates intact non-declarative learning, supported by the basal ganglia and cerebellum rather than the hippocampus. This is the same dissociation H. M. showed.",
        explanation: "Testing procedural learning separately from recall distinguishes medial temporal damage from diffuse or striatal disease, and it is why occupational therapy can produce genuine functional gains in amnesic patients.",
      },
      {
        type: "question",
        prompt: "A student rewrites and highlight-turns their notes before an exam. What does levels-of-processing research predict relative to writing a sentence using each term, and why?",
        answer: "Highlighting and re-reading involve shallow, perceptual processing and produce weak, poorly cued recall. Generating a sentence that uses the term requires deep, elaborative semantic processing, which establishes many retrieval routes and produces far better recall. The difference is in the depth of encoding, not in the time spent.",
        explanation: "Generation, elaboration and retrieval practice are the three robust encoding manipulations. This is the single most transferable study-skills finding in psychology, and it applies to patient education too.",
      },
      {
        type: "question",
        prompt: "Two opposed processes are both described as interference. Which is which?",
        answer: "Retroactive interference is when newly learned material disrupts the recall of material learned earlier — the new telephone number makes the old one unreachable. Proactive interference is when previously learned material disrupts the learning or recall of something new — writing last year's date at the top of a January form.",
        explanation: "In both cases the item exists in storage but is blocked by competing material, which is why they are retrieval failures rather than storage failures, and why cueing helps.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Memory runs through sensory registers, a short-term store understood as working memory with separate verbal and visuospatial components, and multiple long-term systems — episodic, semantic, procedural and non-conscious — supported by different brain structures. Depth of encoding, consolidation and the match between encoding and retrieval cues determine whether material is accessible, and forgetting arises from decay, interference, retrieval failure or disease. Thinking uses prototypes rather than definitions, and reasoning falls into characteristic, predictable errors that become the cognitive distortions targeted in therapy.",
      },
      {
        type: "paragraph",
        text: "Next: intelligence and personality. You will see how ability is measured, with what caveats, and which trait and developmental frameworks describe the stable individual differences that shape vulnerability to disorder.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which finding best demonstrates a dissociated short-term store rather than a single unitary one?",
        options: [
          "Patients with medial temporal damage can learn a motor skill without remembering practising.",
          "Repeating 'the the the' aloud selectively disrupts memory for a spoken word list while leaving memory for a sequence of movements largely intact.",
          "Recall of a word list is better underwater for divers who learned it underwater.",
          "Amnesic patients confabulate to fill gaps in retrieval.",
        ],
        correctIndex: 1,
        explanation: "Articulatory suppression selectively loading and disrupting the phonological loop, with sparing of the visuospatial sketchpad, is the classic evidence for separable components within working memory. Option A dissociates declarative from non-declarative memory, C is encoding specificity, D is Korsakoff syndrome.",
      },
      {
        type: "mcq",
        stem: "A malnourished, alcohol-dependent patient is hypoglycaemic and confused. What is the correct order of treatment?",
        options: [
          "Glucose first, because hypoglycaemia is immediately lethal, with thiamine afterwards.",
          "Parenteral thiamine before or alongside glucose, because a glucose load in thiamine deficiency can precipitate Wernicke encephalopathy.",
          "Oral thiamine only, because parenteral thiamine risks anaphylaxis.",
          "Neither is urgent; fluid resuscitation alone is sufficient while the cause is investigated.",
        ],
        correctIndex: 1,
        explanation: "Parenteral thiamine comes first (Pabrinex); malnourished patients also need magnesium replacement, and hypomagnesaemia makes Wernicke refractory to thiamine. Oral thiamine is too poorly absorbed to count in the acute setting.",
      },
      {
        type: "mcq",
        stem: "Which sequence correctly describes the main brain structures supporting episodic, semantic and procedural long-term memory?",
        options: [
          "Episodic: medial temporal lobe; semantic: anterior and inferolateral temporal cortex; procedural: basal ganglia and cerebellum",
          "Episodic: basal ganglia; semantic: hippocampus; procedural: prefrontal cortex",
          "Episodic: cerebellum; semantic: parietal cortex; procedural: medial temporal lobe",
          "All three depend on the hippocampus, with no structural dissociation",
        ],
        correctIndex: 0,
        explanation: "Episodic memory depends on the medial temporal lobe, particularly the hippocampus; semantic memory on anterior and inferolateral temporal cortex; procedural memory on the basal ganglia and cerebellum. The dissociation is the reason amnesic patients can still acquire new skills.",
      },
      {
        type: "mcq",
        stem: "In Alzheimer's disease the earliest memory deficit typically affects which content?",
        options: [
          "Remote autobiographical memory from childhood",
          "Overlearned semantic facts such as the patient's own address",
          "Procedural skills such as using a knife and fork",
          "Recent episodic memories — conversations, appointments and events",
        ],
        correctIndex: 3,
        explanation: "Hippocampal degeneration impairs new episodic encoding first, so recent events are lost while remote autobiography, semantic knowledge and procedural skill are relatively preserved for years. Loss of address knowledge signals much later, diffuse disease.",
      },
      {
        type: "mcq",
        stem: "Which statement about ordinary forgetting is correct?",
        options: [
          "Retroactive interference is the disruption of new learning by previously learned material.",
          "Retrieval failure implies that the material was never encoded in the first place.",
          "Proactive interference is the disruption of earlier learning by material learned later.",
          "Absent cues rather than lost storage are sufficient to produce a failure of recall, and recognition is generally better than recall.",
        ],
        correctIndex: 3,
        explanation: "Options A and C are the two interference directions reversed. Availability of a memory is inferred from retrieval, so cue-dependent failure is a retrieval problem by definition, and the recognition-recall gap is the standard evidence for it.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 4 — Intelligence & personality (fully authored)
// ---------------------------------------------------------------------------
function lesson4(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define intelligence and describe the major psychometric, cognitive and multiple factor theories of it; calculate and interpret a deviation IQ and name the properties that make a test usable; explain what heritability does and does not mean, and what the Flynn effect demonstrates; describe the principal trait theories of personality, including the Big Five, alongside the psychodynamic, humanistic and social-cognitive accounts; and apply this to the assessment of intellectual disability and to the recognition of personality traits that shape vulnerability to disorder.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 3 (Memory and thinking). Working memory and processing speed are components of any measured intelligence test, and the psychometric ideas of reliability and validity rely on the memory and test-retest logic from that lesson.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Intelligence",
        text: "The capacity to learn from experience, adapt to new situations, reason abstractly and use knowledge deliberately. The word is a research construct inferred from performance under standardised conditions — it is a way of summarising the correlations between many tasks, not a biological entity located in the head.",
      },
      {
        type: "definition",
        term: "Personality",
        text: "The enduring patterns of thinking, feeling, behaving and relating to others that characterise a person across time and situation. It is inferred from behaviour, changes slowly after early adulthood, and is not synonymous with temperament (constitutional emotional style from infancy) or with personality disorder.",
      },
      {
        type: "paragraph",
        text: "Both constructs describe differences between people rather than deficits within a person, and both are used to predict, never to rank worth. Every measurement in this lesson carries the same warning: a standardised score describes performance under particular conditions with particular instruments, and the conditions are never neutral. A patient educated in a second language, with a hearing impairment, distracted by voices, in a ward with an open door, or disabled by depression cannot be assessed as though those conditions were absent.",
      },

      { type: "heading", level: 2, text: "The structure of intelligence" },
      {
        type: "table",
        headers: ["Theory", "Author and era", "Core claim", "Strength and limitation"],
        rows: [
          ["General intelligence, g", "Charles Spearman, 1904", "All cognitive tasks correlate positively because they share one general factor, supplemented by task-specific s factors", "The positive manifold between tasks is the most replicated finding in psychology; g does little to explain which processes differ"],
          ["Primary mental abilities", "Louis Thurstone, 1938", "Several correlated group factors (verbal comprehension, number, reasoning, spatial, memory, perceptual speed, word fluency) rather than one g", "Explains specific profiles; the factors remain correlated, so g reappears at a higher level"],
          ["Fluid and crystallised", "Raymond Cattell and John Horn", "Gf is novel reasoning; Gc is accumulated knowledge. Gf peaks in early adulthood and declines; Gc rises into late life", "Explains why older patients remain excellent at vocabulary and poor at novel matrices — a clinically essential distinction"],
          ["Multiple intelligences", "Howard Gardner, 1983", "Seven or more independent intelligences including musical, bodily-kinaesthetic, interpersonal and intrapersonal", "Persuasive in education; poorly supported by factor analysis, since most of these correlate and load on g"],
          ["Triarchic", "Robert Sternberg", "Analytical, creative and practical intelligence", "Useful critique of a purely academic construct; hard to measure psychometrically"],
          ["Three-stratum / CHC", "Carroll, later McGrew and Flanagan", "g at the apex, broad abilities (Gf, Gc, Gv, Gsm, Gs, Ga) in the middle, narrow abilities below", "The framework on which modern IQ batteries, including Wechsler, are built and reported"],
        ],
      },
      {
        type: "paragraph",
        text: "Practical summary: g and its broad abilities describe real and predictive differences, but the specific profile matters clinically. A patient with a spatial ability of the 5th percentile and a verbal ability of the 75th has an average IQ and a specific, remediable problem that the average conceals — and that profile will not be seen at all if you never break the score down.",
      },

      { type: "heading", level: 2, text: "Measuring intelligence" },
      {
        type: "paragraph",
        text: "The Wechsler scales (WAIS in adults, WISC in children) report a Full Scale IQ that is a deviation IQ: the test population is normed so that the mean is 100 with a standard deviation of 15, and the score is a statement about position in that distribution, not a count of correct answers. Because the distribution is normal, roughly two thirds of people score between 85 and 115, and roughly 2.3 percent deviate more than 30 points from the mean in either direction.",
      },
      {
        type: "table",
        headers: ["Property", "What it means", "Why the examiner cares", "How it fails in practice"],
        rows: [
          ["Standardisation", "Uniform instructions, materials and conditions; a reference group provides the norms", "Any departure changes the score's meaning", "Testing in a foreign language, with a deaf patient unaided, or with a mimicking respondent"],
          ["Reliability", "Consistency: test-retest over weeks, internal consistency, and inter-rater agreement", "A score that changes between two unchanged administrations cannot be interpreted", "Practice effects, retrieval practice, retesting in a different mood state"],
          ["Validity", "Whether the test measures what it claims: content, criterion and construct validity", "Without it reliability is measuring something irrelevant, reliably", "Culture-loaded vocabulary items; tests of 'achievement' presented as tests of ability"],
          ["Sensitivity and specificity", "Detection of cases and exclusion of non-cases, which trade against each other", "Screening scales are false-positive machines by design and require confirmation", "The PHQ-9 administered and treated as a diagnosis"],
          ["Floor and ceiling effects", "Whether the test can detect very low and very high ability", "A normal-range patient scoring at the floor is a measurement problem, not a patient problem", "Using an adult scale on a child or a dementia patient without a lower-bound form"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Raven's Progressive Matrices was designed as a culture-reduced test of fluid reasoning: non-verbal, minimal instruction, no vocabulary requirement. It is the best available approximation to a culture-fair test, and it remains an approximation — motivation, schooling and familiarity with test formats still affect scores, so 'culture-reduced' is a statement about reducing, not eliminating, bias.",
      },
      {
        type: "paragraph",
        text: "Heritability is the proportion of variance in a trait attributable to genetic differences within a specified population in a specified environment. It is a population statistic, not a statement about any individual, and it rises with environmental equality: as schooling becomes universal and nutrition improves, the remaining differences become more genetic. Heritability of measured intelligence is moderate to high in adulthood and increases with age, which puzzles people who expect genes to matter less as experience accumulates — the mechanism is that people increasingly select environments that match their genes.",
      },
      {
        type: "paragraph",
        text: "The Flynn effect is the steady rise of raw scores on IQ tests through the twentieth century in many countries, roughly three points per decade, with some countries reporting declines since the 1990s. Its significance is that the rate is far too fast for genetic change: it must reflect environmental change — nutrition, infectious disease, schooling, test familiarity, and the cognitive demands of modern life. Flynn himself argued that this demonstrates that IQ is not a measure of inborn fixed capacity.",
      },

      { type: "heading", level: 2, text: "Intellectual disability: diagnosis is functional, not a number" },
      {
        type: "paragraph",
        text: "Current definitions (DSM-5, AAIDD) require deficits in both intellectual functioning and in adaptive functioning — conceptual, social and practical skills of everyday life — with onset in the developmental period. Severity is specified from the adaptive profile, and a score of 70 or below on a well-standardised instrument is a necessary but not sufficient part of the judgement.",
      },
      {
        type: "table",
        headers: ["Severity", "Approximate IQ range", "Adaptive picture", "Support implications"],
        rows: [
          ["Mild", "50-69", "Academics to about primary level; independent living possible with support; social judgement immature", "Support with finances, decision-making and transitions; this is the most common group and the most under-recognised"],
          ["Moderate", "35-49", "Academics to early primary; supported work; independent living with substantial support", "Supervised work settings, structured daily living, support with safety"],
          ["Severe", "20-34", "Limited communication and conceptual skills; continuous supervision", "High levels of hands-on support; movement and communication aids assessed early"],
          ["Profound", "Under 20", "Very limited communication; constant support for all daily care", "Specialist residential care; sensory impairment is often coexisting and easily overlooked"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Never use an IQ score as a label. Say 'a score of 65 on the WAIS-IV at age 9' — a measurement with a date and an instrument — rather than 'a mild retardate'. 'Retardation' and 'borderline' as nouns are obsolete, and 'low functioning' is vague while carrying stigma. Diagnose intellectual disability on adaptive function, and remember that depression, ADHD, autism, hearing impairment and a poor testing environment can all drag a single score down.",
      },

      { type: "heading", level: 2, text: "Personality: trait theories" },
      {
        type: "table",
        headers: ["Approach", "Proponents", "Structure", "Contribution"],
        rows: [
          ["Lexical and trait", "Gordon Allport; Raymond Cattell (16PF)", "Personality described by the trait words of ordinary language", "The catalogue of traits; trait terms are how clinicians describe patients in handovers"],
          ["Biological trait", "Hans Eysenck", "Three dimensions — extraversion (cortical arousal), neuroticism (limbic lability), psychoticism — with psychophysiological grounding", "Predicts vulnerability to disorder: high neuroticism to anxiety and depression, low extraversion to withdrawal, high psychoticism to antisocial conduct"],
          ["Five-factor model", "Costa and McCrae", "Five broad factors: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism — with six facets each", "The dominant empirical model; robust across cultures and languages, moderately heritable, and stable in adulthood"],
          ["Type theory", "Myers-Briggs and similar", "Four dichotomies producing 16 types", "Popular in workplaces; test-retest reliability and predictive validity are poor, and it should not be used for clinical or occupational decisions"],
        ],
      },
      {
        type: "paragraph",
        text: "The Big Five is the best-evidenced description of normal personality variation, and its clinical value is predictive: high neuroticism is the strongest trait predictor of anxiety and depressive disorders, low agreeableness and low conscientiousness strongly predict substance misuse and antisocial outcomes, and conscientiousness predicts adherence and longevity. Two qualifications keep it honest. Personality is not destiny — traits are one of several interacting influences — and the model describes dimensions on which everyone sits, so high neuroticism is a risk factor, not a diagnosis.",
      },

      { type: "heading", level: 2, text: "Personality: psychodynamic, humanistic and social-cognitive accounts" },
      {
        type: "table",
        headers: ["Approach", "Central claim", "Key structures or stages", "Enduring clinical use"],
        rows: [
          ["Psychoanalytic (Freud)", "Behaviour is driven by unconscious conflict between impulse and defence, formed in childhood", "Id (instinct), ego (reality-testing and defence), superego (conscience and ideal); psychosexual stages oral, anal, phallic, latency, genital", "The concept of defence mechanisms remains indispensable: repression, projection, displacement, sublimation, reaction formation, rationalisation, denial, regression"],
          ["Psychosocial (Erikson)", "Development proceeds through eight psychosocial crises across the whole lifespan", "Trust versus mistrust, autonomy versus shame, initiative versus guilt, industry versus inferiority, identity versus role confusion, intimacy versus isolation, generativity versus stagnation, integrity versus despair", "The framework for thinking about adolescent identity, midlife crisis and the tasks of ageing"],
          ["Humanistic (Rogers, Maslow)", "People have an innate actualising tendency and become disordered when conditions of worth override their own valuing", "Self-concept, incongruence, unconditional positive regard, the fully functioning person", "The relational conditions of effective therapy — empathy, warmth and genuineness — predict outcome across modalities"],
          ["Social-cognitive (Bandura, Rotter, Mischel)", "Behaviour arises from person, environment and behaviour interacting; cognition mediates both", "Self-efficacy, reciprocal determinism, locus of control, if-then behavioural signatures", "The basis of self-management, relapse-prevention and CBT's emphasis on efficacy expectations"],
        ],
      },
      {
        type: "paragraph",
        text: "Temperament completes the picture. Thomas and Chess's New York Longitudinal Study identified easy, difficult and slow-to-warm patterns, and the dimension most relevant to psychiatry is behavioural inhibition — the tendency to withdraw and be vigilant toward novelty — which predicts later social anxiety with moderate strength. Inhibition is observable in infancy, is heritable, and is one of the clearest examples of a personality-relevant disposition present before any learning could have occurred.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Saying 'heritability is 60 percent' and meaning that 60 percent of a person's intelligence came from their parents. It means 60 percent of the variance observed in that population in that environment is associated with genetic differences between individuals. It says nothing about any one person, and the figure changes when the environment changes.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Treating a full-scale IQ as an explanation rather than a measurement. The IQ does not cause anything; it summarises correlations between tasks. If you find yourself explaining a patient's poverty of speech by their IQ, you have inverted the direction of inference.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using the Myers-Briggs type inventory as if it were a clinical instrument. It has poor test-retest reliability and no demonstrated predictive validity for occupational or clinical outcomes; it is a culture-fair-sounding, psychometrically weak questionnaire, and clinical decisions about capacity or risk must not rest on it.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 30-year-old with a lifelong history of reading difficulty scores at the 20th percentile on block design and vocabulary but at the 70th on matrix reasoning. How should this be interpreted?",
        answer: "The profile is uneven rather than uniformly low: matrix reasoning (fluid reasoning, a relatively culture-reduced task) is much stronger than the knowledge-loaded subtests of vocabulary and block design. This pattern is compatible with a specific developmental disorder of academic skills superimposed on adequate reasoning ability, and it should prompt a developmental history, hearing and vision assessment, and educational records, rather than a global 'low intelligence' conclusion.",
        explanation: "Fluid-loading subtests require less accumulated schooling and vocabulary, so a verbal-knowledge deficit depresses crystallised subtests disproportionately. The index-level breakdown is what disambiguates a specific learning difficulty from a generalised one.",
      },
      {
        type: "question",
        prompt: "How does a high score on the neuroticism dimension differ from borderline personality organisation, given that both predict affective instability?",
        answer: "High neuroticism is a dimension on which everyone sits: it describes a tendency to experience negative emotion readily, is moderately heritable, and is stable from early adulthood. Borderline personality organisation is a disorder-level construct diagnosed by a sustained pattern of unstable relationships and self-image, impulsivity, marked abandonment fears, recurrent self-harm and transient paranoid or dissociative symptoms, with an onset traceable to adolescence. A person can score high on neuroticism without any personality disorder, and the distinction determines whether what is needed is routine psychological support or a structured personality-disorder pathway.",
        explanation: "Trait dimensions describe proneness; personality disorders describe pattern and severity. This is the dimensional-then-threshold structure on which ICD-11's reappraisal of personality disorder is based, and it is why 'they are high in neuroticism' is not a formulation.",
      },
      {
        type: "question",
        prompt: "Why is adaptive behaviour required before a diagnosis of intellectual disability can be made from an IQ score alone?",
        answer: "Because an IQ score is a measurement of performance under test conditions — vulnerable to educational deprivation, sensory impairment, language of testing, motivation, anxiety and cooperation — while adaptive behaviour is what determines the person's need for support in daily life. The diagnosis exists to identify people who need support, so the construct it must capture is functional, not numerical.",
        explanation: "Diagnosis on score alone produces both over-identification of deprived but capable people and under-identification of people with a score in the low-normal range who nevertheless need substantial daily support.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Intelligence is a construct summarising real, predictive correlations between cognitive tasks, with a general factor, broad fluid and crystallised abilities, and narrow task-specific skills; deviation IQs locate a person in a normal distribution with mean 100 and standard deviation 15, and are only as meaningful as the standardisation, reliability, validity and fairness of the instrument. Personality is described best by trait dimensions such as the Big Five, enriched by psychodynamic, psychosocial and social-cognitive accounts. Both constructs describe variation between people, not a hierarchy of worth.",
      },
      {
        type: "paragraph",
        text: "Next: the foundations of psychiatry. The behavioural sciences end here and clinical psychiatry begins — with classification, the mental status examination, and the interview that produces the diagnosis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "If a Wechsler Full Scale IQ is a deviation IQ with a mean of 100 and a standard deviation of 15, approximately what proportion of the population scores between 85 and 115?",
        options: ["About 5 percent", "About 34 percent", "About 68 percent", "About 95 percent"],
        correctIndex: 2,
        explanation: "Plus or minus one standard deviation around the mean of a normal distribution contains about 68 percent; plus or minus two contains about 95 percent. This is why an IQ of 90 is unremarkable rather than deficient, and why two points of difference means nothing.",
      },
      {
        type: "mcq",
        stem: "Which statement about crystallised (Gc) and fluid (Gf) intelligence is correct?",
        options: [
          "Both peak in the late teens and decline together thereafter.",
          "Gc reflects accumulated knowledge and rises or stays high with age; Gf reflects novel reasoning and peaks in early adulthood before declining.",
          "Gf is measured by vocabulary and comprehension subtests; Gc by matrix reasoning.",
          "Neither changes across the lifespan because both are fixed at birth.",
        ],
        correctIndex: 1,
        explanation: "Vocabulary, comprehension and similarities load on crystallised ability, which tends to increase into late life. Matrix reasoning and block design load on fluid ability, which peaks in early adulthood. This explains the familiar cross-sectional profile of the older patient.",
      },
      {
        type: "mcq",
        stem: "Which finding most directly supports the conclusion that environment contributes substantially to measured intelligence scores?",
        options: [
          "Intelligence test scores correlate strongly between identical twins reared apart.",
          "Adoption studies show adopted children resemble their biological parents more than their adoptive parents in IQ.",
          "Raw scores on intelligence tests rose by about three points per decade in many countries during the twentieth century.",
          "The correlation between scores on diverse cognitive tasks is positive across populations.",
        ],
        correctIndex: 2,
        explanation: "The Flynn effect is far too rapid to be genetic and is attributed to environmental change, including nutrition, schooling, disease reduction and test familiarity. Twin and adoption designs are used to estimate genetic contributions, and the positive manifold is evidence for g.",
      },
      {
        type: "mcq",
        stem: "Which Big Five trait shows the strongest and most replicated association with vulnerability to anxiety and depressive disorders?",
        options: ["Openness to experience", "Conscientiousness", "Extraversion", "Neuroticism"],
        correctIndex: 3,
        explanation: "High neuroticism — negative emotionality, including the tendency to experience anxiety, low mood and irritability — is the strongest trait predictor of anxiety and depressive disorders and also predicts poorer recovery. Conscientiousness predicts adherence, and low conscientiousness predicts substance misuse.",
      },
      {
        type: "mcq",
        stem: "A patient scores 67 on an intelligence test but manages her own medication, works in a supermarket, and maintains a bank account. What is the correct conclusion?",
        options: [
          "Intellectual disability, because the score is below 70.",
          "No intellectual disability can be diagnosed, because the score alone is insufficient and the adaptive profile must be assessed and must show deficits.",
          "A malingered score, because the adaptive functioning is too good.",
          "Borderline intelligence, so no further assessment is required.",
        ],
        correctIndex: 1,
        explanation: "Intellectual disability requires deficits in both intellectual functioning and adaptive functioning. A single score is also affected by test conditions, mood, education and language, so the adaptive profile — conceptual, social and practical skills — is decisive.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 5 — Classification & assessment (fully authored)
// ---------------------------------------------------------------------------
function lesson5(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: explain why psychiatry classifies, and compare the purposes and structure of ICD-11 and DSM-5; describe the strengths and weaknesses of categorical classification and the dimensional alternative; take a psychiatric history in a structured order; perform and record a mental status examination across all its domains, including thought form and thought content; distinguish insight, judgement and mental capacity, and describe how each is assessed and documented; and describe the screening instruments used routinely in practice.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "None. This is the entry point to clinical psychiatry. The behavioural sciences lessons (1-4) supply the vocabulary of motivation, emotion, conditioning and memory used throughout, but nothing in this lesson depends on any of them.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Nosology",
        text: "The branch of medicine concerned with the systematic naming and classification of diseases. Psychiatric nosology is contested in a way that, say, the classification of fractures is not, because the disorders it describes are syndromes — clusters of symptoms with a characteristic course — rather than pathologies identified by a test.",
      },
      {
        type: "paragraph",
        text: "Classification does three jobs in psychiatry, and it is worth keeping them apart. It is a communication device: 'F20 schizophrenia' conveys a great deal to a psychiatrist in another country. It is a research device: it defines the population a trial actually enrolled. And it is a management device: it maps onto treatment selection and to the legal frameworks of detention. The difficulty is that no psychiatric diagnosis has a confirmatory test, so a category is a bet about natural boundaries that biology has not yet confirmed, and that has practical consequences — a misdiagnosis is not merely a labelling error but a route to the wrong treatment.",
      },

      { type: "heading", level: 2, text: "ICD and DSM: the two classifications" },
      {
        type: "table",
        headers: ["Feature", "ICD-11 (and ICD-10)", "DSM-5 (and DSM-5-TR)"],
        rows: [
          ["Publisher", "World Health Organization", "American Psychiatric Association"],
          ["Legal and service use", "The coding system of member states' health statistics, of death certification and of most national services including the NHS and the Indian health system", "Dominant in North American research, insurance and practice"],
          ["Structure of classification", "Chapters by disorder group; mental, behavioural and neurodevelopmental disorders occupy a dedicated chapter with F-codes", "Also chapter-based, but with explicit criteria sets designed for operationalised research use"],
          ["Diagnostic culture", "Statement of clinical practice; often deliberately less detailed about criteria sets and duration thresholds, allowing clinical judgement", "Explicit polythetic criteria (a specified number from a list, for a specified duration, plus exclusions)"],
          ["Axes", "DSM-IV used a multiaxial system (Axis I clinical, II personality, III medical, IV psychosocial, V functioning); ICD-10 also used a multiaxial scheme for child and adolescent psychiatry", "DSM-5 removed the multiaxial system and merged most of it into the diagnostic code plus separate measures of functioning"],
          ["Frequency of revision", "Decadal, deliberately conservative", "Revised in more frequent iterative releases in practice"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The practical rule: know ICD-11 descriptions in order to practise anywhere in the world, and know DSM-5 criteria sets in order to read the literature. Many trial results cannot be applied to ICD-defined patients, and the two systems do not draw every boundary in the same place — for example, schizophrenia in DSM-5 requires six months of continuous disturbance, whereas ICD-10 required one month.",
      },
      {
        type: "paragraph",
        text: "Categorical versus dimensional is the central unresolved argument. Categorical systems give categories: present or absent, with a threshold. Dimensional systems give scores along continua, on which everyone sits somewhere. The categorical approach is easy to communicate, drives clinical decisions and research sampling, and matches how law and entitlement work. Its cost is high comorbidity and a population of sub-threshold cases who are disabled but undiagnosable. The dimensional approach captures that variation honestly, but thresholds are unavoidable in practice — a treatment decision requires a cut point — and dimensional systems are harder to communicate at handover.",
      },
      {
        type: "paragraph",
        text: "Emil Kraepelin's late-nineteenth-century separation of dementia praecox from manic-depressive illness is the historical root of the current categories, and his method — grouping disorders by course and outcome rather than by presenting symptom — remains the thinking behind the schizophrenia-bipolar divide. Case recognition is helped by two of the criteria a good category should meet: reliability (would two clinicians agree?) and validity (does the category predict anything about cause, treatment or outcome?). Most psychiatric categories have acceptable reliability and modest validity.",
      },

      { type: "heading", level: 2, text: "The psychiatric history" },
      {
        type: "paragraph",
        text: "The history is not a form to fill in. Its purpose is to establish what has happened, in what order, with what consequence, in the patient's own words, with enough collateral to check the account. A defensible order follows.",
      },
      {
        type: "table",
        headers: ["Section", "What it establishes", "Practical notes"],
        rows: [
          ["Referral and reason for contact", "Why the patient is here now — self, family, police, other services", "Quote the source: 'his sister brought him; he said there was nothing wrong'"],
          ["Presenting complaint", "The patient's own words, not your translation", "Record verbatim, in quotation marks"],
          ["History of presenting illness", "Onset, duration, course, precipitants, severity, functional consequence, treatment already tried, previous episodes", "Establish the time scale — frequency, change from baseline, what was happening in the patient's life"],
          ["Past psychiatric history", "Previous episodes, admissions, self-harm, previous diagnoses and medications", "Prior attempts and their response guide the next treatment choice"],
          ["Past medical history and medications", "Medical illness, surgery, head injury, epilepsy, currently prescribed and over-the-counter drugs", "Steroids, L-dopa, dopamine agonists, interferon and thyroid disease cause psychiatric presentations"],
          ["Family history", "Affective, psychotic, substance, suicide, neurodevelopmental, dementia", "Draw a genogram; ask about suicide explicitly, not only about diagnoses"],
          ["Personal and developmental history", "Pregnancy and birth, developmental milestones, education, employment, relationships, sexual history, children", "Childhood adversity is best asked about once the relationship is established and framed as relevant to current symptoms"],
          ["Substance history", "Alcohol, tobacco, cannabis, stimulants, opioids, benzodiazepines, new psychoactive substances", "Quantify: units per day, days per week; AUDIT rather than impression"],
          ["Forensic history", "Convictions, violence, current charges or bail conditions", "Affects risk formulation and admission decisions"],
          ["Social circumstances", "Housing, income, debt, immigration status, carers, social support, dependants", "A housing dispute or an asylum decision is frequently the operative change in an exacerbation"],
          ["Premorbid personality", "The person's standing pattern of thinking, feeling and relating before this episode", "Ask a relative or old friend, not only the patient"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "A history taken through a family member, a telephone interpreter or an intermediary tool is not inferior, but it is different. Document the interpreter's number, the mode (in person, video, telephone), and the patient's preferred language. Never use the patient's child as an interpreter for a psychiatric history.",
      },

      { type: "heading", level: 2, text: "The mental status examination" },
      {
        type: "paragraph",
        text: "The MSE is the state of the mind at the time of interview: a picture with a date, not a diagnosis. It is built from observation and directed questioning, in a fixed order so that nothing is omitted.",
      },
      {
        type: "table",
        headers: ["Domain", "What to observe or ask", "Descriptive vocabulary"],
        rows: [
          ["Appearance and behaviour", "Grooming, hygiene, clothing, eye contact, posture, movements, rapport, cooperation, agitation or retardation", "Kempt or neglected; self-neglecting; restless; retarded; guarded or open; engaged or withdrawn"],
          ["Speech", "Rate, rhythm, volume, quantity, dysarthria, dysphasia", "Pressured, retarded, poverty of speech, blocking, dysarthric, incoherent"],
          ["Mood", "The patient's subjective report over weeks", "Depressed, anxious, elated, irritable, empty, numb"],
          ["Affect", "The objective expression observed in the room: range, intensity, congruence with mood, reactivity", "Preserved or constricted; blunted or flat; labile; incongruous; reactive"],
          ["Thought form", "How thoughts are linked and expressed: speed, coherence, goal-direction", "Pressure of thought, flight of ideas, derailment, tangentiality, circumstantiality, loosening of associations, neologisms, clang associations, blocking, word salad"],
          ["Thought content", "What the patient is thinking about: beliefs, preoccupations, concerns", "Delusional or non-delusional; overvalued ideas; obsessions and compulsions; suicidal ideation; hopelessness; guilt"],
          ["Perception", "Hallucinations, pseudohallucinations, illusions, depersonalisation and derealisation", "Auditory third person, running commentary, visual, somatic, olfactory — with insight into reality status"],
          ["Cognition", "Orientation, attention, concentration, memory, language, praxis, visuospatial construction", "Delirium is an attention and arousal failure first; test attention by months backwards or digit span backwards"],
          ["Insight", "Does the patient recognise the experiences as abnormal, attribute them to illness, and accept treatment?", "Insight is graded — full, partial or absent — on each of those three components independently"],
          ["Judgement", "Ability to make reasonable decisions about own safety and conduct", "Impaired judgement is separate from impaired capacity, and from cognitive impairment"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Insight is not a yes-or-no. It has three components — recognising that something is happening, attributing it to illness, and accepting treatment — and they can dissociate. A patient may accept that voices are abnormal while insisting they are spiritual gifts, and may accept a tablet while denying any illness. Record each component separately; the third is the one that matters for admission.",
      },
      {
        type: "paragraph",
        text: "Mental capacity is a legal concept, separate from insight and from cognition. A patient has capacity for a decision when they can understand the relevant information, retain it long enough to weigh it, use and weigh that information in the reasoning, and communicate the decision. It is decision-specific and time-specific: a patient may have capacity to refuse a blood test but not to refuse admission, and capacity may return next week. Where capacity is absent and there is no valid advance refusal, a decision is made in the patient's best interests or by an appointed substitute decision-maker.",
      },

      { type: "heading", level: 2, text: "Risk assessment: a formulation, not a score" },
      {
        type: "paragraph",
        text: "Risk assessment combines specific and generic factors into a judgement about a specific patient over a specific period, and it is used to structure care, not to predict acts of violence — prediction of rare events with structured tools is no more than chance in most populations. The two questions to answer are: what is the risk (suicide, self-harm, violence, neglect, exploitation, absconding), and to whom is there a risk.",
      },
      {
        type: "table",
        headers: ["Domain", "Static historical factors", "Dynamic clinical factors"],
        rows: [
          ["Suicide", "Previous attempt (the strongest single factor), family history of suicide, male sex, older age, chronic pain or illness", "Current depressive episode, hopelessness, insomnia, recent loss, intoxication, access to means, planned intent, isolation"],
          ["Self-harm", "Repetitive self-harm history, childhood adversity, personality disorder diagnosis", "Current distress, substance use, relationship breakdown, discharge planning"],
          ["Violence to others", "Previous violence, male sex, young age, substance misuse, early conduct disorder", "Current psychosis with persecutory delusions naming a person, command hallucinations, agitation, intoxication, access to weapons"],
          ["Neglect and exploitation", "Dementia, intellectual disability, isolation, prior victimisation", "Self-neglect, failing discharge supports, financial control by another"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ask directly and specifically. 'I need to ask whether you have had thoughts of harming yourself' is not a suggestion, and patients expect the question. Ask about ideation, then plan, then intent, then means, then protective factors, and record the answers in the patient's words. A question never asked is a risk never assessed, and a half-asked question produces an answer you cannot interpret.",
      },

      { type: "heading", level: 2, text: "Screening instruments" },
      {
        type: "table",
        headers: ["Instrument", "Target", "Use and caveat"],
        rows: [
          ["PHQ-2, then PHQ-9", "Depression", "Two screening questions followed by nine severity items; 5, 10, 15 and 20 mark mild, moderate, moderately severe and severe. Item 9 flags suicidality and must be followed by direct assessment"],
          ["GAD-7", "Anxiety", "Seven items; a score of 10 or more is the usual cut-off, and it performs poorly at separating anxiety from depression"],
          ["AUDIT", "Hazardous and harmful alcohol use", "Ten items; a score of 8 or more in men and 6 or more in women is the usual screen-positive; a brief version, AUDIT-C, is three items"],
          ["CAGE and CAGE-AID", "Alcohol, and with drug use", "Four questions; two or more positive is a positive screen — quick for bedside use, insensitive to drinking pattern"],
          ["HoNOS and HoNOSCA", "Clinical severity in services; child and adolescent version", "Twelve-rated-item clinician scale for tracking change; not diagnostic"],
          ["PANSS and BPRS", "Psychotic symptoms in research and follow-up", "Interview-based severity measures; indispensable in trials and the longer-term monitoring of patients, not for diagnosis"],
          ["Y-BOCS", "Obsessive-compulsive symptom severity", "Ten items; the standard for severity tracking and for defining response in treatment studies"],
        ],
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Recording a thought disorder as 'confused'. Thought form is assessed from the patient's speech, judged against the background of their usual speech. A patient who is slow because of depression, retarded by antipsychotic side effects, dysarthric from a stroke, or recoiling from the question is not showing formal thought disorder, and each of those has a different treatment.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Using a symptom as a noun for a person. Write 'a patient experiencing auditory hallucinations', not 'a hallucinator' or 'an auditory hallucinator'. Categorical shorthand does real damage: it predicts willingness to engage, to employ, and to avoid discrediting the person — and it is precisely the linguistic habit that stigma research measures.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Writing 'insight impaired' as a conclusion. It is a description of three separable components, and it can change in weeks with treatment. A patient who refused admission on Tuesday may be asking for help on Thursday, and the note must make clear which components were impaired when.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 78-year-old is admitted overnight with inattention, fluctuating consciousness, poor memory and visual misidentifications. How should the mental status examination be interpreted?",
        answer: "The dominant feature is impaired attention and a fluctuating level of consciousness, which places delirium — an acute disturbance of attention and arousal — at the head of the differential, and delirium is a medical emergency with meningitis, urinary infection, medication, hyponatraemia and alcohol or benzodiazepine withdrawal all as possible precipitants. Dementia is not diagnosed at the same time as a delirium: cognitive testing is deferred until the delirium resolves, though dementia is the strongest risk factor for delirium and often underlies it.",
        explanation: "The bedside discriminator is attention: delirium is an attention and arousal disorder with an acute course, dementia is a chronic, progressive amnestic and multi-domain disorder with normal arousal until late. Doing both is the classic double-diagnosis error.",
      },
      {
        type: "question",
        prompt: "Which four abilities define mental capacity for a specific decision?",
        answer: "The ability to understand the relevant information, to retain it long enough to weigh it, to use and weigh that information in reaching a decision, and to communicate the decision — by any means, including gesture, writing or an interpreter.",
        explanation: "Capacity is decision-specific, time-specific and assumption-neutral: you start from the presumption of capacity and assess each decision separately. An unwise decision does not make an incapacitated one.",
      },
      {
        type: "question",
        prompt: "Why should a screening questionnaire never be recorded as a psychiatric diagnosis?",
        answer: "Because a questionnaire quantifies symptom frequency and severity; it does not include differential diagnosis, medical exclusion, course or functional impairment, and it is vulnerable to day-to-day mood, to malingering, to over-reporting and to language and education. A PHQ-9 of 15 at a screening clinic is a flag for a full assessment, not a diagnosis of a major depressive episode.",
        explanation: "Sensitivity is bought with specificity: the tool is built to over-identify, and the positive cases still need history, examination and the differential.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Classification exists to communicate, to select treatment and to research, and it is realised in two systems — the WHO's ICD-11 and the APA's DSM-5 — with different purposes and different boundaries. The psychiatric assessment combines a structured history with a mental status examination whose domains are separately recorded, and it closes with risk formulated from static and dynamic factors. Screening instruments quantify severity; they do not make diagnoses.",
      },
      {
        type: "paragraph",
        text: "Next: aetiology and the biopsychosocial model. You will see how genes, brains, minds and social worlds combine in ways that no single level of explanation captures — and why that structure is the justification for a psychiatric formulation rather than a bare diagnosis.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Why does psychiatry need two major classifications, ICD-11 and DSM-5, rather than one?",
        options: [
          "ICD-11 is used in clinical practice and DSM-5 is used in North American research, and they draw some boundaries differently.",
          "DSM-5 is the standard for death certification in every country and ICD-11 for insurance purposes.",
          "ICD-11 describes disorders with explicit criteria sets while DSM-5 gives only brief clinical descriptions.",
          "DSM-5 is more reliable and every ICD-11 category has a DSM-5 counterpart with identical criteria.",
        ],
        correctIndex: 0,
        explanation: "ICD-11 is the WHO system used for health statistics, coding and legal frameworks worldwide, while DSM-5 is the APA system that dominates North American research and practice. It is DSM-5 that provides the explicit operationalised criteria sets, and the criteria frequently differ.",
      },
      {
        type: "mcq",
        stem: "Which of the following is most characteristic of formal thought disorder rather than dysarthria?",
        options: [
          "Slurred but coherent speech with impaired tongue movement",
          "Speech that slides off one idea onto another with no necessary logical link",
          "Monosyllabic speech with long response latency",
          "A stammer with visible facial contraction",
        ],
        correctIndex: 1,
        explanation: "Thought form concerns the linkage of ideas — derailment and loosening of associations are disorders of that linkage. Options A and D describe a motor speech disorder and option C retardation, both of which are disorders of production rather than of the structure of thought.",
      },
      {
        type: "mcq",
        stem: "A patient is asked what day it is, to count backwards from twenty, and to name three objects after five minutes. She fails the second task only. What does this pattern indicate?",
        options: [
          "Pure amnestic syndrome — the memory failure is the key finding.",
          "Impaired attention and concentration, which is the earliest and most sensitive marker of delirium.",
          "Dementia of Alzheimer type with visuospatial impairment.",
          "Normal ageing, given that attention always declines with age.",
        ],
        correctIndex: 1,
        explanation: "Counting backwards loads attention and working memory; orientation and delayed recall are relatively preserved in mild impairment. Attention is the faculty lost first in delirium, and in an acute presentation delirium must be excluded before dementia is diagnosed.",
      },
      {
        type: "mcq",
        stem: "Which statement about insight, judgement and capacity is correct?",
        options: [
          "Impaired insight implies impaired capacity, and impaired capacity implies impaired insight.",
          "Capacity is decision-specific and time-specific, while insight has three separately assessable components.",
          "All three are synonyms for the same construct differing only in degree.",
          "A patient who makes an unwise decision has, by definition, impaired capacity.",
        ],
        correctIndex: 1,
        explanation: "Insight is graded on recognition, attribution and acceptance of treatment; judgement is the ability to make reasonable decisions about safety; capacity is legal, specific to the decision and the time, and is presumed until shown to be absent for that decision.",
      },
      {
        type: "mcq",
        stem: "Which pair is the best-known brief alcohol screening tools, one using four questions and the other ten?",
        options: [
          "CAGE and AUDIT",
          "PHQ-9 and HoNOS",
          "PANSS and Y-BOCS",
          "CIWA-Ar and SADQ",
        ],
        correctIndex: 0,
        explanation: "CAGE is a four-question screen for alcohol dependence, and AUDIT is the ten-item WHO test that identifies the full range from hazardous use to dependence. PHQ-9 and HoNOS are severity measures, PANSS and Y-BOCS are psychopathology and OCD severity, and CIWA-Ar and SADQ assess withdrawal and severity in existing dependence.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 6 — Aetiology & the biopsychosocial model (fully authored)
// ---------------------------------------------------------------------------
function lesson6(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: state the biopsychosocial model and explain what it adds to a biological account; explain the stress-vulnerability (diathesis-stress) framework and how it generates testable predictions; describe the evidence from twin, adoption and genome-wide association studies and what heritability does and does not mean; outline the major neurobiological hypotheses for depression, psychosis and anxiety; describe the psychological and social contributions, including conditioning, cognitive schema, attachment, life events, poverty and social defeat; and construct a multi-level formulation for a patient rather than reducing them to a diagnosis.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 5 (Classification and assessment). You need the idea of a syndrome, and the distinction between factors that predispose, precipitate and perpetuate, before the causal claims in this lesson can be read carefully.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "The biopsychosocial model",
        text: "George Engel's 1977 proposal that illness must be understood simultaneously at biological, psychological and social levels, because each level has causal consequences for the others and because a reduction to any one level fails to predict outcome or to guide treatment.",
      },
      {
        type: "paragraph",
        text: "Engel's argument was not that biology does not matter — he was himself a consultant physician and internist — but that a model which explains everything at the cellular level explains nothing at the level at which the patient lives. The practical pay-off is that the same patient can be treated at several levels at once: a mood stabiliser such as lithium or valproate for a manic episode, cognitive therapy for the depressive thinking that follows it, and a debt adviser for the spending that precipitated it. Each intervention targets a different level, and none substitutes for another.",
      },
      {
        type: "paragraph",
        text: "An easy way to remember the levels is to ask: what is this person made of (biological), what do they do and believe (psychological), and where in the world are they situated (social)? A single-factor account — 'a chemical imbalance', 'a bad upbringing', 'a chemical in the water' — should always be read as a hypothesis of last resort, not an explanation.",
      },

      { type: "heading", level: 2, text: "The stress-vulnerability framework" },
      {
        type: "paragraph",
        text: "Zubin and Spring's vulnerability model (1977) separates a stable disposition — the diathesis — from transient stressors, and asks when the two coincide. The clinical value is twofold: it explains why patients relapse when stressed and improve when settled, and it directly generates intervention. If a patient has a high vulnerability, the highest-yield interventions may be environmental — reducing exposure to high expressed emotion, stabilising sleep, avoiding cannabis — rather than merely adding medication.",
      },
      {
        type: "table",
        headers: ["Phase", "Meaning", "Examples", "What the clinician does about it"],
        rows: [
          ["Predisposing", "Factors present from birth or early life that raise vulnerability", "Genetic loading, obstetric complications, childhood maltreatment, developmental intellectual disability", "Informs prognosis and family counselling; rarely modifiable but shapes prevention"],
          ["Precipitating", "Events that trigger the current episode", "Bereavement, childbirth (postpartum psychosis), a first psychotic episode after cannabis use, a job loss", "The focus of immediate intervention and of crisis planning"],
          ["Perpetuating", "Factors that keep the episode going once it has started", "Avoidance behaviour, chronic insomnia, high expressed emotion in the family, secondary gain, substance misuse, untreated comorbidity", "Where most therapeutic gain is available — the part that responds to treatment"],
          ["Protective", "Factors that lower the probability and severity of relapse", "Social support, employment, adherence, insight, secure housing, stable relationships", "Deliberately cultivated; they change the course more than most acute interventions"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "A formulation is the biopsychosocial model applied to one patient: predisposing, precipitating, perpetuating and protective factors across all three levels, leading to an explicit management plan. The diagnosis says what the disorder is; the formulation says why this person has it now, and what to do next.",
      },

      { type: "heading", level: 2, text: "Genetic contributions" },
      {
        type: "paragraph",
        text: "The classic evidence rests on comparing people who differ in genetic and environmental sharing. Twin studies show higher concordance in monozygotic than in dizygotic pairs, and adoption studies separate genetic relatedness from rearing environment. In schizophrenia, monozygotic concordance of roughly 40 to 50 percent and dizygotic of roughly 10 to 17 percent supports strong genetic loading, but the monozygotic figure being well under 100 percent establishes that genes are not sufficient. Genome-wide association studies have since identified hundreds of common variants of small individual effect, and copy number variants (such as 22q11.2 deletion) of larger effect.",
      },
      {
        type: "table",
        headers: ["Disorder", "Approximate heritability", "What the pattern of inheritance implies", "Known environmental contributions"],
        rows: [
          ["Schizophrenia", "Around 60-80 percent in twin studies", "Strongly polygenic; thousands of variants each of small effect; no single gene causes it", "Urban birth and upbringing, migration and minority status, childhood adversity, cannabis use in adolescence, obstetric complications"],
          ["Bipolar disorder", "Around 60-85 percent", "Even more strongly genetic; overlapping liability with schizophrenia in GWAS data", "Sleep deprivation, childbirth, life events, antidepressant switching"],
          ["Major depressive disorder", "Around 35-40 percent", "Moderate heritability for a broad liability; gene-environment interaction is prominent", "Loss events, chronic strain, poverty, isolation, medical illness"],
          ["Anxiety disorders", "Around 30-50 percent", "Shared liability across the anxiety disorders; trait neuroticism sits upstream", "Adverse parenting, overprotective caregiving, traumatic events"],
          ["Alcohol dependence", "Around 50-60 percent", "Substantially genetic via impulsivity and alcohol metabolism; ALDH2 variant strongly protective in East Asian populations", "Availability, price, social norms, trauma, peer use"],
          ["Autism spectrum disorder", "Around 60-90 percent", "Highly polygenic, large contribution from de novo variants; substantial overlap with intellectual disability", "No established environmental cause; the MMR-vaccine link has been retracted and discredited"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Heritability is a statement about variance in a population, not about a person and not about destiny. Two patients with identical diagnoses can have entirely different genetic loading, and identical twins who are discordant for schizophrenia demonstrate that the non-genetic half is real. Quoting heritability to a worried family should be paired with the more useful statement: what raises risk mostly is what treatment can help with.",
      },
      {
        type: "paragraph",
        text: "Gene-environment interplay takes two forms. In gene-environment correlation, genes shape exposure — a genetically inhibited child seeks fewer novel encounters, and a genetically impulsive adolescent seeks more risky peers. In gene-environment interaction, the effect of an environmental exposure depends on genotype: the best-known psychiatric example is that the effect of stressful life events on depressive episodes is stronger in people with particular variants in stress-response pathways, though the effect sizes are small and replication has been uneven.",
      },

      { type: "heading", level: 2, text: "Neurobiology" },
      {
        type: "table",
        headers: ["Hypothesis", "System", "Principal evidence", "Status of the claim"],
        rows: [
          ["Dopamine hypothesis of psychosis", "Mesolimbic dopamine signalling; striatal D2 receptor availability", "Amphetamines and dopamine agonists induce psychosis and worsen schizophrenia; antipsychotics are D2 antagonists; imaging shows elevated striatal dopamine synthesis capacity", "The best-supported neurochemical account of positive symptoms, but it is one part of a wider story and does not explain negative symptoms"],
          ["Serotonergic hypothesis", "Serotonergic transmission and receptor systems", "SSRIs increase synaptic serotonin and relieve depression; triptans and hallucinogens act on serotonin receptors", "Seriously limited as a causal account: depression onset is delayed 2-4 weeks after serotonin rises, and SSRIs relieve depression without correcting any measurable deficit"],
          ["Monoamine hypothesis of depression", "Serotonin, noradrenaline and dopamine", "Reserpine depletes monoamines and can induce depression; most antidepressants act on monoamine reuptake or metabolism", "Superseded as a complete account — it describes drug targets, not cause; neurotrophic and stress-axis models now sit alongside"],
          ["Glutamate hypothesis of psychosis and depression", "NMDA receptor hypofunction and glutamate-glutamine cycling", "Ketamine and phencyclidine produce schizophreniform symptoms and rapid antidepressant effects; postmortem and spectroscopy findings are suggestive", "The most active current line for both depression and negative symptoms; esketamine is derived from it"],
          ["HPA axis dysregulation", "Hypothalamic-pituitary-adrenal axis, CRH and cortisol", "Non-suppression on dexamethasone suppression testing in a proportion of patients with melancholic depression; elevated cortisol in chronic stress", "A state marker of severity and of chronic stress, not a diagnostic test"],
          ["Neurotrophic and inflammatory", "BDNF, neurogenesis; cytokine signalling", "BDNF rises with effective antidepressant treatment; inflammation is associated with depression in chronic illness", "Moderate; relevant to illness behaviours, fatigue and sickness behaviour in medical depression"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "'A chemical imbalance' is not a psychiatric explanation. It is a drug-advertising simplification, it is not measurable in the clinic, and it leads patients into the belief that tablets alone will fix a complex problem. Depression is not a serotonin deficiency; SSRIs happen to act on serotonin and take weeks to change mood. Explain treatment as 'this medication corrects a pattern of brain signalling involved in your symptoms', and be honest that the mechanism is not fully understood.",
      },
      {
        type: "paragraph",
        text: "Structural and functional imaging contributes context rather than diagnosis: patients with schizophrenia show slightly enlarged ventricles and reduced hippocampal and prefrontal cortical volumes on group averages, PTSD shows smaller hippocampal volume, and mood disorders show altered amygdala and prefrontal activation. None of these is diagnostic for an individual, and no psychiatric diagnosis is made from a scan. Neuropsychological profiles are more useful at the bedside: the frontal-subcortical pattern in Parkinson's disease and Huntington's disease, the episodic-dominant profile in early Alzheimer's disease, and the patchy pattern in vascular dementia.",
      },

      { type: "heading", level: 2, text: "Psychological contributions" },
      {
        type: "table",
        headers: ["Mechanism", "Theory", "How it produces disorder", "Therapy implied"],
        rows: [
          ["Classical conditioning", "Watson and Rayner; Mowrer two-factor", "Neutral cues acquire fear by pairing with an aversive event and the response is maintained by avoidance", "Graded exposure and response prevention"],
          ["Operant conditioning", "Skinner", "Depression as a loss of environmental reinforcement — activities stop paying, so they stop happening, so they pay less", "Behavioural activation: scheduling valued, rewarding activity"],
          ["Cognitive schemas and the triad", "Beck", "Negative views of self, world and future; dysfunctional assumptions activated by matching events", "Cognitive restructuring; cognitive therapy for relapse prevention"],
          ["Learned helplessness", "Seligman", "Repeated exposure to uncontrollable outcomes produces the belief that action is pointless, plus the cognitive attributional style that makes it general", "Attribution retraining; problem-solving therapy"],
          ["Attachment and loss", "Bowlby", "Early loss or insecure attachment shapes the internal working model of relationships, predicting later vulnerability to depression", "Psychoanalytic and attachment-based therapies"],
          ["Psychodynamic conflict and defence", "Freud and successors", "Unacceptable impulses and affects are managed by defences that distort reality and symptoms", "Psychodynamic psychotherapy"],
          ["Sexual conditioning", "Conditioning of arousal patterns", "Unusual stimuli acquire erotic significance, and the pattern is reinforced by orgasm", "Behavioural retraining where the pattern is distressing or harmful"],
        ],
      },

      { type: "heading", level: 2, text: "Social contributions" },
      {
        type: "paragraph",
        text: "The social environment is not background noise; it is causal. Brown and Harris established that depressive episodes in women followed loss and humiliation events, that the effect was amplified by the absence of a confiding relationship, and that working-class women with children at home had four times the rate of depression of middle-class women without. Social factors also determine whether a disorder is recognized, treated and supported.",
      },
      {
        type: "table",
        headers: ["Social factor", "Effect", "Disorder it most clearly affects"],
        rows: [
          ["Life events and chronic strain", "Precipitates depressive episodes; humiliation and entrapment events are particularly potent", "Depression, PTSD, adjustment disorders"],
          ["Poverty, unemployment and debt", "Prevalence and outcome worsen; treatment access falls; debt adds a chronic, unremitting stressor", "Depression, anxiety, alcohol and drug dependence, self-harm"],
          ["Loneliness and isolation", "Loneliness predicts depression, anxiety and dementia, and carries mortality risk comparable with smoking", "Depression, Alzheimer's disease, self-harm in older people"],
          ["Urban birth and upbringing", "Dose-related increase in risk for schizophrenia, independent of family history", "Schizophrenia spectrum disorders"],
          ["Migration, minority status and discrimination", "Elevated rates of psychosis; misdiagnosis is also more frequent", "Schizophrenia and affective psychosis"],
          ["High expressed emotion in the family", "Criticism, hostility and emotional overinvolvement predict relapse two to three times over", "Schizophrenia, bipolar disorder, anorexia nervosa"],
          ["Adverse childhood experiences", "Dose-related increase in depression, PTSD, substance misuse and self-harm", "Nearly all psychiatric disorders"],
          ["Stigma", "Reduces help-seeking and treatment adherence, worsens employment outcomes, and adds an internalised stressor", "All psychiatric disorders"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Stigma is both a cause and a consequence. Public stigma (stereotypes held by others), self stigma (beliefs a patient holds about themselves) and structural stigma (legal and institutional arrangements) all produce measurable clinical harm. Language is a site of this: 'schizophrenic' as a noun, 'addict' as a synonym for a person, and 'a danger to the public' as a description of psychosis all move practice in the wrong direction.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Explaining a disorder at one level and calling it explained. 'It is genes' does not tell you which life event triggered this relapse; 'it is trauma' does not tell you why one traumatised person becomes depressed and another does not. Aetiology is multi-level, and the intervention usually follows the level at which the mechanism is available.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Inferring causation from a correlation in epidemiology. Schizophrenia and cannabis use co-occur, but most cannabis users never develop psychosis and most patients have never used it — and reverse causation (prodromal patients self-medicate) has been demonstrated in cohorts. Associations constrain hypotheses; they do not settle them.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Writing 'psychosocial' as a euphemism for 'not really organic'. Psychosocial factors are causal and objective — unemployment, a bereavement, a hostile relative — and 'organic' is not a synonym for real. Health psychology has repeatedly found that social position alters measured biological risk.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient has a father with schizophrenia, used cannabis heavily at seventeen, was born in a city and grew up there, has lost several jobs, and has a highly critical mother. Map these to the four phases of the stress-vulnerability model.",
        answer: "Predisposing: the family history and urban birth and upbringing. Precipitating: cannabis use in adolescence and the job losses, with the family environment raising ongoing stress. Perpetuating: sustained heavy cannabis use and the high expressed emotion in his relationship with his mother. Protective factors need to be sought separately — adherence, friendships, a supportive service, and any employment he still holds.",
        explanation: "The mapping matters because it directs the plan: cannabis cessation and family intervention target perpetuating factors, and are often the highest-yield interventions available alongside antipsychotic medication.",
      },
      {
        type: "question",
        prompt: "Why is it misleading to tell a patient with depression that they have 'a chemical imbalance'?",
        answer: "Because it converts a weak, contested hypothesis into a causal explanation, is not measurable in the patient, and encourages the expectation that medication alone will restore them. It also tends to be followed by a disappointment that undermines the therapeutic relationship when the medication does not produce immediate change.",
        explanation: "The honest version is that antidepressants act on brain signalling systems involved in mood, sleep, appetite and motivation, that the mechanism is incompletely understood, and that psychological and social interventions work alongside the medication, not behind it.",
      },
      {
        type: "question",
        prompt: "How does the two-factor theory of avoidance, from Lesson 2, fit into the stress-vulnerability model?",
        answer: "It supplies a psychological mechanism by which a vulnerability becomes a persistent disorder: the fear is acquired by classical conditioning, and every episode of avoidance is negatively reinforced, so the fear is never disconfirmed and the disorder perpetuates itself even after the original stressor has ended.",
        explanation: "This is the clearest case of a psychological level intervention that changes a biological outcome: exposure disrupts the avoidance loop and the disorder no longer self-maintains.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Aetiology is multi-level: genetic liability is real and overwhelmingly polygenic, neurobiology explains parts of syndromes rather than whole ones, psychological mechanisms explain how symptoms are acquired and maintained, and social factors carry independent causal weight. The stress-vulnerability framework organises these into predisposing, precipitating, perpetuating and protective factors, and it converts directly into a management plan.",
      },
      {
        type: "paragraph",
        text: "Next: the psychotic disorders. You will meet delusions, hallucinations and thought disorder as phenomena, and see how the five As of schizophrenia, the differential diagnosis of psychosis, and the management of antipsychotic side effects connect back to the dopamine hypothesis you have just read.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which finding most directly demonstrates that the stress-vulnerability model adds predictive power beyond vulnerability alone?",
        options: [
          "Monozygotic twins are more concordant for schizophrenia than dizygotic pairs.",
          "Relapse rates in schizophrenia fall when family expressed emotion is reduced, holding medication constant.",
          "SSRI response rates in depression trials exceed placebo in meta-analysis.",
          "Patients with schizophrenia have enlarged ventricles on group-average imaging.",
        ],
        correctIndex: 1,
        explanation: "The model's claim is that vulnerability interacts with environment, and the family expressed-emotion trials change the environment while vulnerability is unchanged, producing a measurable change in relapse. Twin concordance establishes genetic loading, drug efficacy establishes treatment, and imaging is a group-average correlate.",
      },
      {
        type: "mcq",
        stem: "Which statement about heritability of schizophrenia is correct?",
        options: [
          "It means that 70 percent of the cause of a given patient's schizophrenia is genetic.",
          "It means that in the population studied, around 70 percent of variance in liability is associated with genetic differences, and environment explains the rest.",
          "It means that the disorder is inherited in a Mendelian fashion with one gene of large effect.",
          "It means that environmental interventions are pointless because the disorder is biological.",
        ],
        correctIndex: 1,
        explanation: "Heritability is a population variance statistic. It changes with the environment, says nothing about an individual patient, and psychiatric heritability is overwhelmingly polygenic, and it certainly does not render psychosocial intervention futile.",
      },
      {
        type: "mcq",
        stem: "Which of these is the strongest current neurochemical account of the positive symptoms of schizophrenia?",
        options: [
          "Serotonin deficiency in the raphe nuclei",
          "Substance P excess in the amygdala",
          "Increased dopamine synthesis capacity in the striatum",
          "Global GABA excess in the prefrontal cortex",
        ],
        correctIndex: 2,
        explanation: "Elevated striatal dopamine synthesis capacity is the best-supported neurochemical correlate of positive symptoms, consistent with dopamine agonists inducing psychosis and antipsychotics blocking D2. The GABA finding in schizophrenia is a deficit of interneuron function, not an excess, and serotonin and substance P are not the accepted accounts of psychotic symptoms.",
      },
      {
        type: "mcq",
        stem: "A patient's depressive episode began after redundancy and homelessness, and persists because of debt. Which level does this aetiology best illustrate?",
        options: [
          "A purely neurochemical aetiology, since all depression is biological",
          "A biopsychosocial aetiology, in which social stressors precipitate and perpetuate the episode and biological treatment is one option among several",
          "A psychodynamic aetiology, in which the symptom is symbolic of the loss",
          "A malingered presentation, since the trigger is so clearly external",
        ],
        correctIndex: 1,
        explanation: "Redundancy precipitates, debt perpetuates, and low mood impairs the capacity to address the debt — the classic biopsychosocial picture. Every level is real and the intervention must address each: psychological therapy, social intervention on the debt, and consideration of an antidepressant.",
      },
      {
        type: "mcq",
        stem: "Which statement correctly describes the role of cannabis in schizophrenia risk?",
        options: [
          "Cannabis use is a proven cause, since most patients have used it.",
          "Cannabis is irrelevant to schizophrenia, and the association is a statistical artefact.",
          "Cannabis use approximately doubles risk, particularly for high-potency varieties used in adolescence, and reverse causation accounts for part of the association.",
          "Cannabis use is protective against schizophrenia because it suppresses dopamine.",
        ],
        correctIndex: 2,
        explanation: "Meta-analyses show roughly a doubling of risk for psychosis, with dose-dependence and an age window in adolescence, while reverse causation is well documented — prodromal patients use cannabis to relieve dysphoria. The correct public-health framing is a risk factor, not a cause, and not a licence for blame.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 7 — Schizophrenia spectrum (fully authored)
// ---------------------------------------------------------------------------
function lesson7(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define delusion, hallucination and formal thought disorder and recognise each in a patient's account; describe the positive, negative, disorganisation, cognitive and affective symptom groups of schizophrenia and the first-rank symptoms of Schneider; distinguish schizophrenia from schizoaffective disorder, delusional disorder, brief psychotic disorder, psychotic depression and mania, substance-induced and medically induced psychosis, and delirium; outline the natural history of the disorder, its prognosis and its excess mortality; and describe the first-line drug treatment, its principal side effects including neuroleptic malignant syndrome, the role of clozapine, and the psychosocial interventions that reduce relapse.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 6 (Aetiology and the biopsychosocial model) for the genetic and dopaminergic background, and Lesson 5 (Classification and assessment) for the history and mental status examination that produce these descriptions.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Psychosis",
        text: "A state in which the person loses contact with reality as it is generally agreed: they hold beliefs that are fixed and false despite evidence to the contrary, or perceive things that are not present, or their speech loses a comprehensible structure. Psychosis is a syndrome, not a diagnosis — it occurs in schizophrenia, in affective disorders, in delirium and dementia, after substances, and in numerous medical conditions.",
      },
      {
        type: "paragraph",
        text: "Schizophrenia is best understood not as the presence of bizarre symptoms but as a narrowing of the field of consciousness — a loss of the automatic filtering that lets most people experience only what is relevant. Bleuler described it as a fragmentation of the normally connected functions of personality. That model explains why the symptoms seem so disparate: the patient cannot distinguish the important from the trivial, cannot hold a train of thought together, cannot separate their own mental activity from external events. It also explains why the most disabling features are the negative ones, because the capacity to initiate and sustain goal-directed action is itself impaired.",
      },

      { type: "heading", level: 2, text: "The phenomena of psychosis" },
      {
        type: "table",
        headers: ["Phenomenon", "Definition", "Typical description by a patient", "Points to note on questioning"],
        rows: [
          ["Delusion", "A fixed false belief, held with conviction despite evidence and despite the absence of any shared cultural or religious explanation for it", "'The television company are broadcasting my thoughts to the neighbours.'", "Distinguish from overvalued ideas, obsessions and cultural beliefs: delusions are unshakable by evidence, and obsessions are recognised by the patient as unreasonable"],
          ["Delusional perception", "A Schneider first-rank symptom: a genuine perception is invested with a delusional meaning", "'When the traffic light turned green I knew I was chosen.'", "First-rank symptoms are strongly associated with schizophrenia but are not pathognomonic and occur in affective and organic psychoses too"],
          ["Hallucination", "A perception without an external stimulus, experienced with the quality of a real perception", "'Two men argue about me in the wall; I hear them every evening.'", "Auditory third-person voices, a running commentary and voices arguing are most typical; pseudohallucinations are recognised as unreal and arise in subjective inner space"],
          ["Formal thought disorder", "A disorder of the form and linkage of thought, inferred from speech", "'I was walking down the, and then the paint, well the colour reminded me of the hospital and the nurses are in the... the plants.'", "Listen for derailment (slipping off the point), tangentiality (answering obliquely), loosening of associations, blocking, neologisms and clang associations"],
          ["Passivity experiences", "Made feelings, made impulses and made acts: experiences are imposed by an external agency", "'They move my arm and I have to hit him — it is not my act.'", "Ask about the boundary between self and other; this is one of the most diagnostically specific of the first-rank symptoms"],
          ["Thought insertion, withdrawal and broadcasting", "One's own thoughts are put in by others, taken out, or shared with others", "'They take my thoughts out and read them on the air.'", "Distinguish from thought echo, which is hearing one's own thoughts repeated aloud — another first-rank symptom"],
          ["Disorganisation", "Disorganised speech, behaviour and affect, breaking the coherence of action", "A patient dressing in the corridor in an outdoor coat in August", "Look for incoherence at the level of behaviour as well as speech"],
          ["Catatonia", "A syndrome of motor abnormality — immobility, mutism, posturing, waxy flexibility, negativism, echolalia and echopraxia", "A patient holding an arm raised for hours after being assisted into that position", "Catatonia is a psychiatric emergency; it is frequently missed and can be lethal, and it is no longer confined to schizophrenia"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Schneider's first-rank symptoms are: audible thoughts (thought echo), voices arguing, voices commenting in the third person, somatic passivity, made affect, made impulses, made acts, thought insertion, thought withdrawal, thought broadcasting, and delusional perception. Their value is real but bounded: they occur in mania and psychotic depression too, their absence never excludes schizophrenia, and their insensitivity has been repeatedly criticised. They are a pointer, not a rule.",
      },

      { type: "heading", level: 2, text: "The symptom groups" },
      {
        type: "paragraph",
        text: "The five groups are conventionally remembered as the five As: Affect (flattened), Alogia (poverty of speech), Avolition (loss of drive), Asociality, and Anhedonia (loss of pleasure). The division between positive and negative symptoms is the most clinically consequential, because positive symptoms usually respond to antipsychotics and negative symptoms usually do not.",
      },
      {
        type: "table",
        headers: ["Group", "Contents", "Response to antipsychotic medication", "Relevance to function"],
        rows: [
          ["Positive", "Delusions, hallucinations, thought disorder, bizarre behaviour", "Usually substantial", "Highly distressing but often episodic; medication substantially reduces relapse"],
          ["Negative", "Affective flattening, alogia, avolition, apathy, asociality, anhedonia", "Poor to minimal — and antipsychotics can worsen them", "The strongest predictor of long-term social disability, and the least responsive to treatment"],
          ["Cognitive", "Impaired attention, working memory, executive function and processing speed; social cognition deficits", "Not reliably improved", "Determines employability and independent living more than any other domain"],
          ["Disorganisation", "Incoherence, disorganised behaviour, inappropriate affect", "Partially responsive", "Sensitive to poor adherence"],
          ["Affective", "Depression, anxiety, hopelessness, suicidal ideation", "Antidepressants and psychological therapy help", "Depression is common and is a strong predictor of suicide in schizophrenia"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not mistake antipsychotic-induced bradykinesia and affective flattening for negative symptoms. Antipsychotics produce a state indistinguishable from parkinsonism, and bromocriptine, benztropine and dose reduction are all reasonable responses. Similarly, akathisia — a distressing inner restlessness with pacing and an inability to sit still — is a side effect that is frequently misread as agitation and misread as a deterioration of the illness requiring more of the same drug.",
      },

      { type: "heading", level: 2, text: "Differential diagnosis of psychosis" },
      {
        type: "table",
        headers: ["Diagnosis", "Discriminating feature", "Duration or course", "What to ask or do"],
        rows: [
          ["Schizophrenia", "Characteristic symptoms from more than one domain, with declining function", "At least one month of active symptoms and six months of continuous disturbance in DSM-5; ICD-10 requires one month of active symptoms", "Lifetime history of functioning; pre-admission work or study record"],
          ["Schizoaffective disorder", "A mood episode runs concurrently with psychotic symptoms AND for a substantial part of the total illness, with psychosis also present in the absence of mood disturbance for at least two weeks", "Longitudinal", "Construct the timeline: were the delusions present when the mood was well?"],
          ["Delusional disorder", "One or more non-bizarre encapsulated delusions without other psychotic features, and function is otherwise relatively preserved", "At least three months (one month in ICD-10)", "Ask what makes the belief fixed and whether anything else has changed"],
          ["Brief psychotic disorder", "Sudden onset of psychosis after a stressor, with complete return to premorbid function", "Under one month, typically days", "Ask how abruptly it began and whether the stressor was identifiable"],
          ["Schizophreniform disorder", "Schizophrenia-like presentation not yet of sufficient duration", "One to six months", "Follow-up over time before diagnosing"],
          ["Schizotypal disorder", "Odd, eccentric beliefs and behaviour with perceptual disturbance but no sustained delusions or hallucinations", "Chronic, lifelong", "Developmental history from family; this lies in the spectrum rather than being equivalent to it"],
          ["Psychotic depression and mania with psychotic features", "Mood-congruent delusions of guilt, worthlessness, poverty or nihilism in depression; grandiose delusions in mania", "Episodic, tracking the mood", "Screen for a past history of elevated or irritable mood, decreased sleep and increased activity — the bipolar question"],
          ["Substance-induced psychosis", "Temporal relation to use or withdrawal, and persisting after abstinence", "Clears within days to a month of abstinence (a year for cannabis per DSM-5)", "Quantify substance use; urine screen; always ask about amphetamines, cocaine, high-potency cannabis, hallucinogens, anabolic steroids and novelty drugs"],
          ["Psychosis due to a medical condition", "Hallucinations of smell or taste, visual hallucinations, focal neurology, disorientation", "Symptom onset tracks the medical illness", "Thyroid function, B12, calcium, glucose, cortisol, MRI, EEG for suspected epilepsy and autoimmune encephalitis"],
          ["Delirium", "Acute onset with impaired attention and a fluctuating level of consciousness, with visual hallucinations and disorientation", "Hours to days, reversible", "Always the first exclusion in acute psychosis in an older or medically unwell patient"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Always screen for bipolar disorder before prescribing an antidepressant for a depressed patient with psychotic features. Unopposed antidepressants can precipitate mania and can worsen the long-term course, so the question 'have you ever had several days when you needed much less sleep than usual and felt unusually energetic?' is as important as the depression rating.",
      },

      { type: "heading", level: 2, text: "Course, prognosis and mortality" },
      {
        type: "paragraph",
        text: "Onset is typically late adolescence or the third decade in men and somewhat later in women; onset after forty is unusual and demands a search for an organic cause. A prodrome of subtle social withdrawal, unusual thinking, declining function and perceptual hypersensitivity often precedes the first episode by months or years, and an acute first presentation usually separates a recognisable pre-morbid from the episode itself.",
      },
      {
        type: "table",
        headers: ["Phase", "Duration", "Clinical feature", "Implication"],
        rows: [
          ["Prodrome", "Weeks to years", "Declining function, social withdrawal, suspiciousness, perceptual hypersensitivity", "The window in which early intervention carries the best evidence, so first-episode services have developed precisely here"],
          ["Acute episode", "Weeks to months", "Positive symptoms dominating; often precipitated by stress, cannabis use or non-adherence", "Urgent treatment; risk of suicide is highest in this phase and the first years after it"],
          ["Stabilisation", "Months", "Resolution of positive symptoms; negative and cognitive deficits emerge as the acute noise clears", "Intensive psychosocial rehabilitation and careful re-titration"],
          ["Long-term", "Years to lifetime", "Variable: roughly a third have a good outcome, a third episodic, a third chronic and disabling", "Relapse prevention is the central task, because each relapse costs function that may not return"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Adherence is the single strongest modifiable determinant of relapse: stopping antipsychotic medication raises relapse risk roughly five-fold, and the risk is concentrated in the first months after discontinuation. This is the rationale for long-acting injectable antipsychotics, which pragmatically solve the problem of missed doses, and for psychoeducation framed as protection rather than coercion.",
      },
      {
        type: "paragraph",
        text: "Excess mortality in schizophrenia is serious and under-recognised: life expectancy is reduced by roughly ten to twenty years, driven by cardiovascular disease, diabetes, smoking, and by suicide, which carries about a tenfold increase in risk with around five to ten percent of patients dying by suicide — concentrated in the first years, in young men, and after discharge. The gap is partly a disease factor, partly a consequence of antipsychotic metabolic side effects, and partly the consequence of physical health care being delivered less well to psychiatric patients.",
      },

      { type: "heading", level: 2, text: "Treatment" },
      {
        type: "paragraph",
        text: "Antipsychotic medication is the core of treatment, and all licensed antipsychotics are dopamine D2 antagonists, with the second-generation agents also blocking 5-HT2A receptors. The first-line choice is made on side-effect profile, previous response, route and patient preference, not on differences in efficacy between agents that are real but modest.",
      },
      {
        type: "table",
        headers: ["Adverse effect", "Mechanism and timing", "Management"],
        rows: [
          ["Acute dystonia", "D2 blockade, within hours or days — oculogyric crisis, torticollis, trismus", "Procyclidine or benztropine intramuscularly; it resolves within minutes and is not a reason to abandon the drug on its own"],
          ["Parkinsonism", "Weeks to months — bradykinesia, rigidity, tremor, mask-like face", "Reduce the dose; add an anticholinergic short-term; consider switching; do not confuse with negative symptoms"],
          ["Akathisia", "Onset within weeks — inner restlessness with an inability to sit still", "Frequently misread as agitation; reduce the dose, switch, or add propranolol; high suicide risk if untreated"],
          ["Tardive dyskinesia", "Years of exposure, in a minority — involuntary oral-buccal-lingual movements", "Often irreversible; stop or switch if identified early; tetrabenazine, valbenazine and deutetrabenazine are options; document at baseline and monitor"],
          ["Hyperprolactinaemia", "D2 blockade of the tuberoinfundibular pathway — amenorrhoea, galactorrhoea, sexual dysfunction, infertility, osteoporosis", "Risperidone and typical antipsychotics are the worst offenders; switch to a prolactin-sparing agent such as aripiprazole or quetiapine"],
          ["Metabolic effects", "Second-generation agents, especially clozapine and olanzapine — weight gain, dyslipidaemia, insulin resistance", "Weight, glucose, lipids and blood pressure at baseline, three months and annually; dietetic input"],
          ["Neuroleptic malignant syndrome", "Idiosyncratic, in the first weeks — fever, severe rigidity, autonomic instability, altered consciousness, and raised creatinine kinase", "Stop the antipsychotic immediately; give supportive care, fluids, dantrolene or bromocriptine; admission and CK monitoring; mortality is low but real"],
          ["Clozapine-specific", "Agranulocytosis (up to about one percent), myocarditis, seizures, hypersalivation, severe constipation", "Mandatory haematological monitoring by a registry; stop immediately and obtain an urgent full blood count if fever or sore throat occurs; check troponin if myocarditis suspected"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Clozapine is the treatment of choice for treatment-resistant schizophrenia — conventionally, two adequate trials of different antipsychotics at adequate dose and duration — and it remains markedly under-used because of monitoring requirements. Under-treatment is a far greater harm to patients than the monitoring burden: it outperforms other antipsychotics on suicide, hospitalisation and global outcome, and it is the recommended agent in patients with persistent suicidality.",
      },
      {
        type: "paragraph",
        text: "Psychosocial treatment is not an optional extra. Cognitive behavioural therapy for psychosis (CBTp) targets the belief system around delusions and hallucinations and reduces distress and relapse. Family intervention reduces high expressed emotion and is among the best-evidenced psychosocial interventions available. Psychoeducation, adherence therapy, supported employment, social skills training, cognitive remediation and first-episode early intervention services all have evidence, and cognitive behavioural case management reduces readmission. Recovery-oriented work with the patient's own goals is the frame in which all of it is delivered.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Compulsory treatment is a legal decision under mental health legislation, not a clinical shorthand for 'the patient disagrees'. It requires that the patient has a mental disorder of a nature or degree warranting detention, that it is necessary for the patient's health, safety or the protection of others, and that no less restrictive alternative is available — and it must be reviewed by an independent body. Capacity, the patient's own wishes and an advance statement all form part of the record, and antipsychotics used as sedation rather than treatment are a recognised abuse.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Talking about 'schizophrenics' and treating them as violent. People with schizophrenia are far more likely to be the victims of crime than its perpetrators, and population-level violence is overwhelmingly attributable to substance misuse, not to psychosis. Using a diagnosis as a noun about a person, and predicting violence from it, are the two most damaging stigmatising errors available in this subject.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading reduced emotional expression as reduced feeling. As established in Lesson 1, flattened affect is a negative symptom and a parkinsonian side effect; patients commonly report intense feeling that they cannot express. Under-recognised depression in schizophrenia is one of the commonest causes of preventable suicide in the disorder.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Accepting a single diagnosis of schizophrenia at first presentation without a substance and medical workup. Amphetamine psychosis, steroid psychosis, thyroid disease, B12 deficiency, hypercalcaemia, autoimmune encephalitis and delirium all mimic it, and each has a specific treatment that the diagnosis would obscure.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient tells you that when she looks at the clock she knows the time was put there by the news channel as a message to her, and that twice a week two voices in the room discuss her behaviour. Classify these phenomena.",
        answer: "Delusional perception (a genuine perception invested with a fixed delusional meaning) and third-person auditory hallucinations in the form of a running commentary or voices discussing the patient — both Schneider first-rank symptoms.",
        explanation: "Note that the significance is not that these are pathognomonic of schizophrenia but that they indicate psychosis and prompt a full differential: schizophrenia, schizoaffective disorder, psychotic depression or mania, substance-induced psychosis and organic causes.",
      },
      {
        type: "question",
        prompt: "A man with schizophrenia on risperidone reports loss of libido and amenorrhoea, and new-onset visual disturbance. Which mechanisms are involved?",
        answer: "Hyperprolactinaemia from D2 blockade of the tuberoinfundibular dopamine pathway is the cause of the sexual dysfunction and amenorrhoea, and prolactin should be measured. Prolonged untreated hyperprolactinaemia causes bone loss. Visual disturbance in a patient on a prolactin-raising antipsychotic raises the possibility of a prolactimoma, which requires pituitary imaging and does not settle merely by drug switching.",
        explanation: "Risperidone and older typical antipsychotics are the worst offenders for prolactin; switching to aripiprazole or quetiapine is the usual remedy once pathology is excluded — and the headache and visual fields are the cues to think of a pituitary cause.",
      },
      {
        type: "question",
        prompt: "Which combination of findings distinguishes neuroleptic malignant syndrome from akathisia or from a relapse of psychosis?",
        answer: "Fever, severe lead-pipe rigidity, autonomic instability (tachycardia, labile blood pressure, sweating), altered consciousness and a markedly raised creatine kinase. Akathisia has no fever or rigidity, and a relapse of psychosis has neither fever nor rigidity nor CK elevation.",
        explanation: "The discriminating features are fever, rigidity, autonomic instability and CK. Immediate antipsychotic withdrawal and supportive care are required, with dantrolene or bromocriptine, and the reaction may last beyond the drug's plasma half-life.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Psychosis is a syndrome defined by delusions, hallucinations and formal thought disorder, occurring across many diagnoses. Schizophrenia is diagnosed by a characteristic grouping across positive, negative, disorganisation, cognitive and affective domains with a decline in function over at least six months, and the differential is wide — affective psychoses, substance-induced psychosis, delirium and medical causes must all be excluded. Antipsychotics reduce positive symptoms and relapse; negative and cognitive deficits drive long-term disability; and clozapine is the agent of choice for treatment resistance.",
      },
      {
        type: "paragraph",
        text: "Next: bipolar disorder. You will see how the same psychotic phenomena occur in mood disorder, and how the diagnosis rests on longitudinal history rather than on a single episode.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of the following is a Schneider first-rank symptom?",
        options: [
          "A fixed belief that one has a serious illness despite normal test results",
          "A running commentary in which voices describe the patient's ongoing behaviour in the third person",
          "A hallucination of an unseen figure looking over the shoulder on falling asleep",
          "An overvalued idea that one's appearance is unattractive",
        ],
        correctIndex: 1,
        explanation: "Voices commenting on the patient's behaviour in the third person are first-rank. A fixed false belief about illness is a somatic delusion, a hypnagogic hallucination is a pseudohallucination, and an overvalued idea about appearance is precisely not delusional.",
      },
      {
        type: "mcq",
        stem: "Which statement about negative symptoms in schizophrenia is correct?",
        options: [
          "They respond to antipsychotic medication more reliably than positive symptoms.",
          "They are the strongest predictor of long-term social disability and respond poorly to medication.",
          "They are pathognomonic of schizophrenia and never occur in depression.",
          "They are always the result of antipsychotic-induced parkinsonism.",
        ],
        correctIndex: 1,
        explanation: "Negative symptoms are the best clinical predictor of long-term functional outcome and respond poorly to medication, so rehabilitation and supported employment carry most of the therapeutic weight. They also occur in depression, parkinsonism and institutional under-stimulation, and antipsychotics can cause or worsen them.",
      },
      {
        type: "mcq",
        stem: "A patient has a three-month history of somatic passivity and auditory hallucinations, alongside a persistent low mood with anhedonia and early morning waking that began one month after the psychosis and persists. Which diagnosis fits best?",
        options: [
          "Schizophrenia, because psychotic symptoms are present.",
          "Schizoaffective disorder, because psychotic symptoms persist in the absence of a full mood episode, while bipolar disorder is not clearly involved.",
          "Major depressive disorder with mood-congruent psychotic features.",
          "Brief psychotic disorder followed by an adjustment reaction.",
        ],
        correctIndex: 1,
        explanation: "The essential requirement for schizoaffective disorder is a mood episode occurring alongside psychotic symptoms, with psychosis present for at least two weeks in the absence of prominent mood symptoms. Schizophrenia has no dominant mood syndrome, and psychotic depression is mood-congruent, with the psychosis tracking the mood.",
      },
      {
        type: "mcq",
        stem: "Which set of findings most strongly suggests neuroleptic malignant syndrome rather than akathisia?",
        options: [
          "Pacing, inability to sit still, and a new complaint of feeling driven, after haloperidol",
          "Fever, severe lead-pipe rigidity, labile blood pressure and a raised creatine kinase after commencing flupentixol",
          "Coarse tongue protrusion and involuntary lip-smacking over two years on a depot",
          "Loss of libido with amenorrhoea on risperidone",
        ],
        correctIndex: 1,
        explanation: "NMS is fever, rigidity, autonomic instability, altered consciousness and raised CK, and it is a medical emergency. Option A is akathisia, C is tardive dyskinesia, and D is hyperprolactinaemia — all side effects, none of them emergencies of this kind.",
      },
      {
        type: "mcq",
        stem: "Which statement about clozapine is correct?",
        options: [
          "It is a first-line antipsychotic for all patients with a first episode of psychosis.",
          "It is indicated in treatment-resistant schizophrenia and requires mandatory blood monitoring because of the risk of agranulocytosis.",
          "It is contraindicated in patients with persistent suicidal ideation because of its risks.",
          "It does not require monitoring because it has no serious adverse effects.",
        ],
        correctIndex: 1,
        explanation: "Clozapine is the agent of choice for treatment resistance and for persistent suicidality, and registry-based haematological monitoring exists because of agranulocytosis in around one percent. It is under-used because of that monitoring burden and because clozapine monitoring is administratively demanding.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 8 — Bipolar disorder (fully authored)
// ---------------------------------------------------------------------------
function lesson8(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a manic, hypomanic, mixed and depressive episode and apply the duration and severity thresholds that separate them; distinguish bipolar I from bipolar II disorder, cyclothymia and rapid cycling; use the screening questions that identify previously unrecognised bipolarity in a depressed patient; describe the differential including thyroid disease, substance intoxication and stimulant use; and outline the acute and maintenance treatment of mania and bipolar depression, including lithium, valproate, lamotrigine and antipsychotics, and the hazards of prescribing an antidepressant alone.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 7 (Schizophrenia spectrum) for psychosis phenomenology, and Lesson 5 for the interview technique that extracts the longitudinal history on which this diagnosis depends.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Manic episode",
        text: "A period of elevated, expansive or irritable mood, at least one week in duration (or of any duration if hospitalisation is required), accompanied by increased activity and energy, and by at least three further symptoms from a defined list, sufficient to cause marked impairment or to require hospitalisation. Grandiosity, decreased need for sleep and reckless expenditure are typical.",
      },
      {
        type: "paragraph",
        text: "Bipolar disorder is not a mood disorder that happens to be severe; it is a disorder of the regulation of activation with two poles. The manic mood is not happiness in any ordinary sense — patients describe it as pressure, urgency, an inability to be still, irritability and an irritability-driven impatience with others. And the depressive pole, which carries the greater burden of suffering and of suicide, is where the illness does most of its damage. A patient's first presentation is usually depressive, which is precisely why bipolar disorder is missed so often.",
      },

      { type: "heading", level: 2, text: "The manic syndrome" },
      {
        type: "paragraph",
        text: "The diagnosis requires a change from the person's usual state — this is a family member's observation as much as the patient's — and the symptoms cluster around increased energy and reduced sleep.",
      },
      {
        type: "table",
        headers: ["Symptom", "How it presents", "What to ask"],
        rows: [
          ["Elevated, expansive or irritable mood", "Unusually cheerful, or unreasonably irritable and impatient; a change from previous behaviour", "Has anyone said you have been different in the last two weeks? What did they say?"],
          ["Increased activity and energy", "More projects, more exercise, more social contact, more spending, more sexual activity", "What have you been doing more of than usual?"],
          ["Decreased need for sleep", "Waking after two or three hours feeling rested and refreshed, and full of plans from dawn", "How many hours did you sleep? Did you wake early and feel fine?"],
          ["Grandiosity", "Inflated self-esteem, unrealistic plans, special relationships, special powers or a religious mission", "Have you felt you had a special purpose or unusual ability?"],
          ["Pressure of speech", "Rapid, loud, difficult to interrupt, often with puns and rhymes", "Observe rather than ask: can you get a word in?"],
          ["Flight of ideas or racing thoughts", "Thoughts moving so fast that the patient cannot keep up with their own speech", "Do your thoughts race so fast you cannot hold on to one?"],
          ["Distractibility", "Attention diverted by irrelevant external stimuli", "Do you find it hard to finish one thing?"],
          ["Increased goal-directed activity or psychomotor agitation", "Work, social, sexual or creative activity; or purposeless movement", "What have you started doing?"],
          ["Excessive involvement in pleasurable activities with painful consequences", "Spending, sexual indiscretion, reckless driving or investments", "Have you done anything you now regret?"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The severity line is where hypomania ends and mania begins. Mania causes marked impairment or requires admission; hypomania produces an observable change in function without marked impairment and without psychosis. Mood may be elevated or irritable, and increased energy and activity is required in ICD-11 — euphoria alone is not enough.",
      },
      {
        type: "definition",
        term: "Hypomania",
        text: "A milder episode of increased energy and activity with at least three of the associated symptoms, lasting at least four days, observable by others, not causing marked impairment in functioning, not accompanied by psychosis, and not requiring admission. Hypomania is the defining feature of bipolar II disorder; mania defines bipolar I disorder.",
      },
      {
        type: "paragraph",
        text: "Mixed features are common and important: during a manic or hypomanic episode, depressive symptoms — low mood, anhedonia, hopelessness, guilt, suicidal ideation — may occur simultaneously. Mixed presentations are diagnostically hazardous, because they resemble agitated depression, and they carry a high suicide risk. Cyclothymia consists of at least two years of persistent instability of mood, with numerous periods of mild hypomanic and depressive symptoms that do not meet full criteria. Rapid cycling, defined as four or more mood episodes in twelve months, is associated with poorer outcome, greater refractoriness, and a poorer response to lithium — and it is frequently iatrogenic through antidepressant use.",
      },

      { type: "heading", level: 2, text: "Classification and epidemiology" },
      {
        type: "table",
        headers: ["Disorder", "Criteria", "Notes"],
        rows: [
          ["Bipolar I disorder", "At least one manic episode, usually with depressive episodes", "Around one percent of the population lifetime; equal sex distribution; mean onset in the early twenties; psychotic features common in mania"],
          ["Bipolar II disorder", "At least one hypomanic episode and at least one major depressive episode, and never a manic episode", "Probably at least as common as bipolar I; more depressive predominance, more chronicity, more frequent misdiagnosis as unipolar depression"],
          ["Cyclothymic disorder", "Two years of fluctuating subsyndromal hypomanic and depressive symptoms without full episodes", "A trait-like diathesis to bipolarity; a substantial proportion progress to a full episode"],
          ["Rapid cycling", "Four or more mood episodes within twelve months", "More common in women; a worse prognosis; avoid antidepressants; often reduced lithium responsiveness"],
          ["Other bipolar and related disorders", "Substance- or medication-induced bipolar disorder, and bipolar disorder due to a medical condition", "Consider thyroid disease, corticosteroids, stimulants and antidepressants before settling on primary bipolarity"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The scenario that hides bipolar disorder is a young adult with several depressive episodes. Two questions change the yield enormously: 'have you ever had a period of days when you felt unusually good, energetic or irritable, when people told you that you seemed different?' and 'have you ever needed much less sleep than usual, without feeling tired the next day?' A positive answer alters the treatment entirely — antidepressants alone risk switching and destabilising the course.",
      },

      { type: "heading", level: 2, text: "Differential diagnosis" },
      {
        type: "table",
        headers: ["Condition", "Reason it mimics mania", "Discriminator"],
        rows: [
          ["Unipolar depression with agitation", "Restlessness and irritability resemble manic energy", "No elevated mood, no decreased need for sleep, and an episodic depressive course; the agitation is in service of anxiety rather than activity"],
          ["Schizoaffective disorder", "Psychosis and mood disturbance coexist", "Psychosis is present for at least two weeks in the absence of the mood episode in schizoaffective disorder"],
          ["Schizophrenia", "Disorganised and agitated behaviour", "The disturbance is chronic with no bipolar periodicity; the mood is not elevated"],
          ["Hyperthyroidism", "Overactivity, tremor, weight loss, heat intolerance and emotional lability", "Goitre, tachycardia, raised T4 and suppressed TSH — always test thyroid function in a first presentation of apparent mania"],
          ["Substance intoxication and withdrawal", "Stimulants (amphetamines, cocaine), alcohol intoxication and withdrawal, and phencyclidine produce agitation and grandiosity", "Temporal relation to use; resolve after abstinence; always obtain a urine screen and a collateral history"],
          ["Medication-induced mood change", "Corticosteroids, antidepressants, L-dopa, dopamine agonists, venlafaxine, interferon alfa", "Document recent prescriptions and doses; antidepressant-induced hypomania still counts toward a bipolar diagnosis"],
          ["Personality disorder, particularly borderline", "Affective instability and impulsivity", "Bipolar episodes are discrete, sustained and separated by euthymia; borderline instability is triggered by interpersonal events and shifts within hours"],
          ["ADHD", "Distractibility and overactivity", "ADHD is chronic and present from childhood; mania begins later and is episodic; comorbidity is common and hard to disentangle"],
        ],
      },

      { type: "heading", level: 2, text: "Aetiology" },
      {
        type: "paragraph",
        text: "Bipolar I is among the most heritable of psychiatric disorders — family, twin and adoption studies give heritability estimates in the region of sixty to eighty-five percent — and the genetic architecture is strongly polygenic with substantial overlap with schizophrenia. Circadian and homeostatic sleep disruption is central: a single night of sleep deprivation can trigger a manic episode in a vulnerable person, and irregular schedules precede relapse; the mechanism involves disturbances of melatonin and cortisol rhythm, and the family of clock genes. Life events are weak precipitants compared with unipolar depression, but childbirth, sleep disruption, interpersonal disruption and medication non-adherence are all potent. Seasonality affects both poles.",
      },

      { type: "heading", level: 2, text: "Management of mania" },
      {
        type: "paragraph",
        text: "The first tasks are safety and setting. The risk profile in a manic episode is driven by impulsivity, spending, sexual indiscretion, driving, exhaustion and loss of insight, and by the risk of dehydration or injury; assess capacity and the need for detention, and ensure that any financial safeguards are considered. Stopping any antidepressant is the first pharmacological act, and in severe or treatment-refractory mania, ECT is highly effective.",
      },
      {
        type: "table",
        headers: ["Agent", "Role", "Practical points"],
        rows: [
          ["Second-generation antipsychotics (olanzapine, risperidone, quetiapine, aripiprazole)", "First-line for acute mania; sedating agents such as olanzapine and quetiapine help recovery of sleep", "Rapid and reliable; monitor metabolic effects and akathisia; long-acting injections where adherence is the issue"],
          ["Valproate", "First-line alternative or adjunct, effective in mixed states and rapid cycling", "Loading and maintenance dosing; monitor levels and blood count; weight gain and tremor are common"],
          ["Lithium", "Effective but slower to act; the gold standard for maintenance and the only mood stabiliser with strong anti-suicidal evidence", "Narrow therapeutic index; monitor serum level, renal function, thyroid function and calcium; teratogenic, causing Ebstein anomaly"],
          ["Carbamazepine and oxcarbazepine", "Alternatives, particularly if valproate is not tolerated", "Enzyme induction with numerous interactions; hyponatraemia; blood dyscrasias and rash"],
          ["Benzodiazepines", "Short-term adjunct for agitation and to restore sleep", "Lorazepam is usual; for days only, not as maintenance, given dependence and disinhibition"],
          ["ECT", "Severe, refractory, or life-threatening mania, and where the patient cannot eat or drink", "Most efficacious treatment available in severe mania; consent and capacity are often the obstacles"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Lithium toxicity is a matter of life and death. Above 1.5 mmol/L expect coarse tremor, ataxia, confusion, vomiting and diarrhea; above 2.5 mmol/L, oliguria, seizures, coma and death. Anything that reduces renal clearance precipitates it — dehydration, non-steroidal anti-inflammatory drugs, angiotensin-converting enzyme inhibitors, thiazide diuretics — and pregnant women need careful dose management with a higher loss of clearance after delivery. Patients should be taught to stop lithium and seek help during any illness causing dehydration.",
      },

      { type: "heading", level: 2, text: "Management of bipolar depression" },
      {
        type: "paragraph",
        text: "Depression is the pole that dominates the illness course and the suicide risk, and it is harder to treat. The evidence-based options are quetiapine (which is licensed and effective for bipolar depression), lamotrigine (with slow titration because of the Stevens-Johnson risk), the combination of olanzapine with fluoxetine, and lurasidone where available. Lithium has anti-suicidal and mood-stabilising properties. An antidepressant alone is inappropriate, both because of the switch risk and because there is little evidence of benefit.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Antidepressant monotherapy in a patient with bipolar disorder is a recognised source of harm. It can precipitate a switch into mania or rapid cycling, destabilise the longitudinal course, and has been associated with worsening outcome. If an antidepressant is ever used, it is only alongside a mood stabiliser or antipsychotic, for a depressive episode, and for the shortest duration compatible with response — with an explicit stop date.",
      },

      { type: "heading", level: 2, text: "Maintenance and monitoring" },
      {
        type: "table",
        headers: ["Agent", "Place in maintenance", "Monitoring required", "Principal hazards"],
        rows: [
          ["Lithium", "First-line maintenance, reduces relapse, suicide and mortality", "Serum level (aim 0.6-1.0 mmol/L, checked at least annually and after dose changes), creatinine and eGFR, thyroid function, calcium, weight, pregnancy test in women of childbearing potential", "Toxicity from any cause of reduced renal clearance; chronic tubulointerstitial nephropathy and nephrogenic diabetes insipidus; hypothyroidism; hyperparathyroidism; teratogenicity"],
          ["Valproate", "Alternative, particularly effective for rapid cycling and mixed states", "Full blood count, liver function, weight", "Highly teratogenic: neural tube defects, neurodevelopmental and autistic-type outcomes. In much of the world, it must not be prescribed to any woman or girl of childbearing potential unless a pregnancy prevention programme is in place and she has been counselled"],
          ["Lamotrigine", "Alternative; relatively better for preventing depressive relapse than manic relapse", "Dose titration over at least five weeks to reduce rash risk; report any rash immediately", "Stevens-Johnson syndrome and toxic epidermal necrolysis; interactions with valproate"],
          ["Second-generation antipsychotics", "Maintenance, especially in those responsive in the acute phase", "Weight, glucose, lipids, prolactin where symptomatic, and ECG where indicated", "Metabolic syndrome, sedation, tardive dyskinesia with long exposure"],
        ],
      },
      {
        type: "paragraph",
        text: "Psychosocial treatment is integral rather than adjunctive. Psychoeducation is the single most effective intervention available in reducing relapse, and it addresses adherence, the recognition of prodromes, sleep regularity, the avoidance of antidepressants without supervision, and the repair of the social and occupational wreckage. Interpersonal and social rhythm therapy formalises sleep and routine. Family-focused therapy targets high expressed emotion and criticism. CBT addresses residual depressive symptoms. Employment and social support predict outcome as strongly as any drug.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Failing to ask about hypomania in a depressed patient, then prescribing an SSRI. This is the commonest and most consequential error in this lesson. A single question about reduced sleep needs and unusual energy takes twenty seconds and changes the entire treatment plan.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Interpreting the patient's own account as reliable for a manic episode. Manic patients lack insight into the episode itself and often deny symptoms precisely because of grandiosity. A collateral history from a relative or partner is more valuable than the patient's own account, and the mother's or partner's version is the one to record.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing lithium or valproate in a woman of childbearing potential without a pregnancy discussion. Lithium causes Ebstein anomaly and valproate is a potent teratogen; the conversation must include contraception, planning, and the risks of an untreated episode, and it must be documented and repeated, not held once.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 24-year-old woman presents with low mood, hopelessness and suicidal ideation. Her partner mentions she has had several episodes this month lasting four or five days in which she talked rapidly, spent heavily and slept only three hours without next-day tiredness. What diagnosis is suggested, and what treatment change does it require?",
        answer: "Bipolar II disorder: hypomanic episodes (at least four days, observable by others, without marked impairment, psychosis or admission) alongside a major depressive episode, and never a manic episode. An antidepressant alone is inappropriate; the first-line treatments for bipolar depression are quetiapine, lamotrigine, and olanzapine-fluoxetine, always with a mood stabiliser or antipsychotic on board and with antidepressant monotherapy avoided.",
        explanation: "The task in a young depressed patient is always to exclude bipolarity before prescribing, because switching, rapid cycling and destabilisation are the recognised harms of antidepressant monotherapy.",
      },
      {
        type: "question",
        prompt: "A patient on lithium for four years develops vomiting, diarrhea and a coarse tremor during an episode of gastroenteritis and presents ataxic and confused. What is happening?",
        answer: "Lithium toxicity. Dehydration during gastroenteritis reduces renal clearance and raises the serum level. Management is to stop lithium, rehydrate, check the serum level urgently and correct electrolytes including magnesium, and support renal function; severe toxicity may require haemodialysis. The patient should have been taught during the initial lithium discussion to stop lithium during any illness causing dehydration and to be monitored.",
        explanation: "Volume depletion, non-steroidal anti-inflammatory drugs, ACE inhibitors and thiazides all reduce lithium clearance. This toxicity is preventable with patient education, which makes that education a part of prescribing.",
      },
      {
        type: "question",
        prompt: "Why is rapid cycling important clinically?",
        answer: "It is associated with greater chronicity, poorer inter-episode recovery, greater suicide risk and a poorer response to lithium; it is more common in women and is frequently precipitated by antidepressant use or thyroid disease. Management therefore involves excluding thyroid disease and reducing or stopping antidepressants, and favouring valproate, quetiapine or lamotrigine, with careful psychosocial support.",
        explanation: "Rapid cycling is both a prognostic marker and a warning to search for iatrogenic and organic contributors, since correcting them can restore a more tractable course.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Bipolar disorder is a disorder of activation with two poles. Mania is at least a week of elevated or irritable mood with increased energy and at least three associated symptoms, causing impairment or admission; hypomania is shorter, observable and non-impairing. Bipolar I requires mania, bipolar II requires hypomania plus a major depressive episode, and both require screening for thyroid and substance causes. Lithium, valproate, lamotrigine and second-generation antipsychotics are the mainstays, antidepressant monotherapy is a hazard, and psychoeducation and sleep regularity carry most of the relapse-prevention weight.",
      },
      {
        type: "paragraph",
        text: "Next: depressive disorders. You will see the syndrome that is the commonest reason a patient of any age reaches a doctor, how it is separated from grief and adjustment, and how suicide risk is assessed.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "A patient has had elevated mood with three associated symptoms for at least four days, observed by others, without marked impairment, psychosis or hospitalisation. This is best described as:",
        options: [
          "A manic episode",
          "A hypomanic episode",
          "Cyclothymia",
          "Normal mood variation, requiring no diagnosis",
        ],
        correctIndex: 1,
        explanation: "At least four days, observable, without marked impairment or psychosis, and not requiring admission, is hypomania. Mania is at least one week, or shorter if hospitalisation is needed, and causes marked impairment.",
      },
      {
        type: "mcq",
        stem: "Which combination is the most dangerous to prescribe to a patient with bipolar disorder presenting with a depressive episode?",
        options: [
          "Quetiapine alone",
          "Lamotrigine alone, titrated over six weeks",
          "An SSRI antidepressant alone",
          "Lithium alone",
        ],
        correctIndex: 2,
        explanation: "Antidepressant monotherapy risks a switch into mania, rapid cycling and destabilisation, with little evidence of benefit. Quetiapine, lithium and lamotrigine all have positive evidence in bipolar depression; lithium additionally reduces suicide risk.",
      },
      {
        type: "mcq",
        stem: "Which monitoring is mandatory in a woman of childbearing potential who is starting valproate for bipolar disorder?",
        options: [
          "Pregnancy prevention programme, counselling, and pregnancy testing before and during treatment, because valproate is highly teratogenic",
          "No additional monitoring, since the risk is only in the first trimester",
          "Serum magnesium alone",
          "Annual chest radiography",
        ],
        correctIndex: 0,
        explanation: "Valproate causes neural tube defects and neurodevelopmental harm, and in many jurisdictions must not be prescribed to women or girls of childbearing potential unless a pregnancy prevention programme is in place and the patient has been counselled and tested. The discussion must be documented and repeated.",
      },
      {
        type: "mcq",
        stem: "Which finding best distinguishes mania from hyperthyroidism when both produce overactivity and emotional lability?",
        options: [
          "The presence of decreased need for sleep, which is specific to mania",
          "Goitre, weight loss despite increased appetite, tremor and a suppressed TSH",
          "Pressured speech, which does not occur in thyroid disease",
          "Irritability, which is absent in hyperthyroidism",
        ],
        correctIndex: 1,
        explanation: "Thyroid function tests are mandatory at first presentation of apparent mania, because hyperthyroidism mimics it closely. Decreased sleep need, pressured speech and irritability can occur in both; a suppressed TSH and a goitre point to the endocrine cause.",
      },
      {
        type: "mcq",
        stem: "Which statement about the significance of collateral history in an acute manic episode is correct?",
        options: [
          "It is unnecessary because manic patients are usually accurate about their own state.",
          "The patient's relatives are biased and should not be interviewed.",
          "The patient's understanding of the episode may be impaired by grandiosity and by denial, so a relative's account is often more reliable than the patient's.",
          "Collateral history should be withheld for reasons of confidentiality.",
        ],
        correctIndex: 2,
        explanation: "Insight is characteristically poor in mania, so the patient's account is often the least reliable source. A relative's account supports diagnosis, dates the onset and detects rapid cycling. Confidentiality still applies — the information is used with consent where possible, but in emergencies it may be disclosed in the patient's best interests.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 9 — Depressive disorders (fully authored)
// ---------------------------------------------------------------------------
function lesson9(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define a depressive episode by its core and somatic symptoms, its duration and its severity bands; distinguish depressive disorder from grief, adjustment disorder, dysthymia, depressive pseudodementia and depressive symptoms caused by medical illness or medication; apply the two screening questions and the PHQ-9 appropriately; assess suicide risk in terms of ideation, plan, intent, means and protective factors; and outline the stepped management of depression including psychological therapy, antidepressant selection and administration, electroconvulsive therapy and risk-aware monitoring.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 8 (Bipolar disorder). Screening for past mania or hypomania is a prerequisite for safely treating any depressive episode, and this lesson assumes it.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Depressive episode",
        text: "A period of at least two weeks characterised by depressed mood and loss of interest or pleasure in most activities, accompanied by reduced energy and difficulties with concentration, sleep, appetite, self-esteem and hope, and often by thoughts of death or suicide — sufficient to impair functioning to a degree that is clinically recognisable.",
      },
      {
        type: "paragraph",
        text: "Depression is the commonest reason a patient of any age consults a doctor and one of the largest causes of disability worldwide. The single most useful shift in thinking is to separate symptom, syndrome and diagnosis. Low mood is a symptom everyone experiences; a depressive episode requires duration, severity and impact; and a depressive disorder requires exclusion of other causes and of bipolarity. Keep those three apart and you will neither over-diagnose misery nor under-diagnose illness.",
      },
      {
        type: "definition",
        term: "Anhedonia",
        text: "The loss of the capacity to experience pleasure and, critically, of the capacity to anticipate it. It is one of the two core symptoms of depression and it outranks sadness as a marker of severity: the patient no longer expects anything to be worth doing, which is what produces the withdrawal and the inaction.",
      },
      {
        type: "paragraph",
        text: "One further feature deserves emphasis because it is frequently misattributed to weakness or laziness. In depression, the difficulty is not that the patient will not act but that the machinery of initiating action is impaired: reward anticipation is blunted, effort is subjectively more costly, and concentration fails at the point of use. The clinical description is that of withdrawal and inactivity, and patients are often blamed for it — by employers, by families, and occasionally by clinicians.",
      },

      { type: "heading", level: 2, text: "The symptoms" },
      {
        type: "table",
        headers: ["Domain", "Symptoms", "How to elicit it"],
        rows: [
          ["Core", "Persistent low mood or irritability; loss of interest and pleasure", "'In the past two weeks, how often have you been bothered by feeling down, depressed or hopeless?' and '...by little interest or pleasure in doing things?'"],
          ["Energy", "Fatigue and loss of energy; activities feel disproportionately effortful", "'Do everyday tasks take more effort than they used to?'"],
          ["Biological", "Insomnia with early morning waking or, less commonly, hypersomnia; appetite and weight change; reduced libido; diurnal variation with a worse morning", "'What time do you wake, and how do you feel then compared with the evening?'"],
          ["Cognitive", "Impaired concentration and indecisiveness; poor memory; slowed thinking", "'Have other people noticed a change in how much you can take in?'"],
          ["Affective-cognitive", "Guilt, worthlessness, hopelessness, low self-confidence, self-criticism", "'When you make a mistake, what do you think it says about you?'"],
          ["Suicidality", "Recurrent thoughts of death, suicidal ideation, plans, prior attempts", "'Have you had thoughts that you would be better off dead, or of hurting yourself?'"],
          ["Psychotic", "Mood-congruent delusions of guilt, worthlessness, poverty, nihilism or persecution; auditory voices of condemnation", "A psychotic depression is severe by definition and requires urgent treatment"],
        ],
      },
      {
        type: "paragraph",
        text: "The thresholds are the part that must be exact. ICD-11's episode requires at least two weeks with depressed mood, loss of interest or reduced energy plus at least four further symptoms from the list; mild (four symptoms), moderate (five or six) and severe (seven or more, with or without psychosis) are the conventional severity bands, classified by symptom count and functional impact. DSM-5 requires five or more symptoms over the same two weeks, including one of the two core symptoms, with clinically significant distress or impairment, and with exclusions for substances, medical illness, grief and bipolarity.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Dysthymia, now persistent depressive disorder, describes at least two years of low mood with additional symptoms that do not reach full episode criteria. It is not a mild form of the same illness; it is a distinct, chronic, early-onset pattern with a higher risk of later major depressive episodes and a poorer response to short treatments. Double depression — a major episode superimposed on persistent depressive disorder — is common and often missed, because both patient and clinician discount the chronic background as personality.",
      },

      { type: "heading", level: 2, text: "Differential diagnosis" },
      {
        type: "table",
        headers: ["Condition", "What distinguishes it", "The action it requires"],
        rows: [
          ["Normal grief and bereavement reaction", "Waves of painful yearning focused on the deceased, preserved self-esteem, capacity for humour and pleasure, and doubt rather than guilt about what happened", "Support and monitoring; not a diagnosis unless it persists beyond a few months or meets episode criteria, and grief is a risk factor for later depression rather than an alternative to it"],
          ["Adjustment disorder with depressed mood", "Emerges within three months of an identifiable stressor and does not meet full episode criteria", "Problem-solving, counselling and monitoring; resolve the stressor where possible"],
          ["Bipolar depression", "A history of mania or hypomania; early onset, atypical features, psychomotor retardation and postpartum onset are pointers", "Screen with the two questions of Lesson 8 before prescribing; bipolar depression is treated with quetiapine, lamotrigine or lithium rather than antidepressant monotherapy"],
          ["Substance- or medication-induced depressive disorder", "Temporal relation to alcohol, cannabis, stimulant withdrawal, opioids, corticosteroids, interferon alfa, isotretinoin, varenicline or antihypertensives", "Withdraw, substitute or reduce the offending agent where possible and reassess"],
          ["Depression due to a medical condition", "Hypothyroidism, anaemia, obstructive sleep apnoea, vitamin B12 or folate deficiency, Cushing syndrome, Parkinson's disease, dementia, cerebrovascular disease, malignancy, Addison's disease, chronic infection", "Check thyroid function, full blood count, B12, folate, glucose, calcium, renal and liver function, and consider further testing on history"],
          ["Delirium and dementia", "Acute change with impaired attention and fluctuating consciousness in delirium; insidious multi-domain decline with preserved attention early in dementia", "Delirium is a medical emergency; depressive pseudodementia responds to the treatment of the depression and is a trap made by not asking about mood"],
          ["Anxiety disorders", "Worry, tension and restlessness dominate; depression is commonly comorbid and should be diagnosed alongside, not instead of", "Treat both; comorbidity is the rule and worsens prognosis"],
          ["Premenstrual dysphoric disorder and perimenopausal depression", "Cyclical mood symptoms, irritability and tension confined to the luteal phase", "A symptom diary over two or three cycles; treatment may be cyclical"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Always exclude bipolar disorder and always exclude organic disease. A woman in her twenties with three depressive episodes and antidepressant-induced agitation needs the mania question asked. A man of sixty with new-onset depression, weight loss and fatigue needs a clinical examination, not a prescription.",
      },

      { type: "heading", level: 2, text: "Special presentations" },
      {
        type: "table",
        headers: ["Presentation", "Phenomenology", "Clinical importance"],
        rows: [
          ["Melancholic depression", "Pervasive anhedonia, non-reactive mood, early morning waking, marked psychomotor retardation or agitation, weight loss, excessive guilt", "When severe, the physical treatments — electroconvulsive therapy and antidepressants — outperform psychotherapy alone"],
          ["Atypical depression", "Mood reactivity, hypersomnia, hyperphagia with weight gain, leaden paralysis of the limbs, long-standing interpersonal rejection sensitivity", "Historically linked with monoamine oxidase inhibitors, but SSRIs are used in practice; the pattern often begins early and persists"],
          ["Psychotic depression", "Mood-congruent delusions of guilt, worthlessness, poverty or nihilism, or depressive auditory hallucinations", "Requires combined antidepressant-antipsychotic treatment or electroconvulsive therapy; antipsychotic alone is inadequate"],
          ["Postnatal depression", "Onset within weeks to months after delivery, with anxiety, intrusive thoughts of harm to the infant and exhaustion", "Treat the mother's illness and assess the infant's safety and development; peripartum screening is a normal part of maternity care"],
          ["Depression with anxiety and irritability", "Tension, restlessness and irritability alongside low mood; commoner in men, adolescents and older adults", "Do not discount irritability: it is a depressive symptom in its own right and is often the presenting complaint in men"],
          ["Seasonal affective disorder", "Recurrent winter episodes with hypersomnia, hyperphagia and carbohydrate craving", "Bright light therapy has a specific evidence base here"],
        ],
      },

      { type: "heading", level: 2, text: "Screening and suicide risk assessment" },
      {
        type: "paragraph",
        text: "The two screening questions derive from the nine items of the PHQ-9: over the last two weeks, how often have you been bothered by (a) little interest or pleasure in doing things, and (b) feeling down, depressed or hopeless? A yes to either triggers the full PHQ-9, which is a severity instrument with cut points of 5, 10, 15 and 20 for mild, moderate, moderately severe and severe. Item nine asks about thoughts of being better off dead or of hurting oneself, and a positive response must be followed by direct assessment, not by a formula.",
      },
      {
        type: "table",
        headers: ["Suicide risk domain", "Static factors", "Dynamic factors", "Protective factors"],
        rows: [
          ["History", "Previous attempt — the strongest single predictor; family history of suicide", "Current depressive episode, hopelessness, recent discharge from hospital", "Good social support, dependants, religious objection, reasons for living stated by the patient"],
          ["Access", "Occupation or home with means (firearms, medications, high buildings)", "Intoxication, which disinhibits and impairs judgement", "Restricting means, storing medications more safely, removing firearms"],
          ["Intent and plan", "—", "Specificity, lethality and timing of the plan; any preparation made", "Future orientation; the patient's stated reasons and the therapeutic relationship"],
          ["Demography and context", "Male sex (completed suicide), older age, chronic pain, recent bereavement, unemployment", "Isolation, recent relationship breakdown, financial crisis, alcoholism", "Engagement with services, and a treatment plan the patient accepts"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Ask directly, and do not believe the myth that asking plants the idea. A patient is not made suicidal by a question, and an unasked question leaves the risk unassessed. Ask about ideation first, then plan, then intent, then means, then protective factors. Record the patient's own words — 'I want to die' is a different entry from 'I would not mind not waking up'. Finally, avoid the phrase 'committed suicide', which implies criminality, and use 'died by suicide'.",
      },
      {
        type: "paragraph",
        text: "Suicide risk is elevated early in treatment, in the weeks after diagnosis, and shortly after discharge from hospital. It is concentrated in patients with depression combined with hopelessness, insomnia and substance misuse. A safety plan — written, with the patient, naming warning signs, coping strategies, people to contact, and means restriction — reduces subsequent suicidal behaviour and is recommended alongside risk assessment rather than instead of it.",
      },

      { type: "heading", level: 2, text: "Management" },
      {
        type: "paragraph",
        text: "Care is stepped: the intensity of treatment is matched to severity and response, and the stepping is both up and down. Mild depression is treated with guided self-help, structured physical activity, behavioural activation, computerised or group cognitive therapy, and problem-solving therapy; watchful waiting for two weeks is reasonable for a first presentation. Moderate depression is treated with individual cognitive therapy or interpersonal therapy. Severe and psychotic depression requires combined pharmacotherapy, sometimes electroconvulsive therapy, and often admission.",
      },
      {
        type: "table",
        headers: ["Intervention", "Indication", "Evidence and notes"],
        rows: [
          ["CBT", "Moderate and severe depression; relapse prevention", "The most extensively evidenced psychological treatment; 12-16 sessions; equal in effect to medication for milder episodes and superior in relapse prevention"],
          ["Interpersonal therapy", "Depression related to loss, role transition, role dispute and social isolation", "Twelve to sixteen sessions; addresses the interpersonal context that precipitated the episode"],
          ["Behavioural activation", "Depression with withdrawal and low activity", "Simple to deliver, highly effective, and the mechanism of relief is increased contact with reinforcement — as predicted by Lesson 2"],
          ["Problem-solving therapy", "Multiple life problems; low educational attainment; older adults", "Structured and practical, and superior to placebo in older adults with executive impairment"],
          ["Mindfulness-based cognitive therapy", "Relapse prevention in recurrent depression", "Reduces relapse in patients with three or more previous episodes, roughly halving it, at the cost of intensive group practice"],
          ["Psychodynamic and counselling approaches", "Depression with chronic interpersonal themes", "Effective for a substantial minority, but the evidence is weaker and the duration longer"],
          ["Physical activity and sleep regulation", "All severities, as adjuncts", "Exercise has moderate efficacy and improves physical comorbidity, which is itself a cause of excess mortality"],
        ],
      },
      {
        type: "paragraph",
        text: "Antidepressants are first-line for moderate and severe depression and are usually unnecessary for mild. Selective serotonin reuptake inhibitors (sertraline, escitalopram, fluoxetine) are the usual first choice on tolerability; serotonin and noradrenaline reuptake inhibitors (venlafaxine, duloxetine) are second-line and carry greater withdrawal burden and blood pressure effects. The practical rules governing their use are the following:",
      },
      {
        type: "table",
        headers: ["Rule", "Content", "Rationale"],
        rows: [
          ["Latency", "A response takes two to four weeks, and much longer for full remission — do not judge before four weeks, and do not abandon before six to eight weeks at an adequate dose", "The monoamine rise is immediate but the therapeutic effect depends on downstream adaptation"],
          ["Monitoring", "Weekly review for the first weeks in patients at risk of suicide, particularly the under-25s", "Regulatory agencies have warned of a small increase in suicidal ideation early in treatment in this age group"],
          ["Duration", "Continue for at least six months after remission, and two years or longer for recurrent or severe episodes", "Premature withdrawal is a principal cause of relapse, and discontinuation is the commonest error"],
          ["Switching", "After failure, switch class (SSRI to SNRI or mirtazapine) or augment with lithium, aripiprazole, quetiapine or thyroid hormone", "Non-response to one agent predicts response to another rather than to none"],
          ["Discontinuation", "Taper over weeks to months; expect FINISH symptoms (flu-like, insomnia, nausea, imbalance, sensory disturbance, hyperarousal)", "Confident reassurance before starting that the drug can be tapered prevents much avoidable alarm"],
          ["Adverse effects", "Hyponatraemia, particularly in older adults; gastrointestinal upset and sexual dysfunction; bleeding risk with non-steroidal anti-inflammatory drugs; serotonin syndrome with triptans and with tramadol or linezolid; QT prolongation with citalopram", "Discuss these before prescribing: an informed patient adheres better, and the hyponatraemia risk in the elderly is often forgotten"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not tell a patient that they will become dependent. Antidepressants are not addictive in the pharmacological sense: there is no craving and no dose escalation. There is a physiological adaptation on stopping, which is why tapering is used, and conflating that with addiction is both inaccurate and a cause of avoidable non-adherence. This distinction is worth making explicitly in the first consultation.",
      },
      {
        type: "paragraph",
        text: "Electroconvulsive therapy is the most effective treatment available for severe depression, and it is specifically indicated when there is psychotic depression, catatonia, refusal of food or drink, high immediate suicide risk, or failure of other treatment. Six to twelve treatments are typically given, and the main adverse effects are transient confusion and retrograde amnesia for the period around treatment. It is a treatment of choice, not a last resort, and the stigma that surrounds it derives from historical practice rather than from modern, consent-based, monitored electroconvulsive therapy.",
      },
      {
        type: "paragraph",
        text: "Refractory depression is treated with a combination of electroconvulsive therapy, repetitive transcranial magnetic stimulation, ketamine or esketamine in specialist services with monitoring for dissociation and blood pressure, and, less commonly, vagus nerve stimulation. Finally, the social determinants of relapse — unemployment, debt, isolation and carer burden — must be addressed alongside the symptoms, because they are causal, as Lesson 6 established.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Prescribing an antidepressant for a patient whose low mood is a normal reaction to bereavement, redundancy or a new disability. In the right situation that is not unkind, but it converts an understandable reaction into a medical problem, and it delays the problem solving that the situation actually requires. Ask whether the symptoms exceed the reaction, and if they do not, treat the problem.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Confounding the hypothyroid presentation. Depression is a common presentation of hypothyroidism and of anaemia, and thyroid function, a full blood count, B12 and folate are as much a part of the first assessment as the mental status examination. Weight loss and fatigue in an older patient should prompt a physical examination before a prescription.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Assuming that a patient with a chronic disease who is depressed needs only reassurance, or conversely that someone with a chronically gloomy manner cannot be depressed. Depression is common in chronic physical disease, worsens its outcome, and responds to treatment. And a low-grade, lifelong, low mood is persistent depressive disorder — it is neither a character trait nor a mild episode, and it is often missed because both patient and clinician have discounted it as personality.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 62-year-old woman has had six months of low mood, anhedonia and 8 kg weight loss with early morning waking and profound guilt about a trivial decision she made at work. What is the diagnosis, the differential, and the main safety consideration?",
        answer: "A severe depressive episode, melancholic in subtype, given the anhedonia, early waking, marked weight loss, excessive guilt and psychomotor features. The differential includes hypothyroidism, anaemia, carcinoma, and depression secondary to medication. The main safety consideration is suicide risk from hopelessness, guilt and insomnia — in an older woman, which must be assessed directly and specifically.",
        explanation: "Severe melancholic depression responds particularly well to physical treatment. A first presentation of depression in an older adult demands a physical work-up, because organic disease presents psychologically more often than clinicians expect.",
      },
      {
        type: "question",
        prompt: "How would you ask about suicidal ideation without leading the patient?",
        answer: "Begin with a normalising statement, then ask directly and specifically: 'People who feel this low sometimes have thoughts of not wanting to be here anymore. Have you had thoughts like that?' Then escalate: 'Have you thought about how you might do it? Have you made any plans or taken any steps? What stops you? Who could you contact?' The final questions address intent, means and protective factors.",
        explanation: "The normalising preface reduces the pressure to deny, the escalation distinguishes passive ideation from active intent, and the protective question identifies what can be strengthened in a safety plan. Asking does not increase risk; not asking leaves it unmeasured.",
      },
      {
        type: "question",
        prompt: "A patient improved on sertraline six months ago and now asks to stop immediately. What is your advice?",
        answer: "Continue for at least six months after remission — so for a further three months — and then taper over weeks to months rather than stopping abruptly. I would explain that abrupt discontinuation produces flu-like symptoms, insomnia, nausea, imbalance, electric-shock-like sensations and transient anxiety, which are physiological and not addiction, and that relapse risk is highest in the months immediately after stopping.",
        explanation: "Duration of treatment and the manner of withdrawal are the two most modifiable causes of relapse in depression, and both are controlled at the moment the prescription is written, not when the patient asks to stop.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "A depressive episode is two weeks of depressed mood and anhedonia with associated cognitive, somatic and suicidal symptoms, graded by count and impact, and distinguished from grief, adjustment disorder, bipolar depression and organic disease. Screening uses two questions and a nine-item severity measure; suicide risk is assessed directly for ideation, plan, intent, means and protective factors. Management is stepped, psychological therapies carry the relapse-prevention advantage, antidepressants require adequate dose, duration and monitoring, and electroconvulsive therapy remains the most effective treatment for severe and psychotic depression.",
      },
      {
        type: "paragraph",
        text: "Next: anxiety, phobia and obsessive-compulsive disorder. You will apply the two-factor conditioning model of Lesson 2 to the commonest disorders in practice, and see why exposure and response prevention, rather than reassurance, is the active ingredient.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which pair of symptoms are the two core symptoms of a depressive episode?",
        options: [
          "Early morning waking and weight loss",
          "Depressed mood and loss of interest or pleasure in nearly all activities",
          "Guilt and hopelessness",
          "Fatigue and poor concentration",
        ],
        correctIndex: 1,
        explanation: "Depressed mood and anhedonia are the two core symptoms, both classification systems requiring at least one of them. The others are associated symptoms whose presence determines severity rather than diagnosis.",
      },
      {
        type: "mcq",
        stem: "Which feature most strongly suggests that a grief reaction is not a depressive episode?",
        options: [
          "Waves of yearning for the deceased with preserved self-esteem, humour and the capacity to feel pleasure when distracted",
          "Early morning waking and marked weight loss",
          "Persistent low mood for three weeks",
          "Guilt about the period before the death",
        ],
        correctIndex: 0,
        explanation: "Normal grief comes in waves, focuses on the deceased, does not destroy self-esteem and leaves intact the ability to react to comfort. Pervasive anhedonia, pervasive low mood, diurnal variation, weight loss, worthlessness and guilt are features that point to an episode.",
      },
      {
        type: "mcq",
        stem: "Which blood test is most important at a first presentation of depression in an older adult?",
        options: [
          "Thyroid function, since hypothyroidism mimics depression closely",
          "Troponin, since depression is a cardiac symptom",
          "Serum ferritin alone, without thyroid function",
          "No blood tests are needed unless the patient reports physical symptoms",
        ],
        correctIndex: 0,
        explanation: "Hypothyroidism presents with low mood, anergia, weight gain and impaired cognition and is reversible. Full blood count, renal and liver function, B12 and folate, calcium and glucose complete the organic work-up.",
      },
      {
        type: "mcq",
        stem: "A patient with severe depression and delusions of worthlessness is best treated with which of the following?",
        options: [
          "An SSRI alone at low dose",
          "Supportive psychotherapy and watchful waiting",
          "Electroconvulsive therapy, or an antidepressant combined with an antipsychotic, given psychotic features indicate a severe episode",
          "Benzodiazepines to manage the agitation",
        ],
        correctIndex: 2,
        explanation: "Psychotic depression carries severe morbidity and suicide risk and responds less well to antidepressant alone; combined pharmacotherapy or electroconvulsive therapy is indicated, with electroconvulsive therapy being the most effective overall. Benzodiazepines treat agitation only, never the underlying illness.",
      },
      {
        type: "mcq",
        stem: "Which statement about antidepressant withdrawal is correct?",
        options: [
          "The FINISH symptoms of flu-like illness, insomnia, nausea, imbalance, sensory disturbance and hyperarousal are expected and respond to tapered withdrawal.",
          "They do not occur with SSRIs, only with monoamine oxidase inhibitors.",
          "They indicate addiction and indicate that antidepressant medication must be avoided.",
          "They resolve spontaneously within hours, so no taper is needed.",
        ],
        correctIndex: 0,
        explanation: "Discontinuation symptoms are a physiological adaptation, differ from addiction in that they involve neither craving nor dose escalation, and are minimised by tapering over weeks to months. Explaining this before prescribing prevents the alarm that leads to abrupt relapse.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 10 — Anxiety, phobia & OCD (fully authored)
// ---------------------------------------------------------------------------
function lesson10(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: distinguish normal anxiety from the anxiety disorders and state the duration, symptom-count and functional criteria that separate them; diagnose generalised anxiety disorder, panic disorder, agoraphobia, specific phobia, social anxiety disorder and obsessive-compulsive disorder; explain the acquisition and maintenance of each in terms of classical conditioning, avoidance learning and the cognitive factors of responsibility, thought-action fusion and intolerance of uncertainty; and outline first-line management, including exposure and response prevention, selective serotonin reuptake inhibitors, and the cautious role of benzodiazepines.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 2 (Learning and cognition) for conditioning and the two-factor avoidance model, and Lesson 9 (Depressive disorders) for the comorbidity that alters treatment.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Anxiety",
        text: "A state of apprehension about future threat, accompanied by autonomic arousal, muscle tension and avoidance of what is anticipated. Unlike fear, which has an identifiable and immediate object, anxiety is directed at something that has not happened yet — which is why a patient can be anxious while nothing at all is happening.",
      },
      {
        type: "paragraph",
        text: "Anxiety is the normal and necessary machinery of anticipating danger. Anxiety disorders arise when the same machinery runs at the wrong magnitude, in the wrong context, or for the wrong duration, and when the patient's own attempts to shut it down make it persist. Every disorder in this lesson is a variation on that theme, and every effective treatment works by interrupting the self-maintaining loop — usually by requiring the patient to stay with the anxiety rather than to remove it.",
      },
      {
        type: "table",
        headers: ["Disorder", "Core content", "Threshold"],
        rows: [
          ["Generalised anxiety disorder", "Excessive, difficult-to-control worry about multiple domains, with autonomic hyperactivity", "Most days for at least six months, with at least three of restlessness, fatigability, poor concentration, irritability, muscle tension and disturbed sleep"],
          ["Panic disorder", "Recurrent unexpected surges of fear with physical symptoms, followed by persistent concern or behavioural change", "Recurrent unexpected attacks plus at least one month of persistent worry about further attacks or a change in behaviour because of them"],
          ["Agoraphobia", "Fear and avoidance of situations where escape would be difficult or help unavailable", "Marked fear or avoidance in at least two of: public transport, open spaces, enclosed places, crowds, being outside alone"],
          ["Specific phobia", "Marked, immediate fear of a particular object or situation", "Persistent for at least six months, with avoidance or endurance with intense fear"],
          ["Social anxiety disorder", "Marked fear of scrutiny, embarrassment or humiliation in social situations", "Persistent for at least six months, with avoidance or endurance with intense anxiety"],
          ["Obsessive-compulsive disorder", "Persistent intrusive thoughts or images, and repetitive behaviours or mental acts performed to neutralise them", "Time-consuming, distressing, and interfering with function, with retained insight in most patients"],
        ],
      },

      { type: "heading", level: 2, text: "Generalised anxiety disorder" },
      {
        type: "paragraph",
        text: "The defining feature is free-floating worry: not one catastrophised object but several — finances, family, health, minor decisions — each considered in turn and none resolved. ICD-11 describes apprehension about everyday problems plus tension and motor restlessness, and DSM-5 specifies difficulty controlling the worry. The associated features are fatigue, poor concentration, irritability, muscle tension and disturbed sleep, and the physical presentation is dominated by autonomic arousal: palpitations, tremor, sweating, dry mouth, frequency of micturition and breathlessness, which is what brings the patient to a cardiologist more often than to a psychiatrist.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A patient with breathlessness, palpitations and dizziness has not failed a cardiology assessment until the cardiac, respiratory, haematological, endocrine and drug causes have been considered and the picture has been understood in context. Thyrotoxicosis, phaeochromocytoma, blood loss, anaemia, the parasympathomimetic effects of beta-agonists and pure nicotine withdrawal all present this way.",
      },

      { type: "heading", level: 2, text: "Panic disorder" },
      {
        type: "paragraph",
        text: "A panic attack is an abrupt surge of fear that peaks within minutes and carries at least four of the following: palpitations, sweating, trembling, feelings of breathlessness, choking, chest pain, nausea, dizziness, chills or hot flushes, paraesthesia, derealisation or depersonalisation, fear of losing control, and fear of dying.",
      },
      {
        type: "definition",
        term: "Panic disorder",
        text: "Recurrent unexpected panic attacks accompanied by at least one month of persistent worry about having further attacks, or a significant maladaptive change in behaviour (avoidance of exercise, avoidance of being alone) designed to prevent them. A panic attack alone is a symptom; the disorder is the fear of the fear and the behaviour it produces.",
      },
      {
        type: "paragraph",
        text: "The learning sequence is the classic two-factor account: the first attack is genuinely physiological and often unexplained, and the patient's interpretation that it is catastrophic ('I am having a heart attack', 'I am going mad') drives the physical arousal upward. The bodily sensations then become conditioned stimuli for further panic, and avoidance of anything associated with an attack is negatively reinforced by the relief it brings. Nocturnal panic attacks occur on waking, in the transition between sleep stages, and are typically mistaken for nightmares; anticipatory anxiety, between attacks, becomes the disabling part of the condition.",
      },
      {
        type: "callout",
        variant: "info",
        text: "Hyperventilation is the amplifier to target in treatment. Rapid breathing lowers arterial carbon dioxide, causing paraesthesia in the hands and around the mouth, dizziness, tetany and a sense of suffocation — sensations indistinguishable from the onset of panic, which drives further hyperventilation. Teaching slow diaphragmatic breathing with a prolonged out-breath breaks this loop, but it must be delivered alongside interoceptive exposure, because it is the tolerance of the sensations that resolves the disorder.",
      },

      { type: "heading", level: 2, text: "Phobic disorders and social anxiety" },
      {
        type: "table",
        headers: ["Disorder", "Feared object", "Avoidance", "Notes"],
        rows: [
          ["Specific phobia: animal", "Snakes, spiders, dogs, insects", "Avoids the animal and places where it might occur", "Snakes and spiders are the commonest; the prepared-learning account holds that these are evolutionarily salient and therefore acquired faster"],
          ["Specific phobia: natural environment", "Heights, water, storms", "Avoids the setting", "Height phobia is the most disabling of the specific phobias"],
          ["Specific phobia: situational", "Aeroplanes, lifts, tunnels, enclosed spaces", "Avoids transport, buildings and travel", "Claustrophobia overlaps strongly with agoraphobia and responds to exposure"],
          ["Blood-injection-injury phobia", "Blood, needles, injury, medical procedures", "Avoids dental and medical care, and pregnancy care in extreme cases", "Unique among phobias: the response is vasovagal, with a fall in heart rate and blood pressure, and fainting is common. Applied tension, which raises blood pressure, is the treatment of choice — exposure alone can worsen it"],
          ["Social anxiety disorder", "Social situations, performance, and being observed", "Avoids parties, public speaking, eating out, interviews, and phone calls", "Usually begins in adolescence. Most people with it are convinced their anxiety is visible, and it is far less visible than they suppose"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Do not mistake normal embarrassment for a disorder. Sweating, blushing and hesitation before speaking in public are ordinary. The disorder requires marked and persistent fear that is disproportionate to the situation and causes avoidance or intense distress. Conversely, do not dismiss social anxiety in a bright and socially fluent patient: presentation in public settings often coexists with pathological private fear.",
      },

      { type: "heading", level: 2, text: "Obsessive-compulsive disorder" },
      {
        type: "definition",
        term: "Obsession",
        text: "A recurrent, persistent intrusion — thought, image or urge — that is unwanted, recognised by the sufferer as originating in their own mind, and produces marked anxiety. It is resisted but cannot be dismissed by argument, and the patient recognises it as excessive. The recognition, termed insight, is what separates obsessions from delusions.",
      },
      {
        type: "definition",
        term: "Compulsion",
        text: "A repetitive behaviour or mental act that the person feels driven to perform to reduce the anxiety caused by an obsession, or to prevent some dreaded event, according to rules that cannot be applied flexibly. Obsessions and compulsions form linked pairs: checking compulsion to relieve fear of causing harm, mental neutralisation to relieve a blasphemous thought.",
      },
      {
        type: "table",
        headers: ["Differential", "Feature", "Why it is not OCD"],
        rows: [
          ["Obsessive-compulsive personality disorder", "Preoccupation with order, control and perfection, without resistance to the pattern", "Ego-syntonic: the person regards the traits as reasonable, whereas obsessions are unwanted and resisted"],
          ["Delusional disorder", "A fixed false belief with no recognition of excess", "Insight is intact in most OCD; in some patients insight is poor, and the clinical response to treatment then becomes the discriminator"],
          ["Psychosis", "Delusional convictions or hallucinations without recognition of their nature", "An insight question resolves the boundary directly"],
          ["Tic disorders", "Motor or vocal tics with a premonitory urge, relieved by the movement", "Tics are executed to discharge tension; compulsions are executed to neutralise a threat or to prevent an event"],
          ["Depression, anxiety, hypochondriasis and eating disorders", "Recurrent ruminations and checking that resemble rituals", "Ask whether the behaviours are performed to prevent harm or to neutralise distress; if they are habitual decision-making anxiety, the treatment is not exposure"],
          ["Substance-related and neurological causes", "Rituals emerging after amphetamine, cocaine or cocaine-withdrawal psychosis", "Temporal course, substance timing and neurological examination"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The three cognitive maintenance factors, identified by the Obsessive Compulsive Cognitions Working Group, are worth learning because they explain the treatment: an inflated sense of responsibility and an overestimation of threat (I am responsible for preventing harm), thought-action fusion (having the thought is morally equivalent to doing the act, or makes it more likely), perfectionism and intolerance of uncertainty (the only acceptable action is certainty). Exposure and response prevention attacks each in turn — by requiring the patient to hold uncertainty, to accept responsibility, and to permit the thought without acting.",
      },

      { type: "heading", level: 2, text: "Aetiology: conditioning plus cognition" },
      {
        type: "paragraph",
        text: "The behavioural account is Lesson 2's two-factor theory, stated in its modern form. Fear is acquired by classical conditioning; the response is maintained by negative reinforcement through avoidance, and every avoidance removes the disconfirmation that the feared outcome will not occur. Preparedness theory, proposed by Seligman, accounts for why phobias cluster on snakes, spiders and heights: organisms acquire fear of evolutionarily relevant stimuli more rapidly and more durably than of modern ones prepared by conditioning experiments in the laboratory.",
      },
      {
        type: "paragraph",
        text: "The cognitive contribution is the interpretative step. A palpitation is a bodily event; the belief that it signifies death is what converts it into a panic attack. A thought of pushing someone onto a railway track is an intrusion; the belief that thinking makes doing it more likely is what makes it an obsession. Anxiety disorders therefore have two routes to change: the behavioural route of exposure, which corrects the expectation directly, and the cognitive route of examining and testing the belief, which does the same work through inference.",
      },
      {
        type: "paragraph",
        text: "Developmental and familial factors contribute: behavioural inhibition in infancy (Lesson 4), an anxious and overprotective attachment style, parental modelling of anxious responses, parental control, and a specific contribution to anxiety disorders of moderate heritability, with little evidence that either traumatic conditioning or genes suffice alone. In OCD, family studies show elevated rates of obsessive-compulsive disorder in relatives of probands, and neuroimaging of the cortico-striato-thalamo-cortical loop is the standard neurobiological model, though it is a research model rather than a clinical tool.",
      },

      { type: "heading", level: 2, text: "Management" },
      {
        type: "paragraph",
        text: "The order of treatment is clear in evidence terms: graded exposure and response prevention for the phobic and obsessive disorders, cognitive therapy for the cognitive disorders, and selective serotonin reuptake inhibitors where the disorders are moderate to severe or where psychological treatment is unavailable, declined or insufficient. Combining the two is better than either alone in more severe cases.",
      },
      {
        type: "table",
        headers: ["Disorder", "Psychological treatment", "Pharmacological treatment", "Practical notes"],
        rows: [
          ["Specific phobia", "In vivo graded exposure with response prevention; applied tension for blood-injection-injury phobia", "Rarely required; beta-blockers may be used for performance anxiety", "Exposure can be delivered in a few sessions, and the strongest predictor of success is the patient remaining in the situation until anxiety falls, not escaping it"],
          ["Panic disorder", "Cognitive restructuring of catastrophic misinterpretation, interoceptive exposure and then in vivo exposure of avoided situations", "SSRIs (sertraline, escitalopram, fluoxetine, paroxetine), with clomipramine second-line", "Benzodiazepines suppress the panic and therefore block the exposure that resolves it; never combine with an SSRI without discussing serotonin syndrome and sedation"],
          ["Agoraphobia", "Graded exposure with response prevention, or self-exposure programmes and bibliotherapy with therapist contact", "SSRIs where severe, particularly where panic is prominent", "The treatment is time-consuming but durable; drop-out is the main obstacle"],
          ["Social anxiety disorder", "Cognitive therapy targeting self-focused attention and the feared evaluation, plus social exposure", "SSRIs; beta-blockers for performance situations only", "Group cognitive therapy has specific advantages: the group is itself a graded social exposure"],
          ["Generalised anxiety disorder", "Cognitive therapy, applied relaxation, and worry time with problem-solving", "SSRIs, serotonin and noradrenaline reuptake inhibitors, buspirone, and pregabalin in some guidelines", "Benzodiazepines produce rapid relief but no durable benefit and significant harm; a fixed two- to four-week prescription with a taper plan is the outside limit"],
          ["Obsessive-compulsive disorder", "Exposure and response prevention is the specific and first-line treatment; cognitive techniques for the maintenance beliefs", "SSRIs at higher doses than for depression (for example fluoxetine 40-80 mg), clomipramine second-line; augmentation with an antipsychotic in treatment-resistant cases", "Response requires eight to twelve weeks at adequate dose and dose, which is roughly twice the duration used in depression"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reassurance is the maintenance factor, not the treatment. Checking the lock again, calling the doctor for the fourth time, or asking a partner whether you smell of the feared substance removes anxiety today and preserves the disorder for the next decade. Where reassurance is part of the presentation, response prevention means withholding it — and this must be planned with family members as well as with the patient.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Benzodiazepines are not a treatment for anxiety disorders; they are a treatment for the sister symptom of fear. Tolerance and dependence follow within weeks, discontinuation produces rebound anxiety worse than the original, fall and fracture risk rises in the elderly, disinhibition and paradoxical aggression occur, and in combination with opioids respiratory depression is potentially fatal. Prescribe short courses for crises with a written taper plan, or not at all, and never initiate maintenance benzodiazepines.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Diagnosing panic disorder on the basis of a panic attack. Panic attacks occur in anxiety, in depression, in phobic encounters with the feared object, during withdrawal, and as isolated events in healthy people. The disorder requires recurrent unexpected attacks, at least a month of consequent worrying or behavioural change, and the exclusion of organic causes; a single attack with a subsequent avoidance is not panic disorder.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Mistaking agoraphobic avoidance for laziness, introversion or constitutional shyness. The consequence is a shrinking life with secondary loss, and repeated misinterpretation by others compounds the disability. Note also that avoidance is itself a barrier to recovery, so it is the specific target of treatment rather than a symptom to be sympathised with.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Reading OCD as a condition of patients who need reassurance. The rituals are performed to neutralise anxiety, and providing reassurance removes the very exposure that would otherwise disconfirm the belief. Worse, telling a patient to 'stop worrying about it' mistakes an ego-dystonic disorder for an ego-syntonic disposition.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A patient checks the front door eleven times before leaving. He knows it is irrational, dreads the morning, and says the thought 'what if the house burns down' arrives unbidden forty times a day. What is the diagnosis, what maintains it, and what is the first-line treatment?",
        answer: "Obsessive-compulsive disorder: obsessions (recurrent intrusive thoughts of catastrophe, recognised as unwanted and excessive) linked to compulsions (repeated checking, performed according to rigid rules and time-consuming). It is maintained by negative reinforcement: the checking removes the anxiety, so it is repeated. The first-line treatment is exposure and response prevention in conjunction with cognitive therapy for the maintenance beliefs, and SSRIs at higher-than-antidepressant doses where medication is needed.",
        explanation: "Insight is intact, so this is not a delusion, and the ritual is ego-dystonic, so it is not a character trait. Crucially, stopping the checking is not an act of willpower but the active ingredient of treatment.",
      },
      {
        type: "question",
        prompt: "Why is applied tension, rather than standard exposure, first-line for blood-injection-injury phobia?",
        answer: "Because the phobia produces a vasovagal response — an initial rise in heart rate and blood pressure, then a parasympathetically mediated fall that leads to fainting. Standard exposure without interference allows the pressure drop to occur and can increase fainting and avoidance. Applied tension, the deliberate tensing of the body to raise blood pressure, counters the fall directly and is therefore the effective technique.",
        explanation: "Blood-injection-injury phobia is the exception to the general rule that exposure works everywhere, and recognising it avoids a treatment that makes the disorder worse.",
      },
      {
        type: "question",
        prompt: "Which cognitive maintenance factor allows an intrusive, violent thought to become an obsessive one rather than an idle one?",
        answer: "Thought-action fusion, together with an inflated sense of responsibility: the belief that having the thought is morally equivalent to committing the act, or makes it more likely, transforms an unwanted intrusion into a threat that must be neutralised. The treatment targets this by having the patient hold the thought deliberately and experience the fact that nothing bad happens.",
        explanation: "Intrusive thoughts of harm occur in the large majority of healthy people; what separates them from OCD is the interpretation applied to them, not the occurrence of the thoughts themselves.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Anxiety disorders differ in content and duration rather than in mechanism. They are acquired through conditioning, amplified by catastrophic misinterpretation, and maintained by avoidance and reassurance, which remove the disconfirmation that would resolve them. The effective treatments are therefore graded exposure with response prevention, cognitive therapy for the safety beliefs, and selective serotonin reuptake inhibitors where the severity requires them; benzodiazepines buy days and cost months.",
      },
      {
        type: "paragraph",
        text: "Next: somatoform and dissociative disorders. You will see what happens when distress is expressed through the body rather than the mind, and how the empathy of the clinician is itself a treatment variable.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which minimum duration is required for generalised anxiety disorder?",
        options: [
          "One month",
          "Three months",
          "Six months on most days with difficulty controlling the worry",
          "Two weeks, with episodic worry between episodes",
        ],
        correctIndex: 2,
        explanation: "Generalised anxiety disorder requires excessive worry on most days for at least six months, which is the feature that distinguishes it from anxious depression, stress-related worry and adjustment. Two weeks is the threshold for a depressive episode, and anxiety lasting under six months with an identifiable stressor is classified differently.",
      },
      {
        type: "mcq",
        stem: "Which of the following is required for panic disorder rather than a panic attack alone?",
        options: [
          "Recurrent unexpected panic attacks, plus at least one month of persistent worry about further attacks or a change in behaviour",
          "A single unexpected attack and a normal electrocardiogram",
          "Recurrent attacks that occur only when the feared object is present",
          "Palpitations together with a documented arrhythmia on tape",
        ],
        correctIndex: 0,
        explanation: "Attacks are unexpected in panic disorder; a panic attack bound to a feared object is part of a phobia. Organic causes must be excluded, but the disorder is defined by the attacks plus the persistent worry or behavioural change that follows them.",
      },
      {
        type: "mcq",
        stem: "What does exposure and response prevention mean in the treatment of obsessive-compulsive disorder?",
        options: [
          "Gradual exposure to the feared situation, with the ritual prevented so that anxiety is allowed to habituate and the belief is tested",
          "Repeatedly performing the ritual until the patient becomes bored",
          "Exposure to the feared situation with the ritual permitted, since avoidance is the greater danger",
          "Avoiding the feared situation while the anxiety resolves naturally",
        ],
        correctIndex: 0,
        explanation: "Exposure brings the patient into contact with the trigger and response prevention blocks the ritual, so habituation occurs, the feared consequence does not happen, and the compensated belief is disconfirmed. Permitting the ritual removes the effect, and avoiding the situation removes the disconfirmation entirely.",
      },
      {
        type: "mcq",
        stem: "A patient with severe panic attacks asks for diazepam to take as needed. What is the correct position?",
        options: [
          "It is safe and effective long-term therapy for panic disorder.",
          "It may cause tolerance, dependence, rebound anxiety worse than the attacks, falls and disinhibition, and it blocks the exposure that resolves the disorder.",
          "It is contraindicated as a short-term adjunct to an SSRI and is completely avoided.",
          "It should be combined with an SSRI and continued at full dose for six months.",
        ],
        correctIndex: 1,
        explanation: "The practical answer is a limited prescription of at most two to four weeks with a written taper, not a maintenance supply. Longer use produces tolerance, dependence, falls and disinhibition and, more subtly, blocks the exposure that resolves the disorder.",
      },
      {
        type: "mcq",
        stem: "Which statement about specific phobia of blood and injections is correct?",
        options: [
          "The response is mediated by a fall in heart rate and blood pressure, and fainting is common",
          "The response is identical to all other phobic responses, with a pure sympathetic surge",
          "The treatment of choice is procedural reassurance and distraction alone",
          "The phobia is never disabling because patients can live normal lives",
        ],
        correctIndex: 0,
        explanation: "Blood-injection-injury phobia is the diphasic vasovagal exception among the phobias, and applied tension — training the patient to raise blood pressure — is the treatment of choice. Its disabling effect is in avoiding medical and dental care and in pregnancy care.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 11 — Somatoform & dissociative disorders (fully authored)
// ---------------------------------------------------------------------------
function lesson11(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: name the modern categories — somatic symptom disorder, illness anxiety disorder, functional neurological symptom disorder, and the dissociative disorders — and explain why 'hysteria' and 'somatoform' were replaced; recognise conversion presentations and the positive clinical signs by which functional neurological symptoms are distinguished from neurological disease; describe the predisposing, precipitating and perpetuating factors, including trauma, without implying fabrication; explain why repeated investigation is harmful; and outline an empathetic, single-clinician management plan and its psychological components.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lesson 10 (Anxiety, phobia and OCD) for the conditioning of symptoms and the role of avoidance, and Lesson 6 (Aetiology) for the framing of predisposing, precipitating and perpetuating factors.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Somatic symptom disorder",
        text: "One or more persistent, distressing somatic symptoms, accompanied by excessive thoughts, feelings or behaviours related to them — the excessive cognitive-affective response, not the symptom itself, is what distinguishes disorder from ordinary physical illness. In illness anxiety disorder the person is preoccupied with having or acquiring a serious illness with few or no somatic symptoms at all.",
      },
      {
        type: "definition",
        term: "Dissociation",
        text: "A disruption of the normal integration of consciousness, memory, identity, bodily perception and motor control, ranging from depersonalisation and derealisation (feeling detached from self or from the world) to dissociative amnesia, fugue, and — rarely and contentiously — dissociative identity disorder.",
      },
      {
        type: "paragraph",
        text: "The core insight in this lesson is that these conditions are real, not feigned, and that the old vocabulary — hysteria, conversion, somatoform — carried assumptions that harmed patients. The modern position is that a patient with functional neurological symptoms has a genuine neurological dysfunction that is produced by the brain's own mechanisms of attention and expectation, not by a lesion the scan can see. They are not pretending. They are, however, frequently treated as if they are, and the wound the treatment leaves is often worse than the symptom.",
      },
      {
        type: "table",
        headers: ["Old term", "Modern term", "What changed and why"],
        rows: [
          ["Hysteria", "Functional neurological symptom disorder; dissociative disorders; somatic symptom disorder", "The term carried a long history of contempt for women and of the assumption of moral weakness; the modern terms describe the neurological dysfunction without implying character"],
          ["Conversion", "Functional neurological symptom disorder", "'Conversion' asserted that psychic energy was converted into a bodily symptom — a claim without evidence. The modern term requires only that the dysfunction is incompatible with recognised neurological disease"],
          ["Somatoform disorder", "Somatic symptom disorder and illness anxiety disorder", "The old category required medically unexplained symptoms, which meant the diagnosis could not be made until every test had been done; the modern one rests on disproportionate response to symptoms, which is assessable from the beginning"],
          ["Hypochondria", "Illness anxiety disorder and somatic symptom disorder with predominant pain or health anxiety", "The old term was used dismissively as an accusation; the modern diagnosis separates those with few symptoms from those with persistent distressing symptoms"],
        ],
      },

      { type: "heading", level: 2, text: "Recognition: positive signs, not absent findings" },
      {
        type: "paragraph",
        text: "The crucial advance in this field is that functional neurological symptoms are diagnosed from the presence of positive signs of inconsistency and variability, not from the absence of findings on a scan. A diagnosis built positively is far more secure than one built by exclusion, and it also has to be communicated as such — 'your nervous system is working in a way that produces these symptoms, and here is how I can tell' rather than 'your tests were normal'.",
      },
      {
        type: "table",
        headers: ["Sign", "How it is elicited", "What it shows", "Cautions"],
        rows: [
          ["Hoover's sign for functional leg weakness", "The patient's hip extension is weak on direct testing but normal when the opposite hip is flexed against resistance", "Involuntary and automatic motor activation is preserved where voluntary activation is not", "Must be demonstrable in both directions, and performed with the patient's cooperation; a single positive is not enough"],
          ["Distractible tremor and tremor entrainment", "A tremor changes frequency or direction when the patient performs a distracting task, or entrains to a rhythm", "Involuntary rhythmic movements are modulated by attention", "Careful technique and experience needed; psychogenic tremor can look very like organic tremor"],
          ["Give-way weakness", "The muscle initially resists normally, then gives way abruptly", "Effort is inconsistently applied", "A patient with pain may give way; distinguish it carefully"],
          ["Non-dermatomal sensory loss", "Sensory loss that does not correspond to a nerve, root or dermatome, or that splits the midline exactly", "The map does not fit any anatomical structure", "Midline splitting must be exact and must be tested for it"],
          ["Dragging monoplegic gait and astasia-abasia", "Leg dragged as a unit without circumduction and without the usual compensatory movements; or a wildly unsteady gait that nonetheless does not fall", "The gait pattern is not produced by weakness or by ataxia", "Watch the patient walk and turn, not merely the straight-line gait"],
          ["Positive astatic pattern with normal leg power lying down", "Weakness on standing and walking that disappears in the lying position", "Function depends on context", "Always examine in both positions"],
        ],
      },
      {
        type: "example",
        text: "A 34-year-old woman is admitted with sudden-onset inability to move her right leg after an argument with her partner. Magnetic resonance imaging of the lumbar spine is normal, the reflexes are normal, and she has a positive Hoover's sign. The correct formulation is functional weakness of uncertain cause: the nervous system is producing a genuine inability to move, and the trigger was a distressing event. The incorrect formulations are (a) that she is malingering, which is an accusation requiring evidence of external gain, and (b) that the scans prove a neurological disease hidden from us, which is a claim without support.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "A normal investigation is not the diagnosis. Functional neurological symptoms are diagnosed by positive signs of internal inconsistency and variability with intact automatic function, accompanied by a history compatible with the psychosocial context. The old practice of diagnosing by exclusion exposed patients to years of invasive testing, entrenched invalidism and left the diagnosis unspoken once the tests ran out.",
      },

      { type: "heading", level: 2, text: "Aetiology: predisposing, precipitating and perpetuating" },
      {
        type: "table",
        headers: ["Stage", "Examples of contributing factors", "How it translates into the presenting symptom"],
        rows: [
          ["Predisposing", "Female sex; childhood adversity and traumatic experience; pre-existing anxiety, depression or a personality disorder; maladaptive illness beliefs from the family of origin; a recent minor physical illness or injury that made the body salient", "A nervous system already primed to detect and interpret bodily sensation as threatening"],
          ["Precipitating", "A physically trivial injury; a panic attack; an acute emotional event; a medical procedure, operation or anaesthetic; an episode of illness; a bereavement", "A single episode of altered function that is then misattributed to injury, and consolidated by attention"],
          ["Perpetuating", "Avoidance and disuse; catastrophic beliefs about the body; iatrogenic harm from repeated investigations, splinting, inactivity and conflicting advice; secondary gain such as compensation claims; comorbid anxiety and depression", "Loss of automatic movement and function through disuse, and loss of confidence that maintains the avoidance"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "The mechanism that explains why a patient who is desperate to recover cannot simply try harder is that attention and expectation act on the brain's own movement plans. Experimental work shows that voluntary movement of a limb can be impaired while the same movement performed automatically — reaching, protecting the body — remains intact, and that the predicted sensory consequences of movement are the mechanism through which willed action reaches the muscles. This is a model of nervous-system function, not a theory about hidden motive.",
      },

      { type: "heading", level: 2, text: "The dissociative disorders" },
      {
        type: "table",
        headers: ["Disorder", "Phenomenology", "Assessment"],
        rows: [
          ["Depersonalisation-derealisation disorder", "Persistent or recurrent feelings of detachment from one's own body, thoughts or feelings, or of unreality of the surroundings, with retained reality testing", "Ask about visual fogging, feeling like an automaton, and watching oneself from outside; it is common in anxiety, depression and PTSD and is not psychosis"],
          ["Dissociative amnesia", "Inability to recall important autobiographical information, usually of a traumatic or stressful nature, that is inconsistent with ordinary forgetting", "Ask whether the memory gap is bounded, and for what was happening at the edges; contrast with the diffuse, episodic global recall loss of dementia"],
          ["Dissociative fugue", "Purposeful travel or wandering with sudden amnesia and altered identity", "Establish the sequence from records and collateral; rare"],
          ["Dissociative identity disorder", "Disruption of identity into two or more distinct personality states, with recurrent gaps in recall; contentious and variably diagnosed across services", "Requires a specialist, longitudinal assessment; the diagnosis is not appropriate in a first episode and must never be suggested to a patient"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Dissociative symptoms are commonly mislabeled as psychosis. A patient reporting 'a part of me watches me from the corner of the room' with preserved insight and intact reality testing is describing depersonalisation, not a hallucination and not a delusion. The questions to ask are whether they regard the experience as real, whether it arises in subjective inner space, and whether it alters their orientation and behaviour.",
      },

      { type: "heading", level: 2, text: "Management" },
      {
        type: "paragraph",
        text: "The evidence for treatment is thinner here than for the psychotic, mood and anxiety disorders, and the importance of the clinical relationship is correspondingly greater. The following structure carries the weight.",
      },
      {
        type: "table",
        headers: ["Element", "Content", "Rationale"],
        rows: [
          ["Explanation that validates", "Name the positive diagnosis, demonstrate the positive signs physically, and explain in words the patient can use with others", "A patient given 'we could not find anything' leaves with the thought 'they think I am making it up'; a patient given 'this is a functional weakness, and this test proves it' leaves with a diagnosis"],
          ["One coordinating clinician", "A single clinician responsible for the overall plan, with clear time-limited reviews and a named point of contact", "Repeated rotations, conflicting opinions and serial specialists produce uncertainty, repeated testing and deterioration"],
          ["Avoid iatrogenic harm", "No routine repeat imaging or extensive investigation unless the clinical picture changes; document the rationale for each test", "Each investigation is a disconfirming message, and the harm from unnecessary testing compounds the disability"],
          ["Treat comorbidity", "Depression, anxiety, obsessive-compulsive disorder and pain are common, disabling, and treatable, and their treatment frequently improves the functional outcome", "Comorbidity predicts worse outcome and is under-treated in functional disorders"],
          ["Physiotherapy and occupational therapy", "Function-focused, goal-setting retraining with an understanding of the functional diagnosis; graded return to activity", "The specialist approach avoids both forced effort, which worsens symptoms, and complete rest, which entrenches disability"],
          ["Cognitive behavioural therapy adapted to the presentation", "Retraining movement or control of the functioning, attention retraining, restructuring catastrophic beliefs, and a graded plan to defeat avoidance", "The mechanism is the reversal of disuse and of the belief that activity is dangerous"],
          ["Trauma-informed work where relevant", "Stability and grounding first; trauma-focused therapy only where the patient is secure", "Premature memory work can destabilise severely dissociative patients; safety comes before disclosure"],
          ["Avoid reinforcement of disability", "Do not withdraw all activity, do not remove the family's involvement entirely, and do not make benefits contingent on symptoms resolving", "Involuntary or premature confrontation is harmful; withdrawal of activity consolidates the invalid role"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Words matter more in this condition than in any other. Never say 'there is nothing wrong with you', 'it is all in your mind', 'your tests are normal', or 'psychosomatic' as a dismissal. Say 'this is a real problem of nervous system functioning that we can treat and that often improves'. The second sentence is both kinder and more accurate than the first.",
      },
      {
        type: "paragraph",
        text: "Prognosis is variable. A substantial proportion improve markedly with the correct approach, and early explanation and positive treatment attendance predict a good outcome. A chronic, disabling minority develop progressively worsening function, frequently after multiple explanations and repeated investigations, which is itself an iatrogenic outcome. Somatic symptom disorder persists most where the patient's illness beliefs are entrenched and the social rewards of the sick role are high.",
      },

      { type: "heading", level: 2, text: "Factitious disorder and malingering: distinctions to keep" },
      {
        type: "table",
        headers: ["Category", "Motivation", "Assessment", "Response"],
        rows: [
          ["Functional neurological symptom disorder and somatic symptom disorder", "None defined by external gain; distress is genuine and out of control", "Positive signs of inconsistency; no evidence of intentional production", "Empathetic management as above"],
          ["Factitious disorder", "Deliberate falsification or production of symptoms in the absence of external reward, motivated by an internal wish to occupy the patient role", "Direct observation, careful records, and collation of a documented history; confession is rare and confrontation usually fails", "Treat rather than accuse; the underlying need is for care, and psychiatric treatment of comorbid disorder is the route"],
          ["Malingering", "Intentional production or exaggeration of symptoms for external gain — compensation, evading liability, drugs, avoidance of military service, avoiding prison", "Requires evidence of intent and of external advantage; it is a conclusion, not an impression", "Not a psychiatric diagnosis. An accusation requires evidence, and the assumption is dangerous"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "The three are frequently conflated in ordinary clinical speech, and the conflation is what destroys therapeutic relationships. Most patients with symptoms out of proportion to pathology are not fabricating; the word 'hysterical' should not appear in a modern record, and neither should 'malingering' without documented grounds.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Allowing a request for more investigations to substitute for a diagnosis. The patient's repeated insistence on a further magnetic resonance scan is a sign of distress and of poor explanation, not a request to be accommodated for its own sake. Each unnecessary test is a small injury and a larger missed opportunity to explain the diagnosis.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing every somatic presentation to depression. Depression is commonly comorbid, and it may maintain a functional symptom, but it does not explain a functional weakness or a dissociative episode by itself. Treating the depression and ignoring the symptom leaves the patient with the symptom unchanged and a psychiatrist who appears not to have believed them.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Telling a family that the patient's symptoms are attention-seeking. It is dismissive, inaccurate, and produces an oppositional family dynamic in which every symptom becomes contested. Educate the family that the symptoms are involuntary — that the patient cannot control them — while also making clear that pushing through them is not the route to recovery either.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 25-year-old has an unexplained non-epileptic seizure disorder. How should the cardiac and neurological work-up have proceeded, and what is the explanation to give after it?",
        answer: "The work-up should exclude epilepsy and cardiac causes, and no further investigation is required once a functional diagnosis has been made positively. The explanation should be: 'These episodes are real, they are involuntary, they arise from the nervous system shutting down its own function in a way that mimics the electrical events you have not got. Here is what triggers that, and here is how treatment helps.' The word 'seizure' should be dropped in favour of 'attack' or 'event'.",
        explanation: "Positive diagnosis, positive explanation, positive treatment. If the explanation is delivered as 'nothing was found', the patient concludes — reasonably — that the clinician believes they are making it up, and the next episode is a worse one.",
      },
      {
        type: "question",
        prompt: "How does Hoover's sign distinguish functional from neurological weakness?",
        answer: "Automatic, involuntary activation of hip extension is preserved: when the patient flexes the opposite hip against resistance, the hip on the affected side extends normally and involuntarily, even though voluntary extension of that hip is weak. A structural lesion produces weakness in both circumstances.",
        explanation: "The principle is that automatic motor programmes are intact while voluntary control is impaired, which is a positive demonstration of functional weakness. It is testing the difference between automatic and willed movement, not testing whether the patient is truthful.",
      },
      {
        type: "question",
        prompt: "What are the three factors that combine to perpetuate a somatic symptom disorder?",
        answer: "Catastrophic, entrenched illness beliefs; iatrogenic harm from repeated investigations, repeated conflicting advice and enforced inactivity; and secondary gains including compensation claims, benefits, incapacity relief and increased family attention, together with comorbid anxiety and depression.",
        explanation: "Perpetuating factors are where the therapeutic leverage lies, which is why single-clinician coordination, explanation, graded activity and treating comorbidity are the core of management rather than supplementary.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Somatic symptom disorder, illness anxiety disorder and functional neurological symptom disorder are genuine, involuntary disorders diagnosed from positive signs and from disproportionate response rather than from the absence of findings. Their aetiology is biopsychosocial and multi-stage, and perpetuating factors — including the iatrogenic harm of serial investigation — are where treatment gains lie. Dissociative disorders share the theme of disrupted integration of consciousness, memory, identity and body. Management is one coordinating clinician, a validating explanation, graded activity and physical rehabilitation, treatment of comorbidity, and the discipline to avoid unnecessary tests.",
      },
      {
        type: "paragraph",
        text: "Next: stress-related disorders and personality disorders — the acute stress reaction, post-traumatic stress disorder, and the clusters of disordered personality that complicate every branch of psychiatric care.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "Which of the following is a positive sign of a functional neurological symptom?",
        options: [
          "Two normal magnetic resonance scans reported as unremarkable",
          "A positive Hoover's sign in a weak hip",
          "Normal tendon reflexes",
          "Absence of a family history of neurological disease",
        ],
        correctIndex: 1,
        explanation: "Hoover's sign demonstrates preserved involuntary extension with impaired voluntary extension. Normal reflexes, normal imaging and an empty family history are the absence of findings, and the absence of evidence is a much weaker basis for diagnosis than a positive sign of inconsistency.",
      },
      {
        type: "mcq",
        stem: "Which statement about somatic symptom disorder is correct?",
        options: [
          "The diagnosis is based on symptoms remaining unexplained after full investigation.",
          "The diagnosis depends on an excessive response to the symptoms, so it can be made without waiting for tests to fail.",
          "It is defined as symptoms that are voluntary in origin.",
          "It requires a single somatic symptom of at least one month's duration.",
        ],
        correctIndex: 1,
        explanation: "Modern classification bases the diagnosis on the disproportionate cognitive-affective response to symptoms, which can be assessed at first contact. Diagnosing by exclusion is abandoned because it drove serial testing, iatrogenic harm and dismissive attitudes.",
      },
      {
        type: "mcq",
        stem: "Which statement about factitious disorder and malingering is correct?",
        options: [
          "Both are psychiatric diagnoses and both require the same management.",
          "Neither involves intentional symptom production; both are involuntary disorders.",
          "Factitious disorder involves intentional symptom production without external reward, while malingering involves intentional production for an external advantage.",
          "Malingering is commoner than functional neurological symptoms in adult inpatients.",
        ],
        correctIndex: 2,
        explanation: "Factitious disorder is a psychiatric diagnosis in which the motivation is internal — an internal wish to occupy the patient role. Malingering implies a conscious intention and an external gain, and is not a psychiatric diagnosis. Both are distinct from the much commoner involuntary functional symptoms.",
      },
      {
        type: "mcq",
        stem: "Which statement about dissociative symptoms in a psychiatric patient is correct?",
        options: [
          "All dissociative experiences indicate a dissociative identity disorder and require specialist referral.",
          "Feeling unreal or detached and watching oneself from outside, with preserved reality testing, is depersonalisation and occurs commonly in anxiety and depression.",
          "Dissociative symptoms never overlap with post-traumatic stress disorder.",
          "Dissociative symptoms are recognised by the patient as not real, and are therefore never distressing.",
        ],
        correctIndex: 1,
        explanation: "Depersonalisation and derealisation are common, often transient, and occur in anxiety, depression and PTSD. They are distressing precisely because they are so strange, and they carry a preserved distinction from reality that separates them from psychosis.",
      },
      {
        type: "mcq",
        stem: "A young woman with functional weakness asks for another magnetic resonance scan. What is the best response?",
        options: [
          "Arrange it, since her consent and autonomy must be respected.",
          "Explain that the diagnosis has been made positively on the basis of signs, and that further imaging in the absence of new findings would not alter management.",
          "Tell her the result will be normal so that she will accept the diagnosis.",
          "Discharge her, since she is refusing to accept the diagnosis.",
        ],
        correctIndex: 1,
        explanation: "The response should be explanation rather than accommodation or dismissal: the diagnosis has already been made on positive findings, so further imaging cannot change the management. Discharge removes the one clinician best placed to help, and 'result will be normal' is a promise and a dismissal.",
      },
    ],
  };
}

// ---------------------------------------------------------------------------
// LESSON 12 — Alcohol & drug dependence (fully authored)
// ---------------------------------------------------------------------------
function lesson12(): LessonContent {
  return {
    blocks: [
      { type: "heading", level: 2, text: "Learning outcomes" },
      {
        type: "paragraph",
        text: "By the end of this lesson you should be able to: define harmful use and dependence and apply the AUDIT and CAGE screens; recognise intoxication, withdrawal and dependence syndromes for alcohol, opioids, benzodiazepines and stimulants; describe the time course of alcohol withdrawal and the management of Wernicke encephalopathy, Korsakoff syndrome and delirium tremens; select the appropriate setting for alcohol detoxification and describe relapse-prevention pharmacotherapy; apply the specific knowledge of alcohol and drug substances needed for the acute management of intoxication and overdose; and describe opioid substitution therapy, harm reduction and the treatment of nicotine and stimulant dependence.",
      },

      { type: "heading", level: 2, text: "Prerequisites" },
      {
        type: "paragraph",
        text: "Lessons 5 and 6 for the assessment framework and the multi-level aetiology of dependence, and Lesson 9 for the suicide risk assessment that coexists with every substance use disorder.",
      },

      { type: "heading", level: 2, text: "The big idea" },
      {
        type: "definition",
        term: "Harmful pattern of substance use",
        text: "A pattern of use that causes damage to physical or mental health — liver injury, injury while intoxicated, mood disorder, cognitive impairment — without meeting the criteria for dependence. Harmful use is an early and often reversible point in the course of substance use disorder.",
      },
      {
        type: "definition",
        term: "Substance dependence",
        text: "A disorder of regulation in which the substance increasingly occupies a central place in the person's life. The features are impaired control over use, increasing priority of the substance over other activities, and physiological alterations — tolerance (a given dose produces a smaller effect) and withdrawal (a characteristic syndrome follows cessation or reduction).",
      },
      {
        type: "paragraph",
        text: "The single most clinically relevant idea is that dependence is a disorder of regulation, not of character, and that the pharmacology is what makes it a medical problem. Alcohol and benzodiazepines act on the same GABA-A receptor, so their withdrawal syndromes are the only two that are reliably life-threatening. Opioids cause profound dependence with severe withdrawal but withdrawal is not the danger — overdose is, and naloxone and substitution therapy are the counter-measures. Stimulants produce dependence and a depressive crash, and antipsychotics treat their psychosis. Knowing the three pharmacologies is most of the assessment.",
      },
      {
        type: "table",
        headers: ["Substance", "Principal receptor and action", "Intoxication syndrome", "Withdrawal syndrome", "Danger"],
        rows: [
          ["Alcohol", "GABA-A potentiation and NMDA receptor blockade, with dopaminergic reward", "Disinhibition, slurred speech, ataxia, nystagmus, lethargy, stupor, coma, respiratory depression; hypoglycaemia", "Tremor, sweating, tachycardia, insomnia and anxiety, hallucinations and seizures between six and 48 hours, and delirium tremens at 48-96 hours", "Delirium tremens and Wernicke encephalopathy; both preventable"],
          ["Benzodiazepines and Z-drugs", "GABA-A potentiation at a different site from alcohol, with cross-tolerance", "Same as alcohol — drowsiness, ataxia, dysarthria, respiratory depression, especially with opioids", "Anxiety, tremor, insomnia, seizures, and delirium; protracted over weeks", "Seizures and delirium; abrupt cessation is the error"],
          ["Opioids (heroin, morphine, codeine)", "Mu and kappa agonism", "Miosis, respiratory depression, drowsiness, cold clammy skin, constipation", "Rhinorrhoea, lacrimation, yawning, sweating, piloerection, dilated pupils, myalgia, abdominal cramps, vomiting, diarrhoea and craving — distressing but not life-threatening", "Overdose; aspiration; HIV, hepatitis B and C and endocarditis"],
          ["Stimulants (cocaine, amphetamines, methamphetamine, mephedrone)", "Increased noradrenaline, dopamine and serotonin at synapses and increased release", "Euphoria, hypervigilance, tachycardia, hypertension, mydriasis, hyperthermia, stereotypy; chest pain from cardiac ischaemia; psychosis with paranoid delusions", "A crash with hypersomnia, increased appetite, dysphoria and intense craving", "Overdose with cardiovascular collapse; psychosis; severe withdrawal depression and suicide risk"],
          ["Cannabis", "THC agonist, plus CBD in some preparations", "Relaxation, conjunctival injection, tachycardia, slowed time perception, impaired coordination and memory", "Irritability, insomnia, anxiety, tremor, decreased appetite — usually mild", "Psychosis, especially high potency and early adolescent use; dependence"],
          ["Nicotine", "Nicotinic receptor agonism, with dopaminergic reward", "Stimulation, with nausea in the untolerant", "Irritability, anxiety, poor concentration, increased appetite", "The dependence is near-universal and the mortality is the largest in the field"],
        ],
      },

      { type: "heading", level: 2, text: "Screening and the initial assessment" },
      {
        type: "paragraph",
        text: "Every patient in every specialty should be screened, because alcohol misuse is common, frequently concealed, and the underlying cause of a large fraction of admissions. A brief intervention is part of the assessment, not a separate intervention at a later appointment.",
      },
      {
        type: "table",
        headers: ["Instrument", "Items and scoring", "Interpretation"],
        rows: [
          ["AUDIT", "Ten items: consumption, drinking behaviour, dependence symptoms and alcohol-related problems; maximum 40", "A score of 8 or more in men and 6 or more in women indicates hazardous or harmful drinking; scores of 20 or more indicate probable dependence and warrant a specialist assessment"],
          ["AUDIT-C", "The first three consumption questions", "A screen of four or more in men and three or more in women is positive, with high sensitivity and minimal burden"],
          ["CAGE", "Cut down, Annoyed, Guilty, Eye-opener", "Two or more positive suggests dependence; it is quick for bedside use but is insensitive to hazardous use without dependence"],
          ["CAGE-AID", "The CAGE adapted to include drug use", "A useful single-question extension in psychiatric and emergency practice"],
          ["SADQ", "A 20-item self-rated severity of dependence", "For quantifying severity in established dependence and for monitoring"],
          ["CIWA-Ar", "A clinician-rated 10-item withdrawal severity score", "For symptom-triggered benzodiazepine regimens; it is a monitoring tool, not a diagnostic one"],
        ],
      },
      {
        type: "paragraph",
        text: "A history should establish the amount and pattern of alcohol or drug use, the age of onset, the duration, the longest period of abstinence and how it was achieved, previous treatment, previous seizures or delirium tremens, and the existence of social or occupational consequences, criminal charges and relationship breakdown. Do not forget that liver disease, injection practice, psychiatric comorbidity and physical comorbidity determine most of the mortality of dependence, and that most deaths in patients with alcohol dependence are from causes other than withdrawal.",
      },
      {
        type: "callout",
        variant: "info",
        text: "A standard UK drink is 8 grams of alcohol, a US standard drink 14 grams; a 50 ml measure of spirits at 40 percent, half a pint of ordinary beer and a 175 ml glass of wine at 13 percent each contain roughly one unit. Low-risk drinking guidance in the UK is no more than 14 units a week for both sexes, spread across three or more days. The purpose of stating it precisely is to prevent the common error of counting glasses, bottles or cans rather than units.",
      },

      { type: "heading", level: 2, text: "Alcohol withdrawal and its complications" },
      {
        type: "table",
        headers: ["Phase", "Timing", "Clinical features", "Management"],
        rows: [
          ["Early withdrawal", "6-12 hours", "Tremor, anxiety, sweating, tachycardia, hypertension, insomnia, nausea, depression of mood", "Thiamine (Pabrinex), fluids, and a benzodiazepine regimen or symptom-triggered treatment with monitoring of symptoms and observations"],
          ["Alcohol withdrawal seizures", "12-48 hours", "Generalised tonic-clonic seizures, usually one or two within a short period; rare status", "Benzodiazepines are the treatment of choice; treat as seizures, and exclude hypoglycaemia, head injury and epilepsy"],
          ["Hallucinations", "12-48 hours", "Visual, occasionally auditory or tactile, with a clear sensorium and partial insight in some", "The same benzodiazepine regimen, with reassurance about the nature of the experience"],
          ["Delirium tremens", "48-96 hours", "Profound agitation, confusion, disorientation, paranoid delusions, hallucinations, gross tremor, pyrexia, tachycardia, hypertension, dehydration — a medical emergency with significant mortality", "High-dose benzodiazepine, intravenous fluids, parenteral thiamine, correction of electrolytes including magnesium, and admission to a medical or intensive care setting"],
          ["Wernicke encephalopathy", "Onset over days; in chronic deficiency at any time", "The classic triad is confusion, ataxia and ophthalmoplegia, but a minority show all three; the commonest presentation is a confused, ataxic patient who may deteriorate while being sedated for something else", "Immediate parenteral thiamine (Pabrinex) before any glucose load; under-treatment is the common error"],
          ["Korsakoff syndrome", "After Wernicke encephalopathy if untreated", "Profound anterograde amnesia with confabulation and often a preserved social manner; the prognosis is poor", "Prevention by treating Wernicke promptly; long-term care and thiamine continuation"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Thiamine before glucose. In the acutely intoxicated, malnourished, confused patient, give parenteral thiamine first (or with the glucose), because a glucose load accelerates the consumption of thiamine and can precipitate Wernicke encephalopathy. Correct magnesium too, because hypomagnesaemia renders thiamine ineffective, and remember that parenteral thiamine is poorly replaced by oral thiamine in an acute episode.",
      },
      {
        type: "paragraph",
        text: "Alcohol detoxification aims to manage withdrawal safely rather than to produce abstinence. For a patient with a modest dependence and no history of seizures or delirium tremens, a community detoxification reduces dose over seven to ten days. For a patient with a history of withdrawal seizures or delirium tremens, with significant medical or psychiatric comorbidity, with pregnancy, with homelessness, with polydrug use, or with a previous failed community attempt, inpatient detoxification is required. Chlordiazepoxide is the standard agent; in hepatic failure or severe respiratory disease, lorazepam or oxazepam is used, as they are not metabolised by oxidation in the liver.",
      },

      { type: "heading", level: 2, text: "Detoxification and relapse prevention" },
      {
        type: "paragraph",
        text: "Relapse rates after unassisted abstinence are high; combining pharmacotherapy with psychosocial intervention roughly doubles abstinence rates, and the medication choice is made on the patient's goal and comorbidity.",
      },
      {
        type: "table",
        headers: ["Medication", "Mechanism and goal", "Practical points", "Side effects"],
        rows: [
          ["Acamprosate", "Modulates glutamatergic transmission, and reduces the 'need to drink' through the NMDA system; supports abstinence", "Started at the beginning of detoxification or at abstinence, and continued for six months; contraindicated in severe renal impairment and pregnancy", "Diarrhoea; the profile is benign"],
          ["Naltrexone", "Mu-opioid receptor antagonist; reduces the rewarding effect of alcohol and the craving to drink; can be started while the patient is still drinking", "Can be given orally daily or as a monthly intramuscular injection; use cautiously if opioids may be given for pain, because it will precipitate withdrawal and block analgesia", "Nausea, headache; contraindicated in current opioid use and in acute hepatitis"],
          ["Disulfiram", "Inhibits aldehyde dehydrogenase, so that drinking while taking it causes a flushing reaction with vomiting and headache; a deterrent requiring supervised administration", "Effective only with commitment and supervision; requires abstinence, informed consent, and a card carried in case of emergency", "Rash, metallic taste, neuropathy, hepatotoxicity, and the risk of the reaction itself if the patient drinks regardless"],
          ["Baclofen", "GABA-B agonist with some evidence for reducing craving", "Second-line in many countries; requires renal and hepatic caution", "Sedation, and abrupt discontinuation can cause a withdrawal-like syndrome"],
        ],
      },
      {
        type: "callout",
        variant: "info",
        text: "Pharmacotherapy only works alongside psychosocial work: motivational interviewing, cognitive therapy, family involvement, community reinforcement, and mutual-aid groups such as Alcoholics Anonymous. The strongest predictor of outcome is engagement, which is why the first appointment's substance is the offering of a specific, small, achievable step rather than a demand for lifelong abstinence.",
      },

      { type: "heading", level: 2, text: "Opioid dependence" },
      {
        type: "paragraph",
        text: "Opioid dependence is a chronic relapsing condition with a high mortality, and the two pillars of treatment are opioid substitution therapy and harm reduction. Methadone (full agonist) and buprenorphine (partial agonist, safer in overdose, available sublingually) reduce illicit opioid use, mortality, HIV and hepatitis C transmission and criminal activity, and are the only treatments shown to reduce mortality.",
      },
      {
        type: "table",
        headers: ["Feature", "Opioid intoxication", "Opioid overdose", "Opioid withdrawal"],
        rows: [
          ["Clinical picture", "Miosis, drowsiness, euphoria, slowed respiration, constricted pupils, hyporeflexia", "Respiratory depression, pinpoint pupils, loss of consciousness, cyanosis, apnoea", "Rhinorrhoea, lacrimation, yawning, mydriasis, piloerection, myalgia, vomiting, diarrhoea, abdominal cramps, insomnia, intense craving"],
          ["Urgency", "Monitor", "Medical emergency", "Distressing, not life-threatening"],
          ["Treatment", "Supportive care", "Airway and ventilation; naloxone 400-800 micrograms intravenously, repeated as needed, intramuscularly or intranasally where intravenous access is unavailable; watch for re-sedation because naloxone has a shorter half-life than most opioids", "Agonist substitution with methadone or buprenorphine, or symptomatic treatment with clonidine, antiemetics and antidiarrhoeals"],
        ],
      },
      {
        type: "callout",
        variant: "warning",
        text: "Naloxone is competitive, so giving the full dose to an opioid-dependent patient can precipitate acute withdrawal. Titrate to respiratory effort, not to consciousness, in patients who are dependent, and remember that the half-life is 30-90 minutes, so re-sedation may occur after an apparently successful resuscitation. Take-home naloxone should be offered to any patient at risk, and to family members.",
      },

      { type: "heading", level: 2, text: "Stimulants, nicotine and other substances" },
      {
        type: "table",
        headers: ["Substance", "Presentation", "Treatment"],
        rows: [
          ["Cocaine and amphetamines", "Intoxication with tachycardia, hypertension, hyperthermia, chest pain, seizures, psychosis with paranoid delusions and stereotypy; a crash with hypersomnia, depression and craving; and a persistent depressive state in chronic use", "Supportive care with cooling, fluids and monitoring; benzodiazepines for agitation; antipsychotics for psychosis; psychiatric follow-up for the depressive phase, in which suicide risk is high. There is no approved medication for dependence"],
          ["Cannabis", "Dependence with irritability and insomnia on withdrawal; anxiety and depersonalisation on intoxication; and a risk of psychosis with high-potency and early-onset use", "Cognitive behavioural therapy and motivational interviewing; treat any psychosis with antipsychotics and advise cessation"],
          ["Nicotine", "Dependence with withdrawal on cessation, and mortality driven by cardiovascular disease and cancer", "Nicotine replacement therapy, varenicline (a partial nicotinic agonist, the most effective single pharmacotherapy), or bupropion; combined with behavioural support and follow-up. Stop-smoking advice is one of the most cost-effective interventions in medicine"],
          ["Benzodiazepines and Z-drugs", "Dependence and withdrawal, with cross-tolerance to alcohol, so withdrawal can be dangerous and can overlap with alcohol withdrawal", "Slow taper, often switching to an equivalent dose of diazepam which has a long half-life and smoother decline; do not stop abruptly; inpatient tapering where dependence is severe"],
          ["Hallucinogens and novel psychoactive substances", "Acute intoxication with hallucination, agitation and paraesthesia; hallucinogen persisting perception disorder rarely after heavy use", "Supportive care; benzodiazepines for agitation; no specific pharmacotherapy for dependence, which is uncommon"],
          ["Inhaled solvents", "Acute intoxication with euphoria then drowsiness, ataxia, arrhythmia and risk of sudden death; chronic use causes cerebellar and pyramidal damage", "Supportive care and harm reduction; specialist adolescent services"],
        ],
      },

      { type: "heading", level: 2, text: "Harm reduction and legal frameworks" },
      {
        type: "paragraph",
        text: "Most deaths in opioid dependence are from overdose, and most harm from injection comes from the injection rather than the drug. Harm reduction — needle and syringe programmes, supervised consumption, take-home naloxone, hepatitis B and C screening and vaccination, HIV testing, wound care, and education on safer injection — reduces mortality and infection rates, and does not increase drug use. It is the clinical baseline for every patient who injects.",
      },
      {
        type: "paragraph",
        text: "Compulsory detention for intoxication is a legal intervention under mental health or drugs legislation, and requires the same justification as any detention: a mental disorder of a nature or degree warranting it, necessity, and the absence of a less restrictive alternative, with the maximum available proportionality. Most jurisdictions provide for a period of short assessment for a person intoxicated to the point of danger, and that is the limit of what may be done without a full assessment. Work with the patient's capacity wherever capacity exists; assume capacity until shown absent, and record the reasons for any decision that capacity is absent.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Language is part of treatment in this field. 'Addict', 'junkie', 'abuser' and 'clean' as a synonym for abstinent all reduce engagement, and studies show they predict clinician attitudes and referral decisions. Use 'person with alcohol dependence', 'patient who injects drugs', 'in recovery', and 'negative drug screen' instead.",
      },

      { type: "heading", level: 2, text: "Common mistakes" },
      {
        type: "callout",
        variant: "warning",
        text: "Giving intravenous glucose to a hypoglycaemic, malnourished, intoxicated patient without parenteral thiamine. This is a preventable cause of Wernicke encephalopathy and Korsakoff syndrome, it is committed exactly when the patient is least able to report symptoms, and the correct order is thiamine first or simultaneously.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Stopping benzodiazepines abruptly in a dependent patient. Benzodiazepine withdrawal causes seizures, and cross-tolerance with alcohol makes it the same dangerous pharmacology. Switch to diazepam and taper slowly, or admit for withdrawal.",
      },
      {
        type: "callout",
        variant: "warning",
        text: "Attributing the whole of a patient's presentation to alcohol, or refusing to treat the alcohol because there is psychiatric comorbidity. Psychiatric comorbidity is common, predicts worse outcome, and is often undertreated in patients with alcohol dependence; depression improves in many patients within weeks of abstinence, but untreated depression and suicidal ideation should not simply be waited out.",
      },

      { type: "heading", level: 2, text: "Check your understanding" },
      {
        type: "question",
        prompt: "A 54-year-old man with alcohol dependence is admitted with confusion and ataxia, and a blood glucose of 1.9 mmol/L is measured from the intravenous cannula. What comes first?",
        answer: "Parenteral thiamine (Pabrinex) before or with the intravenous glucose, and correction of magnesium. He presents the triad of Wernicke encephalopathy — confusion, ataxia, and in some patients ophthalmoplegia — in a patient with a predisposition, and the acute confusion means that he may not be able to report further deterioration.",
        explanation: "The rule is thiamine first because glucose accelerates thiamine consumption. Oral thiamine is insufficient in an acute episode because absorption is unreliable in dependence.",
      },
      {
        type: "question",
        prompt: "How does naloxone have a shorter half-life in clinical practice, and what does this mean for monitoring?",
        answer: "Naloxone's half-life is roughly 30-90 minutes, whereas most opioids, particularly methadone, have much longer half-lives. A patient successfully resuscitated may therefore re-sedate and become apnoeic again. Monitor respiratory rate, oxygen saturation and level of consciousness for at least four to six hours, and repeat the naloxone dose or start an infusion in sustained cases.",
        explanation: "This is the standard reason for admission after naloxone administration in overdose. The half-life is the mechanism, and the practical consequence is a minimum period of monitored observation and a repeat dose if needed.",
      },
      {
        type: "question",
        prompt: "Why does alcohol withdrawal become more dangerous with successive detoxifications?",
        answer: "Kindling: repeated cycles of intoxication and withdrawal sensitise the central nervous system, so each subsequent withdrawal is more severe, with a greater risk of seizures and delirium tremens after longer drinking periods. This is why patients with a history of withdrawal seizures or delirium tremens should not be detoxified in the community and should be treated with symptom-triggered rather than merely fixed-dose regimens.",
        explanation: "The practical consequence is that the history of a previous severe withdrawal is the most important single predictor of a subsequently severe withdrawal, and it determines the setting of care.",
      },

      { type: "heading", level: 2, text: "Summary and next" },
      {
        type: "paragraph",
        text: "Alcohol and benzodiazepine withdrawal share GABA-A pharmacology and are the two reliably life-threatening withdrawal syndromes; opioids cause dependence and fatal overdose but a non-fatal withdrawal; stimulants produce a depressive crash and psychosis. Screening with the AUDIT and CAGE identifies the great majority of patients. Alcohol detoxification is an inpatient decision where seizures, delirium tremens or significant comorbidity are present, and relapse prevention combines pharmacotherapy with psychological and social work. Opioid substitution therapy, take-home naloxone and harm reduction are the mortality-reducing interventions in injection use, and language is part of the clinical method.",
      },
      {
        type: "paragraph",
        text: "This lesson completes the twelve authored lessons of PSYT 306: the behavioural sciences (lessons 1 to 4), the foundations of classification and aetiology (lessons 5 and 6), the psychotic and mood disorders (lessons 7 to 9), and the anxiety, dissociative and substance use disorders (lessons 10 to 12). Still to be authored in the course spine: stress-related and personality disorders, child and adolescent disorders, psychological therapies and counselling, and psychological testing with psychiatric emergencies — each of which builds on what is now in place.",
      },

      { type: "heading", level: 2, text: "Multiple choice" },
      {
        type: "mcq",
        stem: "At what point in alcohol withdrawal do withdrawal seizures typically occur?",
        options: [
          "Within the first hour of the last drink",
          "Between 6 and 12 hours after the last drink",
          "Between 12 and 48 hours after the last drink",
          "Only after 5 days of abstinence",
        ],
        correctIndex: 2,
        explanation: "Withdrawal seizures occur classically between 12 and 48 hours after the last drink. Tremor and autonomic symptoms begin at 6-12 hours, and delirium tremens typically presents at 48-96 hours. All are preventable with an adequate benzodiazepine regimen.",
      },
      {
        type: "mcq",
        stem: "Which is the correct order of treatment for a confused, malnourished, intoxicated patient who is hypoglycaemic?",
        options: [
          "Intravenous glucose, then thiamine if symptoms persist",
          "Oral thiamine and glucose together",
          "Parenteral thiamine before or with the intravenous glucose, and correction of magnesium",
          "Neither; observe the hypoglycaemia first",
        ],
        correctIndex: 2,
        explanation: "Thiamine precedes or accompanies the glucose because a glucose load consumes thiamine and can precipitate Wernicke encephalopathy. Oral thiamine is inadequate in an acute episode, and hypomagnesaemia must also be corrected for thiamine to work.",
      },
      {
        type: "mcq",
        stem: "A patient is found unconscious with pinpoint pupils and a respiratory rate of 4. What is the treatment of choice?",
        options: [
          "High-dose flumazenil intravenously",
          "Naloxone, titrated to restore respiratory effort, with close observation for re-sedation",
          "Naltrexone, started as soon as the patient is conscious",
          "Chlordiazepoxide and observation",
        ],
        correctIndex: 1,
        explanation: "This is opioid overdose, and naloxone is the competitive antagonist needed to reverse the respiratory depression. Flumazenil reverses benzodiazepines and can precipitate seizures in polypharmacy; naltrexone is for maintenance, not for reversal; and chlordiazepoxide would worsen respiratory depression.",
      },
      {
        type: "mcq",
        stem: "Which is the most effective single pharmacological treatment for smoking cessation?",
        options: [
          "Nicotine replacement therapy alone",
          "Bupropion alone",
          "Varenicline, a nicotinic acetylcholine receptor partial agonist",
          "Nortriptyline, a second-line agent in all patients",
        ],
        correctIndex: 2,
        explanation: "Varenicline, a partial agonist at the nicotinic receptor, reduces reward and withdrawal and is the most effective single pharmacotherapy, approximately doubling or more the odds of sustained abstinence, and it is also usable together with nicotine replacement under supervision.",
      },
      {
        type: "mcq",
        stem: "Which statement about opioid substitution therapy is correct?",
        options: [
          "It substitutes one dependence for another without reducing mortality.",
          "Methadone and buprenorphine reduce mortality, illicit opioid use, HIV and hepatitis C transmission, and criminal activity.",
          "Substitution therapy is contraindicated in patients who are also using benzodiazepines under any circumstances.",
          "Withdrawal from opioids is the principal cause of death in opioid dependence.",
        ],
        correctIndex: 1,
        explanation: "Opioid substitution therapy reduces mortality and harms substantially and is the only approach shown to reduce mortality in opioid dependence. The dangerous process is overdose, not withdrawal, and buprenorphine is safer in overdose than methadone because of its partial agonism.",
      },
    ],
  };
}

export const PSYCHIATRY: SubjectSeed = {
  id: "mbbs-psychiatry",
  slug: "psychiatry",
  title: "Psychiatry",
  code: "PSYT 306",
  department: "Psychiatry",
  level: 300,
  credits: 3,
  semester: "second",
  description:
    "Behavioural sciences and clinical psychiatry: classification, aetiology, psychotic, mood, anxiety and related disorders, substance use, child and adolescent disorders, therapies and psychological testing (AIIMS behavioural sciences in semester II, clinical psychiatry in semester VI).",
  faculty: "clinical-medicine",
  prereqCourses: ["physiology-cell-and-general", "pathology-cell-injury-repair"],
  modules: [
    { slug: "behavioural-sciences", title: "M1 — Behavioural sciences" },
    { slug: "psychiatry-foundations", title: "M2 — Foundations of psychiatry" },
    { slug: "psychotic-mood-disorders", title: "M3 — Psychotic & mood disorders" },
    { slug: "anxiety-trauma-related", title: "M4 — Anxiety, trauma & related disorders" },
    { slug: "substance-special-populations", title: "M5 — Substance use & special populations" },
  ],
  lessons: [
    { title: "Motivation & emotion", module: 1, estimatedMinutes: 30, authored: true, concept: { title: "Motivation and emotion", slug: "motivation-emotion", summary: "Drives, homeostasis of motivation, theories of emotion and their expression — the substrate of normal mental functioning.", blooms: "understand", minutes: 30, prereq: [] }, content: lesson1() as never},
    { title: "Learning & cognition", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Learning and cognition", slug: "learning-cognition", summary: "Conditioning, observational learning, attention, language and problem-solving as the basis of behaviour and its modification.", blooms: "understand", minutes: 35, prereq: ["motivation-emotion"] }, content: lesson2() as never},
    { title: "Memory & thinking", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Memory and thinking", slug: "memory-thinking", summary: "Stages and systems of memory, forgetting, concept formation, reasoning and the common errors of thinking.", blooms: "understand", minutes: 35, prereq: ["learning-cognition"] }, content: lesson3() as never},
    { title: "Intelligence & personality", module: 1, estimatedMinutes: 35, authored: true, concept: { title: "Intelligence and personality", slug: "intelligence-personality", summary: "Theories and measurement of intelligence, personality development, and the traits that shape vulnerability to disorder.", blooms: "understand", minutes: 35, prereq: ["memory-thinking"] }, content: lesson4() as never},
    { title: "Classification & assessment", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Classification and assessment", slug: "classification-assessment", summary: "ICD and DSM classification, the mental status examination, history taking and risk assessment in the psychiatric interview.", blooms: "apply", minutes: 35, prereq: [] }, content: lesson5() as never},
    { title: "Aetiology & the biopsychosocial model", module: 2, estimatedMinutes: 35, authored: true, concept: { title: "Aetiology and biopsychosocial model", slug: "aetiology-biopsychosocial", summary: "Genetic, neurobiological, psychological and social contributions to mental disorder, and the stress-vulnerability framework.", blooms: "analyze", minutes: 35, prereq: ["classification-assessment"] }, content: lesson6() as never},
    { title: "Schizophrenia spectrum", module: 3, estimatedMinutes: 45, authored: true, concept: { title: "Schizophrenia spectrum disorders", slug: "schizophrenia-spectrum", summary: "Phenomenology of delusions, hallucinations and thought disorder; positive and negative symptoms, course and subtypes.", blooms: "understand", minutes: 45, prereq: ["classification-assessment"] }, content: lesson7() as never},
    { title: "Bipolar disorder", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Bipolar disorder", slug: "bipolar-disorder", summary: "Manic, hypomanic and depressive episodes, mixed states, cyclothymia and the longitudinal diagnosis that separates bipolar from unipolar illness.", blooms: "understand", minutes: 40, prereq: ["classification-assessment"] }, content: lesson8() as never},
    { title: "Depressive disorders", module: 3, estimatedMinutes: 40, authored: true, concept: { title: "Depressive disorders", slug: "depressive-disorders", summary: "Core and somatic symptoms, grief and adjustment, dysthymia, screening questions and suicide risk assessment.", blooms: "analyze", minutes: 40, prereq: ["bipolar-disorder"] }, content: lesson9() as never},
    { title: "Anxiety, phobia & OCD", module: 4, estimatedMinutes: 40, authored: true, concept: { title: "Anxiety, phobia and OCD", slug: "anxiety-phobia-ocd", summary: "Generalised anxiety, panic, phobias and obsessive-compulsive phenomena — recognition, differentials and first-line management.", blooms: "understand", minutes: 40, prereq: ["classification-assessment"] }, content: lesson10() as never},
    { title: "Somatoform & dissociative disorders", module: 4, estimatedMinutes: 35, authored: true, concept: { title: "Somatoform and dissociative disorders", slug: "somatoform-dissociative", summary: "Conversion and dissociative presentations, medically unexplained symptoms, and the empathetic management that avoids reinforcement.", blooms: "apply", minutes: 35, prereq: ["anxiety-phobia-ocd"] }, content: lesson11() as never},
    { title: "Stress-related & personality disorders", module: 4, estimatedMinutes: 35, authored: false, concept: { title: "Stress-related and personality disorders", slug: "stress-personality-disorders", summary: "Acute stress and PTSD, and the clusters of personality disorder with their assessment and management implications.", blooms: "understand", minutes: 35, prereq: ["somatoform-dissociative"] }, content: PLACEHOLDER },
    { title: "Alcohol & drug dependence", module: 5, estimatedMinutes: 45, authored: true, concept: { title: "Alcohol and drug dependence", slug: "alcohol-drug-dependence", summary: "Intoxication, withdrawal and dependence syndromes for alcohol, opioids, stimulants and sedatives; screening tools and treatment pathways.", blooms: "apply", minutes: 45, prereq: [] }, content: lesson12() as never},
    { title: "Child & adolescent disorders", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Child and adolescent disorders", slug: "child-adolescent-disorders", summary: "Neurodevelopmental disorders, ADHD, autism, conduct problems and adolescent emotional disorders across development.", blooms: "understand", minutes: 40, prereq: ["classification-assessment"] }, content: PLACEHOLDER },
    { title: "Therapies & counselling", module: 5, estimatedMinutes: 40, authored: false, concept: { title: "Psychological therapies and counselling", slug: "therapies-counselling", summary: "CBT and other psychotherapies, counselling technique, motivational interviewing and the indications for each modality.", blooms: "apply", minutes: 40, prereq: ["anxiety-phobia-ocd"] }, content: PLACEHOLDER },
    { title: "Psychological testing & emergencies", module: 5, estimatedMinutes: 35, authored: false, concept: { title: "Psychological testing and emergencies", slug: "psychological-testing-emergencies", summary: "Rating scales and neuropsychological tests, and the acute management of agitation, self-harm and psychiatric emergency.", blooms: "apply", minutes: 35, prereq: ["therapies-counselling"] }, content: PLACEHOLDER },
  ],
  sbas: [],
}

export async function seedPsychiatry(): Promise<void> {
  const counts = await seedMbbsCourse(PSYCHIATRY);
  console.log(`✓ ${PSYCHIATRY.code} ${PSYCHIATRY.title}: ${counts.modules} modules · ${counts.concepts} concepts · ${counts.lessons} lessons · ${counts.items} items`);
}

if (process.argv[1] && (process.argv[1].includes("mbbs/psychiatry") || process.argv[1].includes("seed-assessment-psychiatry"))) {
  seedPsychiatry()
    .then(async () => await prisma.$disconnect())
    .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
}
