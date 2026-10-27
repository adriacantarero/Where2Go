import React from "react";
import { DepartDatePicker } from "/src/components/tripDatePicker";
import { FaGlobe, FaPhoneAlt, FaEnvelope } from "react-icons/fa"; 
import "./dashboardStyle.css";

// Main Result Details View Component
export function ResultDetailsView(props) {
    const { 
        details, isLoading, error, onBack, onAddToItinerary, isAdded,
        dateOptions, selectedDate, onDateChange, hideAddButton
    } = props;


    // Loading State
    if (isLoading) {
        return (
            <div className="side-panel state-box">
                <div className="spin"></div>
                <p>Loading details...</p>
            </div>
        );
    }

    // Error State
    if (error) {
        return (
            <div className="side-panel state-box">
                <p style={{color: '#ef4444'}}>Error: {error}</p>
                <button className="list-back-btn" onClick={onBack} style={{marginTop: '1rem'}}>
                    ← Back to Search
                </button>
            </div>
        );
    }

    // Empty State
    if (!details) {
        return (
            <div className="side-panel">
                <div className="list-header">
                    <button className="list-back-btn" onClick={onBack}>← Back to Search</button>
                </div>
                <div className="state-box">
                    <p>No details available for this selection.</p>
                </div>
            </div>
        );
    }

    // Logic for leaf categories
    const leafCategories = details.categories?.filter(cat => {
        const isLeaf = !details.categories.some(other => other !== cat && other.startsWith(cat + '.'));
        const lastPart = cat.split('.').pop();
        return isLeaf && lastPart !== 'yes' && lastPart !== 'no';
    }) || [];

    // Content State
    return (
        <div className="side-panel">
            {/* Header */}
            <div className="list-header" style={{ paddingBottom: '0.5rem' }}>
                <button className="list-back-btn" onClick={onBack}>
                    ← Back to Results
                </button>
            </div>

            {/* Content */}
            <div className="detail-content">
                
                {/* Image */}
                {details.image && (
                    <img className="detail-img" src={details.image} alt={details.name} />
                )}
                
                <div className="detail-head">
                    <h2 className="detail-name">{details.name}</h2>
                    <p className="detail-addr">{details.address}</p>
                </div>

                {/* Info Blocks organized by context */}
                <div className="info-block">
                    {/* 1. Description Section */}
                    {details.description && (
                        <div className="info-section">
                            <p className="info-item"><i>{details.description}</i></p>
                        </div>
                    )}

                    {/* 2. Specific Metadata Section (Type-dependent) */}
                    {(details.cuisine || details.elevation || details.brand || details.heritage || details.openingHours) && (
                        <div className="info-section specs-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', background: '#f8fafc', padding: '10px', borderRadius: '8px' }}>
                            {details.cuisine && (
                                <div className="spec-item">
                                    <span className="spec-label">Cuisine</span>
                                    <span className="spec-value">{details.cuisine}</span>
                                </div>
                            )}
                            {details.elevation && (
                                <div className="spec-item">
                                    <span className="spec-label">Elevation</span>
                                    <span className="spec-value">{details.elevation}m</span>
                                </div>
                            )}
                            {details.brand && (
                                <div className="spec-item">
                                    <span className="spec-label">Brand</span>
                                    <span className="spec-value">{details.brand}</span>
                                </div>
                            )}
                            {details.heritage && (
                                <div className="spec-item">
                                    <span className="spec-label">Heritage</span>
                                    <span className="spec-value">{details.heritage}</span>
                                </div>
                            )}
                            {details.openingHours && (
                                <div className="spec-item" style={{ gridColumn: 'span 2' }}>
                                    <span className="spec-label">Opening hours</span>
                                    <span className="spec-value">{details.openingHours}</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 3. Facilities & Tags */}
                    {(details.facilities?.wheelchair || details.facilities?.internet_access || details.facilities?.toilets || details.facilities?.takeaway || details.diet?.vegetarian || leafCategories.length > 0) && (
                        <div className="tag-row" style={{ marginTop: '10px' }}>
                            {details.facilities?.wheelchair && <span className="tag green">♿ Wheelchair</span>}
                            {details.facilities?.internet_access && <span className="tag blue">📶 WiFi</span>}
                            {details.facilities?.toilets && <span className="tag">🚻 Toilets</span>}
                            {details.facilities?.takeaway && <span className="tag orange">🥡 Takeaway</span>}
                            {details.diet?.vegetarian && <span className="tag green">🥗 Vegetarian</span>}
                            {details.categories && details.categories
                                .filter(cat => {
                                    const isLeaf = !details.categories.some(other => other !== cat && other.startsWith(cat + '.'));
                                    const lastPart = cat.split('.').pop();
                                    return isLeaf && lastPart !== 'yes' && lastPart !== 'no';
                                })
                                .map(cat => (
                                    <span key={cat} className="tag">
                                        {cat.split('.').pop().replace(/_/g, ' ')}
                                    </span>
                                ))
                            }
                        </div>
                    )}
                    
                    {/* 4. Contact & Links*/}
                    {(details.website || details.phone || details.email) && (
                        <div className="info-section" style={{ borderTop: '1px solid #eee', paddingTop: '10px' }}>
                            {details.website && (
                                <p className="info-item">
                                    <FaGlobe size={16} color="#2563eb" style={{ marginTop: '3px', flexShrink: 0 }} />
                                    <a className="info-link" href={details.website} target="_blank" rel="noopener noreferrer">Official Website</a>
                                </p>
                            )}
                            {details.phone && (
                                <p className="info-item">
                                    <FaPhoneAlt size={16} color="#2563eb" style={{ marginTop: '3px', flexShrink: 0 }} />
                                    {details.phone}
                                </p>
                            )}
                            {details.email && (
                                <p className="info-item">
                                    <FaEnvelope size={16} color="#2563eb" style={{ marginTop: '3px', flexShrink: 0 }} />
                                    {details.email}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Footer Buttons */}
            {!hideAddButton && (
                <div className="detail-foot">
                
                {/* Date Dropdown OR Date Picker */}
                {!isAdded && (
                    <>
                        {/* Logic: If itinerary dates exist (dateOptions > 0), show Dropdown. Else show Standard Date Input */}
                        {dateOptions && dateOptions.length > 0 ? (
                            <select 
                                className="date-select"
                                value={selectedDate}
                                onChange={(e) => onDateChange(e.target.value)}
                            >
                                <option value="">Select a day to visit</option>
                                {dateOptions.map(date => (
                                    <option key={date} value={date}>{date}</option>
                                ))}
                            </select>
                        ) : (
                            <div style={{ marginBottom: '10px' }}>
                                <DepartDatePicker value={selectedDate} placeholder={"Select a day to visit"}
                                    onChange={(date, dateString) => onDateChange(dateString)} 
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Add Button */}
                <button 
                    className="add-btn"
                    onClick={onAddToItinerary}
                    disabled={isAdded} 
                >
                    {isAdded ? "Added to Itinerary" : "+ Add to Itinerary"}
                </button>
            </div>
            )}
        </div>
    );
}