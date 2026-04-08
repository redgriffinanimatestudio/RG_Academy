"""
Test runner script for API endpoint tests
Runs all tests and generates HTML report
"""
import subprocess
import sys
import json
from datetime import datetime
from pathlib import Path

# Test files
TEST_FILES = [
    'tests/api_endpoints/test_analytics_sync.py',
    'tests/api_endpoints/test_finance_balance.py',
    'tests/api_endpoints/test_auth_logout.py',
    'tests/api_endpoints/test_notifications_mark_read.py',
    'tests/api_endpoints/test_chat_unread_count.py'
]

def run_test(test_file):
    """Run a single test and return result"""
    print(f"\n{'='*60}")
    print(f"Running: {test_file}")
    print(f"{'='*60}")

    try:
        result = subprocess.run(
            [sys.executable, test_file],
            capture_output=True,
            text=True,
            timeout=60
        )

        return {
            'file': test_file,
            'success': result.returncode == 0,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'returncode': result.returncode
        }
    except subprocess.TimeoutExpired:
        return {
            'file': test_file,
            'success': False,
            'stdout': '',
            'stderr': 'Test timed out after 60 seconds',
            'returncode': -1
        }
    except Exception as e:
        return {
            'file': test_file,
            'success': False,
            'stdout': '',
            'stderr': str(e),
            'returncode': -1
        }

def generate_html_report(results):
    """Generate HTML report from test results"""
    timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    total_tests = len(results)
    passed_tests = sum(1 for r in results if r['success'])
    failed_tests = total_tests - passed_tests

    html = f"""
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Endpoint Test Report</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f5f5f5;
        }}
        .header {{
            background-color: #333;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
        }}
        .summary {{
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }}
        .summary-card {{
            background: white;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .summary-card h3 {{
            margin: 0 0 10px 0;
            color: #666;
        }}
        .summary-card .value {{
            font-size: 2em;
            font-weight: bold;
        }}
        .passed {{ color: #4CAF50; }}
        .failed {{ color: #f44336; }}
        .test-result {{
            background: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }}
        .test-result.passed {{
            border-left: 5px solid #4CAF50;
        }}
        .test-result.failed {{
            border-left: 5px solid #f44336;
        }}
        .test-result h3 {{
            margin: 0 0 10px 0;
        }}
        .test-result .status {{
            display: inline-block;
            padding: 5px 10px;
            border-radius: 3px;
            color: white;
            font-weight: bold;
        }}
        .test-result.passed .status {{
            background-color: #4CAF50;
        }}
        .test-result.failed .status {{
            background-color: #f44336;
        }}
        .test-result pre {{
            background: #f5f5f5;
            padding: 10px;
            border-radius: 3px;
            overflow-x: auto;
            font-size: 0.9em;
        }}
        .test-result .stdout {{
            color: #333;
        }}
        .test-result .stderr {{
            color: #f44336;
        }}
        .screenshots {{
            margin-top: 10px;
        }}
        .screenshot {{
            max-width: 100%;
            border: 1px solid #ddd;
            border-radius: 3px;
            margin: 5px 0;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>API Endpoint Test Report</h1>
        <p>Generated: {timestamp}</p>
    </div>

    <div class="summary">
        <div class="summary-card">
            <h3>Total Tests</h3>
            <div class="value">{total_tests}</div>
        </div>
        <div class="summary-card">
            <h3>Passed</h3>
            <div class="value passed">{passed_tests}</div>
        </div>
        <div class="summary-card">
            <h3>Failed</h3>
            <div class="value failed">{failed_tests}</div>
        </div>
        <div class="summary-card">
            <h3>Success Rate</h3>
            <div class="value">{(passed_tests/total_tests*100):.1f}%</div>
        </div>
    </div>
"""

    for result in results:
        status_class = 'passed' if result['success'] else 'failed'
        status_text = 'PASSED' if result['success'] else 'FAILED'

        html += f"""
    <div class="test-result {status_class}">
        <h3>{Path(result['file']).name} <span class="status">{status_text}</span></h3>
"""

        if result['stdout']:
            html += f"""
        <h4>Output:</h4>
        <pre class="stdout">{result['stdout']}</pre>
"""

        if result['stderr']:
            html += f"""
        <h4>Errors:</h4>
        <pre class="stderr">{result['stderr']}</pre>
"""

        # Add screenshots if they exist
        test_name = Path(result['file']).stem
        screenshot_path = f'tests/reports/{test_name}_page.png'
        if Path(screenshot_path).exists():
            html += f"""
        <div class="screenshots">
            <h4>Screenshot:</h4>
            <img src="{screenshot_path}" alt="Screenshot" class="screenshot">
        </div>
"""

        html += """
    </div>
"""

    html += """
</body>
</html>
"""

    return html

def main():
    """Main test runner"""
    print("="*60)
    print("API Endpoint Test Suite")
    print("="*60)
    print(f"Starting at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Total tests to run: {len(TEST_FILES)}")

    results = []
    for test_file in TEST_FILES:
        result = run_test(test_file)
        results.append(result)

        if result['success']:
            print(f"✅ {test_file} - PASSED")
        else:
            print(f"❌ {test_file} - FAILED")
            if result['stderr']:
                print(f"   Error: {result['stderr'][:200]}")

    # Generate report
    print("\n" + "="*60)
    print("Generating HTML report...")
    html_report = generate_html_report(results)

    report_path = 'tests/reports/test_results.html'
    Path(report_path).parent.mkdir(parents=True, exist_ok=True)
    with open(report_path, 'w') as f:
        f.write(html_report)

    print(f"Report saved to: {report_path}")

    # Summary
    passed = sum(1 for r in results if r['success'])
    total = len(results)
    print("\n" + "="*60)
    print("Test Summary")
    print("="*60)
    print(f"Total: {total}")
    print(f"Passed: {passed}")
    print(f"Failed: {total - passed}")
    print(f"Success Rate: {(passed/total*100):.1f}%")
    print("="*60)

    # Exit with appropriate code
    sys.exit(0 if passed == total else 1)

if __name__ == '__main__':
    main()
