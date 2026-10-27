import { useNavigate } from "react-router-dom";
import { MenuView } from "/src/views/core/menuView";

import { FaSearch, FaRoute, FaUser, FaInfo } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";

export function MenuPresenter(props) {
    const navigate = useNavigate();
    const { hasActiveSearch, user } = props;

    // Navigation handlers
    const handleGoHome = () => {
        props.onClearSelection(); // clear selected place details
        props.restoreHomeSearch();
        navigate("/");
    };

    const handleGoItinerary = () => {
        props.onClearSelection();
        navigate("/itinerary");
    };

    const handleGoDashBoard = () => {
        props.onClearSelection();
        props.onLoadPlacesForCurrentItinerary(props.currentItinerary, props.hasMapResults); 
        navigate("/map");
    };

    const handleGoInstructions = () => {
        props.onClearSelection();
        navigate("/instructions");
    }

    const handleLogout = () => {
        props.onLogout();                      
        navigate("/auth", { replace: true });  
    };

    // Helper to build the items list
    const getMenuItems = () => {
        const menuItems = [
            {
                icon: <FaSearch size={22} color="#1e293b" />,
                label: 'Search',
                onClick: handleGoHome,
            },
            {
                icon: <FaRoute size={22} color="#1e293b" />,
                label: 'My Itineraries',
                onClick: handleGoItinerary,
            }
        ];

        // ONLY ADD MAP if there is an active search
        if (hasActiveSearch) {
            menuItems.push({
                icon: <img src="https://img.icons8.com/ios-filled/50/1e293b/map.png" alt="map" className="map-btn-icon" />,
                label: 'Map',
                onClick: handleGoDashBoard,
            });
        }

        menuItems.push({
            icon: <FaInfo size={22} color="#1e293b" />,
            label: 'Help',
            onClick: handleGoInstructions,
        });

        // Add Login/Logout at the end
        if (!user) {
            menuItems.push({
                icon: <FaUser size={22} color="#2563eb" />, 
                label: 'Log in',
                onClick: props.onLogin,
            });
        } else {
            menuItems.push({
                icon: <FiLogOut size={22} color="#ef4444" />,
                label: "Logout",
                onClick: handleLogout,
            });
        }

        return menuItems;
    };

    return (
        <MenuView 
            {...props} 
            items={getMenuItems()}
            modalOpen={props.modalOpen}
        />
    );
}