import { PushActionPlugin } from '@finos/git-proxy/plugin';
import { Step } from '@finos/git-proxy/proxy/actions';

function checkForVulnerabilities(diff) {
  const issues = [];
  if (diff.includes("exec")) {
    issues.push("Use of exec() detected");
  }
  if (diff.includes("eval")) {
    issues.push("Use of eval() detected");
  }
  return issues;
}

function checkLicenses(diff) {
  return diff.includes("GPL") ? ["GPL licensed code detected"] : [];
}

function lintAndAnalyze(diff) {
  const issues = [];
  if (/console\.log/.test(diff)) {
    issues.push("console.log found, remove debug statements");
  }
  if (/\/\/|\/\*[\s\S]*?\*\//.test(diff)) {
    issues.push("Comment found, consider removing unnecessary comments");
  }
  return issues;
}

class SensitiveDataDetectionPlugin extends PushActionPlugin {
    execute(action) {
        const sensitivePatterns = [/API_KEY=\w+/, /SSN:\d{3}-\d{2}-\d{4}/];
        this.results = [];
        sensitivePatterns.forEach(pattern => {
            if (pattern.test(action.diffContent)) {
                this.results.push(`Sensitive data found matching ${pattern}`);
            }
        });
        return this.results;
    }
}

class StaticSecurityVulnerabilityPlugin extends PushActionPlugin {
    async execute(action) {
        const vulnerabilities = checkForVulnerabilities(action.diffContent); 
        return vulnerabilities.length > 0
            ? { success: false, issues: vulnerabilities }
            : { success: true, message: 'No security vulnerabilities detected.' };
    }
}

class ComplianceCheckPlugin extends PushActionPlugin {
    execute(action) {
        const piipatterns = [/log\(.+userData/, /encrypt\(.+\)/]; 
        const issues = [];
        piipatterns.forEach(pattern => {
            if (pattern.test(action.diffContent)) {
                issues.push('Potential GDPR compliance issue detected');
            }
        });
        return issues.length ? { success: false, issues } : { success: true };
    }
}

class NonStandardCryptographyPlugin extends PushActionPlugin {
    execute(action) {
        const cryptoPatterns = [/md5\(.+\)/, /sha1\(.+\)/, /customEncrypt\(.+\)/];
        const issues = cryptoPatterns.filter(pattern => pattern.test(action.diffContent));
        return issues.length ? { success: false, issues } : { success: true };
    }
}

class LicenseCompliancePlugin extends PushActionPlugin {
    async execute(action) {
        const licenseIssues = checkLicenses(action.diffContent); 
        return licenseIssues.length > 0
            ? { success: false, issues: licenseIssues }
            : { success: true };
    }
}

class MaliciousCodeDetectionPlugin extends PushActionPlugin {
    execute(action) {
        const maliciousPatterns = [/eval\(.+\)/, /exec\(.+\)/];
        const issues = maliciousPatterns.filter(pattern => pattern.test(action.diffContent));
        return issues.length ? { success: false, issues } : { success: true };
    }
}

class SecurityConfigurationPlugin extends PushActionPlugin {
    execute(action) {
        const configPatterns = [/FROM ubuntu:/, /public-read/]; 
        const issues = configPatterns.filter(pattern => pattern.test(action.diffContent));
        return issues.length ? { success: false, issues } : { success: true };
    }
}

class AIModelCompliancePlugin extends PushActionPlugin {
    execute(action) {
        const aiPatterns = [/model\.h5/, /torch/];
        const issues = aiPatterns.filter(pattern => pattern.test(action.diffContent));
        return issues.length ? { success: false, issues } : { success: true };
    }
}

class CodeQualityPlugin extends PushActionPlugin {
    async execute(action) {
        const qualityIssues = lintAndAnalyze(action.diffContent); 
        return qualityIssues.length > 0
            ? { success: false, issues: qualityIssues }
            : { success: true };
    }
}

class DocumentationAuditPlugin extends PushActionPlugin {
    execute(action) {
        const docPatterns = [/README/, /docs/];
        const issues = docPatterns.filter(pattern => pattern.test(action.diffContent));
        return issues.length ? { success: false, issues } : { success: true };
    }
}

export const sensitiveDataDetectionPlugin = new SensitiveDataDetectionPlugin();
export const staticSecurityVulnerabilityPlugin = new StaticSecurityVulnerabilityPlugin();
export const complianceCheckPlugin = new ComplianceCheckPlugin();
export const nonStandardCryptographyPlugin = new NonStandardCryptographyPlugin();
export const licenseCompliancePlugin = new LicenseCompliancePlugin();
export const maliciousCodeDetectionPlugin = new MaliciousCodeDetectionPlugin();
export const securityConfigurationPlugin = new SecurityConfigurationPlugin();
export const aiModelCompliancePlugin = new AIModelCompliancePlugin();
export const codeQualityPlugin = new CodeQualityPlugin();
export const documentationAuditPlugin = new DocumentationAuditPlugin();
