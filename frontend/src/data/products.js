const products = [
  {
    id: 'qbank',
    slug: 'qbank',
    name: 'Qbank',
    category: 'Qbank',
    subtitle: 'USMLE Step 1 prep course',
    price: 140,
    originalPrice: 199,
    badge: 'Save 30%',
    description:
      'A question bank designed for targeted concept review, timed practice and measurable progress.',
    longDescription:
      'Build confidence with thousands of exam-style questions, diagnostic blocks, and realistic timed practice. This course is ideal for students wanting to sharpen high-yield content and improve performance through data-backed review.',
    features: [
      '3,000+ exam-style questions',
      'Diagnostic assessment and baselines',
      'Timed simulated exam blocks',
      'Performance analytics dashboard',
      'Mobile-friendly access',
    ],
    benefits: [
      'Identify weak areas quickly and focus your preparation with precision.',
      'Track understanding across systems, physiology and clinical reasoning.',
      'Practice in realistic test conditions to build stamina and pacing.',
    ],
    faqs: [
      {
        question: 'How is the Qbank structured?',
        answer:
          'The bank is organized by topic and includes timed question sets, review explanations, and progress analytics to help you study strategically.',
      },
      {
        question: 'Is it good for full-length review?',
        answer:
          'Yes. It includes diagnostic assessments and timed question blocks that mimic exam pressure while helping you monitor growth.',
      },
    ],
    image:
      'https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'test-product',
    slug: 'test-product',
    name: 'Test Product',
    category: 'Testing',
    subtitle: 'Live Razorpay validation item',
    price: 0.011,
    originalPrice: 0.02,
    badge: 'Test',
    description:
      'Small-value test item for validating live Razorpay checkout in a safe, minimum-payment flow.',
    longDescription:
      'Use this test item to validate Razorpay checkout behavior with a tiny amount, confirm your live keys work, and smoke-test the booking flow without using a large purchase.',
    features: [
      'Very small live-payment test amount',
      'Razorpay checkout smoke test',
      'Quick validation for production keys',
      'Good for QA and payment regression checks',
    ],
    benefits: [
      'Validate the entire live payment path with a minimal amount.',
      'Confirm your live API keys are wired correctly.',
      'Use this as a safe payment smoke test before releasing large purchases.',
    ],
    faqs: [
      {
        question: 'Why is this product priced so low?',
        answer:
          'It is intended as a smoke-test item to confirm your live Razorpay integration is working correctly before selling full-price courses.',
      },
      {
        question: 'Is this for real checkout?',
        answer:
          'Yes. It is meant to validate the actual checkout process with your live Razorpay credentials.',
      },
    ],
    image:
      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'flextrack',
    slug: 'flextrack-course',
    name: 'FlexTrack Course',
    category: 'Course',
    subtitle: 'Self-paced learning system',
    price: 1560,
    originalPrice: 1990,
    badge: 'Save 30%',
    description:
      'A structured online course with videos, guided modules, checkpoints and measurable learning milestones.',
    longDescription:
      'FlexTrack gives you a self-paced study pathway with high-yield review, progressive lessons, quizzes and data-rich progress tracking designed for disciplined study schedules.',
    features: [
      'Instructional video library',
      'Learning modules and assignments',
      'Knowledge checks and quizzes',
      'Progress tracking dashboard',
      'Custom study planner',
    ],
    benefits: [
      'Study at your own pace while maintaining consistent progress with structured checkpoints.',
      'Reinforce learning through assignments and concept reviews that map to the exam blueprint.',
      'Use analytics to identify patterns and refine your study strategy systematically.',
    ],
    faqs: [
      {
        question: 'Is the course self-paced?',
        answer:
          'Yes. You can complete the modules on your own schedule and revisit lessons whenever needed.',
      },
      {
        question: 'Does it include assessment support?',
        answer:
          'Yes. The course includes quizzes, practice tasks and performance insights so you can measure retention over time.',
      },
    ],
    image:
      'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'live-online',
    slug: 'live-online',
    name: 'Live Online',
    category: 'Live',
    subtitle: 'Instructor-led coaching',
    price: 2800,
    originalPrice: 3999,
    badge: 'Save 30%',
    description:
      'Interactive online coaching with live workshops, targeted review sessions, and expert-led feedback.',
    longDescription:
      'This program blends live instruction with guided practice and review labs. It is designed for students who benefit from direct teaching, collaborative discussion and question-driven learning.',
    features: [
      'Weekly live interactive sessions',
      'Question-based review workshops',
      'Recorded lessons and replays',
      'Instructor feedback during practice',
      'Study accountability and benchmarks',
    ],
    benefits: [
      'Stay motivated with structured weekly interaction and expert accountability.',
      'Ask questions in real time and gain clarity on the most difficult concepts.',
      'Review lectures and workshop notes as needed for reinforcement and faster retention.',
    ],
    faqs: [
      {
        question: 'Are the sessions recorded?',
        answer:
          'Yes. All live sessions are recorded and available for review after class.',
      },
      {
        question: 'Who is this best for?',
        answer:
          'This format is ideal if you want live guidance, structured accountability and frequent review sessions.',
      },
    ],
    image:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: 'private-tutoring',
    slug: 'private-tutoring-live-online',
    name: 'Private Tutoring + Live Online',
    category: 'Premium',
    subtitle: 'Personalized study plan',
    price: 6499,
    originalPrice: 9999,
    badge: 'Custom pricing',
    description:
      'A premium learning track combining one-to-one tutoring, live classes, and a tailored study plan for accelerated support.',
    longDescription:
      'For students looking for a highly personalized approach, this option pairs dedicated instruction with live online learning and a custom study roadmap tailored to your pace, strengths and gaps.',
    features: [
      'One-to-one instructor sessions',
      'Flexible scheduling and study plan',
      'Performance review and strategy calls',
      'Live online coursework included',
      'Priority support and accountability',
    ],
    benefits: [
      'Receive individualized guidance around your exact learning gaps and goals.',
      'Create a realistic study path with more flexibility and direct support from your coach.',
      'Maximize accountability with frequent check-ins and personalized recommendations.',
    ],
    faqs: [
      {
        question: 'Is the tutoring customized?',
        answer:
          'Yes. The program is tailored to your goals, current strengths, and the pace that fits your schedule.',
      },
      {
        question: 'Can I combine it with the live online coursework?',
        answer:
          'Yes. This plan includes a live online experience with added mentor-led support.',
      },
    ],
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&w=900&q=80',
  },
]

export default products
