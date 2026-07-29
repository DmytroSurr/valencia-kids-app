"""
Generates real Valencian-accent audio for every word/phrase in data/lessons.json
using the free Projecte Aina Matxa-TTS space (non-commercial use, GPL-3.0 model,
see https://huggingface.co/projecte-aina/matxa-tts-cat-multiaccent).

Talks to the space directly over HTTP (Gradio's "call API" pattern), instead of
using the gradio_client package, because gradio_client's automatic API-info
lookup fails against this particular (Docker-based) space.

Usage:
    pip3 install requests
    python3 tools/generate_valencian_audio.py

Safe to re-run: already-generated files are skipped, so if the space times out
partway through you can just run it again.
"""

import json
import os
import re
import time
import unicodedata

import requests

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LESSONS_PATH = os.path.join(REPO_ROOT, "data", "lessons.json")
AUDIO_DIR = os.path.join(REPO_ROOT, "audio")

SPACE_HOST = "https://projecte-aina-matxa-alvocat-tts-ca.hf.space"
CALL_PATH_CANDIDATES = ["/call/predict", "/gradio_api/call/predict"]
ACCENT = "valencia"
SPEAKER = "lluc"  # or "gina" for the female Valencian voice

# Get a free token at https://huggingface.co/settings/tokens (Read access is enough)
# and either set the HF_TOKEN environment variable, or paste it directly below.
HF_TOKEN = os.environ.get("HF_TOKEN", "")


def auth_headers():
    return {"Authorization": f"Bearer {HF_TOKEN}"} if HF_TOKEN else {}


def slugify(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^a-zA-Z0-9]+", "_", text).strip("_").lower()
    return text or "item"


def start_job(text, accent, spk_name, temperature, length_scale):
    payload = {"data": [text, accent, spk_name, temperature, length_scale]}
    last_err = None
    for path in CALL_PATH_CANDIDATES:
        url = SPACE_HOST + path
        try:
            r = requests.post(url, json=payload, headers=auth_headers(), timeout=30)
            if r.status_code == 200 and "event_id" in r.json():
                return url, r.json()["event_id"]
            last_err = f"{r.status_code}: {r.text[:200]}"
        except Exception as e:
            last_err = str(e)
    raise RuntimeError(f"Could not start job on any known endpoint: {last_err}")


def poll_result(call_url, event_id, debug=False):
    result_url = f"{call_url}/{event_id}"
    raw_lines_seen = []
    with requests.get(result_url, stream=True, headers=auth_headers(), timeout=180) as resp:
        resp.raise_for_status()
        current_event = None
        for raw_line in resp.iter_lines(decode_unicode=True):
            if not raw_line:
                continue
            raw_lines_seen.append(raw_line)
            if raw_line.startswith("event:"):
                current_event = raw_line[len("event:"):].strip()
                continue
            if raw_line.startswith("data:"):
                data_str = raw_line[len("data:"):].strip()
                if current_event == "error":
                    if debug:
                        print("  --- full SSE stream (debug) ---")
                        for l in raw_lines_seen:
                            print("   ", l)
                        print("  --- end debug ---")
                    raise RuntimeError(f"space returned error: {data_str}")
                if current_event == "complete":
                    return json.loads(data_str)
    raise RuntimeError("stream ended without a complete event")


def synthesize(text, accent=ACCENT, spk_name=SPEAKER, temperature=0.2, length_scale=0.89, debug=False):
    call_url, event_id = start_job(text, accent, spk_name, temperature, length_scale)
    outputs = poll_result(call_url, event_id, debug=debug)
    file_info = outputs[0]
    file_url = file_info.get("url")
    if not file_url:
        path = file_info.get("path")
        file_url = f"{SPACE_HOST}/file={path}"
    audio_resp = requests.get(file_url, headers=auth_headers(), timeout=60)
    audio_resp.raise_for_status()
    return audio_resp.content


def main():
    os.makedirs(AUDIO_DIR, exist_ok=True)
    with open(LESSONS_PATH, encoding="utf-8") as f:
        data = json.load(f)

    lessons_data = data["lessons_data"]
    total = sum(len(words) for words in lessons_data.values())
    done = 0
    failed = []
    debug_shown = [False]

    if not HF_TOKEN:
        print("WARNING: no HF_TOKEN set (export HF_TOKEN=hf_xxx before running).")
        print("This space requires a free Hugging Face account token to allocate GPU time.\n")

    for topic, words in lessons_data.items():
        for entry in words:
            done += 1
            slug = slugify(entry["va"])
            filename = f"{topic}_{slug}.wav"
            dest_path = os.path.join(AUDIO_DIR, filename)
            rel_path = f"audio/{filename}"

            if os.path.exists(dest_path):
                entry["audio"] = rel_path
                print(f"[{done}/{total}] skip (already exists): {filename}")
                continue

            print(f"[{done}/{total}] generating: {entry['va']!r}")
            audio_bytes = None
            for attempt in range(3):
                try:
                    audio_bytes = synthesize(entry["va"], debug=not debug_shown[0])
                    break
                except Exception as e:
                    print(f"  attempt {attempt + 1} failed: {e}")
                    debug_shown[0] = True
                    time.sleep(3)

            if audio_bytes is None:
                print(f"  FAILED after 3 attempts, skipping {entry['va']!r}")
                failed.append(entry["va"])
                continue

            with open(dest_path, "wb") as dst:
                dst.write(audio_bytes)
            entry["audio"] = rel_path
            time.sleep(0.5)

    with open(LESSONS_PATH, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print("\nDone. lessons.json updated with audio paths.")
    if failed:
        print(f"{len(failed)} item(s) failed, re-run the script to retry them:")
        for text in failed:
            print(f"  - {text}")


if __name__ == "__main__":
    main()
