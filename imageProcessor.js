class ImageProcessor {
    constructor() {
        this.model = null;
    }

    async initModel() {
        if (!this.model) {
            this.model = await tf.loadLayersModel('https://tfhub.dev/tensorflow/tfjs-model/lite-model/mobilenet_v2_1.0_224/1/default/1', { fromTFHub: true });
        }
    }

    async resizeImage(imageFile, specs) {
        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                canvas.width = specs.width;
                canvas.height = specs.height;

                // High quality resize
                ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(img, 0, 0, specs.width, specs.height);

                canvas.toBlob((blob) => {
                    const resizedFile = new File([blob], imageFile.name.replace(/\.[^/.]+$/, `_${specs.width}x${specs.height}.${specs.format.toLowerCase()}`), {
                        type: `image/${specs.format.toLowerCase()}`
                    });
                    resolve({ original: imageFile, resized: resizedFile, specs });
                }, `image/${specs.format.toLowerCase()}`, 0.95);
            };
            img.src = URL.createObjectURL(imageFile);
        });
    }

    async compressImage(file, targetKB) {
        return new Promise((resolve) => {
            const img = new Image();
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                let quality = 0.95;
                const checkSize = (blob) => {
                    if (blob.size / 1024 <= targetKB || quality <= 0.1) {
                        resolve(new File([blob], file.name, { type: file.type }));
                    } else {
                        quality -= 0.05;
                        canvas.toBlob(checkSize, file.type, quality);
                    }
                };
                canvas.toBlob(checkSize, file.type, quality);
            };
            img.src = URL.createObjectURL(file);
        });
    }

    async batchProcess(images, selectedPlatforms) {
        const results = [];
        const total = images.length * selectedPlatforms.length;
        let processed = 0;

        for (const image of images) {
            for (const platform of selectedPlatforms) {
                for (const [type, specs] of Object.entries(PLATFORMS[platform])) {
                    const resized = await this.resizeImage(image, specs);
                    const compressed = await this.compressImage(resized.resized, specs.maxKB);
                    
                    results.push({
                        original: image,
                        platform,
                        type,
                        file: compressed,
                        sizeReduction: ((image.size - compressed.size) / image.size * 100).toFixed(1),
                        specs
                    });

                    processed++;
                    document.getElementById('progressBar').style.width = `${(processed / total) * 100}%`;
                    document.getElementById('progressText').textContent = `Processing ${processed}/${total}`;
                }
            }
        }
        return results;
    }

    createPreviewHTML(result) {
        return `
            <div class="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300">
                <div class="text-center mb-4">
                    <div class="font-bold text-lg text-gray-800">${result.platform} - ${result.type}</div>
                    <div class="text-sm text-emerald-600 font-semibold">${result.sizeReduction}% smaller</div>
                </div>
                <div class="w-full h-48 bg-gray-100 rounded-xl overflow-hidden relative">
                    <canvas class="absolute inset-0 w-full h-full object-cover" width="300" height="200"></canvas>
                </div>
                <div class="mt-4 text-center">
                    <div class="text-sm text-gray-600">${(result.file.size/1024).toFixed(1)} KB</div>
                    <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div class="bg-emerald-500 h-2 rounded-full" style="width: ${Math.min(100, result.sizeReduction)}%"></div>
                    </div>
                </div>
            </div>
        `;
    }
}

const processor = new ImageProcessor();
