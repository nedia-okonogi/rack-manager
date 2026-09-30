import urllib.request
import json
import sys

def test_server():
    print("Testing server endpoints...")
    base_url = "http://127.0.0.1:8005"
    
    # 1. Test GET /
    req = urllib.request.urlopen(base_url + "/")
    html = req.read().decode('utf-8')
    assert "btn-toggle-setup-mode" in html, "btn-toggle-setup-mode not in index.html"
    assert "btn-clear-all-history" in html, "btn-clear-all-history not in index.html"
    assert "history-setup-mode-banner" in html, "history-setup-mode-banner not in index.html"
    assert "setting-setup-mode-toggle" in html, "setting-setup-mode-toggle not in index.html"
    print("[PASS] HTML elements present")

    # 2. Test GET /api/data
    req = urllib.request.urlopen(base_url + "/api/data")
    data = json.loads(req.read().decode('utf-8'))
    assert "racks" in data, "racks not in api/data"
    assert "cables" in data, "cables not in api/data"
    assert "changeLogs" in data, "changeLogs not in api/data"
    assert "settings" in data, "settings not in api/data"
    print(f"[PASS] API GET /api/data returned {len(data['racks'])} racks, {len(data['changeLogs'])} logs")

    # 3. Test POST /api/data with initialSetupMode
    data['settings']['initialSetupMode'] = True
    post_data = json.dumps(data).encode('utf-8')
    req = urllib.request.Request(base_url + "/api/data", data=post_data, headers={'Content-Type': 'application/json'}, method='POST')
    res = urllib.request.urlopen(req)
    res_json = json.loads(res.read().decode('utf-8'))
    assert res_json.get("success") is True, f"Save failed: {res_json}"
    print("[PASS] API POST /api/data with initialSetupMode saved")

    # 4. Verify reload preserves initialSetupMode
    req = urllib.request.urlopen(base_url + "/api/data")
    reloaded = json.loads(req.read().decode('utf-8'))
    assert reloaded['settings'].get('initialSetupMode') is True, "initialSetupMode was not persisted"
    print("[PASS] API Data reloaded and verified persistence")

    # 5. Clean up / restore initialSetupMode to False
    reloaded['settings']['initialSetupMode'] = False
    post_data = json.dumps(reloaded).encode('utf-8')
    req = urllib.request.Request(base_url + "/api/data", data=post_data, headers={'Content-Type': 'application/json'}, method='POST')
    urllib.request.urlopen(req)
    print("[PASS] Cleaned up state")
    print("\nALL BACKEND & INTEGRATION TESTS PASSED!")

if __name__ == '__main__':
    test_server()
