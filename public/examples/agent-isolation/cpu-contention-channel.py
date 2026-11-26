#!/usr/bin/env python3
"""兩個行程只靠「搶同一顆 CPU」傳位元的玩具實驗（只用標準函式庫，Linux）。

發送端想傳 1：在這個位元時段內全速空轉；想傳 0：睡覺。
接收端：同一顆 CPU 上不停數自己的空轉迴圈跑了幾圈。發送端空轉時它分到的 CPU 時間變少，
圈數就少；發送端睡覺時圈數就多。

這是同一個作業系統內的兩個行程，並沒有跨過容器或虛擬機的邊界；它只示範
「共用資源的快慢可以當訊號」這件事，以及速度越快錯誤越多。

用法：python3 cpu-contention-channel.py [--bits 64] [--seed 1]
"""
import argparse
import multiprocessing as mp
import os
import random
import time

PREAMBLE = [1, 0] * 4  # 雙方事先約定：用來校準門檻


def pin_to_cpu(cpu):
    os.sched_setaffinity(0, {cpu})


def spin(deadline):
    n = 0
    while time.perf_counter() < deadline:
        n += 1
    return n


def sender(bits, start, period, cpu):
    pin_to_cpu(cpu)
    time.sleep(max(0.0, start - time.time()))
    t0 = time.perf_counter()
    for i, bit in enumerate(bits):
        end = t0 + (i + 1) * period
        if bit:
            spin(end)
        else:
            time.sleep(max(0.0, end - time.perf_counter()))


def receiver(n_bits, start, period, cpu, out):
    pin_to_cpu(cpu)
    time.sleep(max(0.0, start - time.time()))
    t0 = time.perf_counter()
    counts = []
    for i in range(n_bits):
        end = t0 + (i + 1) * period
        n = 0
        while True:
            # 每次只跑一小段，數「完成了幾小段」
            chunk_end = time.perf_counter() + 0.0005
            while time.perf_counter() < chunk_end:
                pass
            n += 1
            if time.perf_counter() >= end:
                break
        counts.append(n)
    out.put(counts)


def decode(counts):
    k = len(PREAMBLE)
    ones = [c for c, b in zip(counts[:k], PREAMBLE) if b]
    zeros = [c for c, b in zip(counts[:k], PREAMBLE) if not b]
    threshold = (sum(ones) / len(ones) + sum(zeros) / len(zeros)) / 2
    # 發送端空轉（1）時，接收端數到的圈數比較少
    return [1 if c < threshold else 0 for c in counts[k:]]


def run(n_payload, period, seed, cpu):
    rng = random.Random(seed)
    payload = [rng.randint(0, 1) for _ in range(n_payload)]
    frame = PREAMBLE + payload
    start = time.time() + 0.5
    q = mp.Queue()
    ps = mp.Process(target=sender, args=(frame, start, period, cpu))
    pr = mp.Process(target=receiver, args=(len(frame), start, period, cpu, q))
    pr.start()
    ps.start()
    counts = q.get()
    ps.join()
    pr.join()
    got = decode(counts)
    errors = sum(a != b for a, b in zip(payload, got))
    return errors, len(payload)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--bits", type=int, default=64)
    ap.add_argument("--seed", type=int, default=1)
    args = ap.parse_args()
    cpu = sorted(os.sched_getaffinity(0))[0]
    print(f"兩個行程都綁在 CPU {cpu}，每種速度傳 {args.bits} 位元")
    print(f"{'位元時段':>8} {'速度(bps)':>10} {'錯誤':>6}")
    for period in (0.2, 0.1, 0.05, 0.02, 0.01, 0.005):
        errors, total = run(args.bits, period, args.seed, cpu)
        print(f"{period * 1000:>6.0f}ms {1 / period:>10.0f} {errors:>3}/{total}")


if __name__ == "__main__":
    main()
