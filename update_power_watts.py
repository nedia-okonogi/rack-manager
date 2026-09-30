#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "rack_manager.db")

def get_average_power(dev_type, size_u=1, name=""):
    t = (dev_type or "").lower().strip()
    u = int(size_u) if size_u else 1
    
    if t == "rackmount":
        if u == 1:
            return 100
        elif u == 2:
            return 150
        elif u >= 4:
            return 300
        return 100
    elif t == "nas":
        return 60
    elif t == "l3_switch":
        return 100
    elif t == "l2_switch":
        return 40
    elif t == "utm":
        return 50
    elif t == "router":
        return 25
    elif t == "onu":
        return 10
    elif t == "mc":
        return 5
    elif t == "ap":
        return 15
    elif t == "hub":
        return 5
    elif t == "desktop":
        return 20
    elif t == "tower":
        return 300
    elif t == "laptop":
        return 30
    elif t == "desktop_pc":
        return 80
    elif t == "iot":
        return 5
    elif t in ("pdu", "ups", "shelf"):
        return 0
    elif t == "misc":
        return 20
    else:
        return 100

def update_all_power_watts():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, type, size_u, power_watts FROM devices")
    devices = cursor.fetchall()
    print(f"Found {len(devices)} devices in 'devices' table.")

    for dev_id, name, dev_type, size_u, old_power in devices:
        new_power = get_average_power(dev_type, size_u, name)
        cursor.execute("UPDATE devices SET power_watts = ? WHERE id = ?", (new_power, dev_id))
        print(f"  [Device] {name} ({dev_type}, {size_u}U): {old_power}W -> {new_power}W")

    cursor.execute("SELECT id, name, type, size_u, power_watts FROM storage_devices")
    storage_devices = cursor.fetchall()
    print(f"Found {len(storage_devices)} devices in 'storage_devices' table.")

    for s_id, name, dev_type, size_u, old_power in storage_devices:
        new_power = get_average_power(dev_type, size_u, name)
        cursor.execute("UPDATE storage_devices SET power_watts = ? WHERE id = ?", (new_power, s_id))
        print(f"  [Storage] {name} ({dev_type}, {size_u}U): {old_power}W -> {new_power}W")

    conn.commit()
    conn.close()
    print("All device power_watts successfully updated!")

if __name__ == "__main__":
    update_all_power_watts()
