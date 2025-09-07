import { PushActionPlugin } from '@finos/git-proxy/plugin';
import { Step } from '@finos/git-proxy/proxy/actions';

function checkForVulnerabilities(diffContent = "") {
  const vulns = [];

  if (typeof diffContent !== "string") {
    console.warn("checkForVulnerabilities called with non-string diffContent:", diffContent);
    return vulns;
  }

  if (diffContent.includes("eval(")) {
    vulns.push("Use of eval detected");
  }

  if (diffContent.includes("exec(")) {
    vulns.push("Use of exec detected");
  }

  return vulns;
}

function checkLicenses(diff) {
  const licensePatterns = [
    { pattern: /GPL/, message: "GPL licensed code detected" },
    { pattern: /LGPL/, message: "LGPL licensed code detected" },
    { pattern: /AGPL/, message: "AGPL licensed code detected" },
    { pattern: /MPL/, message: "Mozilla Public License (MPL) code detected" },
    { pattern: /EPL/, message: "Eclipse Public License (EPL) code detected" },
    { pattern: /CDDL/, message: "Common Development and Distribution License (CDDL) code detected" },
    { pattern: /Apache License/, message: "Apache licensed code detected" },
    { pattern: /MIT License/, message: "MIT licensed code detected" }
  ];
  return licensePatterns
    .filter(l => l.pattern.test(diff))
    .map(l => l.message);
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
  constructor() {
    super(async (req, action) => this.execute(req, action));
  }

  async execute(req, action) {
    const sensitivePatterns = [/API_KEY=\w+/, /SSN:\d{3}-\d{2}-\d{4}/];
    this.results = [];

    sensitivePatterns.forEach(pattern => {
      if (pattern.test(action.diffContent)) {
        this.results.push(`Sensitive data found matching ${pattern}`);
      }
    });

    console.log("SensitiveDataDetectionPlugin running:", this.results);
    return action;
  }
}


// ✅ Static Security Vulnerability
class StaticSecurityVulnerabilityPlugin extends PushActionPlugin {
  constructor() {
    super(async (req, action) => this.execute(req, action));
  }

  async execute(req, action) {
  const diff = action.diffContent || "";
  const vulnerabilities = checkForVulnerabilities(diff);

  if (vulnerabilities.length > 0) {
    console.log("StaticSecurityVulnerabilityPlugin issues:", vulnerabilities);
    action.addStep(new Step("StaticSecurityVulnerability", { issues: vulnerabilities }));
  }

  return action;
}

}

// ✅ Compliance Check
class ComplianceCheckPlugin extends PushActionPlugin {
  constructor() {
    super((req, action) => this.execute(req, action));
  }

  execute(req, action) {
    const piipatterns = [/log\(.+userData/, /encrypt\(.+\)/];
    const issues = [];

    piipatterns.forEach(pattern => {
      if (pattern.test(action.diffContent)) {
        issues.push("Potential GDPR compliance issue detected");
      }
    });

    if (issues.length) {
      console.log("ComplianceCheckPlugin issues:", issues);
      action.addStep(new Step("ComplianceCheck", { issues }));
    }
    return action;
  }
}

// ✅ Non-Standard Cryptography
class NonStandardCryptographyPlugin extends PushActionPlugin {
  constructor() {
    super((req, action) => this.execute(req, action));
  }

  execute(req, action) {
    const cryptoPatterns = [/md5\(.+\)/, /sha1\(.+\)/, /customEncrypt\(.+\)/];
    const issues = cryptoPatterns.filter(pattern => pattern.test(action.diffContent));

    if (issues.length) {
      console.log("NonStandardCryptographyPlugin issues:", issues);
      action.addStep(new Step("NonStandardCryptography", { issues }));
    }
    return action;
  }
}

// ✅ License Compliance
class LicenseCompliancePlugin extends PushActionPlugin {
  constructor() {
    super(async (req, action) => this.execute(req, action));
  }

  async execute(req, action) {
    const licenseIssues = checkLicenses(action.diffContent);
    if (licenseIssues.length > 0) {
      console.log("LicenseCompliancePlugin issues:", licenseIssues);
      action.addStep(new Step("LicenseCompliance", { issues: licenseIssues }));
    }
    return action;
  }
}

// ✅ Malicious Code Detection
class MaliciousCodeDetectionPlugin extends PushActionPlugin {
  constructor() {
    super((req, action) => this.execute(req, action));
  }

  execute(req, action) {
    const maliciousPatterns = [/eval\(.+\)/, /exec\(.+\)/];
    const issues = maliciousPatterns.filter(pattern => pattern.test(action.diffContent));

    if (issues.length) {
      console.log("MaliciousCodeDetectionPlugin issues:", issues);
      action.addStep(new Step("MaliciousCodeDetection", { issues }));
    }
    return action;
  }
}

// ✅ Security Configuration
class SecurityConfigurationPlugin extends PushActionPlugin {
  constructor() {
    super((req, action) => this.execute(req, action));
  }

  execute(req, action) {
    const configPatterns = [/FROM ubuntu:/, /public-read/];
    const issues = configPatterns.filter(pattern => pattern.test(action.diffContent));

    if (issues.length) {
      console.log("SecurityConfigurationPlugin issues:", issues);
      action.addStep(new Step("SecurityConfiguration", { issues }));
    }
    return action;
  }
}

// ✅ AI Model Compliance
class AIModelCompliancePlugin extends PushActionPlugin {
  constructor() {
    super((req, action) => this.execute(req, action));
  }

  execute(req, action) {
    const aiPatterns = [/model\.h5/, /torch/];
    const issues = aiPatterns.filter(pattern => pattern.test(action.diffContent));

    if (issues.length) {
      console.log("AIModelCompliancePlugin issues:", issues);
      action.addStep(new Step("AIModelCompliance", { issues }));
    }
    return action;
  }
}

// ✅ Code Quality
class CodeQualityPlugin extends PushActionPlugin {
  constructor() {
    super(async (req, action) => this.execute(req, action));
  }

  async execute(req, action) {
    const qualityIssues = lintAndAnalyze(action.diffContent);
    if (qualityIssues.length > 0) {
      console.log("CodeQualityPlugin issues:", qualityIssues);
      action.addStep(new Step("CodeQuality", { issues: qualityIssues }));
    }
    return action;
  }
}

// ✅ Documentation Audit
class DocumentationAuditPlugin extends PushActionPlugin {
  constructor() {
    super((req, action) => this.execute(req, action));
  }

  execute(req, action) {
    const docPatterns = [/README/, /docs/];
    const issues = docPatterns.filter(pattern => pattern.test(action.diffContent));

    if (issues.length) {
      console.log("DocumentationAuditPlugin issues:", issues);
      action.addStep(new Step("DocumentationAudit", { issues }));
    }
    return action;
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
