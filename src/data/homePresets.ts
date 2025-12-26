// Prefab data for quick start

export const DA20_SPEEDS_DATA = {
    aircraftModel: "DIAMOND DA20-C1",
    footer: "FLIGHT SCHOOL",
    speeds: [
        { label: "Max Speed in Rough Air V_NO", value: "118 Kts" },
        { label: "Max Maneuvering Speed V_A", value: "106 Kts" },
        { label: "Max Speed Flaps T/O V_FE T/O", value: "100 Kts" },
        { label: "Max Speed Flaps LDG V_FE LDG", value: "78 Kts" },
        { label: "Never Exceed Speed V_NE", value: "164 Kts" },
        { label: "Stall Speed Flaps Cruise V_S", value: "44 Kts" },
        { label: "Stall Speed Flaps LDG V_SO", value: "36 Kts" }
    ],
    takeoff: [
        { label: "Normal Rotate", value: "50-55 Kts" },
        { label: "Climb Out (Flaps T/O)", value: "65 Kts" },
        { label: "Climb Out (Flaps Cruise)", value: "75 Kts" },
        { label: "Short Field Rotate", value: "52 Kts" },
        { label: "V_X Cruise", value: "60 Kts" },
        { label: "V_Y Cruise", value: "75 Kts" }
    ],
    landing: [
        { label: "Normal Approach Flaps LDG", value: "65 Kts" },
        { label: "Approach Flaps UP", value: "70 Kts" },
        { label: "Short Field Approach Flaps LDG", value: "55-60 Kts" },
        { label: "Max Demonstrated X-Wind", value: "20 Kts" }
    ],
    emergency: [
        { label: "Best Glide (Flaps UP)", value: "73 Kts" },
        { label: "Glide Ratio", value: "11:1" },
        { label: "Distance per 1000ft AGL", value: "1.8 NM" }
    ],
    briefing: [
        { title: "SAFETY BRIEFING", content: "**S** - Seatbelts fastened **A** - Air vents overhead/panel. **F** - Fire extinguisher between seats. **E** - Doors and canopy. **T** - No talking during takeoff/landing. Point out traffic. **Y** - Any questions?" },

        // Takeoff Briefing
        { type: "Takeoff", title: "Type of Takeoff", content: "Normal takeoff, flaps T/O. Rotation at 50-55 knots, climb out at 65 knots flaps T/O, 75 knots flaps cruise." },
        { type: "Takeoff", title: "Runway", content: "Departing Runway [Insert Runway]. Full length available." },
        { type: "Takeoff", title: "Abnormal on Runway", content: "If any abnormality occurs before rotation, I will close the throttle and stop straight ahead." },
        { type: "Takeoff", title: "Engine Failure < 1000' AGL", content: "If engine fails after rotation with runway remaining, I will land on the runway. If runway is insufficient and below 1000', I will pick a field 30° left or right of nose. No turns back." },
        { type: "Takeoff", title: "Engine Failure > 1000' AGL", content: "If above 1000', I will check if a return to the airport is possible or select the best field." }
    ]
};

export const C172S_SPEEDS_DATA = {
    aircraftModel: "CESSNA 172S SKYHAWK",
    footer: "FLIGHT SCHOOL",
    speeds: [
        { label: "Max Speed in Rough Air V_NO", value: "129 Kts" },
        { label: "Max Maneuvering Speed V_A", value: "99 Kts" },
        { label: "Max Speed Flaps 10° V_FE", value: "110 Kts" },
        { label: "Max Speed Flaps FULL V_FE", value: "85 Kts" },
        { label: "Never Exceed Speed V_NE", value: "163 Kts" },
        { label: "Stall Speed Clean V_S1", value: "53 Kts" },
        { label: "Stall Speed Flaps FULL V_SO", value: "48 Kts" }
    ],
    takeoff: [
        { label: "Rotation Speed V_R", value: "55 Kts" },
        { label: "Best Rate of Climb V_Y", value: "75 Kts" },
        { label: "Best Angle of Climb V_X", value: "60 Kts" },
        { label: "Short Field Rotate", value: "51 Kts" },
        { label: "Short Field Climb", value: "56 Kts" }
    ],
    landing: [
        { label: "Normal Approach Flaps FULL", value: "61-65 Kts" },
        { label: "Short Field Approach", value: "57 Kts" },
        { label: "Max Demonstrated X-Wind", value: "15 Kts" }
    ],
    emergency: [
        { label: "Best Glide", value: "65 Kts" },
        { label: "Glide Ratio", value: "9:1" },
        { label: "Distance per 1000ft AGL", value: "1.5 NM" }
    ],
    briefing: [
        { title: "SAFETY BRIEFING", content: "**S** - Seatbelts fastened **A** - Air vents overhead/panel. **F** - Fire extinguisher between seats. **E** - Doors and luggage door. **T** - No talking during takeoff/landing. Point out traffic. **Y** - Any questions?" },

        // Takeoff Briefing
        { type: "Takeoff", title: "Type of Takeoff", content: "Normal takeoff, flaps up. Rotation at 55 knots, climb out at 75 knots." },
        { type: "Takeoff", title: "Runway", content: "Departing Runway [Insert Runway]. Full length available." },
        { type: "Takeoff", title: "Abnormal on Runway", content: "If any abnormality occurs before rotation, I will close the throttle and stop straight ahead." },
        { type: "Takeoff", title: "Engine Failure < 1000' AGL", content: "If engine fails after rotation with runway remaining, I will land on the runway. If runway is insufficient and below 1000', I will pick a field 30° left or right of nose. No turns back." },
        { type: "Takeoff", title: "Engine Failure > 1000' AGL", content: "If above 1000', I will check if a return to the airport is possible or select the best field." }
    ]
};

export const C172N_DATA = {
    aircraftModel: "CESSNA 172N SKYHAWK",
    footer: "",
    speeds: [
        { label: "V_R - Rotate Speed", value: "55 Kts" },
        { label: "V_Y - Best Rate of Climb", value: "75 Kts" },
        { label: "V_X - Best Angle of Climb", value: "60 Kts" },
        { label: "V_A - Max Maneuvering Speed", value: "80-95 Kts" },
        { label: "V_FE - Max Flap Ext", value: "85 Kts" },
        { label: "V_NO - Mac Cruise", value: "128 Kts" },
        { label: "V_NE - Never Exceed Speed", value: "160 Kts" },
        { label: "V_S - Stall Speed Clean", value: "53 Kts" },
        { label: "V_SO - Stall Speed Flaps FULL", value: "48 Kts" }
    ],
    takeoff: [
        { label: "V_R - Rotation Speed", value: "55 Kts" },
        { label: "V_Y - Best Rate of Climb", value: "75 Kts" },
        { label: "V_X - Best Angle of Climb", value: "60 Kts" },
    ],
    landing: [
        { label: "Normal Approach (Flaps Up)", value: "60-70 Kts" },
        { label: "Normal Approach (Flaps 40°)", value: "55-65 Kts" },
        { label: "Short Field Approach", value: "60 Kts" },
        { label: "Max Demonstrated X-Wind", value: "15 Kts" }
    ],
    emergency: [
        { label: "Best Glide", value: "65 Kts" },
        { label: "Glide Ratio", value: "9:1" },
        { label: "Distance per 1000ft AGL", value: "1.5 NM" }
    ],
    briefing: [
        { title: "SAFETY BRIEFING", content: "**S** - Seatbelts fastened \n**A** - Air vents overhead/panel. \n**F** - Fire extinguisher between seats. \n**E** - Doors and luggage door. \n**T** - No talking during takeoff/landing. Point out traffic. \n**Y** - Any questions?" },

        // Takeoff Briefing
        { title: "Type of Takeoff", content: "Normal takeoff, flaps up. Rotation at 55 knots, climb out at 75 knots." },
        { title: "Runway", content: "Departing Runway [RW]. Full length available." },
        { title: "Abnormal on Runway", content: "If any abnormality occurs before rotation, I will close the throttle and stop straight ahead." },
        { title: "Engine Failure < 1000' AGL", content: "If engine fails after rotation with runway remaining, I will land on the runway. If runway is insufficient and below 1000', I will pick a field 30° left or right of nose. No turns back." },
        { title: "Engine Failure > 1000' AGL", content: "If above 1000', I will check if a return to the airport is possible or select the best field." },

        { title: "Short Field Takeoff", content: "Flaps UP. I will hold the brakes, apply full power, and check gauges. Release brakes, rotate at 55 knots. Climb at 59 knots until clear of the obstacle, then accelerate to 73 knots." },
        { title: "Soft Field Takeoff", content: "Flaps 10°. I will keep the nose wheel light and lift off as soon as possible. I will stay in ground effect to accelerate to 55 knots, then climb out gently." },
        { title: "Normal Landing", content: "Flaps 40°. Final approach at 65 knots. Aiming for the numbers." },
        { title: "Short Field Landing", content: "Flaps 40°. Steep approach at 60 knots. I will cut power over the obstacles, touch down on the aiming point, retract flaps immediately, and apply heavy braking." },
        { title: "Soft Field Landing", content: "Flaps 40°. I will carry a small amount of power to cushion the landing. I will hold the nose wheel off the ground as long as possible and use minimum braking." },
    ]
};

export const DA20_WEIGHT_BALANCE_DATA = {
    aircraft: "DIAMOND DA20-C1",
    tailNumber: "N12345",
    makeModel: "DIAMOND DA20-C1 ECLIPSE",
    date: new Date().toISOString().split('T')[0],
    category: "Normal",
    maxTakeoffWeight: "1764",
    referenceDatum: "0.0",
    positions: [
        { name: "Basic Empty Weight", weight: "1232", arm: "93.7", moment: "115438" },
        { name: "Front Occupants", weight: "340", arm: "90.0", moment: "30600" },
        { name: "Baggage", weight: "0", arm: "123.0", moment: "0" },
        { name: "Fuel (24 gal usable)", weight: "144", arm: "94.0", moment: "13536" }
    ],
    footer: ""
};

export const C172S_WB_DATA = {
    aircraft: "CESSNA 172S",
    tailNumber: "N12345",
    makeModel: "CESSNA 172S SKYHAWK",
    date: new Date().toISOString().split('T')[0],
    category: "Normal",
    maxTakeoffWeight: "2550",
    referenceDatum: "40.0",
    positions: [
        { name: "Basic Empty Weight", weight: "1645", arm: "39.1", moment: "64290" },
        { name: "Front Occupants", weight: "340", arm: "37.0", moment: "12580" },
        { name: "Rear Occupants", weight: "340", arm: "73.0", moment: "24820" },
        { name: "Fuel (56 gal usable)", weight: "336", arm: "48.0", moment: "16128" },
        { name: "Baggage Area 1 (120 lb)", weight: "0", arm: "95.0", moment: "0" },
        { name: "Baggage Area 2 (50 lb)", weight: "0", arm: "123.0", moment: "0" }
    ],
    footer: "FLIGHT SCHOOL"
};

export const DA20_WB_DATA = DA20_WEIGHT_BALANCE_DATA;

export const C172N_WB_DATA = {
    aircraft: "Cessna 172N",
    tailNumber: "N738NY",
    makeModel: "CESSNA 172N SKYHAWK",
    date: new Date().toISOString().split('T')[0],
    category: "Normal",
    maxTakeoffWeight: "2300",
    referenceDatum: "40.0",
    positions: [
        { name: "Basic Empty Weight", weight: "1458", arm: "39.1", moment: "56997" },
        { name: "Front Occupants", weight: "340", arm: "37.0", moment: "12580" },
        { name: "Rear Occupants", weight: "340", arm: "73.0", moment: "24820" },
        { name: "Fuel (48 gal usable)", weight: "288", arm: "48.0", moment: "13824" },
        { name: "Baggage Area 1 (120 lb)", weight: "0", arm: "95.0", moment: "0" },
        { name: "Baggage Area 2 (50 lb)", weight: "0", arm: "123.0", moment: "0" }
    ],
    footer: ""
};

export const C172N_EMERGENCY_DATA = {
    aircraft: "CESSNA 172N SKYHAWK",
    sections: [
        {
            type: 'EMERGENCY',
            title: "ENGINE FAILURES",
            scripts: [
                {
                    title: "ENGINE FAILURE DURING T/O RUN",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "IDLE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Brakes", desiredState: "APPLY" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Flaps", desiredState: "RETRACT" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "OFF" } },
                    ]
                },
                {
                    title: "ENGINE FAILURE IMMEDIATELY AFTER T/O",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "65 KIAS (Flaps UP)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "60 KIAS (Flaps DOWN)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition Switch", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Wing Flaps", desiredState: "AS REQUIRED" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master Switch", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Emergency Landing", desiredState: "EXECUTE" } },
                    ]
                },
                {
                    title: "ENGINE FAILURE DURING FLIGHT",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "65 KIAS" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Carburetor Heat", desiredState: "ON" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "BOTH" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "RICH" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "BOTH (or START)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Primer", desiredState: "IN and LOCKED" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "FORCED LANDINGS",
            scripts: [
                {
                    title: "EMERGENCY LANDING W/ ENGINE POWER",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "65 KIAS (Flaps UP)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "60 KIAS (Flaps DOWN)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Landing Site", desiredState: "IDENTIFY" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Radio", desiredState: "MAYDAY-121.5" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Flaps", desiredState: "AS REQUIRED" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Doors", desiredState: "UNLATCH" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Touchdown", desiredState: "SLIGHTLY TAIL LOW" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Brakes", desiredState: "APPLY HEAVILY" } }
                    ]
                },
                {
                    title: "EMERGENCY LANDING W/O ENGINE POWER",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Flaps", desiredState: "AS REQUIRED" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "60 KIAS" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Landing Site", desiredState: "IDENTIFY" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Radio", desiredState: "MAYDAY-121.5" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Avionics", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Doors", desiredState: "UNLATCH" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Touchdown", desiredState: "SLIGHTLY TAIL LOW" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Brakes", desiredState: "APPLY HEAVILY" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "FIRES",
            scripts: [
                {
                    title: "DURING START ON GROUND",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cranking", desiredState: "CONTINUE" } },
                        { type: 'ITEM', item: { type: 'INFO', title: "IF ENGINE STARTS:", content: "Power 1700 RPM for a few minutes, then Shutdown." } },
                        { type: 'ITEM', item: { type: 'INFO', title: "IF ENGINE FAILS TO START:", content: "Throttle - Full" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cranking", desiredState: "CONTINUE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fire Extinguisher", desiredState: "APPLY" } }
                    ]
                },
                {
                    title: "ELECTRICAL FIRE IN FLIGHT",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Avionics", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "All Other Switches", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Vents", desiredState: "CLOSED" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fire Extinguisher", desiredState: "APPLY" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Vents", desiredState: "OPEN WHEN FIRE OUT" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master", desiredState: "ON" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Circuit Breakers", desiredState: "CHECK, NO RESET" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Avionics", desiredState: "ON INCREMENTALLY" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Vents", desiredState: "OPEN" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Land the Airplane", desiredState: "ASAP" } }
                    ]
                },
                {
                    title: "ENGINE FIRE IN FLIGHT",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUT-OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cabin Heat and Air", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "100 KIAS" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Forced Landing", desiredState: "EXECUTE" } }
                    ]
                },
                {
                    title: "CABIN FIRE",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Vents", desiredState: "CLOSED" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fire Extinguisher", desiredState: "ACTIVATE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Land the Airplane", desiredState: "ASAP" } }
                    ]
                },
                {
                    title: "WING FIRE",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Navigation Lights", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Strobe Lights", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Side Slip", desiredState: "AWAY FROM FLAMES" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Land the Airplane", desiredState: "ASAP" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "SPINS",
            scripts: [
                {
                    title: "PROCEDURE",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "IDLE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ailerons", desiredState: "NEUTRAL" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Rudder", desiredState: "FULL OPPOSITE TO ROTATION" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Elevator", desiredState: "BRISKLY FORWARD" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Recovery", desiredState: "NEUTRAL CONTROLS AT BREAK" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "DITCHING",
            scripts: [
                {
                    title: "PROCEDURE",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Radio", desiredState: "MAYDAY-121.5" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Heavy Objects", desiredState: "JETTISON" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Flaps", desiredState: "FULL" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Power", desiredState: "65 KTS" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Approach", desiredState: "INTO THE WIND" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Doors", desiredState: "UNLATCHED" } }
                    ]
                }
            ]
        },
    ],
    footer: "DATA DERIVED FROM 1977 CESSNA 172N POH SECTION 3."
};

export const DA20_EMERGENCY_DATA = {
    aircraft: "DIAMOND DA20-C1",
    sections: [
        {
            type: 'EMERGENCY',
            title: "ENGINE FAILURE",
            scripts: [
                {
                    title: "PROCEDURE",
                    internalCode: "EMERGENCY 4-1",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "IDLE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUTOFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Wing Flaps", desiredState: "AS REQUIRED" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cabin Heat", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Alternate Air", desiredState: "ON (IF NEEDED)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Pump", desiredState: "OFF" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "ENGINE FAILURE AFTER T/O",
            scripts: [
                {
                    title: "PROCEDURE",
                    internalCode: "EMERGENCY 4-2",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "73 KTS (BEST GLIDE)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Flaps", desiredState: "T/O (AS NEEDED)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "FULLEST TANK" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "FULL RICH" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "FULL" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Pump", desiredState: "ON" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Restart Attempt", desiredState: "BELOW 2000' AGL" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "FIRE DURING START",
            scripts: [
                {
                    title: "PROCEDURE",
                    internalCode: "EMERGENCY 4-3",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "FULL" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUTOFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Continue Cranking", desiredState: "TO DRAW FIRE OUT" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "IN-FLIGHT FIRE",
            scripts: [
                {
                    title: "PROCEDURE",
                    internalCode: "EMERGENCY 4-4",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master Switch", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUTOFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cabin Air", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Vents", desiredState: "OPEN" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fire Extinguisher", desiredState: "ACTIVATE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Emergency Landing", desiredState: "EXECUTE" } }
                    ]
                }
            ]
        }
    ],
    footer: "FOR TRAINING PURPOSES ONLY - CONSULT POH"
};

export const C172S_EMERGENCY_DATA = {
    aircraft: "CESSNA 172S SKYHAWK",
    sections: [
        {
            type: 'EMERGENCY',
            title: "ENGINE FAILURE",
            scripts: [
                {
                    title: "PROCEDURE",
                    internalCode: "EMERGENCY 5-1",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "IDLE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUTOFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Wing Flaps", desiredState: "AS REQUIRED" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cabin Heat/Air", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Alternate Air", desiredState: "ON (IF CARB ICE)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Primer", desiredState: "IN & LOCKED" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "ENGINE FAILURE AFTER TAKEOFF",
            scripts: [
                {
                    title: "PROCEDURE",
                    internalCode: "EMERGENCY 5-2",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Airspeed", desiredState: "65 KTS (BEST GLIDE)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Flaps", desiredState: "20° (AS NEEDED)" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "FULLEST TANK" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "FULL RICH" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "FULL" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Carb Heat", desiredState: "ON" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Primer", desiredState: "UNLOCK & PRIME" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "BOTH" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Restart Attempt", desiredState: "BELOW 2000' AGL" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "FIRE DURING START",
            scripts: [
                {
                    title: "PROCEDURE",
                    internalCode: "EMERGENCY 5-3",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "FULL" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUTOFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ignition", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Continue Cranking", desiredState: "TO DRAW FIRE OUT" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "IN-FLIGHT FIRE",
            scripts: [
                {
                    title: "PROCEDURE",
                    internalCode: "EMERGENCY 5-4",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Master Switch", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fuel Selector", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Mixture", desiredState: "IDLE CUTOFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cabin Air", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Vents", desiredState: "OPEN" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Cabin Heat", desiredState: "OFF" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Fire Extinguisher", desiredState: "ACTIVATE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Emergency Landing", desiredState: "EXECUTE" } }
                    ]
                }
            ]
        },
        {
            type: 'EMERGENCY',
            title: "SPINS",
            scripts: [
                {
                    title: "PROCEDURE",
                    internalCode: "EMERGENCY 5-5",
                    steps: [
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Throttle", desiredState: "IDLE" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Ailerons", desiredState: "NEUTRAL" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Rudder", desiredState: "FULL OPPOSITE TO ROTATION" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Elevator", desiredState: "BRISKLY FORWARD" } },
                        { type: 'ITEM', item: { type: 'CHECK_LINE', title: "Recovery", desiredState: "NEUTRAL CONTROLS AT BREAK" } }
                    ]
                }
            ]
        }
    ],
    footer: "FOR TRAINING PURPOSES ONLY - CONSULT POH"
};

// Preset mapping for URL parameter loading
export const SPEEDS_PRESETS = {
    'da20-c1': DA20_SPEEDS_DATA,
    'c172s': C172S_SPEEDS_DATA,
    'c172n': C172N_DATA,
};

export const WEIGHT_BALANCE_PRESETS = {
    'da20-c1': DA20_WEIGHT_BALANCE_DATA,
    'c172s': C172S_WB_DATA,
    'c172n': C172N_WB_DATA,
};

export const EMERGENCY_PRESETS = {
    'da20-c1': DA20_EMERGENCY_DATA,
    'c172s': C172S_EMERGENCY_DATA,
    'c172n': C172N_EMERGENCY_DATA,
};
