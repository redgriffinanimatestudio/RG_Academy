# API Endpoint Tests

This directory contains automated tests for critical API endpoints using Playwright.

## Prerequisites

1.  Python 3.8+ installed
2.  Playwright installed: `pip install playwright`
3.  Chromium browser installed: `playwright install chromium`
4.  Backend server running on port 3000
5.  Frontend server running on port 5173

## Test Structure

```
tests/
├── api_endpoints/
│   ├── test_analytics_sync.py
│   ├── test_finance_balance.py
│   ├── test_auth_logout.py
│   ├── test_notifications_mark_read.py
│   └── test_chat_unread_count.py
├── fixtures/
│   └── test_data.json
├── reports/
│   └── test_results.html
└── run_tests.py
```

## Running Tests

### Run all tests
```bash
python tests/run_tests.py
```

### Run individual test
```bash
python tests/api_endpoints/test_analytics_sync.py
```

### Run with webapp-testing skill
```bash
python skills/webapp-testing/scripts/with_server.py \
  --server "cd api && npm run dev" --port 3000 \
  --server "npm run dev" --port 5173 \
  -- python tests/run_tests.py
```

## Test Coverage

| Endpoint | Test File | Status |
|---|---|---|
| `/api/v1/analytics/sync` | test_analytics_sync.py | ⏳ |
| `/api/v1/finance/balance` | test_finance_balance.py | ⏳ |
| `/api/auth/logout` | test_auth_logout.py | ⏳ |
| `/api/notifications/mark-all-read` | test_notifications_mark_read.py | ⏳ |
| `/api/chat/:user/unread-count` | test_chat_unread_count.py | ⏳ |

## Test Data

Test users and data are defined in `tests/fixtures/test_data.json`. Update this file with your test credentials.

## Reports

After running tests, an HTML report is generated at `tests/reports/test_results.html` with:
- Test results summary
- Detailed output for each test
- Screenshots of test execution
- Error messages if any

## Troubleshooting

### Playwright not found
```bash
pip install playwright
playwright install chromium
```

### Servers not running
Make sure both backend and frontend servers are running:
```bash
# Terminal 1 - Backend
cd api && npm run dev

# Terminal 2 - Frontend
npm run dev
```

### Test users not found
Create test users in your database matching the credentials in `test_data.json`.

## Adding New Tests

1.  Create a new test file in `tests/api_endpoints/`
2.  Follow the pattern of existing tests
3.  Add the test file to `TEST_FILES` list in `tests/run_tests.py`
4.  Run the test to verify it works