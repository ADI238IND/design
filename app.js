let uploadedImages = [];
let processedResults = [];
let startTime = 0;

document.addEventListener('DOMContentLoaded', () => {
    setupDragDrop();
    setupButtons();
});

function setupDragDrop() {
    const uploadZone = document.getElementById('uploadZone');
    
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadZone.addEventListener(eventName, unhighlight, false);
    });

    uploadZone.addEventListener('drop', handleDrop, false);

    function highlight(e) {
        uploadZone.classList.add('bg-emerald-50', 'border-emerald-400', 'ring-4', 'ring-emerald-200');
    }

    function unhighlight(e) {
        uploadZone.classList.remove('bg-emerald-50', 'border-emerald-400', 'ring-4', 'ring-emerald-200');
    }
}

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = Array.from(dt.files).filter(file => 
        file.type.startsWith('image/') && file.size < 10 * 1024 * 1024
    );
    
    if (files.length > 20) {
        alert('Max 20 images at once');
        return;
    }

    uploadedImages = files;
    showUploadSuccess(files.length);
}

function showUploadSuccess(count) {
    document.getElementById('uploadZone').innerHTML = `
        <div class="text-center">
            <div class="w-20 h-20 mx-auto mb-6 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">✓</div>
            <h2 class="text-3xl font-bold text-gray-800 mb-4">${count} images loaded</h2>
            <p class="text-xl text-gray-600 mb-8">Ready for platform selection</p>
        </div>
    `;
    document.getElementById('platformSection').classList.remove('hidden');
    populatePlatforms();
}

function populatePlatforms() {
    const grid = document.querySelector('#platformSection .grid');
    let html = '';
    
    Object.keys(PLATFORMS).slice(0, 16).forEach(platform => {
        html += `
            <label class="flex items-center p-4 bg-gray-50 hover:bg-emerald-50 rounded-xl cursor-pointer transition-all group">
                <input type="checkbox" value="${platform}" class="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500 mr-3">
                <span class="font-medium text-gray-800 group-hover:text-emerald-700">${platform}</span>
            </label>
        `;
    });
    grid.innerHTML = html;
}

function setupButtons() {
    document.getElementById('processBtn').addEventListener('click', processBatch);
    document.getElementById('downloadBtn').addEventListener('click', downloadZip);
}

async function processBatch() {
    const checkboxes = document.querySelectorAll('#platformSection input[type="checkbox"]:checked');
    const selectedPlatforms = Array.from(checkboxes).map(cb => cb.value);
    
    if (selectedPlatforms.length === 0) {
        alert('Select at least one platform');
        return;
    }

    document.getElementById('platformSection').classList.add('hidden');
    document.getElementById('progressContainer').classList.remove('hidden');
    startTime = Date.now();

    try {
        await processor.initModel();
        processedResults = await processor.batchProcess(uploadedImages, selectedPlatforms);
        showPreview();
    } catch (error) {
        alert('Processing failed. Try again.');
        console.error(error);
    }
}

function showPreview() {
    document.getElementById('progressContainer').classList.add('hidden');
    document.getElementById('previewSection').classList.remove('hidden');

    const timeSaved = Math.round((processedResults.length * 10 * 60 * 1000) / 60000); // 10min per image
    const totalReduction = processedResults.reduce((sum, r) => sum + parseFloat(r.sizeReduction), 0) / processedResults.length;

    document.getElementById('timeSaved').textContent = `${timeSaved} min saved`;
    document.getElementById('sizeReduction').textContent = `${totalReduction.toFixed(1)}% smaller`;

    const grid = document.getElementById('previewGrid');
    grid.innerHTML = processedResults.map(r => processor.createPreviewHTML(r)).join('');
}

async function downloadZip() {
    const zip = new JSZip();
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    
    processedResults.forEach(result => {
        const folder = zip.folder(`Resized_Images_${timestamp}/${result.platform}`);
        if (folder) {
            folder.file(result.type + '_' + result.file.name, result.file);
        }
    });

    zip.file('README.txt', `AI Image Resizer Results\nGenerated: ${new Date().toLocaleString()}\nFiles: ${processedResults.length}\nTime saved: ${document.getElementById('timeSaved').textContent}`);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `Resized_Images_${timestamp}.zip`);
    
    // Show success
    document.getElementById('downloadBtn').innerHTML = '✅ ZIP Downloaded!';
    setTimeout(() => {
        document.getElementById('downloadBtn').innerHTML = '💾 Download ZIP Again';
    }, 3000);
}
