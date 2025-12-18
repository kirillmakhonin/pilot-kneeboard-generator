import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Calculator, Settings, ChevronRight, Sparkles } from 'lucide-react';

// Prefab data for quick start
const DA20_SPEEDS_DATA = {
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

const C172S_SPEEDS_DATA = {
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

const C172S_WB_DATA = {
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

const DA20_WB_DATA = {
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

const encodeData = (data: unknown) => btoa(unescape(encodeURIComponent(JSON.stringify(data))));

interface GeneratorCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    comingSoon?: boolean;
}

interface Generator {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string; size?: number }>;
    color: string;
    status: 'active' | 'coming-soon';
    features: string[];
}

const generators: Generator[] = [
    {
        id: 'speeds-briefing',
        title: 'Speeds & Briefing',
        description: 'Generate comprehensive kneeboard cards with aircraft speeds, takeoff/landing procedures, and emergency checklists.',
        icon: Plane,
        color: 'blue',
        status: 'active',
        features: ['V-Speeds', 'Takeoff Procedures', 'Landing Procedures', 'Emergency Operations']
    },
    {
        id: 'weight-balance',
        title: 'Weight & Balance',
        description: 'Create professional weight and balance forms with automatic moment calculations and CG analysis.',
        icon: Calculator,
        color: 'green',
        status: 'active',
        features: ['Weight Calculations', 'CG Analysis', 'Multiple Positions', 'Printable Forms']
    },
    {
        id: 'emergency',
        title: 'Emergency Procedures',
        description: 'Create comprehensive emergency procedure checklists for quick reference during critical situations.',
        icon: Settings,
        color: 'red',
        status: 'active',
        features: ['Emergency Checklists', 'Quick Reference', 'Critical Procedures']
    }
];

const GeneratorCard: React.FC<GeneratorCardProps> = ({ title, description, icon, path, comingSoon = false }) => {
    if (comingSoon) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 opacity-60">
                <div className="flex items-start gap-4">
                    <div className="bg-slate-100 p-3 rounded-lg">
                        {icon}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                        <p className="text-sm text-slate-600 mb-4">{description}</p>
                        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                            Coming Soon
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <Link
            to={path}
            className="block bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
        >
            <div className="flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
                    <p className="text-sm text-slate-600 mb-4">{description}</p>
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full group-hover:bg-blue-100 transition-colors">
                        Open Generator
                        <ChevronRight size={12} />
                    </span>
                </div>
            </div>
        </Link>
    );
};

export const HomePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <Plane className="text-white" size={18} />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-slate-900">Pilot Kneeboard Generator</h1>
                            <p className="text-xs text-slate-500">Professional aviation reference tools</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Disclaimer */}
            <div className="max-w-7xl mx-auto px-4 pt-6">
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                        <div className="text-amber-600 mt-0.5">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="font-semibold text-amber-900 mb-1">Important Disclaimer</h3>
                            <p className="text-sm text-amber-800">
                                This tool is provided for informational purposes only. Pilots must verify all information against official aircraft documentation, POH/AFM, and regulatory requirements. Use at your own risk and always consult with qualified instructors and aviation authorities. The site owners assume no responsibility for the accuracy or use of this information.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Generator</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Create professional kneeboard cards and reference materials for your aircraft.
                        Each generator is optimized for specific aviation needs.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {generators.map(generator => (
                        <GeneratorCard
                            key={generator.id}
                            title={generator.title}
                            description={generator.description}
                            icon={<generator.icon className={`text-${generator.color}-600`} size={20} />}
                            path={`/${generator.id}`}
                            comingSoon={generator.status === 'coming-soon'}
                        />
                    ))}
                </div>

                {/* Quick Start Prefabs */}
                <div className="mt-16">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
                            <Sparkles size={16} />
                            Quick Start Templates
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-2">Start with Pre-configured Aircraft</h3>
                        <p className="text-slate-600 max-w-xl mx-auto">
                            Jump right in with ready-to-use templates for popular training aircraft. Customize as needed.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        {/* Diamond DA20 */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Plane className="text-blue-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Diamond DA20-C1</h4>
                                    <p className="text-xs text-slate-500">Popular training aircraft</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    to={`/speeds-briefing?data=${encodeData(DA20_SPEEDS_DATA)}`}
                                    className="flex-1 text-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                >
                                    Speeds & Briefing
                                </Link>
                                <Link
                                    to={`/weight-balance?data=${encodeData(DA20_WB_DATA)}`}
                                    className="flex-1 text-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                >
                                    Weight & Balance
                                </Link>
                            </div>
                        </div>

                        {/* Cessna 172S */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Plane className="text-green-600" size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900">Cessna 172S Skyhawk</h4>
                                    <p className="text-xs text-slate-500">Most popular trainer worldwide</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Link
                                    to={`/speeds-briefing?data=${encodeData(C172S_SPEEDS_DATA)}`}
                                    className="flex-1 text-center px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                >
                                    Speeds & Briefing
                                </Link>
                                <Link
                                    to={`/weight-balance?data=${encodeData(C172S_WB_DATA)}`}
                                    className="flex-1 text-center px-4 py-2 bg-green-50 hover:bg-green-100 text-green-700 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                                >
                                    Weight & Balance
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-8 border border-blue-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">Need Something Custom?</h3>
                        <p className="text-slate-600 mb-6 max-w-md mx-auto">
                            We're constantly adding new generators. Let us know what aviation tools would help your flying.
                        </p>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                            Request a Generator
                        </button>
                    </div>
                </div>
            </main >

            <footer className="bg-white border-t border-slate-200 mt-16">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="text-center text-sm text-slate-500">
                        <p>Pilot Kneeboard Generator - Professional aviation tools for pilots</p>
                    </div>
                </div>
            </footer>
        </div >
    );
};
