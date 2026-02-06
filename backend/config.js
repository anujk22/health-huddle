// HealthHuddle Configuration
// Edit these values to customize the application

export const agentConfig = {
    // Agent display names - customize these
    agents: {
        guidelines: {
            name: 'Guidelines',
            icon: '📋',
            description: 'Clinical protocols and guidelines specialist'
        },
        evidence: {
            name: 'Evidence',
            icon: '📊',
            description: 'Medical research and statistics expert'
        },
        cases: {
            name: 'Cases',
            icon: '🗂️',
            description: 'Real-world case patterns analyst'
        },
        safety: {
            name: 'Safety',
            icon: '⚠️',
            description: 'Emergency and risk assessment specialist'
        }
    },

    // Timing configuration (in milliseconds)
    timing: {
        // Minimum delay between agent responses for rate limiting
        apiDelay: 2500,

        // Additional "reading time" pause after each message appears
        // This gives patients time to read before the next message
        readingPauseMs: 4000,

        // Pause before showing consensus (gives time for final interjections)
        beforeConsensusPauseMs: 5000
    },

    // UI Configuration
    ui: {
        // Whether to show the pain severity slider
        showPainSlider: true,

        // Whether to show duration selector
        showDurationSelector: true
    }
};

export default agentConfig;
