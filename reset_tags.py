#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "rack_manager.db")

def get_standard_tags(dev_type, dev_name=""):
    t = (dev_type or "").lower().strip()
    name = (dev_name or "").lower().strip()
    
    if t == "utm":
        return ["security", "firewall", "utm"]
    elif t == "l3_switch":
        return ["network", "l3", "core"]
    elif t == "l2_switch":
        return ["network", "l2", "access"]
    elif t == "router":
        return ["network", "router", "gateway"]
    elif t == "onu":
        return ["network", "onu", "wan", "fiber"]
    elif t == "hg":
        return ["network", "hg", "wan", "router"]
    elif t == "mc":
        return ["network", "mc", "fiber"]
    elif t == "ap":
        return ["network", "wireless", "ap", "wifi"]
    elif t == "hub":
        return ["network", "hub"]
    elif t == "nas":
        return ["storage", "nas", "backup"]
    elif t == "rackmount":
        tags = ["server"]
        if "web" in name:
            tags.append("web")
        elif "db" in name:
            tags.append("db")
        elif "app" in name:
            tags.append("app")
        elif "backup" in name or "bak" in name:
            tags.append("backup")
        else:
            tags.append("compute")
        return tags
    elif t == "tower":
        return ["workstation", "gpu", "ai"]
    elif t == "desktop":
        return ["network", "hub", "desktop"]
    elif t == "iot":
        return ["iot", "sensor", "edge"]
    elif t == "laptop":
        return ["pc", "laptop", "client"]
    elif t == "desktop_pc":
        return ["pc", "desktop", "client"]
    elif t == "pdu":
        return ["power", "pdu"]
    elif t == "ups":
        return ["power", "ups", "battery"]
    elif t == "shelf":
        return ["shelf", "storage"]
    elif t == "misc":
        return ["misc"]
    else:
        return ["server"]

def reset_all_device_tags():
    if not os.path.exists(DB_PATH):
        print(f"Database not found at {DB_PATH}")
        return

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # 名前から明らかなタイプを補正
    cursor.execute("UPDATE devices SET type = 'nas' WHERE (name LIKE '%nas%' OR name LIKE '%storage%') AND type = 'rackmount'")
    cursor.execute("UPDATE devices SET type = 'pdu' WHERE name LIKE '%PDU%' AND type = 'rackmount'")
    cursor.execute("UPDATE devices SET type = 'l3_switch' WHERE name LIKE '%core-switch%' AND type = 'rackmount'")

    # 1. Update devices table (comma-separated tags string)
    cursor.execute("SELECT id, name, type, tags FROM devices")
    devices = cursor.fetchall()
    print(f"Found {len(devices)} devices in 'devices' table.")

    for dev_id, name, dev_type, old_tags in devices:
        new_tags = get_standard_tags(dev_type, name)
        new_tags_str = ",".join(new_tags)
        cursor.execute("UPDATE devices SET tags = ? WHERE id = ?", (new_tags_str, dev_id))
        print(f"  [Device] {name} (type: {dev_type}): {old_tags} -> {new_tags_str}")

    # 2. Update storage_devices table
    cursor.execute("SELECT id, name, type, tags FROM storage_devices")
    storage_devices = cursor.fetchall()
    print(f"Found {len(storage_devices)} devices in 'storage_devices' table.")

    for s_id, name, dev_type, old_tags in storage_devices:
        new_tags = get_standard_tags(dev_type, name)
        new_tags_str = ",".join(new_tags)
        cursor.execute("UPDATE storage_devices SET tags = ? WHERE id = ?", (new_tags_str, s_id))
        print(f"  [Storage] {name} (type: {dev_type}): {old_tags} -> {new_tags_str}")

    conn.commit()
    conn.close()
    print("All device tags successfully reset to clean comma-separated format!")

if __name__ == "__main__":
    reset_all_device_tags()
