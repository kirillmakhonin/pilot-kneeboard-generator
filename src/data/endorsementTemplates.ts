
export interface EndorsementTemplate {
    id: string;
    title: string;
    farReference?: string;
    text: string;
    fields: string[]; // List of field names to prompt for, e.g., ["Student Name", "Date"]
}

export interface EndorsementData {
    type: 'template' | 'custom';
    templateId?: string;
    // Common fields
    title?: string; // For custom or overriding template title
    text?: string; // The final text to render

    // For custom
    cfiName?: string;
    cfiNumber?: string;
    expirationDate?: string;

    // Template fields values
    fieldValues?: Record<string, string>;
}
export const ENDORSEMENT_TEMPLATES: EndorsementTemplate[] = [
    // --- GENERAL ---
    {
        id: 'A.1',
        title: 'Prerequisites for practical test',
        farReference: '61.39(a)(6)(i) and (ii)',
        text: 'I have received and logged training time within 2 calendar-months preceding the month of application in preparation for the practical test and am prepared for the required practical test for the issuance of [Certificate Level] certificate.',
        fields: ['Certificate Level']
    },
    {
        id: 'A.2',
        title: 'Review of deficiencies identified on airman knowledge test',
        farReference: '61.39(a)(6)(iii)',
        text: 'I have demonstrated satisfactory knowledge of the subject areas in which I was deficient on the [Test Name] airman knowledge test.',
        fields: ['Test Name']
    },
    {
        id: 'A.73',
        title: 'Retesting after failure of a knowledge or practical test',
        farReference: '61.49',
        text: 'I have given [Student Name] the additional training in the areas of deficiency required by § 61.49. I have determined that [Student Name] is proficient to pass the [Test Name] test.',
        fields: ['Student Name', 'Test Name']
    },

    // --- STUDENT PILOT ---
    {
        id: 'A.3',
        title: 'Pre-solo aeronautical knowledge',
        farReference: '61.87(b)',
        text: 'I have administered a test to [Student Name] on the aeronautical knowledge section of 14 CFR part 61, subpart C, appropriate to the [Aircraft Category] class aircraft to be flown, and reviewed the correct answers to the questions that were answered incorrectly.',
        fields: ['Student Name', 'Aircraft Category']
    },
    {
        id: 'A.4',
        title: 'Pre-solo flight training',
        farReference: '61.87(c)(1) and (2)',
        text: 'I have given [Student Name] the flight training required by § 61.87(c) in a [Make and Model] aircraft. I have determined that [Student Name] is proficient in the applicable maneuvers and procedures of § 61.87(n) and is proficient to make safe solo flights in a [Make and Model] aircraft.',
        fields: ['Student Name', 'Make and Model']
    },
    {
        id: 'A.5',
        title: 'Pre-solo flight training at night',
        farReference: '61.87(c) and (o)',
        text: 'I have given [Student Name] the flight training required by § 61.87(o) in a [Make and Model] aircraft. I have determined that [Student Name] is proficient in the applicable maneuvers and procedures of § 61.87(o) and is proficient to make safe solo flights at night in a [Make and Model] aircraft.',
        fields: ['Student Name', 'Make and Model']
    },
    {
        id: 'A.6',
        title: 'Solo flight (first 90-day period)',
        farReference: '61.87(n)',
        text: 'I have given [Student Name] the flight training required by § 61.87(c) in a [Make and Model] aircraft. I have determined that [Student Name] is proficient to make safe solo flights in a [Make and Model] aircraft. Limitations: [Limitations].',
        fields: ['Student Name', 'Make and Model', 'Limitations']
    },
    {
        id: 'A.7',
        title: 'Solo flight (additional 90-day period)',
        farReference: '61.87(p)',
        text: 'I have given [Student Name] the flight training required by § 61.87(p) in a [Make and Model] aircraft. I have determined that [Student Name] is proficient to make safe solo flights in a [Make and Model] aircraft. Limitations: [Limitations].',
        fields: ['Student Name', 'Make and Model', 'Limitations']
    },
    {
        id: 'A.8',
        title: 'Solo takeoffs and landings at another airport within 25 nm',
        farReference: '61.93(b)(1)',
        text: 'I have given [Student Name] the flight training required by § 61.93(b)(1). I have determined that [Student Name] is proficient to practice solo takeoffs and landings at [Airport Name] airport. The takeoffs and landings at [Airport Name] airport are subject to the following limitations: [Limitations].',
        fields: ['Student Name', 'Airport Name', 'Limitations']
    },
    {
        id: 'A.9',
        title: 'Solo cross-country flight training',
        farReference: '61.93(c)(1) and (2)',
        text: 'I have given [Student Name] the cross-country flight training required by § 61.93(c)(1) in a [Make and Model] aircraft. I have determined that [Student Name] is proficient in the applicable maneuvers and procedures of § 61.93(c)(1) and is proficient to make safe solo cross-country flights in a [Make and Model] aircraft.',
        fields: ['Student Name', 'Make and Model']
    },
    {
        id: 'A.10',
        title: 'Solo cross-country flight',
        farReference: '61.93(c)(3)',
        text: 'I have reviewed the cross-country planning of [Student Name]. I have confirmed that the navigation log, planning, and weather interpretation are correct and that the flight can be completed safely under the known conditions in a [Make and Model] aircraft. Route: [Route].',
        fields: ['Student Name', 'Make and Model', 'Route']
    },
    {
        id: 'A.12',
        title: 'Solo flight in Class B airspace (Ground)',
        farReference: '61.95(a)(1)',
        text: 'I have given [Student Name] the ground training required by § 61.95(a)(1). I have determined that [Student Name] is proficient to conduct solo flight operations in the [Class B Name] Class B airspace area.',
        fields: ['Student Name', 'Class B Name']
    },
    {
        id: 'A.13',
        title: 'Solo flight in Class B airspace (Flight)',
        farReference: '61.95(a)(2)',
        text: 'I have given [Student Name] the flight training required by § 61.95(a)(2) in a [Make and Model] aircraft. I have determined that [Student Name] is proficient to conduct solo flight operations in the [Class B Name] Class B airspace area. Limitations: [Limitations].',
        fields: ['Student Name', 'Make and Model', 'Class B Name', 'Limitations']
    },

    // --- PRIVATE PILOT ---
    {
        id: 'A.32',
        title: 'Private Pilot - Aeronautical knowledge test',
        farReference: '61.35(a)(1), 61.103(d), and 61.105',
        text: 'I have reviewed the ground training of [Student Name] on the aeronautical knowledge areas of § 61.105(b) that apply to the aircraft category and class rating sought. I have certified that [Student Name] is prepared for the [Test Name] knowledge test.',
        fields: ['Student Name', 'Test Name']
    },
    {
        id: 'A.33',
        title: 'Private Pilot - Flight proficiency/practical test',
        farReference: '61.103(f), 61.107(b), and 61.109',
        text: 'I have given [Student Name] the flight training required by § 61.109 in a [Make and Model] aircraft. I have determined that [Student Name] is proficient in the areas of operation of § 61.107(b) and is prepared for the [Test Name] practical test.',
        fields: ['Student Name', 'Make and Model', 'Test Name']
    },

    // --- INSTRUMENT RATING ---
    {
        id: 'A.38',
        title: 'Instrument Rating - Aeronautical knowledge test',
        farReference: '61.35(a)(1) and 61.65(a) and (b)',
        text: 'I have reviewed the ground training of [Student Name] on the aeronautical knowledge areas of § 61.65(b) that apply to the instrument rating sought. I have certified that [Student Name] is prepared for the [Test Name] knowledge test.',
        fields: ['Student Name', 'Test Name']
    },
    {
        id: 'A.39',
        title: 'Instrument Rating - Flight proficiency/practical test',
        farReference: '61.65(a)(6)',
        text: 'I have given [Student Name] the flight training required by § 61.65(c) and (d) in a [Make and Model] aircraft. I have determined that [Student Name] is proficient in the areas of operation of § 61.65(c) and is prepared for the Instrument - [Category and Class] practical test.',
        fields: ['Student Name', 'Make and Model', 'Category and Class']
    },
    {
        id: 'A.40',
        title: 'Instrument Proficiency Check (IPC)',
        farReference: '61.57(d)',
        text: 'I certify that [Pilot Name] has satisfactorily completed the instrument proficiency check of § 61.57(d) in a [Make and Model] aircraft on [Date].',
        fields: ['Pilot Name', 'Make and Model', 'Date']
    },

    // --- COMMERCIAL PILOT ---
    {
        id: 'A.34',
        title: 'Commercial Pilot - Aeronautical knowledge test',
        farReference: '61.35(a)(1), 61.123(c), and 61.125',
        text: 'I have reviewed the ground training of [Student Name] on the aeronautical knowledge areas of § 61.125(b) that apply to the aircraft category and class rating sought. I have certified that [Student Name] is prepared for the [Test Name] knowledge test.',
        fields: ['Student Name', 'Test Name']
    },
    {
        id: 'A.35',
        title: 'Commercial Pilot - Flight proficiency/practical test',
        farReference: '61.123(e), 61.127, and 61.129',
        text: 'I have given [Student Name] the flight training required by § 61.129 in a [Make and Model] aircraft. I have determined that [Student Name] is proficient in the areas of operation of § 61.127(b) and is prepared for the [Test Name] practical test.',
        fields: ['Student Name', 'Make and Model', 'Test Name']
    },

    // --- ADDITIONAL RATINGS / SPECIAL ENDORSEMENTS ---
    {
        id: 'A.68',
        title: 'Tailwheel Airplane',
        farReference: '61.31(i)',
        text: 'I certify that [Pilot Name] has received the required training of § 61.31(i) in a [Make and Model] aircraft. I have determined that [Pilot Name] is proficient in the operation of a tailwheel airplane.',
        fields: ['Pilot Name', 'Make and Model']
    },
    {
        id: 'A.69',
        title: 'Complex Airplane',
        farReference: '61.31(e)',
        text: 'I certify that [Pilot Name] has received the required training of § 61.31(e) in a [Make and Model] aircraft. I have determined that [Pilot Name] is proficient in the operation and systems of a complex airplane.',
        fields: ['Pilot Name', 'Make and Model']
    },
    {
        id: 'A.70',
        title: 'High Performance Airplane',
        farReference: '61.31(f)',
        text: 'I certify that [Pilot Name] has received the required training of § 61.31(f) in a [Make and Model] aircraft. I have determined that [Pilot Name] is proficient in the operation and systems of a high-performance airplane.',
        fields: ['Pilot Name', 'Make and Model']
    },
    {
        id: 'A.71',
        title: 'Pressurized Aircraft Capable of High Altitude Operations',
        farReference: '61.31(g)',
        text: 'I certify that [Pilot Name] has received the required training of § 61.31(g) in a [Make and Model] aircraft. I have determined that [Pilot Name] is proficient in the operation and systems of a pressurized aircraft.',
        fields: ['Pilot Name', 'Make and Model']
    },
    {
        id: 'A.65',
        title: 'Completion of a flight review',
        farReference: '61.56',
        text: 'I certify that [Pilot Name], [Certificate Number], has satisfactorily completed a flight review of § 61.56(a) on [Date].',
        fields: ['Pilot Name', 'Certificate Number', 'Date']
    },

    // --- FLIGHT INSTRUCTOR (CFI) ---
    {
        id: 'A.41',
        title: 'Fundamentals of instructing knowledge test',
        farReference: '61.183(d) and 61.185(a)(1)',
        text: 'I have reviewed the ground training of [Student Name] on the aeronautical knowledge areas of § 61.185(a)(1). I have certified that [Student Name] is prepared for the Fundamentals of Instructing knowledge test.',
        fields: ['Student Name']
    },
    {
        id: 'A.42',
        title: 'Flight Instructor - Aeronautical knowledge test',
        farReference: '61.183(f) and 61.185(a)(2) or (3)',
        text: 'I have reviewed the ground training of [Student Name] on the aeronautical knowledge areas of § 61.185(a)([Subsection]). I have certified that [Student Name] is prepared for the [Test Name] knowledge test.',
        fields: ['Student Name', 'Subsection', 'Test Name']
    },
    {
        id: 'A.43',
        title: 'Flight Instructor - Flight proficiency/practical test',
        farReference: '61.183(g) and 61.187',
        text: 'I have given [Student Name] the flight training required by § 61.187(b) in a [Make and Model] aircraft. I have determined that [Student Name] is proficient in the areas of operation of § 61.187(b) and is prepared for the [Test Name] practical test.',
        fields: ['Student Name', 'Make and Model', 'Test Name']
    },
    {
        id: 'A.45',
        title: 'Spin training',
        farReference: '61.183(i)(1)',
        text: 'I certify that [Student Name] has received the required training of § 61.183(i) in a [Make and Model] aircraft. I have determined that [Student Name] is competent in instructional skills for training stall awareness, spin entry, spins, and spin recovery procedures.',
        fields: ['Student Name', 'Make and Model']
    },

    // --- GROUND INSTRUCTOR ---
    {
        id: 'A.55',
        title: 'Ground Instructor - Aeronautical knowledge test',
        farReference: '61.213(a)',
        text: 'I have reviewed the ground training of [Student Name] on the aeronautical knowledge areas of § 61.213(a)([Subsection]). I have certified that [Student Name] is prepared for the [Test Name] knowledge test.',
        fields: ['Student Name', 'Subsection', 'Test Name']
    }
];