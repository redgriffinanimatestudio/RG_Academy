"""
Test script for /api/v1/analytics/sync endpoint
Tests the analytics synchronization functionality
"""
import json
import sys
from playwright.sync_api import sync_playwright

# Load test data
with open('tests/fixtures/test_data.json', 'r') as f:
    TEST_DATA = json.load(f)

def test_analytics_sync():
    """Test analytics sync endpoint"""
    print("Testing /api/v1/analytics/sync endpoint...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Enable console logging
        page.on('console', lambda msg: print(f"Console: {msg.text}"))

        # Navigate to login page
        page.goto('http://localhost:5173/eng/login')
        page.wait_for_load_state('networkidle')

        # Login as student
        print("Logging in as student...")
        page.fill('input[type="email"]', TEST_DATA['test_users']['student']['email'])
        page.fill('input[type="password"]', TEST_DATA['test_users']['student']['password'])
        page.click('button[type="submit"]')
        page.wait_for_load_state('networkidle')

        # Navigate to course detail page
        print("Navigating to course detail page...")
        page.goto(f'http://localhost:5173/aca/eng/course/{TEST_DATA["test_courses"]["course_slug"]}')
        page.wait_for_load_state('networkidle')

        # Monitor network requests
        api_requests = []
        def handle_request(request):
            if '/api/v1/analytics/sync' in request.url:
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
            if '/api/v1/analytics/sync' in response.url:
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

        # Trigger analytics sync (look for sync button or auto-sync)
        print("Triggering analytics sync...")
        try:
            # Try to find and click sync button
            sync_button = page.locator('button:has-text("Sync"), button:has-text("Синхронизировать")').first
            if sync_button.count() > 0:
                sync_button.click()
                page.wait_for_load_state('networkidle')
            else:
                # If no button, try to trigger via API call directly
                print("No sync button found, checking for auto-sync...")
                page.wait_for_timeout(2000)
        except Exception as e:
            print(f"Error triggering sync: {e}")

        # Take screenshot
        page.screenshot(path='tests/reports/analytics_sync_page.png', full_page=True)

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
                        print("✅ Analytics sync successful!")
                    else:
                        print(f"❌ Analytics sync failed: {resp['body']}")
                else:
                    print(f"❌ Analytics sync returned status {resp['status']}")
        else:
            print("❌ No API response received for analytics sync")

        browser.close()

        return success

if __name__ == '__main__':
    try:
        result = test_analytics_sync()
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
