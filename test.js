const { execSync } = require('child_process');
const path = require('path');

console.log('Testing Vue Security Scanner...\n');

try {
  // Run the scanner on the test directory
  const result = execSync('node bin/vue-security-scanner.js ./tests', {
    encoding: 'utf-8',
    cwd: __dirname
  });
  
  console.log('Scan completed successfully!');
  console.log('Results:');
  console.log(result);
  
  // Check if vulnerabilities were found
  if (result.includes('vulnerabilities found')) {
    const match = result.match(/(\d+) vulnerabilities found/);
    if (match && parseInt(match[1]) > 0) {
      console.log(`✓ Successfully detected ${match[1]} vulnerabilities as expected`);
    }
  }
  
} catch (error) {
  // A non-zero exit code is expected when vulnerabilities are found
  if (error.status === 1 && error.stdout) {
    console.log('Scan completed with vulnerabilities detected (expected behavior):');
    console.log(error.stdout);
    
    const match = error.stdout.match(/(\d+) vulnerabilities found/);
    if (match && parseInt(match[1]) > 0) {
      console.log(`✓ Successfully detected ${match[1]} vulnerabilities as expected`);
    }
  } else {
    console.error('Error running scanner:', error.message);
    process.exit(1);
  }
}

console.log('\nTesting different output formats...\n');

// Test JSON output
try {
  const jsonResult = execSync('node bin/vue-security-scanner.js ./tests -o json', {
    encoding: 'utf-8',
    cwd: __dirname
  });
  
  console.log('JSON output test passed');
  const parsed = JSON.parse(jsonResult);
  console.log(`Found ${parsed.vulnerabilities.length} vulnerabilities in JSON format`);
} catch (error) {
  // Same as above, non-zero exit code is expected
  if (error.status === 1 && error.stdout) {
    const parsed = JSON.parse(error.stdout);
    console.log('JSON output test passed');
    console.log(`Found ${parsed.vulnerabilities.length} vulnerabilities in JSON format`);
  } else {
    console.error('Error with JSON output:', error.message);
    process.exit(1);
  }
}

console.log('\nAll tests passed! ✅');