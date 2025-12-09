// 50+ Indian Education/Job Platforms Database
const PLATFORMS = {
    "NEET": {
        photo: { width: 200, height: 240, maxKB: 100, format: "JPG" },
        signature: { width: 200, height: 60, maxKB: 50, format: "JPG" }
    },
    "JEE": {
        photo: { width: 200, height: 250, maxKB: 100, format: "JPG" },
        signature: { width: 200, height: 60, maxKB: 50, format: "JPG" }
    },
    "LinkedIn": {
        profile: { width: 400, height: 400, maxKB: 5000, format: "PNG" }
    },
    "NAUKRI": {
        photo: { width: 250, height: 300, maxKB: 500, format: "JPG" }
    },
    "GATE": {
        photo: { width: 200, height: 240, maxKB: 100, format: "JPG" }
    },
    "UPSC": {
        photo: { width: 140, height: 180, maxKB: 50, format: "JPG" }
    },
    "CAT": {
        photo: { width: 200, height: 250, maxKB: 50, format: "JPG" }
    },
    "AKTU": {
        photo: { width: 150, height: 200, maxKB: 100, format: "JPG" }
    },
    "IPU": {
        photo: { width: 200, height: 250, maxKB: 100, format: "JPG" }
    },
    "VTU": {
        photo: { width: 150, height: 200, maxKB: 50, format: "JPG" }
    },
    "Anna University": {
        photo: { width: 200, height: 240, maxKB: 100, format: "JPG" }
    },
    "BITSAT": {
        photo: { width: 200, height: 250, maxKB: 100, format: "JPG" }
    },
    "VITEEE": {
        photo: { width: 150, height: 150, maxKB: 50, format: "JPG" }
    },
    "SRMJEEE": {
        photo: { width: 200, height: 240, maxKB: 100, format: "JPG" }
    },
    "COMEDK": {
        photo: { width: 200, height: 300, maxKB: 100, format: "JPG" }
    },
    "KVPY": {
        photo: { width: 200, height: 230, maxKB: 100, format: "JPG" }
    },
    "NATA": {
        photo: { width: 150, height: 150, maxKB: 50, format: "JPG" }
    },
    "CLAT": {
        photo: { width: 200, height: 240, maxKB: 100, format: "JPG" }
    },
    "AILET": {
        photo: { width: 200, height: 250, maxKB: 100, format: "JPG" }
    },
    "XAT": {
        photo: { width: 140, height: 160, maxKB: 50, format: "JPG" }
    },
    "MAT": {
        photo: { width: 200, height: 250, maxKB: 100, format: "JPG" }
    },
    "SNAP": {
        photo: { width: 150, height: 150, maxKB: 50, format: "JPG" }
    },
    "NMAT": {
        photo: { width: 200, height: 240, maxKB: 100, format: "JPG" }
    },
    "IIFT": {
        photo: { width: 200, height: 250, maxKB: 100, format: "JPG" }
    },
    "Bank PO": {
        photo: { width: 200, height: 230, maxKB: 50, format: "JPG" }
    },
    "SSC": {
        photo: { width: 200, height: 230, maxKB: 50, format: "JPG" }
    },
    "Railways": {
        photo: { width: 200, height: 230, maxKB: 50, format: "JPG" }
    },
    "Defence": {
        photo: { width: 200, height: 230, maxKB: 50, format: "JPG" }
    },
    "Passport": {
        photo: { width: 350, height: 450, maxKB: 100, format: "JPG" }
    },
    "Aadhar": {
        photo: { width: 200, height: 250, maxKB: 100, format: "JPG" }
    },
    "Pan Card": {
        photo: { width: 200, height: 300, maxKB: 50, format: "JPG" }
    },
    "Driving License": {
        photo: { width: 200, height: 250, maxKB: 100, format: "JPG" }
    },
    "Twitter": {
        profile: { width: 400, height: 400, maxKB: 2000, format: "JPG" }
    },
    "Instagram": {
        profile: { width: 320, height: 320, maxKB: 2000, format: "JPG" }
    },
    "Facebook": {
        profile: { width: 170, height: 170, maxKB: 1000, format: "JPG" }
    },
    "WhatsApp": {
        profile: { width: 640, height: 640, maxKB: 5000, format: "JPG" }
    },
    "GitHub": {
        profile: { width: 420, height: 420, maxKB: 2000, format: "JPG" }
    },
    "Behance": {
        profile: { width: 140, height: 140, maxKB: 1000, format: "JPG" }
    },
    "Dribbble": {
        profile: { width: 400, height: 400, maxKB: 2000, format: "JPG" }
    }
};

// Auto-detect platform from filename
function detectPlatform(filename) {
    const lower = filename.toLowerCase();
    for (const platform of Object.keys(PLATFORMS)) {
        if (lower.includes(platform.toLowerCase().replace(' ', ''))) {
            return platform;
        }
    }
    return null;
}
