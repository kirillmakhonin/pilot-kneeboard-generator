
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
    // --- PREREQUISITES FOR THE PRACTICAL TEST ENDORSEMENT ---
    {
        id: 'A.1',
        title: 'Prerequisites for practical test',
        farReference: '61.39(a)(6)(i) and (ii)',
        text: 'I certify that [First name, MI, Last name] has received and logged training time within 2 calendar-months preceding the month of application in preparation for the practical test and [he or she] is prepared for the required practical test for the issuance of [applicable] certificate.',
        fields: ['First name, MI, Last name', 'he or she', 'applicable']
    },
    {
        id: 'A.2',
        title: 'Review of deficiencies identified on airman knowledge test',
        farReference: '61.39(a)(6)(iii)',
        text: 'I certify that [First name, MI, Last name] has demonstrated satisfactory knowledge of the subject areas in which [he or she] was deficient on the [applicable] airman knowledge test.',
        fields: ['First name, MI, Last name', 'he or she', 'applicable']
    },

    // --- STUDENT PILOT ENDORSEMENTS ---
    {
        id: 'A.3',
        title: 'Pre-solo aeronautical knowledge',
        farReference: '61.87(b)',
        text: 'I certify that [First name, MI, Last name] has satisfactorily completed the pre-solo knowledge test of § 61.87(b) for the [make and model] aircraft.',
        fields: ['First name, MI, Last name', 'make and model']
    },
    {
        id: 'A.4',
        title: 'Pre-solo flight training',
        farReference: '61.87(c)(1) and (2)',
        text: 'I certify that [First name, MI, Last name] has received and logged pre-solo flight training for the maneuvers and procedures that are appropriate to the [make and model] aircraft. I have determined [he or she] has demonstrated satisfactory proficiency and safety on the maneuvers and procedures required by § 61.87 in this or similar make and model of aircraft to be flown.',
        fields: ['First name, MI, Last name', 'make and model', 'he or she']
    },
    {
        id: 'A.5',
        title: 'Pre-solo flight training at night',
        farReference: '61.87(o)',
        text: 'I certify that [First name, MI, Last name] has received flight training at night on night flying procedures that include takeoffs, approaches, landings, and go-arounds at night at the [airport name] airport where the solo flight will be conducted; navigation training at night in the vicinity of the [airport name] airport where the solo flight will be conducted. This endorsement expires 90 calendar-days from the date the flight training at night was received.',
        fields: ['First name, MI, Last name', 'airport name']
    },
    {
        id: 'A.6',
        title: 'Solo flight (first 90 calendar-day period)',
        farReference: '61.87(n)',
        text: 'I certify that [First name, MI, Last name] has received the required training to qualify for solo flying. I have determined [he or she] meets the applicable requirements of § 61.87(n) and is proficient to make solo flights in [make and model].',
        fields: ['First name, MI, Last name', 'he or she', 'make and model']
    },
    {
        id: 'A.7',
        title: 'Solo flight (each additional 90 calendar-day period)',
        farReference: '61.87(p)',
        text: 'I certify that [First name, MI, Last name] has received the required training to qualify for solo flying. I have determined that [he or she] meets the applicable requirements of § 61.87(p) and is proficient to make solo flights in [make and model].',
        fields: ['First name, MI, Last name', 'he or she', 'make and model']
    },
    {
        id: 'A.8',
        title: 'Solo takeoffs and landings at another airport within 25 nautical miles (NM)',
        farReference: '61.93(b)(1)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.93(b)(1). I have determined that [he or she] is proficient to practice solo takeoffs and landings at [airport name]. The takeoffs and landings at [airport name] are subject to the following conditions: [List any applicable conditions or limitations.]',
        fields: ['First name, MI, Last name', 'he or she', 'airport name', 'List any applicable conditions or limitations.']
    },
    {
        id: 'A.9',
        title: 'Solo cross-country flight',
        farReference: '61.93(c)(1) and (2)',
        text: 'I certify that [First name, MI, Last name] has received the required solo cross-country training. I find [he or she] has met the applicable requirements of § 61.93, and is proficient to make solo cross-country flights in a [make and model] aircraft, [aircraft category].',
        fields: ['First name, MI, Last name', 'he or she', 'make and model', 'aircraft category']
    },
    {
        id: 'A.10',
        title: 'Solo cross-country flight',
        farReference: '61.93(c)(3)',
        text: 'I have reviewed the cross-country planning of [First name, MI, Last name]. I find the planning and preparation to be correct to make the solo flight from [origination airport] to [origination airport] via [route of flight] with landings at [names of the airports] in a [make and model] aircraft on [date]. [List any applicable conditions or limitations.]',
        fields: ['First name, MI, Last name', 'origination airport', 'route of flight', 'names of the airports', 'make and model', 'date', 'List any applicable conditions or limitations.']
    },
    {
        id: 'A.11',
        title: 'Repeated solo cross-country flights not more than 50 NM from the point of departure',
        farReference: '61.93(b)(2)',
        text: 'I certify that [First name, MI, Last name] has received the required training in both directions between and at both [airport names]. I have determined that [he or she] is proficient of § 61.93(b)(2) to conduct repeated solo cross-country flights over that route, subject to the following conditions: [List any applicable conditions or limitations.]',
        fields: ['First name, MI, Last name', 'airport names', 'he or she', 'List any applicable conditions or limitations.']
    },
    {
        id: 'A.12',
        title: 'Solo flight in Class B airspace',
        farReference: '61.95(a)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.95(a). I have determined [he or she] is proficient to conduct solo flights in [name of Class B] airspace. [List any applicable conditions or limitations.]',
        fields: ['First name, MI, Last name', 'he or she', 'name of Class B', 'List any applicable conditions or limitations.']
    },
    {
        id: 'A.13',
        title: 'Solo flight to, from, or at an airport located in Class B airspace',
        farReference: '61.95(b) and 14 CFR part 91, § 91.131(b)(1)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.95(b)(1). I have determined that [he or she] is proficient to conduct solo flight operations at [name of airport]. [List any applicable conditions or limitations.]',
        fields: ['First name, MI, Last name', 'he or she', 'name of airport', 'List any applicable conditions or limitations.']
    },
    {
        id: 'A.14',
        title: 'Endorsement of U.S. citizenship recommended by the Transportation Security Administration (TSA)',
        farReference: '49 CFR § 1552.3(h)',
        text: 'I certify that [First name, MI, Last name] has presented me a [type of document presented, such as a U.S. birth certificate or U.S. passport, and the relevant control or sequential number on the document, if any] establishing that [he or she] is a U.S. citizen or national in accordance with 49 CFR § 1552.3(h).',
        fields: ['First name, MI, Last name', 'type of document presented, such as a U.S. birth certificate or U.S. passport, and the relevant control or sequential number on the document, if any', 'he or she']
    },

    // --- ADDITIONAL STUDENT PILOT ENDORSEMENTS FOR STUDENTS SEEKING SPORT OR RECREATIONAL PILOT CERTIFICATES ---
    {
        id: 'A.15',
        title: 'Solo flight in Class B, C, and D airspace',
        farReference: '61.94(a)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.94(a). I have determined [he or she] is proficient to conduct solo flights in [name of Class B, C, or D] airspace and authorized to operate to, from through and at [name of airport]. [List any applicable conditions or limitations.]',
        fields: ['First name, MI, Last name', 'he or she', 'name of Class B, C, or D', 'name of airport', 'List any applicable conditions or limitations.']
    },
    {
        id: 'A.16',
        title: 'Solo flight to, from, or at an airport located in Class B, C, or D airspace or at an airport having an operational control tower',
        farReference: '61.94(a) and 91.131(b)(1)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.94(a)(1). I have determined that [he or she] is proficient to conduct solo flight operations at [name of airport located in Class B, C, or D airspace or an airport having an operational control tower]. [List any applicable conditions or limitations.]',
        fields: ['First name, MI, Last name', 'he or she', 'name of airport located in Class B, C, or D airspace or an airport having an operational control tower', 'List any applicable conditions or limitations.']
    },

    // --- SPORT PILOT ENDORSEMENTS ---
    {
        id: 'A.17',
        title: 'Aeronautical knowledge test',
        farReference: '61.35(a)(1) and 61.309',
        text: 'I certify that [First name, MI, Last name] has received the required aeronautical knowledge training of § 61.309. I have determined that [he or she] is prepared for the [name of] knowledge test.',
        fields: ['First name, MI, Last name', 'he or she', 'name of']
    },
    {
        id: 'A.18',
        title: 'Taking flight proficiency check for different category or class of aircraft',
        farReference: '61.309 and 61.311',
        text: 'I certify that [First name, MI, Last name] has received the required training required in accordance with §§ 61.309 and 61.311 and have determined that [he or she] is prepared for the [name of] proficiency check.',
        fields: ['First name, MI, Last name', 'he or she', 'name of']
    },
    {
        id: 'A.19',
        title: 'Passing flight proficiency check for different category or class of aircraft',
        farReference: '61.309 and 61.311',
        text: 'I certify that [First name, MI, Last name] has met the requirements of §§ 61.309 and 61.311 and I have determined [him or her] proficient to act as pilot in command of [category and class] of light-sport aircraft.',
        fields: ['First name, MI, Last name', 'him or her', 'category and class']
    },
    {
        id: 'A.20',
        title: 'Taking sport pilot practical test',
        farReference: '61.309, 61.311, and 61.313',
        text: 'I certify that [First name, MI, Last name] has received the training required in accordance with §§ 61.309 and 61.311 and met the aeronautical experience requirements of § 61.313. I have determined that [he or she] is prepared for the [type of] practical test.',
        fields: ['First name, MI, Last name', 'he or she', 'type of']
    },
    {
        id: 'A.21',
        title: 'Passing a sport pilot practical test',
        farReference: '61.309, 61.311, and 61.313',
        text: 'I certify that [First name, MI, Last name] has met the requirements of §§ 61.309, 61.311, and 61.313, and I have determined [him or her] proficient to act as pilot in command of [category and class of] light-sport aircraft.',
        fields: ['First name, MI, Last name', 'him or her', 'category and class of']
    },
    {
        id: 'A.22',
        title: 'Class B, C, or D airspace, at an airport located in Class B, C, or D airspace, or to, from, through, or at an airport having an operational control tower',
        farReference: '61.325',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.325. I have determined [he or she] is proficient to conduct operations in Class B, C, or D airspace, at an airport located in Class B, C, or D airspace, or to, from, through, or at an airport having an operational control tower.',
        fields: ['First name, MI, Last name', 'he or she']
    },
    {
        id: 'A.23',
        title: 'Light-sport aircraft that has a maximum speed in level flight with maximum continuous power (VH) less than or equal to 87 Knots Calibrated Airspeed (KCAS)',
        farReference: '61.327',
        text: 'I certify that [First name, MI, Last name] has received the required training required in accordance with § 61.327(a) in a [make and model] aircraft. I have determined [him or her] proficient to act as pilot in command of a light-sport aircraft that has a VH less than or equal to 87 KCAS.',
        fields: ['First name, MI, Last name', 'make and model', 'him or her']
    },
    {
        id: 'A.24',
        title: 'Light-sport aircraft that has a VH greater than 87 KCAS',
        farReference: '61.327',
        text: 'I certify that [First name, MI, Last name] has received the required training required in accordance with § 61.327(b) in a [make and model] aircraft. I have determined [him or her] proficient to act as pilot in command of a light-sport aircraft that has a VH greater than 87 KCAS.',
        fields: ['First name, MI, Last name', 'make and model', 'him or her']
    },

    // --- RECREATIONAL PILOT ENDORSEMENTS ---
    {
        id: 'A.25',
        title: 'Aeronautical knowledge test',
        farReference: '61.35(a)(1), 61.96(b)(3), and 61.97(b)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.97(b). I have determined that [he or she] is prepared for the [name of] knowledge test.',
        fields: ['First name, MI, Last name', 'he or she', 'name of']
    },
    {
        id: 'A.26',
        title: 'Flight proficiency/practical test',
        farReference: '61.96(b)(5), 61.98(a) and (b), and 61.99',
        text: 'I certify that [First name, MI, Last name] has received the required training of §§ 61.98(b) and 61.99. I have determined that [he or she] is prepared for the [name of] practical test.',
        fields: ['First name, MI, Last name', 'he or she', 'name of']
    },
    {
        id: 'A.27',
        title: 'Recreational pilot to operate within 50 NM of the airport where training was received',
        farReference: '61.101(b)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.101(b). I have determined that [he or she] is competent to operate at the [name of airport].',
        fields: ['First name, MI, Last name', 'he or she', 'name of airport']
    },
    {
        id: 'A.28',
        title: 'Recreational pilot to act as pilot in command on a flight that exceeds 50 NM of the departure airport',
        farReference: '61.101(c)',
        text: 'I certify that [First name, MI, Last name] has received the required cross-country training of § 61.101(c). I have determined that [he or she] is proficient in cross-country flying of part 61 subpart E.',
        fields: ['First name, MI, Last name', 'he or she']
    },
    {
        id: 'A.29',
        title: 'Recreational pilot with less than 400 flight hours and no logged pilot in command time within the preceding 180 calendar-days',
        farReference: '61.101(g)',
        text: 'I certify that [First name, MI, Last name] has received the required 180-day recurrent training of § 61.101(g) in a [make and model] aircraft. I have determined [him or her] proficient to act as pilot in command of that aircraft.',
        fields: ['First name, MI, Last name', 'make and model', 'him or her']
    },
    {
        id: 'A.30',
        title: 'Recreational pilot to conduct solo flights for the purpose of obtaining an additional certificate or rating while under the supervision of an authorized flight instructor',
        farReference: '61.101(j)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.87 in a [make and model] aircraft. I have determined [he or she] is prepared to conduct a solo flight on [date] under the following conditions: [List all conditions which require endorsement (e.g., flight which requires communication with air traffic control, flight in an aircraft for which the pilot does not hold a category/class rating, etc.).]',
        fields: ['First name, MI, Last name', 'make and model', 'he or she', 'date', 'List all conditions which require endorsement (e.g., flight which requires communication with air traffic control, flight in an aircraft for which the pilot does not hold a category/class rating, etc.).']
    },
    {
        id: 'A.31',
        title: 'Class B, C, or D airspace, at an airport located in Class B, C, or D airspace, or to, from, through, or at an airport having an operational control tower',
        farReference: '61.101(d)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.101(d). I have determined [he or she] is proficient to conduct operations in Class B, C, or D airspace, at an airport located in Class B, C, or D airspace, or to, from, through, or at an airport having an operational control tower.',
        fields: ['First name, MI, Last name', 'he or she']
    },

    // --- PRIVATE PILOT ENDORSEMENTS ---
    {
        id: 'A.32',
        title: 'Aeronautical knowledge test',
        farReference: '61.35(a)(1), 61.103(d), and 61.105',
        text: 'I certify that [First name, MI, Last name] has received the required training in accordance with § 61.105. I have determined [he or she] is prepared for the [name of] knowledge test.',
        fields: ['First name, MI, Last name', 'he or she', 'name of']
    },
    {
        id: 'A.33',
        title: 'Flight proficiency/practical test',
        farReference: '61.103(f), 61.107(b), and 61.109',
        text: 'I certify that [First name, MI, Last name] has received the required training in accordance with §§ 61.107 and 61.109. I have determined [he or she] is prepared for the [name of] practical test.',
        fields: ['First name, MI, Last name', 'he or she', 'name of']
    },

    // --- COMMERCIAL PILOT ENDORSEMENTS ---
    {
        id: 'A.34',
        title: 'Aeronautical knowledge test',
        farReference: '61.35(a)(1), 61.123(c), and 61.125',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.125. I have determined that [he or she] is prepared for the [name of] knowledge test.',
        fields: ['First name, MI, Last name', 'he or she', 'name of']
    },
    {
        id: 'A.35',
        title: 'Flight proficiency/practical test',
        farReference: '61.123(e), 61.127, and 61.129',
        text: 'I certify that [First name, MI, Last name] has received the required training of §§ 61.127 and 61.129. I have determined that [he or she] is prepared for the [name of] practical test.',
        fields: ['First name, MI, Last name', 'he or she', 'name of']
    },

    // --- AIRLINE TRANSPORT PILOT (ATP) ENDORSEMENTS ---
    {
        id: 'A.36',
        title: 'Restricted privileges ATP Certificate, Airplane Multiengine Land (AMEL) rating',
        farReference: '61.160',
        text: 'The [insert institution\'s name] certifies that the recipient of this degree has successfully completed all of the aviation coursework requirements of § 61.160[(b), (c), or (d)] and therefore meets the academic eligibility requirements of § 61.160[(b), (c), or (d)].',
        fields: ['insert institution\'s name', '(b), (c), or (d)']
    },
    {
        id: 'A.37',
        title: 'ATP Certification Training Program (CTP)',
        farReference: '61.153(e)',
        text: 'The applicant named above has successfully completed the Airline Transport Pilot Certification Training Program as required by § 61.156, and therefore has met the prerequisite required by § 61.35(a)(2) for the Airline Transport Pilot Multiengine Airplane Knowledge Test.',
        fields: []
    },

    // --- INSTRUMENT RATING ENDORSEMENTS ---
    {
        id: 'A.38',
        title: 'Aeronautical knowledge test',
        farReference: '61.35(a)(1) and 61.65(a) and (b)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.65(b). I have determined that [he or she] is prepared for the Instrument-[airplane, helicopter, or powered-lift] knowledge test.',
        fields: ['First name, MI, Last name', 'he or she', 'airplane, helicopter, or powered-lift']
    },
    {
        id: 'A.39',
        title: 'Flight proficiency/practical test',
        farReference: '61.65(a)(6)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.65(c) and (d). I have determined [he or she] is prepared for the Instrument-[airplane, helicopter, or powered-lift] practical test.',
        fields: ['First name, MI, Last name', 'he or she', 'airplane, helicopter, or powered-lift']
    },
    {
        id: 'A.40',
        title: 'Prerequisites for instrument practical tests',
        farReference: '61.39(a)',
        text: 'I certify that [First name, MI, Last name] has received and logged the required flight time/training of § 61.39(a) in preparation for the practical test within 2 calendar-months preceding the date of the test and has satisfactory knowledge of the subject areas in which [he or she] was shown to be deficient by the FAA Airman Knowledge Test Report. I have determined [he or she] is prepared for the Instrument-[airplane, helicopter, or powered lift] practical test.',
        fields: ['First name, MI, Last name', 'he or she', 'airplane, helicopter, or powered lift']
    },

    // --- FLIGHT INSTRUCTOR (OTHER THAN FLIGHT INSTRUCTORS WITH A SPORT PILOT RATING) ENDORSEMENTS ---
    {
        id: 'A.41',
        title: 'Fundamentals of instructing knowledge test',
        farReference: '61.183(d)',
        text: 'I certify that [First name, MI, Last name] has received the required fundamentals of instruction training of § 61.185(a)(1). I have determined that [he or she] is prepared for the Fundamentals of Instructing knowledge test.',
        fields: ['First name, MI, Last name', 'he or she']
    },
    {
        id: 'A.42',
        title: 'Flight instructor aeronautical knowledge test',
        farReference: '61.183(f)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.185(a)[(2) or (3) (as appropriate to the flight instructor rating sought)]. I have determined that [he or she] is prepared for the [name of] knowledge test.',
        fields: ['First name, MI, Last name', '(2) or (3) (as appropriate to the flight instructor rating sought)', 'he or she', 'name of']
    },
    {
        id: 'A.43',
        title: 'Flight instructor ground and flight proficiency/practical test',
        farReference: '61.183(g)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.187(b). I have determined that [he or she] is prepared for the CFI - [aircraft category and class] practical test.',
        fields: ['First name, MI, Last name', 'he or she', 'aircraft category and class']
    },
    {
        id: 'A.44',
        title: 'Flight instructor certificate with instrument-(category/class) rating/practical test',
        farReference: '61.183(g), and 61.187(a) and (b)(7)',
        text: 'I certify that [First name, MI, Last name] has received the required certificated flight instructor - instrument training of § 61.187(b)(7). I have determined [he or she] is prepared for the certificated flight instructor - instrument - [airplane, helicopter, or powered-lift] practical test.',
        fields: ['First name, MI, Last name', 'he or she', 'airplane, helicopter, or powered-lift']
    },
    {
        id: 'A.45',
        title: 'Spin training',
        farReference: '61.183(i)(1)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.183(i) in [an airplane, a glider]. I have determined that [he or she] is competent and possesses instructional proficiency in stall awareness, spin entry, spins, and spin recovery procedures.',
        fields: ['First name, MI, Last name', 'an airplane, a glider', 'he or she']
    },
    {
        id: 'A.46',
        title: 'Helicopter Touchdown Autorotation',
        farReference: 'FAA-S-8081-7',
        text: 'I certify that [First name, MI, Last name] has received training in straight-in and 180-degree autorotations to include touchdown. I have determined that [he or she] is competent in instructional knowledge relating to the elements, common errors, performance, and correction of common errors related to straight-in and 180-degree autorotations.',
        fields: ['First name, MI, Last name', 'he or she']
    },

    // --- FLIGHT INSTRUCTOR WITH A SPORT PILOT RATING ENDORSEMENT ---
    {
        id: 'A.47',
        title: 'Fundamentals of instructing knowledge test',
        farReference: '61.405(a)(1)',
        text: 'I certify that [First name, MI, Last name] has received the required training in accordance with § 61.405(a)(1). I have determined that [he or she] is prepared for the Fundamentals of Instructing Knowledge Test.',
        fields: ['First name, MI, Last name', 'he or she']
    },
    {
        id: 'A.48',
        title: 'Sport pilot flight instructor aeronautical knowledge test',
        farReference: '61.35(a)(1) and 61.405(a)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.405(a)(2). I have determined that [he or she] is prepared for the [name of the knowledge test].',
        fields: ['First name, MI, Last name', 'he or she', 'name of the knowledge test']
    },
    {
        id: 'A.49',
        title: 'Flight instructor flight proficiency check to provide training if a different category or class of aircraft-(additional category/class)',
        farReference: '61.409 and 61.419',
        text: 'I certify that [First name, MI, Last name] has received the required training in accordance with §§ 61.409 and 61.419 and have determined that [he or she] is prepared for a proficiency check for the flight instructor with a sport pilot rating in a [aircraft category and class].',
        fields: ['First name, MI, Last name', 'he or she', 'aircraft category and class']
    },
    {
        id: 'A.50',
        title: 'Passing the flight instructor flight proficiency check to provide training in a different category or class of aircraft (additional category/class)',
        farReference: '61.409 and 61.419',
        text: 'I certify that [First name, MI, Last name] has met the requirements in accordance with §§ 61.409 and 61.419. I have determined that [he or she] is proficient and authorized for the additional [aircraft category and class] flight instructor privilege.',
        fields: ['First name, MI, Last name', 'he or she', 'aircraft category and class']
    },
    {
        id: 'A.51',
        title: 'Flight instructor practical test',
        farReference: '61.409 and 61.411',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.409 and met the aeronautical experience requirements of § 61.411. I have determined that [he or she] is prepared for the flight instructor with a sport pilot rating practical test in a [aircraft category and class].',
        fields: ['First name, MI, Last name', 'he or she', 'aircraft category and class']
    },
    {
        id: 'A.52',
        title: 'Passing the flight instructor practical test',
        farReference: '61.409 and 61.411',
        text: 'I certify that [First name, MI, Last name] has met the requirements in accordance with §§ 61.409 and 61.411. I have determined that [he or she] is proficient and authorized for the [aircraft category and class] flight instructor privilege.',
        fields: ['First name, MI, Last name', 'he or she', 'aircraft category and class']
    },
    {
        id: 'A.53',
        title: 'Sport pilot instructor to train sport pilots on flight by reference to instruments',
        farReference: '61.412',
        text: 'I certify that I have given [First name, MI, Last name] 3 hours of flight training and 1 hour of ground instruction specific to providing flight training on control and maneuvering an airplane solely by reference to the instruments in accordance with § 61.412. I have determined that [he or she] is proficient and authorized to provide training on control and maneuvering an airplane solely by reference to the flight instruments to this instructor\'s sport pilot candidate, who intends to operate an LSA airplane with a VH greater than 87 KCAS on a cross-country flight.',
        fields: ['First name, MI, Last name', 'he or she']
    },
    {
        id: 'A.54',
        title: 'Spin training',
        farReference: '61.405(b)(1)(ii)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.405(b)(1)(ii). I have determined that [he or she] is competent and possesses instructional proficiency in stall awareness, spin entry, spins, and spin recovery procedures.',
        fields: ['First name, MI, Last name', 'he or she']
    },

    // --- GROUND INSTRUCTOR ENDORSEMENT ---
    {
        id: 'A.55',
        title: 'Ground instructor who does not meet the recent experience requirements',
        farReference: '61.217(d)',
        text: 'I certify that [First name, MI, Last name] has demonstrated knowledge in the subject areas prescribed for a (basic, advanced, instrument) ground instructor under § 61.213(a)(3) and (a)(4), as appropriate.',
        fields: ['First name, MI, Last name']
    },

    // --- SPECIAL FEDERAL AVIATION REGULATION (SFAR) 73, ROBINSON R-22/R-44 SPECIAL TRAINING AND EXPERIENCE REQUIREMENTS, ENDORSEMENTS ---
    {
        id: 'A.56',
        title: 'R-22/R-44 awareness training',
        farReference: 'SFAR 73, section 2(a)(1) or (2)',
        text: 'I certify that [First name, MI, Last name, Pilot Certificate No. ______] has received the Awareness Training required by SFAR 73, section 2(a)(3)(i-v).',
        fields: ['First name, MI, Last name, Pilot Certificate No. ______']
    },
    {
        id: 'A.57',
        title: 'R-22 solo endorsement',
        farReference: 'SFAR 73, section 2(b)(3)',
        text: 'I certify that [First name, MI, Last name, Pilot Certificate No. ______] meets the experience requirements of SFAR 73, section 2(b)(3) and has been given training specified by SFAR 73, section 2(b)(3)(i-iv). [He or She] has been found proficient to solo the R-22 helicopter.',
        fields: ['First name, MI, Last name, Pilot Certificate No. ______', 'He or She']
    },
    {
        id: 'A.58',
        title: 'R-22 pilot-in-command endorsement',
        farReference: 'SFAR 73, section 2(b)(1)(ii)',
        text: 'I certify that [First name, MI, Last name, Pilot Certificate No. ______] has been given training specified by SFAR 73, section 2(b)(1)(ii) (A-D) for Robinson R-22 helicopters and is proficient to act as pilot in command. An annual flight review must be completed by [date 12 calendar-months after date of this endorsement] unless the requirements of SFAR 73, section 2(b)(1)(i) are met.',
        fields: ['First name, MI, Last name, Pilot Certificate No. ______', 'date 12 calendar-months after date of this endorsement']
    },
    {
        id: 'A.59',
        title: 'R-22 flight instructor endorsement',
        farReference: 'SFAR 73, section 2(b)(5)(iv)',
        text: 'I certify that [First name, MI, Last name], holder of CFI Certificate No. [______], meets the experience requirements, and has completed the flight training specified by SFAR 73, section 2(b)(5)(i-ii) and (iii)(A-D), and has demonstrated an ability to provide instruction on the general subject areas of SFAR 73, section 2(a)(3) and the flight training identified in SFAR 73, section 2(b)(5)(iii) in a Robinson R-22 helicopter.',
        fields: ['First name, MI, Last name', '______']
    },
    {
        id: 'A.60',
        title: 'Flight review in an R-22 helicopter',
        farReference: 'SFAR 73, section 2(c)(1) and (3)',
        text: 'I certify that [First name, MI, Last name, Pilot Certificate No. ______] has satisfactorily completed the flight review in an R-22 required by § 61.56 and SFAR 73, section 2(c)(1) and (3), on [date of flight review].',
        fields: ['First name, MI, Last name, Pilot Certificate No. ______', 'date of flight review']
    },
    {
        id: 'A.61',
        title: 'R-44 solo endorsement',
        farReference: 'SFAR 73, section 2(b)(4)',
        text: 'I certify that [First name, MI, Last name, Pilot Certificate No. ______] meets the experience requirements of SFAR 73, section 2(b)(4) and has been given training specified by SFAR 73, section 2(b)(4)(i-iv). [He or She] has been found proficient to solo the R-44 helicopter.',
        fields: ['First name, MI, Last name, Pilot Certificate No. ______', 'He or She']
    },
    {
        id: 'A.62',
        title: 'R-44 pilot-in-command endorsement',
        farReference: 'SFAR 73, section 2(b)(2)(ii)',
        text: 'I certify that [First name, MI, Last name, Pilot Certificate No. ______] has been given training specified by SFAR 73, section 2(b)(2)(ii)(A-D) for Robinson R-44 helicopters and is proficient to act as pilot in command. An annual flight review must be completed by [date 12 calendar-months after date of this endorsement] unless the requirements of SFAR 73, section 2(b)(2)(i) are met.',
        fields: ['First name, MI, Last name, Pilot Certificate No. ______', 'date 12 calendar-months after date of this endorsement']
    },
    {
        id: 'A.63',
        title: 'R-44 flight instructor endorsement',
        farReference: 'SFAR 73, section 2(b)(5)(iv)',
        text: 'I certify that [First name, MI, Last name], holder of CFI Certificate No. [______], meets the experience requirements and has completed the flight training specified by SFAR 73, section 2(b)(5)(i-ii) and (iii) (A-D), and has demonstrated an ability to provide instruction on the general subject areas of SFAR 73, section 2(a)(3) and the flight training identified in SFAR 73, section 2(b)(5)(iii) in a Robinson R-44 helicopter.',
        fields: ['First name, MI, Last name', '______']
    },
    {
        id: 'A.64',
        title: 'Flight review in an R-44 helicopter',
        farReference: 'SFAR 73, section 2(c)(2) and (3)',
        text: 'I certify that [First name, MI, Last name, Pilot Certificate No. ______] has satisfactorily completed the flight review in an R-44 required by 14 CFR, § 61.56 and SFAR 73, section 2(c)(2) and (3), on [date of flight review].',
        fields: ['First name, MI, Last name, Pilot Certificate No. ______', 'date of flight review']
    },

    // --- ADDITIONAL ENDORSEMENTS ---
    {
        id: 'A.65',
        title: 'Completion of a flight review',
        farReference: '61.56(a) and (c)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has satisfactorily completed a flight review of § 61.56(a) on [date].',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'date']
    },
    {
        id: 'A.66',
        title: 'Completion of any phase of an FAA-sponsored Pilot Proficiency Program (WINGS)',
        farReference: '61.56(e)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has satisfactorily completed Level: [Basic/Advanced/Master, as appropriate], PHASE NO. [..] OF A WINGS PROGRAM ON [DATE].',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'Basic/Advanced/Master, as appropriate', '..', 'DATE']
    },
    {
        id: 'A.67',
        title: 'Completion of an instrument proficiency check',
        farReference: '61.57(d)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has satisfactorily completed the instrument proficiency check of § 61.57(d) in a [make and model] aircraft on [date].',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'make and model', 'date']
    },
    {
        id: 'A.68',
        title: 'To act as pilot in command in a complex airplane',
        farReference: '61.31(e)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has received the required training of § 61.31(e) in a [make and model] complex airplane. I have determined that [he or she] is proficient in the operation and systems of a complex airplane.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'make and model', 'he or she']
    },
    {
        id: 'A.69',
        title: 'To act as pilot in command in a high-performance airplane',
        farReference: '61.31(f)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has received the required training of § 61.31(f) in a [make and model] high performance airplane. I have determined that [he or she] is proficient in the operation and systems of a high-performance airplane.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'make and model', 'he or she']
    },
    {
        id: 'A.70',
        title: 'To act as pilot in command in a pressurized aircraft capable of high-altitude operations',
        farReference: '61.31(g)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has received the required training of § 61.31(g) in a [make and model] pressurized aircraft. I have determined that [he or she] is proficient in the operation and systems of a pressurized aircraft.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'make and model', 'he or she']
    },
    {
        id: 'A.71',
        title: 'To act as pilot in command in a tailwheel airplane',
        farReference: '61.31(i)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has received the required training of § 61.31(i) in a [make and model] of tailwheel airplane. I have determined that [he or she] is proficient in the operation of a tailwheel airplane.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'make and model', 'he or she']
    },
    {
        id: 'A.72',
        title: 'To act as pilot in command of an aircraft in solo operations when the pilot does not hold an appropriate category/class rating',
        farReference: '61.31(d)(2)',
        text: 'I certify that [First name, MI, Last name] has received the training as required by § 61.31(d)(2) to serve as a pilot in command in a [specific category and class] of aircraft. I have determined that [he or she] is prepared to solo that [make and model] aircraft. Limitations: [optional].',
        fields: ['First name, MI, Last name', 'specific category and class', 'he or she', 'make and model', 'optional']
    },
    {
        id: 'A.73',
        title: 'Retesting after failure of a knowledge or practical test',
        farReference: '61.49',
        text: 'I certify that [First name, MI, Last name] has received the additional [flight and/or ground, as appropriate] training as required by § 61.49. I have determined that [he or she] is proficient to pass the [name of] knowledge/practical test.',
        fields: ['First name, MI, Last name', 'flight and/or ground, as appropriate', 'he or she', 'name of']
    },
    {
        id: 'A.74',
        title: 'Additional aircraft category or class rating (other than ATP)',
        farReference: '61.63(b) or (c)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has received the required training for an additional [aircraft category/class rating]. I have determined that [he or she] is prepared for the [name of] practical test for the addition of a [name of] [specific aircraft category/class/type] type rating.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'aircraft category/class rating', 'he or she', 'name of', 'specific aircraft category/class/type']
    },
    {
        id: 'A.75',
        title: 'Type rating only, already holds the appropriate category or class rating (other than ATP)',
        farReference: '61.63(d)(2)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.63(d)(2) for an addition of a [name of] type rating.',
        fields: ['First name, MI, Last name', 'name of']
    },
    {
        id: 'A.76',
        title: 'Type rating concurrently with an additional category or class rating (other than ATP)',
        farReference: '61.63(d)(2)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.63(d)(2) for an addition of a [name of] [specific category/class/type] type rating. I have determined that [he or she] is prepared for the [name of] practical test for the addition of a [name of] [specific aircraft category/class/type] type rating.',
        fields: ['First name, MI, Last name', 'name of', 'specific category/class/type', 'he or she', 'specific aircraft category/class/type']
    },
    {
        id: 'A.77',
        title: 'Type rating only, already holds the appropriate category or class rating (at the ATP level)',
        farReference: '61.157(b)(2)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.157(b)(2) for an addition of a [name of] type rating.',
        fields: ['First name, MI, Last name', 'name of']
    },
    {
        id: 'A.78',
        title: 'Type rating concurrently with an additional category or class rating (at the ATP level)',
        farReference: '61.157(b)(2)',
        text: 'I certify that [First name, MI, Last name] has received the required training of § 61.157(b)(2) for an addition of a [name of the specific category/class/type] type rating.',
        fields: ['First name, MI, Last name', 'name of the specific category/class/type']
    },
    {
        id: 'A.79',
        title: 'Launch procedures for operating a glider',
        farReference: '61.31(j)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has received the required training in a glider [make and model] for [ground-tow, aerotow, self-launch] procedure. I have determined that [he or she] is proficient in [ground-tow, aerotow, self-launch] procedure.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'make and model', 'ground-tow, aerotow, self-launch', 'he or she']
    },
    {
        id: 'A.80',
        title: 'Glider and unpowered ultralight vehicle towing experience',
        farReference: '61.69(a)(5)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has accomplished at least three flights in an aircraft while towing [a glider or unpowered ultralight vehicle, or while simulating towing flight procedures, as applicable].',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'a glider or unpowered ultralight vehicle, or while simulating towing flight procedures, as applicable']
    },
    {
        id: 'A.81',
        title: 'Glider and unpowered ultralight vehicle towing ground and flight',
        farReference: '61.69(a)(3)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has received the required ground and flight training in [a glider or unpowered ultralight vehicle, as applicable]. I have determined that [he or she] is proficient in the techniques and procedures essential to the safe towing of [gliders or unpowered vehicles, as applicable] including airspeed limitations; emergency procedures; signals used; and maximum angles of bank.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'a glider or unpowered ultralight vehicle, as applicable', 'he or she', 'gliders or unpowered vehicles, as applicable']
    },
    {
        id: 'A.82',
        title: 'Review of a home study curriculum',
        farReference: '61.35(a)(1)',
        text: 'I certify I have reviewed the home study curriculum of [First name, MI, Last name]. I have determined that [he or she] is prepared for the [name of] knowledge test.',
        fields: ['First name, MI, Last name', 'he or she', 'name of']
    },
    {
        id: 'A.83',
        title: 'Experimental aircraft only additional aircraft category or class rating (other than ATP)',
        farReference: '61.63(h)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], as required by § 61.63(h), is proficient to act as pilot in command in a [category, class, make, and model] of experimental aircraft and has logged at least 5 hours flight time logged between September 1, 2004, and August 31, 2005, while acting as pilot in command in [aircraft category/class rating and make and model] that has been issued an experimental certificate.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'category, class, make, and model', 'aircraft category/class rating and make and model']
    },
    {
        id: 'A.84',
        title: 'Experimental aircraft only additional aircraft category or class rating ATP',
        farReference: '61.65(g)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], as required by § 61.65(g) is proficient to act as pilot in command in a [category, class, make, and model] of experimental aircraft and has logged at least 5 hours flight time logged between September 1, 2004, and August 31, 2005, while acting as pilot in command in [aircraft category/class rating and make and model] that has been issued an experimental certificate.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'category, class, make, and model', 'aircraft category/class rating and make and model']
    },
    {
        id: 'A.85',
        title: 'Aeronautical experience credit-ultralight vehicles',
        farReference: '61.52',
        text: 'I certify that I have reviewed the records of [First name, MI, Last name], as required by § 61.52(c). I have determined that [he or she] may use [number of hours] aeronautical experience obtained in an ultralight vehicle to meet the requirements for [certificate/rating/privilege].',
        fields: ['First name, MI, Last name', 'he or she', 'number of hours', 'certificate/rating/privilege']
    },

    // --- NIGHT VISION GOGGLES (NVG) OPERATIONS ---
    {
        id: 'A.86',
        title: 'Endorsement required for ground training to act as pilot in command of an aircraft using NVG',
        farReference: '61.31(k)(1)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has received the ground training required by § 61.31(k)(1), (i) through (v) to conduct night vision goggle operations.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number']
    },
    {
        id: 'A.87',
        title: 'Endorsement required for flight training and statement of proficiency to act as pilot in command of an aircraft using NVG',
        farReference: '61.31(k)(2)',
        text: 'I certify that [First name, MI, Last name], [grade of pilot certificate], [certificate number], has received the flight training on night vision goggle operations required by 14 CFR § 61.31(k)(2), (i) through (iv). I find [he or she] proficient in the use of night vision goggles.',
        fields: ['First name, MI, Last name', 'grade of pilot certificate', 'certificate number', 'he or she']
    },
    {
        id: 'A.88',
        title: 'Endorsement required to provide training for NVG operations',
        farReference: '61.195(k)(7)',
        text: 'I certify that [First name, MI, Last name], holder of CFI Certificate No. [______], meets the night vision goggle instructor requirements of § 61.195(k) and is authorized to perform the night vision goggle pilot-in-command qualification and recent flight experience requirements under §§ 61.31(k) and 61.57(f) and (g). This endorsement does not provide the authority to endorse another flight instructor as a night vision goggle instructor.',
        fields: ['First name, MI, Last name', '______']
    },

    // --- ENHANCED FLIGHT VISION SYSTEM (EFVS) ---
    {
        id: 'A.89',
        title: 'Endorsement for EFVS ground training',
        farReference: '61.66(a)',
        text: 'I certify that [First name, MI, Last name], [pilot certificate], [certificate number], has satisfactorily completed the ground training required by § 61.66(a) appropriate to the [appropriate aircraft category] category of aircraft.',
        fields: ['First name, MI, Last name', 'pilot certificate', 'certificate number', 'appropriate aircraft category']
    },
    {
        id: 'A.90',
        title: 'Endorsement for EFVS flight training',
        farReference: '61.66(b)',
        text: 'I certify that [First name, MI, Last name], [pilot certificate], [certificate number], has received the flight training required by § 61.66(b) and is proficient in the use of EFVS in the [appropriate aircraft category in which the flight training was conducted] category of aircraft for EFVS operations conducted under [§ 91.176(a), (b), or both § 91.176(a) and (b)].',
        fields: ['First name, MI, Last name', 'pilot certificate', 'certificate number', 'appropriate aircraft category in which the flight training was conducted', '§ 91.176(a), (b), or both § 91.176(a) and (b)']
    },
    {
        id: 'A.91',
        title: 'Endorsement for EFVS ground and flight training',
        farReference: '61.66(a) and (b)',
        text: 'I certify that [First name, MI, Last name], [pilot certificate], [certificate number], has satisfactorily completed the ground training required by § 61.66(a) and has received the flight training required by § 61.66(b) for EFVS operations and is proficient in the use of EFVS in the [appropriate aircraft category in which the ground and flight training was conducted] category of aircraft for EFVS operations conducted under [§ 91.176(a), (b), or both § 91.176(a) and (b)].',
        fields: ['First name, MI, Last name', 'pilot certificate', 'certificate number', 'appropriate aircraft category in which the ground and flight training was conducted', '§ 91.176(a), (b), or both § 91.176(a) and (b)']
    },
    {
        id: 'A.92',
        title: 'Endorsement for EFVS supplementary training',
        farReference: '61.66(c)',
        text: 'I certify that [First name, MI, Last name], [pilot certificate], [certificate number], has satisfactorily completed the required ground and flight training required by § 61.66(c) for EFVS operations and is proficient in the use of EFVS in the [the appropriate aircraft category in which the supplementary ground and flight training was conducted] category of aircraft for EFVS operations conducted under [§ 91.176(a), (b), or both § 91.176(a) and (b)].',
        fields: ['First name, MI, Last name', 'pilot certificate', 'certificate number', 'the appropriate aircraft category in which the supplementary ground and flight training was conducted', '§ 91.176(a), (b), or both § 91.176(a) and (b)']
    }
];