import unittest
import json

# Import the app
import route

class AcceptanceTest(unittest.TestCase):

    def setUp(self):
        self.app = route.app.test_client()

    def test_successful_response(self):
        r = self.app.get('/')
        data = json.loads(r.data)

        assert r.status_code == 200
        assert 'result' in data

if __name__ == '__main__':
    unittest.main()
