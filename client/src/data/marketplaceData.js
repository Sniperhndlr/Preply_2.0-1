export const US_STATES = [
  { code: 'AL', name: 'Alabama' }, { code: 'AK', name: 'Alaska' }, { code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' }, { code: 'CA', name: 'California' }, { code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' }, { code: 'DE', name: 'Delaware' }, { code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' }, { code: 'HI', name: 'Hawaii' }, { code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' }, { code: 'IN', name: 'Indiana' }, { code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' }, { code: 'KY', name: 'Kentucky' }, { code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' }, { code: 'MD', name: 'Maryland' }, { code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' }, { code: 'MN', name: 'Minnesota' }, { code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' }, { code: 'MT', name: 'Montana' }, { code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' }, { code: 'NH', name: 'New Hampshire' }, { code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' }, { code: 'NY', name: 'New York' }, { code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' }, { code: 'OH', name: 'Ohio' }, { code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' }, { code: 'PA', name: 'Pennsylvania' }, { code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' }, { code: 'SD', name: 'South Dakota' }, { code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' }, { code: 'UT', name: 'Utah' }, { code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' }, { code: 'WA', name: 'Washington' }, { code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' }, { code: 'WY', name: 'Wyoming' },
];

export const GRADE_LEVELS = [
  'Elementary (3-5)',
  'Middle (6-8)',
  'High school (9-12)',
  'AP/College',
];

export const POPULAR_SUBJECTS = [
  'Middle School Math', 'Algebra 1', 'Geometry', 'Biology', 'Chemistry',
  'Physics', 'ELA / Reading', 'US History', 'AP Calculus', 'AP US History',
];

export const SUBJECT_OPTIONS = [
  'Math', 'Algebra 1', 'Geometry', 'Biology', 'Chemistry', 'Physics', 'ELA',
  'US History', 'Social Studies', 'AP Calculus', 'AP US History', 'AP Biology', 'SAT Prep',
];

export const COURSE_TYPES = [
  'Algebra 1', 'Geometry', 'Biology', 'Chemistry', 'Physics', 'AP US History', 'AP Calculus',
];

export const TEST_PREP_TAGS = ['End-of-course exam', 'State standardized test', 'AP exam'];
export const AVAILABILITY_PRESETS = ['After school', 'Weekends'];

export const MOCK_TUTORS = [
  {
    id: 't1',
    name: 'Avery Chen',
    avatarUrl: '',
    subjects: ['Algebra 1', 'Geometry', 'AP Calculus'],
    gradeLevels: ['Middle (6-8)', 'High school (9-12)', 'AP/College'],
    statesCovered: ['CA', 'TX', 'NY'],
    standardsTags: ['CA Algebra I', 'TX Algebra I', 'NY Regents Alg 1'],
    hourlyRate: 42,
    rating: 4.9,
    ratingCount: 128,
    tutorType: 'CertifiedTeacher',
    badges: ['Certified teacher', 'AP expert', '5+ years experience'],
    availabilitySlots: [
      { dayOfWeek: 1, startTime: '16:00', endTime: '19:00' },
      { dayOfWeek: 3, startTime: '16:00', endTime: '19:00' },
      { dayOfWeek: 6, startTime: '10:00', endTime: '13:00' },
    ],
  },
  {
    id: 't2', name: 'Jordan Patel', avatarUrl: '',
    subjects: ['Biology', 'Chemistry', 'AP Biology'],
    gradeLevels: ['High school (9-12)', 'AP/College'],
    statesCovered: ['NC', 'SC', 'GA'],
    standardsTags: ['NC Biology', 'GA Biology', 'AP Biology'],
    hourlyRate: 36, rating: 4.8, ratingCount: 94,
    tutorType: 'ProfessionalTutor', badges: ['AP expert', 'STEM specialist'],
    availabilitySlots: [
      { dayOfWeek: 2, startTime: '16:30', endTime: '19:30' },
      { dayOfWeek: 4, startTime: '16:30', endTime: '19:30' },
      { dayOfWeek: 0, startTime: '09:00', endTime: '12:00' },
    ],
  },
  {
    id: 't3', name: 'Maya Thompson', avatarUrl: '',
    subjects: ['ELA', 'US History', 'AP US History'],
    gradeLevels: ['Middle (6-8)', 'High school (9-12)', 'AP/College'],
    statesCovered: ['FL', 'IL', 'PA'],
    standardsTags: ['FL ELA', 'IL US History', 'AP US History'],
    hourlyRate: 34, rating: 4.9, ratingCount: 152,
    tutorType: 'CertifiedTeacher', badges: ['Certified teacher', 'Essay coach'],
    availabilitySlots: [
      { dayOfWeek: 1, startTime: '15:00', endTime: '18:00' },
      { dayOfWeek: 5, startTime: '11:00', endTime: '14:00' },
    ],
  },
  {
    id: 't4', name: 'Noah Ramirez', avatarUrl: '',
    subjects: ['Math', 'Physics', 'SAT Prep'],
    gradeLevels: ['High school (9-12)', 'AP/College'],
    statesCovered: ['TX', 'AZ', 'NM'],
    standardsTags: ['TX Physics', 'SAT Math'],
    hourlyRate: 30, rating: 4.7, ratingCount: 63,
    tutorType: 'CollegeStudent', badges: ['SAT expert', 'Top rated'],
    availabilitySlots: [
      { dayOfWeek: 2, startTime: '17:00', endTime: '20:00' },
      { dayOfWeek: 6, startTime: '09:00', endTime: '12:00' },
    ],
  },
  {
    id: 't5', name: 'Sophia Lee', avatarUrl: '',
    subjects: ['Middle School Math', 'Algebra 1', 'ELA'],
    gradeLevels: ['Elementary (3-5)', 'Middle (6-8)'],
    statesCovered: ['WA', 'OR', 'CA'],
    standardsTags: ['CA Math 8', 'WA Math 7'],
    hourlyRate: 28, rating: 4.8, ratingCount: 81,
    tutorType: 'ProfessionalTutor', badges: ['5+ years experience'],
    availabilitySlots: [
      { dayOfWeek: 1, startTime: '14:00', endTime: '17:00' },
      { dayOfWeek: 3, startTime: '14:00', endTime: '17:00' },
    ],
  },
];

export const quickReplies = [
  'Can we schedule a lesson?',
  'Here is my homework question',
  'What times are you available?',
  'Can you help with test prep?',
];

export const getStateName = (code) => US_STATES.find((s) => s.code === code)?.name || code;

export const buildTutorProfileRoute = (id) => `/teachers/${id}`;
