import json
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from app.models import WikiListResponse, WikiEntry

router = APIRouter(prefix="/api/wiki", tags=["Wiki & Enciclopédia"])

DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "wiki.json"

def load_wiki_data():
    if not DATA_PATH.exists():
        raise HTTPException(status_code=500, detail="Base de dados da Wiki não encontrada.")
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)

@router.get("", response_model=WikiListResponse)
def list_wiki_entries(
    category: Optional[str] = Query(None, description="Filtrar por categoria (Personagens, Botânica, Lugares)"),
    search: Optional[str] = Query(None, description="Termo de busca textual no nome, descrição ou tags")
):
    """Lista verbetes da Wiki com suporte a filtros de categoria e busca textual."""
    data = load_wiki_data()
    raw_entries = data.get("entries", [])
    
    categories = sorted(list({e["category"] for e in raw_entries}))
    
    filtered = raw_entries
    if category and category != "Todos":
        filtered = [e for e in filtered if e["category"].lower() == category.lower()]
        
    if search:
        s = search.lower().strip()
        filtered = [
            e for e in filtered
            if s in e["name"].lower()
            or s in e["description"].lower()
            or any(s in tag.lower() for tag in e.get("tags", []))
        ]
        
    items = [WikiEntry(**e) for e in filtered]
    return WikiListResponse(total=len(items), categories=categories, items=items)

@router.get("/{entry_id}", response_model=WikiEntry)
def get_wiki_entry(entry_id: str):
    """Busca ficha individual da Wiki pelo ID/slug."""
    data = load_wiki_data()
    raw_entries = data.get("entries", [])
    s = entry_id.lower().strip()
    for e in raw_entries:
        if e["id"].lower() == s or e["name"].lower() == s:
            return WikiEntry(**e)
    raise HTTPException(status_code=404, detail=f"Verbete '{entry_id}' não encontrado na Wiki.")
