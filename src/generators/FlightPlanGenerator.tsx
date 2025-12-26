import { useState, useEffect } from 'react';
import {
    MapPin,
    Trash2,
    Plus,
    ChevronDown,
    ChevronUp,
    ChevronRight,
    Database,
    Upload,
    ArrowLeft,
    Plane,
    Navigation,
    FileText,
    X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { PDFButton } from '../components/PDFButton';
import { ShareButton, ShareModal } from '../components/ShareModal';
import { generateFlightPlanPDF } from '../lib/pdf/generateFlightPlanPDF';
import { useGeneratorData } from '../hooks/useGeneratorData';
import type { FlightPlanData, FlightPlanLeg } from '../types';

const INITIAL_DATA: FlightPlanData = {
    departure: {
        code: "",
        elevation: "",
        wxFreq: "",
        approachFreq: "",
        towerFreq: "",
        groundFreq: "",
        ctafFreq: "",
        fssFreq: "",
        unicomFreq: ""
    },
    arrival: {
        code: "",
        elevation: "",
        wxFreq: "",
        approachFreq: "",
        towerFreq: "",
        groundFreq: "",
        ctafFreq: "",
        fssFreq: "",
        unicomFreq: ""
    },
    climb: {
        cruiseAlt: "",
        fieldElev: "",
        climbFpm: "",
        climbGph: ""
    },
    cruise: {
        powerPercent: "",
        manifoldPressure: "",
        rpm: "",
        gph: "",
        tas: ""
    },
    descent: {
        descentRate: ""
    },
    legs: [],
    footer: "VFR FLIGHT PLAN - REVIEW BEFORE USE"
};

export default function FlightPlanGenerator() {
    const [isPdfLibLoaded, setIsPdfLibLoaded] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
        airports: true,
        climb: true,
        cruise: true,
        descent: true,
        legs: true
    });

    const {
        data,
        updateField,
        updateState,
        handleExport,
        handleImport,
        importError,
        getShareableUrl,
        copyShareableUrl
    } = useGeneratorData<FlightPlanData>('flight_plan_data_v1', INITIAL_DATA);

    useEffect(() => {
        setIsPdfLibLoaded(true);
    }, []);

    const toggleSection = (section: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const addLeg = () => {
        const newLeg: FlightPlanLeg = {
            name: "",
            altitude: "",
            windDirection: "",
            windVelocity: "",
            temperature: "",
            tas: "",
            trueCourse: "",
            magneticHeading: "",
            heading: "",
            groundSpeed: "",
            distance: "",
            ete: ""
        };
        const newLegs = [...data.legs, newLeg];
        updateField('legs', null, '', newLegs);
    };

    const removeLeg = (index: number) => {
        if (data.legs.length > 1) {
            const newLegs = data.legs.filter((_, i) => i !== index);
            updateField('legs', null, '', newLegs);
        }
    };

    const moveLeg = (index: number, direction: 'up' | 'down') => {
        const newLegs = [...data.legs];
        const newIndex = direction === 'up' ? index - 1 : index + 1;

        if (newIndex >= 0 && newIndex < newLegs.length) {
            [newLegs[index], newLegs[newIndex]] = [newLegs[newIndex], newLegs[index]];
            updateField('legs', null, '', newLegs);
        }
    };

    const updateAirportField = (airportType: 'departure' | 'arrival', field: string, value: string) => {
        const updatedAirport = { ...data[airportType], [field]: value };

        const nextData: FlightPlanData = {
            ...data,
            [airportType]: updatedAirport
        };

        if (field === 'code') {
            updateState({
                ...nextData,
                legs: buildRouteLegs(nextData)
            });
            return;
        }

        updateState(nextData);
    };

    const updateClimbField = (field: string, value: string) => {
        const updatedClimb = { ...data.climb, [field]: value };
        updateField('climb', null, '', updatedClimb);
    };

    const updateCruiseField = (field: string, value: string) => {
        const updatedCruise = { ...data.cruise, [field]: value };
        updateField('cruise', null, '', updatedCruise);
    };

    const updateDescentField = (field: string, value: string) => {
        const updatedDescent = { ...data.descent, [field]: value };
        updateField('descent', null, '', updatedDescent);
    };

    const updateLegField = (index: number, field: string, value: string) => {
        updateField('legs', index, field, value);
    };

    const buildBlankLeg = (name: string): FlightPlanLeg => ({
        name,
        altitude: "",
        windDirection: "",
        windVelocity: "",
        temperature: "",
        tas: "",
        trueCourse: "",
        magneticHeading: "",
        heading: "",
        groundSpeed: "",
        distance: "",
        ete: ""
    });

    const buildRouteLegs = (baseData: FlightPlanData): FlightPlanLeg[] => {
        const findExisting = (name: string) => baseData.legs.find(l => l.name === name);
        const newLegs: FlightPlanLeg[] = [];

        const depCode = baseData.departure.code.trim();
        const arrCode = baseData.arrival.code.trim();

        if (depCode) {
            newLegs.push(findExisting(depCode) ?? buildBlankLeg(depCode));
        }

        // Always include TOP OF CLIMB once there is at least a departure or arrival
        if (depCode || arrCode) {
            const existingToc = findExisting('TOP OF CLIMB') ?? buildBlankLeg('TOP OF CLIMB');
            newLegs.push({
                ...existingToc,
                altitude: existingToc.altitude || baseData.climb.cruiseAlt || ''
            });
        }

        // Preserve user-added intermediate legs (exclude auto legs)
        baseData.legs.forEach(leg => {
            if (leg.name && leg.name !== depCode && leg.name !== arrCode && leg.name !== 'TOP OF CLIMB') {
                newLegs.push(leg);
            }
        });

        if (arrCode) {
            newLegs.push(findExisting(arrCode) ?? buildBlankLeg(arrCode));
        }

        return newLegs;
    };

    const applyRouteLegs = () => {
        updateState({
            ...data,
            legs: buildRouteLegs(data)
        });
    };

    const handlePreviewPDF = async () => {
        try {
            const pdfBlob = generateFlightPlanPDF(data, 'preview');
            if (pdfBlob instanceof Blob) {
                const url = URL.createObjectURL(pdfBlob);
                setPdfPreviewUrl(url);
            }
        } catch (error) {
            console.error('Failed to generate PDF preview:', error);
        }
    };

    const handleDownloadPDF = () => {
        generateFlightPlanPDF(data, 'download');
    };

    const closePreview = () => {
        if (pdfPreviewUrl) {
            URL.revokeObjectURL(pdfPreviewUrl);
            setPdfPreviewUrl(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <Link to="/" className="text-slate-600 hover:text-slate-900 transition-colors">
                            <ArrowLeft size={24} />
                        </Link>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <MapPin className="text-blue-600" size={24} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">VFR Flight Plan</h1>
                            <p className="text-slate-600">Generate comprehensive VFR flight planning documents</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Form */}
                    <div className="space-y-6">
                        {/* Airports Section */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div
                                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => toggleSection('airports')}
                            >
                                <div className="flex items-center gap-3">
                                    <Plane className="text-slate-600" size={20} />
                                    <h3 className="font-semibold text-slate-900">Airports</h3>
                                </div>
                                {expandedSections.airports ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>

                            {expandedSections.airports && (
                                <div className="p-4 space-y-6">
                                    {/* Departure Airport */}
                                    <div>
                                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                                            <MapPin size={16} className="text-green-600" />
                                            Departure Airport
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Code"
                                                value={data.departure.code}
                                                onChange={(e) => updateAirportField('departure', 'code', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Elevation"
                                                value={data.departure.elevation}
                                                onChange={(e) => updateAirportField('departure', 'elevation', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="WX Freq"
                                                value={data.departure.wxFreq}
                                                onChange={(e) => updateAirportField('departure', 'wxFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Approach Freq"
                                                value={data.departure.approachFreq}
                                                onChange={(e) => updateAirportField('departure', 'approachFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tower Freq"
                                                value={data.departure.towerFreq}
                                                onChange={(e) => updateAirportField('departure', 'towerFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Ground Freq"
                                                value={data.departure.groundFreq}
                                                onChange={(e) => updateAirportField('departure', 'groundFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="CTAF Freq"
                                                value={data.departure.ctafFreq}
                                                onChange={(e) => updateAirportField('departure', 'ctafFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="FSS Freq"
                                                value={data.departure.fssFreq}
                                                onChange={(e) => updateAirportField('departure', 'fssFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="UNICOM Freq"
                                                value={data.departure.unicomFreq}
                                                onChange={(e) => updateAirportField('departure', 'unicomFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Arrival Airport */}
                                    <div>
                                        <h4 className="font-medium text-slate-900 mb-3 flex items-center gap-2">
                                            <MapPin size={16} className="text-red-600" />
                                            Arrival Airport
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Code"
                                                value={data.arrival.code}
                                                onChange={(e) => updateAirportField('arrival', 'code', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Elevation"
                                                value={data.arrival.elevation}
                                                onChange={(e) => updateAirportField('arrival', 'elevation', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="WX Freq"
                                                value={data.arrival.wxFreq}
                                                onChange={(e) => updateAirportField('arrival', 'wxFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Approach Freq"
                                                value={data.arrival.approachFreq}
                                                onChange={(e) => updateAirportField('arrival', 'approachFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Tower Freq"
                                                value={data.arrival.towerFreq}
                                                onChange={(e) => updateAirportField('arrival', 'towerFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Ground Freq"
                                                value={data.arrival.groundFreq}
                                                onChange={(e) => updateAirportField('arrival', 'groundFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="CTAF Freq"
                                                value={data.arrival.ctafFreq}
                                                onChange={(e) => updateAirportField('arrival', 'ctafFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="FSS Freq"
                                                value={data.arrival.fssFreq}
                                                onChange={(e) => updateAirportField('arrival', 'fssFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="UNICOM Freq"
                                                value={data.arrival.unicomFreq}
                                                onChange={(e) => updateAirportField('arrival', 'unicomFreq', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Performance Planning */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div
                                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => toggleSection('climb')}
                            >
                                <div className="flex items-center gap-3">
                                    <Navigation className="text-slate-600" size={20} />
                                    <h3 className="font-semibold text-slate-900">Performance Planning</h3>
                                </div>
                                {expandedSections.climb ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>

                            {expandedSections.climb && (
                                <div className="p-4 space-y-4">
                                    {/* Climb Planning */}
                                    <div>
                                        <h4 className="font-medium text-slate-900 mb-3">Climb Planning</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="Cruise Altitude"
                                                value={data.climb.cruiseAlt}
                                                onChange={(e) => updateClimbField('cruiseAlt', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Field Elevation"
                                                value={data.climb.fieldElev}
                                                onChange={(e) => updateClimbField('fieldElev', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Climb FPM"
                                                value={data.climb.climbFpm}
                                                onChange={(e) => updateClimbField('climbFpm', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Climb GPH"
                                                value={data.climb.climbGph}
                                                onChange={(e) => updateClimbField('climbGph', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Cruise Planning */}
                                    <div>
                                        <h4 className="font-medium text-slate-900 mb-3">Cruise Planning</h4>
                                        <div className="grid grid-cols-2 gap-3">
                                            <input
                                                type="text"
                                                placeholder="% Power"
                                                value={data.cruise.powerPercent}
                                                onChange={(e) => updateCruiseField('powerPercent', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Manifold Pressure"
                                                value={data.cruise.manifoldPressure}
                                                onChange={(e) => updateCruiseField('manifoldPressure', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="RPM"
                                                value={data.cruise.rpm}
                                                onChange={(e) => updateCruiseField('rpm', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="GPH"
                                                value={data.cruise.gph}
                                                onChange={(e) => updateCruiseField('gph', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                            <input
                                                type="text"
                                                placeholder="TAS"
                                                value={data.cruise.tas}
                                                onChange={(e) => updateCruiseField('tas', e.target.value)}
                                                className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>

                                    {/* Descent Planning */}
                                    <div>
                                        <h4 className="font-medium text-slate-900 mb-3">Descent Planning</h4>
                                        <input
                                            type="text"
                                            placeholder="Descent Rate (FPM)"
                                            value={data.descent.descentRate}
                                            onChange={(e) => updateDescentField('descentRate', e.target.value)}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Flight Legs */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div
                                className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                                onClick={() => toggleSection('legs')}
                            >
                                <div className="flex items-center gap-3">
                                    <Navigation className="text-slate-600" size={20} />
                                    <h3 className="font-semibold text-slate-900">Flight Legs</h3>
                                </div>
                                {expandedSections.legs ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                            </div>

                            {expandedSections.legs && (
                                <div className="p-4">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium text-slate-900">Route Waypoints</h4>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={applyRouteLegs}
                                                className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                            >
                                                <Navigation size={14} />
                                                Update Route
                                            </button>
                                            <button
                                                onClick={addLeg}
                                                className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                            >
                                                <Plus size={14} />
                                                Add Leg
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {data.legs.map((leg, index) => (
                                            <div key={index} className="border border-slate-200 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <input
                                                        type="text"
                                                        placeholder="Waypoint Name"
                                                        value={leg.name}
                                                        onChange={(e) => updateLegField(index, 'name', e.target.value)}
                                                        className="font-medium text-slate-900 bg-transparent border-none outline-none text-lg"
                                                    />
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => moveLeg(index, 'up')}
                                                            disabled={index === 0}
                                                            className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ChevronUp size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => moveLeg(index, 'down')}
                                                            disabled={index === data.legs.length - 1}
                                                            className="p-1 text-slate-400 hover:text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <ChevronDown size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => removeLeg(index)}
                                                            disabled={data.legs.length === 1}
                                                            className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <input
                                                        type="text"
                                                        placeholder="VOR Freq (optional)"
                                                        value={leg.vorFreq || ''}
                                                        onChange={(e) => updateLegField(index, 'vorFreq', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Altitude"
                                                        value={leg.altitude}
                                                        onChange={(e) => updateLegField(index, 'altitude', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Wind Direction"
                                                        value={leg.windDirection}
                                                        onChange={(e) => updateLegField(index, 'windDirection', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Wind Velocity"
                                                        value={leg.windVelocity}
                                                        onChange={(e) => updateLegField(index, 'windVelocity', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Temperature"
                                                        value={leg.temperature}
                                                        onChange={(e) => updateLegField(index, 'temperature', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="TAS"
                                                        value={leg.tas}
                                                        onChange={(e) => updateLegField(index, 'tas', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="True Course"
                                                        value={leg.trueCourse}
                                                        onChange={(e) => updateLegField(index, 'trueCourse', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Magnetic Heading"
                                                        value={leg.magneticHeading}
                                                        onChange={(e) => updateLegField(index, 'magneticHeading', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Heading"
                                                        value={leg.heading}
                                                        onChange={(e) => updateLegField(index, 'heading', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Ground Speed"
                                                        value={leg.groundSpeed}
                                                        onChange={(e) => updateLegField(index, 'groundSpeed', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="Distance"
                                                        value={leg.distance}
                                                        onChange={(e) => updateLegField(index, 'distance', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                    <input
                                                        type="text"
                                                        placeholder="ETE"
                                                        value={leg.ete}
                                                        onChange={(e) => updateLegField(index, 'ete', e.target.value)}
                                                        className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Footer Notes
                            </label>
                            <textarea
                                value={data.footer}
                                onChange={(e) => updateField('footer', 0, '', e.target.value)}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                rows={2}
                                placeholder="Additional notes or remarks"
                            />
                        </div>
                    </div>

                    {/* Preview and Actions */}
                    <div className="space-y-6">
                        {/* Actions */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <PDFButton
                                    onClick={handleDownloadPDF}
                                    disabled={!isPdfLibLoaded}
                                    label="Download PDF"
                                />
                                <button
                                    onClick={handlePreviewPDF}
                                    disabled={!isPdfLibLoaded}
                                    className="px-4 h-10 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95 rounded-full border-2 border-slate-300 hover:border-slate-400 text-slate-600 hover:text-slate-800 bg-white disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FileText size={14} />
                                    Preview PDF
                                </button>
                                <ShareButton
                                    onClick={() => setShowShareModal(true)}
                                />
                                <button
                                    onClick={handleExport}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <Database size={16} />
                                    Export
                                </button>
                                <button
                                    onClick={() => handleImport('')}
                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <Upload size={16} />
                                    Import
                                </button>
                            </div>
                            {importError && (
                                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {importError}
                                </div>
                            )}
                        </div>

                        {/* Preview */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                            <h3 className="font-semibold text-slate-900 mb-4">Flight Plan Summary</h3>
                            <div className="space-y-4 text-sm">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="font-medium text-slate-700">Departure:</span>
                                        <div className="text-slate-900">{data.departure.code || 'Not set'}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-700">Arrival:</span>
                                        <div className="text-slate-900">{data.arrival.code || 'Not set'}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-700">Cruise Alt:</span>
                                        <div className="text-slate-900">{data.climb.cruiseAlt || 'Not set'}</div>
                                    </div>
                                    <div>
                                        <span className="font-medium text-slate-700">TAS:</span>
                                        <div className="text-slate-900">{data.cruise.tas || 'Not set'}</div>
                                    </div>
                                </div>
                                <div>
                                    <span className="font-medium text-slate-700">Route ({data.legs.length} legs):</span>
                                    <div className="text-slate-900 mt-1">
                                        {data.legs.map(leg => leg.name || 'Unnamed').join(' → ')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Share Modal */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                shareableUrl={getShareableUrl()}
                onCopyUrl={copyShareableUrl}
            />

            {/* PDF Preview Modal */}
            {pdfPreviewUrl && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-4 border-b border-slate-200">
                            <h3 className="text-lg font-semibold text-slate-900">PDF Preview</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDownloadPDF}
                                    className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                >
                                    Download
                                </button>
                                <button
                                    onClick={closePreview}
                                    className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            <iframe
                                src={pdfPreviewUrl}
                                className="w-full h-full min-h-[600px] border border-slate-200 rounded"
                                title="Flight Plan PDF Preview"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
