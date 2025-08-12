(function() {
    'use strict';
    
    function parseUrlQuery() {
        const urlParams = new URLSearchParams(window.location.search);
        const pathParam = urlParams.get('p');
        
        if (!pathParam) {
            throw new Error('Missing path parameter. Expected: ?p=us/congress/119/HR1234');
        }
        
        const parts = pathParam.split('/');
        
        if (parts.length < 4) {
            throw new Error('Invalid path format. Expected: us/congress/119/HR1234');
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
            
            const urlComponents = parseUrlQuery();
            
            const githubUrl = buildGitHubUrl(urlComponents);
            
            document.getElementById('targetUrl').textContent = githubUrl;
            document.getElementById('targetUrl').href = githubUrl;
            document.getElementById('manualLink').href = githubUrl;
            
            window.location.href = githubUrl;
            
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
    
    // Listen for query string changes
    window.addEventListener('popstate', handleRedirect);
    
})();
