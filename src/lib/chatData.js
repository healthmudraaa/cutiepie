// Chat-related mock data

export const CONVERSATION_STARTERS = [
    "Hey! Saw you're nearby. Coffee at Third Wave?",
    "Cubbon Park walk? I'm just around the corner 😊",
    "Up for some filter coffee? Rameshwaram Cafe?",
    "Brewery hopping in Koramangala? Let's go!",
    "Street shopping on Commercial Street? 🛍️",
    "Chai pe charcha? There's a great spot nearby",
];

export const MEETUP_LOCATIONS = [
    { name: "Rameshwaram Cafe", type: "Cafe", area: "Indiranagar", distance: "0.3 km" },
    { name: "Toit Brewpub", type: "Brewery", area: "Indiranagar", distance: "0.5 km" },
    { name: "Third Wave Coffee", type: "Cafe", area: "Koramangala", distance: "0.8 km" },
    { name: "Cubbon Park", type: "Park", area: "MG Road", distance: "0.4 km" },
    { name: "Phoenix Marketcity", type: "Mall", area: "Whitefield", distance: "1.2 km" },
    { name: "Church Street Social", type: "Bar", area: "Church Street", distance: "0.6 km" },
    { name: "Koshy's Restaurant", type: "Restaurant", area: "MG Road", distance: "0.5 km" },
    { name: "Lalbagh Botanical Garden", type: "Park", area: "Jayanagar", distance: "0.7 km" },
];

// Get smart location suggestions based on time and interests
export function getSmartLocationSuggestions(userInterests = [], currentHour = new Date().getHours()) {
    let suggestions = [...MEETUP_LOCATIONS];

    // Time-based filtering
    if (currentHour >= 6 && currentHour < 12) {
        // Morning: Prefer cafes and parks
        suggestions = suggestions.filter(loc =>
            loc.type === 'Cafe' || loc.type === 'Park'
        );
    } else if (currentHour >= 12 && currentHour < 17) {
        // Afternoon: Cafes, restaurants, malls
        suggestions = suggestions.filter(loc =>
            loc.type === 'Cafe' || loc.type === 'Restaurant' || loc.type === 'Mall'
        );
    } else {
        // Evening/Night: Bars, breweries, restaurants
        suggestions = suggestions.filter(loc =>
            loc.type === 'Bar' || loc.type === 'Brewery' || loc.type === 'Restaurant'
        );
    }

    // Sort by distance
    suggestions.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return suggestions.slice(0, 3);
}

// Mock chat messages
export const MOCK_CHATS = {
    '1': [
        { id: 1, sender: 'them', text: "Hey! Love your profile 😊", timestamp: new Date(Date.now() - 300000) },
        { id: 2, sender: 'me', text: "Thanks! You seem cool too", timestamp: new Date(Date.now() - 240000) },
        { id: 3, sender: 'them', text: "We're so close by! Coffee at Third Wave?", timestamp: new Date(Date.now() - 180000) },
    ],
    '3': [
        { id: 1, sender: 'them', text: "Hi! Saw you're into art too", timestamp: new Date(Date.now() - 600000) },
        { id: 2, sender: 'me', text: "Yes! Have you been to the new gallery?", timestamp: new Date(Date.now() - 540000) },
    ],
};

export const MESSAGE_LIMIT = 10; // After this, prompt to meet
