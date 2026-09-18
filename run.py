import os
import signal
import subprocess
import sys
import time
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(ROOT, "backend")
BACKEND_PORT = int(os.environ.get("BACKEND_PORT", "8080"))
FRONTEND_PORT = int(os.environ.get("FRONTEND_PORT", "3000"))

BACKEND_URL = f"http://localhost:{BACKEND_PORT}/api/staff/students"
FRONTEND_URL = f"http://localhost:{FRONTEND_PORT}"
BACKEND_HEALTH_TIMEOUT = int(os.environ.get("BACKEND_HEALTH_TIMEOUT", "120"))
FRONTEND_HEALTH_TIMEOUT = int(os.environ.get("FRONTEND_HEALTH_TIMEOUT", "60"))


def is_up(url, timeout=2):
    try:
        with urllib.request.urlopen(url, timeout=timeout):
            return True
    except Exception:
        return False


def spawn(command, cwd):
    kwargs = {
        "cwd": cwd,
        "stdout": None,
        "stderr": None,
    }
    if os.name == "nt":
        kwargs["creationflags"] = subprocess.CREATE_NEW_PROCESS_GROUP
    else:
        kwargs["start_new_session"] = True
    return subprocess.Popen(command, shell=True, **kwargs)


def stop(proc):
    if proc.poll() is not None:
        return
    try:
        proc.send_signal(signal.CTRL_BREAK_EVENT if os.name == "nt" else signal.SIGTERM)
    except Exception:
        pass
    try:
        proc.wait(timeout=8)
    except subprocess.TimeoutExpired:
        if os.name == "nt":
            subprocess.run(
                ["taskkill", "/T", "/F", "/PID", str(proc.pid)],
                capture_output=True,
            )
        else:
            proc.kill()


def wait_until(url, timeout, label):
    deadline = time.time() + timeout
    while time.time() < deadline:
        if is_up(url):
            print(f"  OK  {label} is up: {url}")
            return True
        if timeout > 5:
            time.sleep(min(2, deadline - time.time()))
        else:
            time.sleep(0.3)
    print(f"  ERR {label} did not become ready within {timeout}s: {url}")
    return False


def main():
    if not os.path.isdir(BACKEND_DIR):
        print(f"ERROR backend directory not found: {BACKEND_DIR}")
        sys.exit(1)

    print("Starting staff portal")
    print(f"  backend : {BACKEND_URL}")
    print(f"  frontend: {FRONTEND_URL}")

    procs = []
    try:
        procs.append(spawn("mvn -q spring-boot:run", BACKEND_DIR))
        backend_ok = wait_until(BACKEND_URL, BACKEND_HEALTH_TIMEOUT, "backend")
        if not backend_ok:
            print("Backend failed to start, shutting down.")
            sys.exit(1)

        procs.append(spawn("npm run dev", ROOT))
        frontend_ok = wait_until(FRONTEND_URL, FRONTEND_HEALTH_TIMEOUT, "frontend")
        if not frontend_ok:
            print("Frontend failed to start, shutting down.")
            sys.exit(1)

        print("-" * 60)
        print(f"Staff portal ready")
        print(f"  App      : {FRONTEND_URL}")
        print(f"  API      : http://localhost:{BACKEND_PORT}/api/staff")
        print("  Press Ctrl+C to stop both.")
        print("-" * 60)
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping staff portal...")
    finally:
        for proc in reversed(procs):
            stop(proc)


if __name__ == "__main__":
    main()