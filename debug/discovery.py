# /// script
# dependencies = ["dbus-next"]
# ///

import asyncio

from dbus_next import BusType, Variant
from dbus_next.aio import MessageBus

ADAPTER_PATH = "/org/bluez/hci0"


async def main() -> None:
    bus = await MessageBus(bus_type=BusType.SYSTEM).connect()

    introspection = await bus.introspect("org.bluez", ADAPTER_PATH)
    adapter_obj = bus.get_proxy_object("org.bluez", ADAPTER_PATH, introspection)
    adapter = adapter_obj.get_interface("org.bluez.Adapter1")
    props = adapter_obj.get_interface("org.freedesktop.DBus.Properties")

    await props.call_set("org.bluez.Adapter1", "Powered", Variant("b", True))

    try:
        await adapter.call_stop_discovery()
    except Exception:
        pass

    root_introspection = await bus.introspect("org.bluez", "/")
    root_obj = bus.get_proxy_object("org.bluez", "/", root_introspection)
    object_manager = root_obj.get_interface("org.freedesktop.DBus.ObjectManager")

    async def print_devices() -> int:
        found = 0
        managed = await object_manager.call_get_managed_objects()
        for path, interfaces in managed.items():
            if "org.bluez.Device1" in interfaces:
                d = interfaces["org.bluez.Device1"]
                addr = d.get("Address")
                name = d.get("Name")
                rssi = d.get("RSSI")
                print(
                    "  ",
                    addr.value if addr else None,
                    name.value if name else None,
                    "rssi:",
                    rssi.value if rssi else None,
                )
                found += 1
        return found

    print("=== known devices BEFORE scan ===")
    await print_devices()

    print("=== starting discovery ===")
    try:
        await adapter.call_start_discovery()
    except Exception as e:
        print("Error starting discovery:", e)
        return
    await asyncio.sleep(14)
    try:
        await adapter.call_stop_discovery()
    except Exception:
        pass

    print("=== devices AFTER scan ===")
    if not await print_devices():
        print("  (none)")


if __name__ == "__main__":
    asyncio.run(main())

"""
discovery works: it sees Microbit, if it is in pairing mode
"""
