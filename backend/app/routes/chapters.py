import json
from pathlib import Path
from fastapi import APIRouter, HTTPException
from app.models import ChapterListResponse, Chapter, PanelListResponse

router = APIRouter(prefix="/api/chapters", tags=["Capítulos"])

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "chapters.json"

def load_chapters_data():
    if not DATA_PATH.exists():
        raise HTTPException(status_code=500, detail="Base de dados de capítulos não encontrada.")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", response_model=ChapterListResponse)
def list_chapters():
    """Retorna a lista de capítulos disponíveis na plataforma com seus metadados."""
    data = load_chapters_data()
    chapters = [
        Chapter(
            id=c["id"],
            title=c["title"],
            subtitle=c["subtitle"],
            folder=c["folder"],
            prefix=c["prefix"],
            panel_count=c["panel_count"],
            logo_filename=c["logo_filename"]
        )
        for c in data["chapters"]
    ]
    return ChapterListResponse(total=len(chapters), items=chapters)

@router.get("/{chapter_id}", response_model=Chapter)
def get_chapter(chapter_id: int):
    """Retorna detalhes e metadados completos de um capítulo específico."""
    data = load_chapters_data()
    for c in data["chapters"]:
        if c["id"] == chapter_id:
            return Chapter(**c)
    raise HTTPException(status_code=404, detail=f"Capítulo {chapter_id} não encontrado.")

@router.get("/{chapter_id}/panels", response_model=PanelListResponse)
def list_chapter_panels(chapter_id: int):
    """Retorna a lista ordenada dos painéis em imagem para leitura contínua (zero-gap)."""
    data = load_chapters_data()
    for c in data["chapters"]:
        if c["id"] == chapter_id:
            return PanelListResponse(
                chapter_id=c["id"],
                chapter_title=c["title"],
                total_panels=len(c["panels"]),
                panels=c["panels"]
            )
    raise HTTPException(status_code=404, detail=f"Capítulo {chapter_id} não encontrado.")
