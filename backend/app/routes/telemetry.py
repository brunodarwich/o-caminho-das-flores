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
    """Registra evento de leitura, quebra-cabeça, wiki ou navegação no arquivo de telemetria."""
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
            
            # Atualiza KPIs e Funil com métricas reais
            kpis = data.setdefault("kpis", {})
            funnel = data.setdefault("funnel", [])
            
            if event.event_name in ["reader_chapter_completed", "chapter_finished"]:
                current_act = kpis.get("activation_rate", 0.0)
                kpis["activation_rate"] = min(100.0, round(current_act + 1.0, 1))
                for step in funnel:
                    if "Ativação" in step.get("step", ""):
                        step["count"] = step.get("count", 0) + 1
            elif event.event_name in ["reader_chapter_started", "chapter_view"]:
                kpis["active_users_daily"] = kpis.get("active_users_daily", 0) + 1
                kpis["active_users_monthly"] = max(kpis["active_users_daily"], kpis.get("active_users_monthly", 0))
                for step in funnel:
                    if "Descoberta" in step.get("step", ""):
                        step["count"] = step.get("count", 0) + 1
            elif event.event_name in ["puzzle_game_started", "puzzle_game_completed", "wiki_entry_viewed", "share_button_clicked"]:
                if kpis.get("active_users_daily", 0) == 0:
                    kpis["active_users_daily"] = 1
                if kpis.get("active_users_monthly", 0) == 0:
                    kpis["active_users_monthly"] = 1

            # Recalcula conversões no funil se houver visitantes
            visitors = 0
            for step in funnel:
                if "Descoberta" in step.get("step", ""):
                    visitors = step.get("count", 0)
                    break
            
            if visitors > 0:
                for step in funnel:
                    cnt = step.get("count", 0)
                    step["conversion_percentage"] = round((cnt / visitors) * 100, 1)

            with open(ANALYTICS_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
                
            # Sincroniza analytics_data.js para leitura direta sem CORS
            with open(ANALYTICS_JS_PATH, "w", encoding="utf-8") as f:
                f.write(f"window.__ANALYTICS_DATA__ = {json.dumps(data, indent=2, ensure_ascii=False)};\n")
        except Exception:
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
