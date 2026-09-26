import json
from datetime import datetime, timezone
from pathlib import Path
from fastapi import APIRouter
from app.models import TelemetryEvent, TelemetryResponse

router = APIRouter(prefix="/api/telemetry", tags=["Telemetria & Analytics"])

ANALYTICS_PATH = Path(__file__).resolve().parent.parent.parent.parent / "analytics.json"
ANALYTICS_JS_PATH = Path(__file__).resolve().parent.parent.parent.parent / "analytics_data.js"

@router.post("", response_model=TelemetryResponse)
def record_event(event: TelemetryEvent):
    """Registra evento de leitura, quebra-cabeça ou navegação no arquivo de telemetria."""
    now_iso = datetime.now(timezone.utc).isoformat()
    recorded_at = event.timestamp or now_iso
    
    event_entry = {
        "event_name": event.event_name,
        "payload": event.payload,
        "recorded_at": recorded_at
    }
    
    if ANALYTICS_PATH.exists():
        try:
            with open(ANALYTICS_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            
            # Atualiza lista de eventos recentes (limite 50)
            if "recent_events" not in data:
                data["recent_events"] = []
            data["recent_events"].insert(0, event_entry)
            data["recent_events"] = data["recent_events"][:50]
            data["project"]["last_updated"] = datetime.now(timezone.utc).strftime("%Y-%m-%d")
            
            # Atualiza contadores simples se aplicável
            kpis = data.get("kpis", {})
            if event.event_name == "chapter_finished":
                kpis["activation_rate"] = min(100.0, kpis.get("activation_rate", 0) + 1.0)
            
            with open(ANALYTICS_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                
            # Sincroniza analytics_data.js para leitura direta sem CORS
            with open(ANALYTICS_JS_PATH, "w", encoding="utf-8") as f:
                f.write(f"window.__ANALYTICS_DATA__ = {json.dumps(data, indent=2, ensure_ascii=False)};\n")
        except Exception as e:
            # Falha silenciosa de escrita para manter resiliência
            pass
            
    return TelemetryResponse(
        success=True,
        event_name=event.event_name,
        recorded_at=recorded_at
    )

@router.get("/summary")
def get_telemetry_summary():
    """Retorna dados agregados de telemetria."""
    if ANALYTICS_PATH.exists():
        with open(ANALYTICS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"status": "empty", "message": "Nenhum dado de telemetria coletado ainda."}
