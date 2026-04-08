"""
Test script for /api/auth/logout endpoint
Tests logout functionality
"""
import json
import sys
from playwright.sync_api import sync_playwright

# Load test data
with open('tests/fixtures/test_data.json', 'r') as f:
    TEST_DATA = json.load(f)

def test_auth_logout():
    """Test logout endpoint"""
    print("Testing /api/auth/logout endpoint...")

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

        # Verify login successful
        current_url = page.url
        print(f"Current URL after login: {current_url}")
        assert '/login' not in current_url, "Login failed"

        # Monitor network requests
        api_requests = []
        def handle_request(request):
            if '/api/auth/logout' in request.url:
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
            if '/api/auth/logout' in response.url:
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

        # Find and click logout button
        print("Clicking logout button...")
        try:
            # Try different selectors for logout button
            logout_selectors = [
                'button:has-text("Logout")',
                'button:has-text("Выйти")',
                'button[aria-label="Logout"]',
                'a:has-text("Logout")',
                'a:has-text("Выйти")'
            ]

            for selector in logout_selectors:
                logout_button = page.locator(selector).first
                if logout_button.count() > 0:
                    logout_button.click()
                    page.wait_for_load_state('networkidle')
                    break
            else:
                print("❌ Logout button not found")
                browser.close()
                return False
        except Exception as e:
            print(f"Error clicking logout: {e}")
            browser.close()
            return False

        # Take screenshot
        page.screenshot(path='tests/reports/logout_page.png', full_page=True)

        # Verify logout
        print("\n=== Test Results ===")
        print(f"API Requests made: {len(api_requests)}")
        print(f"API Responses received: {len(api_responses)}")

        # Check if redirected to login page
        current_url = page.url
        print(f"Current URL after logout: {current_url}")

        success = False
        if '/login' in current_url:
            print("✅ Redirected to login page after logout")
            success = True
        else:
            print("❌ Not redirected to login page")

        # Check API response
        if api_responses:
            for resp in api_responses:
                if resp['status'] == 200:
                    print("✅ Logout API call successful")
                else:
                    print(f"❌ Logout API returned status {resp['status']}")

        # Check localStorage
        token = page.evaluate('() => localStorage.getItem("auth_token")')
        if token is None:
            print("✅ Auth token removed from localStorage")
        else:
            print("❌ Auth token still in localStorage")
            success = False

        browser.close()

        return success

if __name__ == '__main__':
    try:
        result = test_auth_logout()
        sys.exit(0 if result else 1)
    except Exception as e:
        print(f"Test failed with error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)