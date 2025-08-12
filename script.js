(function() {
    'use strict';
    
    const pathname = window.location.pathname;
    
    function parseUrlPath(path) {
        const parts = path.replace(/^\/+/, '').split('/');
        
        if (parts.length < 4) {
            throw new Error('Invalid URL format. Expected: /country/congress/session/bill');
        }
        
        const [country, congress, session, bill] = parts;
        
        if (!/^[a-z]{2}$/.test(country)) {
            throw new Error('Invalid country code format. Expected 2-letter country code.');
        }
        
        if (!/^\d+$/.test(session)) {
            throw new Error('Invalid session format. Expected numeric session number.');
        }
        
        return { country, congress, session, bill };
    }
    
    function buildGitHubUrl(components) {
        const { country, congress, session, bill } = components;
        
        const encodedCountry = encodeURIComponent(`country:${country}`);
        
        return `https://github.com/windy-civi-pipelines/usa-data-pipeline/tree/main/data_output/data_processed/${encodedCountry}/${congress}/sessions/${session}/bills/${bill}/logs`;
    }
    
    function handleRedirect() {
        try {
            document.getElementById('redirectInfo').style.display = 'block';
            
            const urlComponents = parseUrlPath(pathname);
            
            const githubUrl = buildGitHubUrl(urlComponents);
            
            document.getElementById('targetUrl').textContent = githubUrl;
            document.getElementById('targetUrl').href = githubUrl;
            document.getElementById('manualLink').href = githubUrl;
            
            setTimeout(() => {
                window.location.href = githubUrl;
            }, 2000);
            
            setTimeout(() => {
                document.getElementById('manualRedirect').style.display = 'block';
            }, 3000);
            
        } catch (error) {
            document.getElementById('redirectInfo').style.display = 'none';
            document.getElementById('errorInfo').style.display = 'block';
            document.getElementById('errorMessage').textContent = error.message;
            
            console.error('Redirect error:', error);
        }
    }
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleRedirect);
    } else {
        handleRedirect();
    }
    
    window.addEventListener('hashchange', handleRedirect);
    
})();
