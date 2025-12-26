export interface SpeedData {
    label: string;
    value: string;
}

export interface BriefingData {
    type?: string; // New field for briefing type (e.g., "Passenger", "Takeoff")
    title: string;
    content?: string; // New field for content
    steps?: string; // Legacy field for backward compatibility
}

export interface AircraftData {
    aircraftModel: string;
    footer: string;
    speeds: SpeedData[];
    takeoff: SpeedData[];
    landing: SpeedData[];
    emergency: SpeedData[];
    briefing: BriefingData[];
    [key: string]: unknown; // Add index signature to satisfy Record<string, unknown> constraint
}

export interface WeightBalancePosition {
    name: string;
    weight: string;
    arm: string;
    moment: string;
}

export interface WeightBalanceData {
    aircraft: string;
    tailNumber: string;
    makeModel: string;
    date: string;
    category: string;
    maxTakeoffWeight: string;
    referenceDatum: string;
    positions: WeightBalancePosition[];
    footer: string;
    [key: string]: unknown;
}

export interface FlightPlanAirport {
    code: string;
    elevation: string;
    wxFreq: string;
    approachFreq: string;
    towerFreq: string;
    groundFreq: string;
    ctafFreq: string;
    fssFreq: string;
    unicomFreq: string;
}

export interface FlightPlanClimb {
    cruiseAlt: string;
    fieldElev: string;
    climbFpm: string;
    climbGph: string;
}

export interface FlightPlanCruise {
    powerPercent: string;
    manifoldPressure: string;
    rpm: string;
    gph: string;
    tas: string;
}

export interface FlightPlanDescent {
    descentRate: string;
}

export interface FlightPlanLeg {
    name: string;
    vorFreq?: string;
    altitude: string;
    windDirection: string;
    windVelocity: string;
    temperature: string;
    tas: string;
    trueCourse: string;
    magneticHeading: string;
    heading: string;
    groundSpeed: string;
    distance: string;
    ete: string;
}

export interface FlightPlanData {
    departure: FlightPlanAirport;
    arrival: FlightPlanAirport;
    climb: FlightPlanClimb;
    cruise: FlightPlanCruise;
    descent: FlightPlanDescent;
    legs: FlightPlanLeg[];
    footer: string;
    [key: string]: unknown;
}

export interface CFIEndorsementData {
    cfiName: string;
    cfiNumber: string;
    expirationDate: string;
    endorsementDate: string;
    endorsementTitle: string;
    endorsementText: string;
    endorsementType: 'template' | 'custom';
    templateId?: string;
    fieldValues?: Record<string, string>;
    footer: string;
    [key: string]: unknown;
}

/**
 * Type of the checklist
 */
export const EmergencyChecklistType = {
    EMERGENCY: 'emergency',
    ABNORMAL: 'abnormal',
}

export const EmergencyChecklistItemState = {
    CHECK_LINE: 'check-line',
    SUBTITLE: 'subtitle',
    CONDITION: 'condition',
    INFO: 'info',
}

export interface EmergencyChecklistItem {
    type: keyof typeof EmergencyChecklistItemState;
    /**
     * Content of the item
     */
    title: string;

    content?: string;

    /**
     * Desired state of the condition (only for check-line)
     */
    desiredState?: string;

    /**
     * Highlighted in red
     */
    isHighlighted?: boolean;
}

export interface EmergencyChecklistGroup {
    /**
     * Name of the group
     */
    title?: string;
    /**
     * Items in the group
     */
    items: EmergencyChecklistItem[];


    /**
     * Highlighted in focus color
     */
    isHighlighted?: boolean;
}

export const EmergencyChecklistItemType = {
    ITEM: 'item',
    GROUP: 'group'
}

/**
 * 
 */
export interface EmergencyChecklistItemOrGroup {
    type: keyof typeof EmergencyChecklistItemType;
    item?: EmergencyChecklistItem;
    group?: EmergencyChecklistGroup;
}

export interface EmergencyChecklistScript {
    /**
     * Title of the script, i.e. Aborted Take-Off
     * Needed if more than one script in the section
     */
    title?: string;

    /**
     * Internal code like Emergency 2-3
     */
    internalCode?: string;

    /**
     * Content of the script
     */
    steps: EmergencyChecklistItemOrGroup[];
}


/**
 * Section of checklist 
 * Like FIRE | ELECTRICAL FIRE | SMOKE IN COCKPIT
 */
export interface EmergencyChecklistSection {
    /**
     * Type of the section
     */
    type: keyof typeof EmergencyChecklistType;

    /**
     * Title of the section
     */
    title: string;

    /**
     * One or more scripts
     */
    scripts: EmergencyChecklistScript[];
}

/**
 * Data for emergency checklist
 */
export interface EmergencyChecklistData {
    aircraft: string;
    tailNumber: string;
    makeModel: string;
    footer: string;
    sections: EmergencyChecklistSection[];
    [key: string]: unknown;
}