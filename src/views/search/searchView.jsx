import "./searchStyle.css"

import { useState, useMemo } from 'react';
import debounce from 'lodash/debounce';


// Import custom components
import { DepartDatePicker, ReturnDatePicker } from "/src/components/tripDatePicker";
import { CitySearchInput } from "/src/components/citySearchInput";

// Search View component
export function SearchView(props) {

    // Debounced version of the API trigger
    const triggerSearch = useMemo(
        () => debounce((text) => {
            props.doSearch(text);
        }, 100), 
        [props.doSearch]
    );

    // Event handlers
    const changedInputACB = (field, text) => {
        if (field === "to") props.setTo(text);
        triggerSearch(text);   
    };

    const selectedCityACB = (field, cityOption) => {
        if (field === 'to') props.setTo(cityOption);
    }
  
    return (
        <div className="glass-panel search-card">
            
            <div className="search-header">
                <h2 className="search-title">Design Your Trip</h2>
                <p className="search-instruction">
                    Enter your destination and dates below to generate a smart, daily itinerary in seconds.
                </p>
            </div>

            {/* Location Fields */}	  
            <div className="form-row">
                <div className="input-wrapper">
                    <label>Itinerary Name</label>
                    <input
                        value={props.itineraryTitle}
                        placeholder="Itinerary"
                        onChange={(e) => props.setItineraryTitle(e.target.value)}
                    />
                </div>
                
                <span className="swap-icon"></span>
                <div className="input-wrapper">
                    <label>Destination</label>
                    <CitySearchInput
                        value={props.to?.value || props.to}
                        loading={props.isLoading}
                        error={props.searchError}
                        placeholder="Destination"  
                        exclude={props.from}
                        options={props.searchOptions}
                        onChange={(text) => changedInputACB('to', text)}
                        onSelect={(cityObj) => selectedCityACB("to", cityObj)} 
                        onFocus={props.clearSearch}
                    />
                </div>
            </div>
            {/* Date Fields */}
            <div className="form-row">
                <div className="input-wrapper">
                    <label>Depart</label>
                    <DepartDatePicker value={props.depart}
                        onChange={(d, s) => props.setDepart(s)} />
                </div>

                <div className="vertical-line"></div>

                <div className="input-wrapper">
                    <label>Return</label>
                    <ReturnDatePicker value={props.ret} departDate={props.depart}
                        onChange={(d, s) => props.setReturn(s)} />
                </div>
            </div>
            <button className="btn-primary" onClick={props.onGenerateItinerary} disabled={!props.to?.lat}>Plan Trip</button>
        </div>
    );
}