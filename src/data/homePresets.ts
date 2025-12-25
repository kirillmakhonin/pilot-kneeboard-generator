
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
    briefing: []
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
        { label: "Best Rate of Climb V_Y", value: "74 Kts" },
        { label: "Best Angle of Climb V_X", value: "62 Kts" },
        { label: "Short Field Obstacle Clear", value: "59 Kts" }
    ],
    landing: [
        { label: "Normal Approach", value: "65-75 Kts" },
        { label: "Short Field Approach", value: "62 Kts" },
        { label: "Max Demonstrated X-Wind", value: "15 Kts" }
    ],
    emergency: [
        { label: "Best Glide", value: "68 Kts" },
        { label: "Glide Ratio", value: "9:1" },
        { label: "Distance per 1000ft AGL", value: "1.5 NM" }
    ],
    briefing: []
};

export const C172S_WB_DATA = {
    aircraft: "Cessna 172S",
    tailNumber: "N12345",
    makeModel: "CESSNA 172S SKYHAWK",
    date: new Date().toISOString().split('T')[0],
    category: "Normal",
    maxTakeoffWeight: "2550",
    referenceDatum: "40.0",
    positions: [
        { name: "Basic Empty Weight", weight: "1663", arm: "40.5", moment: "67352" },
        { name: "Pilot", weight: "170", arm: "37.0", moment: "6290" },
        { name: "Front Passenger", weight: "0", arm: "37.0", moment: "0" },
        { name: "Rear Passengers", weight: "0", arm: "73.0", moment: "0" },
        { name: "Baggage Area 1", weight: "0", arm: "95.0", moment: "0" },
        { name: "Fuel (53 gal usable)", weight: "318", arm: "48.0", moment: "15264" }
    ],
    footer: "FLIGHT SCHOOL"
};

export const DA20_WB_DATA = {
    aircraft: "Diamond DA20-C1",
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
    footer: "FLIGHT SCHOOL"
};

export const C172N_DATA = {
    aircraftModel: "CESSNA 172N SKYHAWK",
    footer: "Data based on 1977 Cessna 172N POH and Aircraft W&B",
    speeds: [
        { label: "Max Speed in Rough Air V_NO", value: "128 Kts" },
        { label: "Max Maneuvering Speed V_A (2300 lbs)", value: "97 Kts" },
        { label: "Max Speed Flaps 10° V_FE", value: "85 Kts" },
        { label: "Max Speed Flaps FULL V_FE", value: "85 Kts" },
        { label: "Never Exceed Speed V_NE", value: "160 Kts" },
        { label: "Stall Speed Clean V_S1", value: "47 Kts" },
        { label: "Stall Speed Flaps FULL V_SO", value: "41 Kts" }
    ],
    takeoff: [
        { label: "Rotation Speed V_R", value: "55 Kts" },
        { label: "Best Rate of Climb V_Y", value: "73 Kts" },
        { label: "Best Angle of Climb V_X", value: "59 Kts" },
        { label: "Short Field Obstacle Clear", value: "59 Kts" }
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
        { item: "S", title: "Seatbelts", content: "Fastened low and tight. Shoulder harness worn for taxi, takeoff, and landing. To release: pull the latch outward." }, // [cite: 672, 674]
        { item: "A", title: "Air Vents", content: "Locations and operation of overhead and cabin vents. Fire extinguisher is located [verify location, typically between seats or on floor]." }, // [cite: 625, 188]
        { item: "F", title: "Fire", content: "In case of engine fire: Mixture Idle/Cut-off, Fuel Selector Off, Master Off, Vents Closed." }, // [cite: 1514, 1516, 1524]
        { item: "E", title: "Exits", content: "Doors: Unlock by rotating handle aft. Open by pushing door out. Windows: Left (and optional right) window opens for ventilation or emergency." }, // [cite: 708, 710]
        { item: "T", title: "Talking", content: "Sterile cockpit during critical phases of flight. Help spot traffic." },
        { item: "Y", title: "Your Questions", content: "Do you have any questions?" }
    ]
};

export const C172N_WB_DATA = {
    aircraft: "Cessna 172N",
    tailNumber: "N738NY",
    makeModel: "CESSNA 172N SKYHAWK",
    date: "2022-12-30",
    category: "Normal",
    maxTakeoffWeight: "2300",
    referenceDatum: "Lower portion of front face of firewall",
    positions: [
        { name: "Basic Empty Weight", weight: "1478.0", arm: "37.28", moment: "55099.84" }, // [cite: 4103]
        { name: "Pilot & Front Pax", weight: "170", arm: "37.0", moment: "6290" },          // [cite: 3180] (Station 34-46, Avg 37)
        { name: "Rear Passengers", weight: "0", arm: "73.0", moment: "0" },                 // [cite: 3191]
        { name: "Baggage Area 1", weight: "0", arm: "95.0", moment: "0" },                  // [cite: 3195] (Max 120 lbs)
        { name: "Baggage Area 2", weight: "0", arm: "123.0", moment: "0" },                 // [cite: 3200] (Max 50 lbs)
        { name: "Fuel (40 gal usable)", weight: "240", arm: "48.0", moment: "11520" }       // [cite: 4103, 3246] (W&B fuel deduction confirms 40gal)
    ],
    footer: ""
};