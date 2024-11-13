// Import GitProxy’s PushActionPlugin
import { PushActionPlugin } from '@finos/git-proxy/plugin';

// Define the plugin class
class EnhancedDataUsagePlugin extends PushActionPlugin {
    constructor() {
        super();
        // State to track different categories of detected elements
        this.usageData = {
            dataFiles: { jsonFiles: [], logFiles: [], csvFiles: [], xlsxFiles: [], testData: [] },
            cryptography: { nonStandardMethods: [] },
            patentableAssets: { images: [], videos: [], graphics: [], designs: [] },
            ai_ml: { libraries: [], models: [], weights: [] }
        };
    }

    // Main execution method for the plugin
    async execute(action) {
        const diffContent = action.diffContent;
        
        if (!diffContent) {
            console.log('No diff content to process.');
            return;
        }

        // Process diff content for all required detections
        this.detectDataFiles(diffContent);
        this.detectCryptography(diffContent);
        this.detectPatentableAssets(diffContent);
        this.detectAIUsage(diffContent);
        
        return {
            success: true,
            message: 'Detection completed.',
            usageData: this.usageData
        };
    }

    // Method to detect data files and test data usage
    detectDataFiles(diffContent) {
        const lines = diffContent.split('\n');

        lines.forEach(line => {
            if (line.startsWith('diff --git')) {
                const filePath = line.split(' ')[2].substring(2); // Get file path

                if (filePath.endsWith('.json')) this.usageData.dataFiles.jsonFiles.push(filePath);
                else if (filePath.endsWith('.log')) this.usageData.dataFiles.logFiles.push(filePath);
                else if (filePath.endsWith('.csv')) this.usageData.dataFiles.csvFiles.push(filePath);
                else if (filePath.endsWith('.xlsx')) this.usageData.dataFiles.xlsxFiles.push(filePath);
                else if (/test|sample/i.test(filePath)) this.usageData.dataFiles.testData.push(filePath);
            }
        });
    }

    // Method to detect non-standard cryptography usage
    detectCryptography(diffContent) {
        const cryptoKeywords = ['customEncrypt', 'customDecrypt', 'nonStandardHash', 'proprietaryCrypto'];
        
        cryptoKeywords.forEach(keyword => {
            if (diffContent.includes(keyword)) {
                this.usageData.cryptography.nonStandardMethods.push(keyword);
            }
        });
    }

    // Method to detect potential patentable assets (images, videos, graphics, designs)
    detectPatentableAssets(diffContent) {
        const lines = diffContent.split('\n');

        lines.forEach(line => {
            if (line.startsWith('diff --git')) {
                const filePath = line.split(' ')[2].substring(2);

                if (/\.(png|jpg|jpeg|gif|bmp|svg)$/i.test(filePath)) this.usageData.patentableAssets.images.push(filePath);
                else if (/\.(mp4|avi|mov|mkv)$/i.test(filePath)) this.usageData.patentableAssets.videos.push(filePath);
                else if (/\.(ai|psd|pdf)$/i.test(filePath)) this.usageData.patentableAssets.graphics.push(filePath);
                else if (filePath.includes('design')) this.usageData.patentableAssets.designs.push(filePath);
            }
        });
    }

    // Method to detect AI/ML libraries, models, and weights
    detectAIUsage(diffContent) {
        const aiKeywords = ['tensorflow', 'pytorch', 'scikit-learn', 'modelWeights', '.h5', '.pt', '.pb'];

        aiKeywords.forEach(keyword => {
            if (diffContent.includes(keyword)) {
                this.usageData.ai_ml.libraries.push(keyword);
            }
        });
    }
}

// Export the plugin for GitProxy’s plugin loader to detect it
export const detectData = new EnhancedDataUsagePlugin();