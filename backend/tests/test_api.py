import pytest
from fastapi.testclient import TestClient
import sys
from pathlib import Path

# Adiciona o diretório do backend ao sys.path para importação correta
BACKEND_DIR = Path(__file__).resolve().parent.parent
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

from app.main import app

client = TestClient(app)

def test_root_and_health():
    res = client.get("/")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "online"
    assert "endpoints" in data

    res_health = client.get("/api/health")
    assert res_health.status_code == 200
    assert res_health.json()["status"] == "healthy"

def test_list_chapters():
    res = client.get("/api/chapters")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2
    titles = [c["title"] for c in data["items"]]
    assert "Céu Azul" in titles
    assert "A Vizinha" in titles

def test_get_chapter_details():
    res = client.get("/api/chapters/1")
    assert res.status_code == 200
    c1 = res.json()
    assert c1["id"] == 1
    assert c1["title"] == "Céu Azul"
    assert c1["panel_count"] == 20

    res = client.get("/api/chapters/2")
    assert res.status_code == 200
    c2 = res.json()
    assert c2["id"] == 2
    assert c2["title"] == "A Vizinha"
    assert c2["panel_count"] == 36

    res_404 = client.get("/api/chapters/999")
    assert res_404.status_code == 404

def test_chapter_panels_order():
    res = client.get("/api/chapters/1/panels")
    assert res.status_code == 200
    data = res.json()
    assert data["chapter_id"] == 1
    assert data["total_panels"] == 20
    assert len(data["panels"]) == 20
    assert data["panels"][0]["index"] == 1
    assert data["panels"][0]["filename"] == "c1-p (1).png"
    assert data["panels"][19]["index"] == 20
    assert data["panels"][19]["filename"] == "c1-p (20).png"

    res2 = client.get("/api/chapters/2/panels")
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["chapter_id"] == 2
    assert data2["total_panels"] == 36
    assert data2["panels"][35]["index"] == 36
    assert data2["panels"][35]["filename"] == "c2-p (36).png"

def test_wiki_list_and_categories():
    res = client.get("/api/wiki")
    assert res.status_code == 200
    data = res.json()
    assert data["total"] >= 20
    assert "Personagens" in data["categories"]
    assert "Botânica" in data["categories"]
    assert "Lugares" in data["categories"]

def test_wiki_filter_category():
    res = client.get("/api/wiki?category=Botânica")
    assert res.status_code == 200
    data = res.json()
    assert all(e["category"] == "Botânica" for e in data["items"])
    names = [e["name"] for e in data["items"]]
    assert "Flor do Luar" in names

def test_wiki_search():
    res = client.get("/api/wiki?search=Ariel")
    assert res.status_code == 200
    data = res.json()
    assert any("Ariel" in e["name"] for e in data["items"])

def test_wiki_entry_by_id():
    res = client.get("/api/wiki/ariel")
    assert res.status_code == 200
    entry = res.json()
    assert entry["name"] == "Ariel"
    assert entry["category"] == "Personagens"

    res_404 = client.get("/api/wiki/inexistente")
    assert res_404.status_code == 404

def test_telemetry_event():
    payload = {
        "event_name": "chapter_finished",
        "payload": {"chapter_id": 1, "read_time_seconds": 120}
    }
    res = client.post("/api/telemetry", json=payload)
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert data["event_name"] == "chapter_finished"
    assert "recorded_at" in data

def test_static_media_mount():
    res = client.get("/media/capitulo-01/Logo%20-%20Cap%C3%ADtulo%2001.png")
    assert res.status_code == 200
    assert "image/png" in res.headers.get("content-type", "")
