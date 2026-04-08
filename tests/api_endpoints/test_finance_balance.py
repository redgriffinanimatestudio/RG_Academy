"""
Test script for /api/v1/finance/balance endpoint
Tests the finance balance retrieval functionality
"""
import json
import sys
from playwright.sync_api import sync_playwright

# Load test data
with open('tests/fixtures/test_data.json', 'r') as f:
    TEST_DATA = json.load(f)

def test_finance_balance():
    """Test finance balance endpoint"""
    print("Testing /api/v1/finance/balance endpoint...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Enable console logging
        page.on('console', lambda msg: print(f"Console: {msg.text}"))

        # Navigate to login page
        page.goto('http://localhost:5173/eng/login')
        page.wait_for_load_state('networkidle')

        # Login as executor
        print("Logging in as executor...")
        page.fill('input[type="email"]', TEST_DATA['test_users']['executor']['email'])
        page.fill('input[type="password"]', TEST_DATA['test_users']['executor']['password'])
        page.click('button[type="submit"]')
        page.wait_for_load_state('networkidle')

        # Navigate to finance page
        print("Navigating to finance page...")
        page.goto('http://localhost:5173/studio/eng/finance')
        page.wait_for_load_state('networkidle')

        # Monitor network requests
        api_requests = []
        def handle_request(request):
            if '/api/v1/finance/balance' in request.url:
                api_requests.append({
                    'url': request.url,
                    'method': request.method,
                    'headers': request.headers
                })
                print(f"API Request: {request.method} {request.url}")

        page.on('request', handle_request)

        # Monitor responses
        api_responses = []
        def handle_response(response):
            if '/api/v1/finance/balance' in response.url:
                try:
                    body = response.json()
                    api_responses.append({
                        'url': response.url,
                        'status': response.status,
                        'body': body
                    })
                    print(f"API Response: {response.status} {json.dumps(body, indent=2)}")
                except:
                    api_responses.append({
                        'url': response.url,
                        'status': response.status,
                        'body': response.text()
                    })

        page.on('response', handle_response)

        # Wait for balance to load
        print("Waiting for balance to load...")
        page.wait_for_timeout(3000)

        # Take screenshot
        page.screenshot(path='tests/reports/finance_balance_page.png', full_page=True)

        # Verify results
        print("\n=== Test Results ===")
        print(f"API Requests made: {len(api_requests)}")
        print(f"API Responses received: {len(api_responses)}")

        success = False
        if api_responses:
            for resp in api_responses:
                if resp['status'] == 200:
                    if 'success' in resp['body'] and resp['body']['success']:
                        success = True
                        print("✅ Finance balance retrieved successfully!")
                        if 'data' in resp['body']:
                            print(f"Balance data: {resp['body']['data']}")
                    else:
                        print(f"❌ Finance balance retrieval failed: {resp['body']}")
                else:
                    print(f"❌ Finance balance returned status {resp['status']}")
        else:
            print("❌ No API response received for finance balance")

        browser.close()

        return success

if __name__ == '__main__':
    try:
        result = test_finance_balance()
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
