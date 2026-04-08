"""
Test script for /api/notifications/mark-all-read endpoint
Tests marking all notifications as read
"""
import json
import sys
from playwright.sync_api import sync_playwright

# Load test data
with open('tests/fixtures/test_data.json', 'r') as f:
    TEST_DATA = json.load(f)

def test_notifications_mark_all_read():
    """Test mark all notifications as read endpoint"""
    print("Testing /api/notifications/mark-all-read endpoint...")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Enable console logging
        page.on('console', lambda msg: print(f"Console: {msg.text}"))

        # Navigate to login page
        page.goto('http://localhost:5173/eng/login')
        page.wait_for_load_state('networkidle')

        # Login
        print("Logging in...")
        page.fill('input[type="email"]', TEST_DATA['test_users']['student']['email'])
        page.fill('input[type="password"]', TEST_DATA['test_users']['student']['password'])
        page.click('button[type="submit"]')
        page.wait_for_load_state('networkidle')

        # Navigate to messages page
        print("Navigating to messages page...")
        page.goto('http://localhost:5173/aca/eng/messages')
        page.wait_for_load_state('networkidle')

        # Monitor network requests
        api_requests = []
        def handle_request(request):
            if '/api/notifications/mark-all-read' in request.url or '/api/v1/notifications/mark-all-read' in request.url:
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
            if '/api/notifications/mark-all-read' in response.url or '/api/v1/notifications/mark-all-read' in response.url:
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

        # Find and click "Mark all as read" button
        print("Clicking 'Mark all as read' button...")
        try:
            # Try different selectors
            mark_read_selectors = [
                'button:has-text("Mark all as read")',
                'button:has-text("Отметить все как прочитанные")',
                'button:has-text("Mark all read")',
                'button[aria-label="Mark all as read"]'
            ]

            for selector in mark_read_selectors:
                mark_button = page.locator(selector).first
                if mark_button.count() > 0:
                    mark_button.click()
                    page.wait_for_load_state('networkidle')
                    break
            else:
                print("❌ 'Mark all as read' button not found")
                browser.close()
                return False
        except Exception as e:
            print(f"Error clicking 'Mark all as read': {e}")
            browser.close()
            return False

        # Take screenshot
        page.screenshot(path='tests/reports/notifications_mark_read_page.png', full_page=True)

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
                        print("✅ All notifications marked as read successfully!")
                    else:
                        print(f"❌ Mark all as read failed: {resp['body']}")
                else:
                    print(f"❌ Mark all as read returned status {resp['status']}")
        else:
            print("❌ No API response received for mark all as read")

        # Check notification badge
        try:
            badge = page.locator('[data-testid="notification-badge"], .notification-badge, [class*="badge"]').first
            if badge.count() > 0:
                badge_text = badge.text_content()
                print(f"Notification badge text: {badge_text}")
                if badge_text == '0' or badge_text == '':
                    print("✅ Notification badge cleared")
                else:
                    print(f"❌ Notification badge still shows: {badge_text}")
                    success = False
        except:
            print("Could not check notification badge")

        browser.close()

        return success

if __name__ == '__main__':
    try:
        result = test_notifications_mark_all_read()
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)