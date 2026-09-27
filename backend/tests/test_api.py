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
    assert c1["panel_count"] == 19

    res = client.get("/api/chapters/2")
    assert res.status_code == 200
    c2 = res.json()
    assert c2["id"] == 2
    assert c2["title"] == "A Vizinha"
    assert c2["panel_count"] == 38

    res_404 = client.get("/api/chapters/999")
    assert res_404.status_code == 404

def test_chapter_panels_order():
    res = client.get("/api/chapters/1/panels")
    assert res.status_code == 200
    data = res.json()
    assert data["chapter_id"] == 1
    assert data["total_panels"] == 19
    assert len(data["panels"]) == 19
    assert data["panels"][0]["index"] == 1
    assert data["panels"][0]["filename"] == "cap-01 (1).png"
    assert data["panels"][18]["index"] == 19
    assert data["panels"][18]["filename"] == "cap-01 (19).png"

    res2 = client.get("/api/chapters/2/panels")
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["chapter_id"] == 2
    assert data2["total_panels"] == 38
    assert data2["panels"][37]["index"] == 38
    assert data2["panels"][37]["filename"] == "cap-02 (38).png"

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

def test_telemetry_prd_events():
    # Teste de início e conclusão de leitura
    res_start = client.post("/api/telemetry", json={
        "event_name": "reader_chapter_started",
        "payload": {"chapter_id": 1, "chapter_title": "Céu Azul"}
    })
    assert res_start.status_code == 200
    assert res_start.json()["event_name"] == "reader_chapter_started"

    res_comp = client.post("/api/telemetry", json={
        "event_name": "reader_chapter_completed",
        "payload": {"chapter_id": 1, "time_spent_seconds": 95}
    })
    assert res_comp.status_code == 200
    assert res_comp.json()["event_name"] == "reader_chapter_completed"

    # Teste de puzzle
    res_puzzle = client.post("/api/telemetry", json={
        "event_name": "puzzle_game_completed",
        "payload": {"image_id": "fruto_da_luz", "difficulty_level": "facil", "elapsed_seconds": 45}
    })
    assert res_puzzle.status_code == 200
    assert res_puzzle.json()["event_name"] == "puzzle_game_completed"

    # Teste de alias compatibilidade (event_type e metadata)
    res_alias = client.post("/api/telemetry", json={
        "event_type": "wiki_entry_viewed",
        "metadata": {"entry_id": "ariel", "category": "Personagens"}
    })
    assert res_alias.status_code == 200
    assert res_alias.json()["event_name"] == "wiki_entry_viewed"

    # Teste do endpoint de sumário
    res_summary = client.get("/api/telemetry/summary")
    assert res_summary.status_code == 200
    summary_data = res_summary.json()
    assert "recent_events" in summary_data or "status" in summary_data

def test_static_media_mount():
    res = client.get("/media/capitulo-01/Logo%20-%20Cap%C3%ADtulo%2001.png")
    assert res.status_code == 200
    assert "image/png" in res.headers.get("content-type", "")
