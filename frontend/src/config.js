// Frontend Configuration
// Mirror of backend config for UI customization

export const appConfig = {
    // Agent display names and colors
    agents: {
        Guidelines: {
            name: 'Guidelines',
            icon: '📋',
            color: '#4fc3f7',
            glowColor: 'rgba(79, 195, 247, 0.35)'
        },
        Evidence: {
            name: 'Evidence',
            icon: '📊',
            color: '#00e676',
            glowColor: 'rgba(0, 230, 118, 0.35)'
        },
        Cases: {
            name: 'Cases',
            icon: '🗂️',
            color: '#90a4ae',
            glowColor: 'rgba(144, 164, 174, 0.35)'
        },
        Safety: {
            name: 'Safety',
            icon: '⚠️',
            color: '#ff5252',
            glowColor: 'rgba(255, 82, 82, 0.35)'
        }
    },

    // UI Configuration
    ui: {
        // Whether to show the pain severity slider (set to false to hide)
        showPainSlider: true,

        // Whether to show duration selector
        showDurationSelector: true,

        // App branding
        appName: 'HealthHuddle',
        tagline: 'AI-Powered Medical Consultation'
    }
};

export default appConfig;
