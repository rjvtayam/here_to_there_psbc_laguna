import socketio
import time

sio = socketio.Client()
connected = False

@sio.on('connect')
def on_connect():
    global connected
    connected = True
    print("[TEST] Connected to server")
    # Join room first
    sio.emit('join_room', {'room_id': 'main-session'})
    print("[TEST] Joined room, waiting 2s then triggering emergency...")
    time.sleep(2)
    sio.emit('emergency_trigger', {
        'message': 'Test emergency from script',
        'mode': 'live'
    })
    print("[TEST] Emergency trigger emitted!")

@sio.on('emergency_alert')
def on_emergency_alert(data):
    print(f"[TEST] ✅ EMERGENCY_ALERT RECEIVED: {data}")

@sio.on('emergency_dismissed')
def on_emergency_dismissed():
    print(f"[TEST] ✅ EMERGENCY_DISMISSED received")

@sio.on('error')
def on_error(data):
    print(f"[TEST] ❌ ERROR: {data}")

@sio.on('connect_error')
def on_connect_error(data):
    print(f"[TEST] ❌ CONNECT_ERROR: {data}")

print("[TEST] Connecting to http://localhost:8000...")
# We need a valid JWT token - let's just check if the socket connects at all
try:
    sio.connect('http://localhost:8000', transports=['websocket', 'polling'])
    time.sleep(5)
except Exception as e:
    print(f"[TEST] Connection failed: {e}")
finally:
    if connected:
        sio.disconnect()
        print("[TEST] Disconnected")
    print("[TEST] Done")
