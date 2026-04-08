"""
Test script for /api/chat/:user/unread-count endpoint
Tests unread message count retrieval
"""
import json
import sys
from playwright.sync_api import sync_playwright

# Load test data
with open('tests/fixtures/test_data.json', 'r') as f:
    TEST_DATA = json.load(f)

def test_chat_unread_count():
    """Test chat unread count endpoint"""
    print("Testing /api/chat/:user/unread-count endpoint...")

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

        # Navigate to home page (where header with chat badge is visible)
        print("Navigating to home page...")
        page.goto('http://localhost:5173/eng')
        page.wait_for_load_state('networkidle')

        # Monitor network requests
        api_requests = []
        def handle_request(request):
            if '/unread-count' in request.url:
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
            if '/unread-count' in response.url:
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

        # Wait for unread count to load
        print("Waiting for unread count to load...")
        page.wait_for_timeout(3000)

        # Take screenshot
        page.screenshot(path='tests/reports/chat_unread_count_page.png', full_page=True)

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
                        print("✅ Unread count retrieved successfully!")
                        if 'data' in resp['body']:
                            print(f"Unread count: {resp['body']['data']}")
                    else:
                        print(f"❌ Unread count retrieval failed: {resp['body']}")
                else:
                    print(f"❌ Unread count returned status {resp['status']}")
        else:
            print("❌ No API response received for unread count")

        # Check chat badge in header
        try:
            chat_badge = page.locator('[data-testid="chat-badge"], .chat-badge, [class*="chat"][class*="badge"]').first
            if chat_badge.count() > 0:
                badge_text = chat_badge.text_content()
                print(f"Chat badge text: {badge_text}")
                print("✅ Chat badge found in header")
            else:
                print("ℹ️ Chat badge not found (may be hidden if count is 0)")
        except:
            print("Could not check chat badge")

        browser.close()

        return success

if __name__ == '__main__':
    try:
        result = test_chat_unread_count()
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)