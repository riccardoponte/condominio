document.addEventListener('DOMContentLoaded', () => {
    const appDiv = document.getElementById('app');
    if (appDiv) {
        appDiv.textContent = 'JavaScript è caricato e funzionante!';
        console.log('App div found and updated by app.js');
    } else {
        console.error('Error: App div with id "app" not found.');
    }
    console.log('App Condominio JS loaded and DOMContentLoaded event fired.');
});
