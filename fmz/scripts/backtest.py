#!/usr/bin/env python3
"""Run a prepared FMZ Python backtest task with the platform's own Python harness.

Called by backtest.js (part of the `fmz` skill); not meant to be run by hand:

    python3 backtest.py <harness.py> <task.json> <result.json>

The harness is the cloud backtest's (web_settings backtest_python): it downloads the native engine
library for this OS from the data server (/dist/depends/, cached in the temp dir) and runs the
task's Code entries. Its result frames ([u32 TaskStatus][u32 length][JSON]) normally go to the cloud
cluster over a socket; here a session object collects them. Progress goes to stderr as
"\\x1eFMZ <percent>" lines, the final result to <result.json>.
"""
import json
import os
import struct
import sys
import threading


class Session(object):
    def __init__(self, result_file):
        self.buf = b''
        self.result_file = result_file
        self.last = None
        self.stop = threading.Event()

    def sendall(self, data):
        self.buf += data
        while len(self.buf) >= 8:
            status, n = struct.unpack('!II', self.buf[:8])
            if len(self.buf) < 8 + n:
                break
            frame = self.buf[8:8 + n]
            self.buf = self.buf[8 + n:]
            try:
                st = json.loads(frame.decode('utf-8'))
            except ValueError:
                continue
            if status == 0:
                sys.stderr.write('\x1eFMZ %s\n' % st.get('Progress', 0))
                sys.stderr.flush()
            else:
                self.last = st
                self.save()

    send = sendall

    def save(self):
        tmp = self.result_file + '.tmp'
        with open(tmp, 'w') as f:
            json.dump(self.last, f)
        os.replace(tmp, self.result_file)

    # the harness waits on the socket for a "stop" command on Windows
    def settimeout(self, *args):
        pass

    def recv(self, n):
        self.stop.wait()
        return b''

    def shutdown(self, *args):
        self.stop.set()

    def close(self, *args):
        self.stop.set()


def main():
    if len(sys.argv) != 4:
        sys.stderr.write(__doc__)
        sys.exit(2)
    harness_file, task_file, result_file = sys.argv[1:4]
    with open(task_file) as f:
        task = json.load(f)
    with open(harness_file) as f:
        harness = f.read()
    if '__cfg__' not in harness:
        sys.stderr.write('not a backtest harness (no __cfg__ placeholder): %s\n' % harness_file)
        sys.exit(2)
    # same substitution the server does for the cloud run; the harness defines true/false/null
    code = harness.replace('__cfg__', json.dumps(task), 1).replace('\r\n', '\n')
    os.environ['TASK_UUID'] = 'dummy'
    session = Session(result_file)
    sys.argv = [harness_file]
    g = {'__name__': '__main__', '__file__': harness_file, 's': session}
    try:
        exec(compile(code, harness_file, 'exec'), g)
    except SystemExit:
        pass
    if session.last is None:
        sys.stderr.write('the engine ended without a result\n')
        sys.exit(1)


if __name__ == '__main__':
    main()
