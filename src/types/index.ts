export interface SpeedData {
    label: string;
    value: string;
}

export interface BriefingData {
    title: string;
    steps: string;
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

export interface CFIEndorsementData {
    cfiName: string;
    cfiNumber: string;
    expirationDate: string;
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
}

export interface EmergencyChecklistItem {
    type: keyof typeof EmergencyChecklistItemState;
    /**
     * Content of the item
     */
    title: string;

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