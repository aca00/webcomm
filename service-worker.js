try {
    importScripts('dist/bundle.js');
    console.log("Loaded script successfully")
} catch (error) {
    console.error('Failed to load helper.js:', error);
}