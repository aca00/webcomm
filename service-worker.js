try {
    importScripts('./dist/bundle.js');
    console.log("Loaded script successfully")
    worker = new Worker.Worker();
    worker.createNewCollection("a/b/c");
} catch (error) {
    console.error('Failed:', error);
}