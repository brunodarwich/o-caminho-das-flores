from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field, model_validator

class Panel(BaseModel):
    index: int = Field(..., description="Ordem sequencial do painel no capítulo")
    filename: str = Field(..., description="Nome do arquivo PNG do painel")
    path: str = Field(..., description="Caminho relativo da imagem")

class Chapter(BaseModel):
    id: int = Field(..., description="Identificador numérico do capítulo")
    title: str = Field(..., description="Título poético do capítulo")
    subtitle: str = Field(..., description="Resumo breve do enredo")
    folder: str = Field(..., description="Diretório onde as imagens estão armazenadas")
    prefix: str = Field(..., description="Prefixo dos arquivos de painel")
    panel_count: int = Field(..., description="Total de painéis no capítulo")
    logo_filename: str = Field(..., description="Nome da imagem da logo oficial do capítulo")
    panels: Optional[List[Panel]] = Field(default=None, description="Lista opcional de painéis")

class ChapterListResponse(BaseModel):
    total: int = Field(..., description="Total de capítulos disponíveis")
    items: List[Chapter] = Field(..., description="Lista de capítulos")

class PanelListResponse(BaseModel):
    chapter_id: int = Field(..., description="Identificador do capítulo")
    chapter_title: str = Field(..., description="Título do capítulo")
    total_panels: int = Field(..., description="Quantidade total de painéis")
    panels: List[Panel] = Field(..., description="Lista ordenada de painéis")

class WikiEntry(BaseModel):
    id: str = Field(..., description="Slug identificador único do verbete")
    name: str = Field(..., description="Nome do personagem, planta ou lugar")
    category: str = Field(..., description="Categoria (Personagens, Botânica, Lugares)")
    description: str = Field(..., description="Descrição detalhada e lore")
    image: str = Field(..., description="Caminho da imagem canônica de referência")
    image_position: Optional[str] = Field(default="50% 50%", description="Alinhamento CSS da imagem")
    tags: List[str] = Field(default_factory=list, description="Tags temáticas para busca")

class WikiListResponse(BaseModel):
    total: int = Field(..., description="Total de verbetes catalogados")
    categories: List[str] = Field(..., description="Lista de categorias disponíveis")
    items: List[WikiEntry] = Field(..., description="Lista de verbetes filtrados")

class TelemetryEvent(BaseModel):
    event_name: str = Field(..., description="Nome do evento (ex: reader_chapter_completed, puzzle_game_completed)")
    payload: Dict[str, Any] = Field(default_factory=dict, description="Dados do evento")
    timestamp: Optional[str] = Field(default=None, description="ISO timestamp do evento")

    @model_validator(mode="before")
    @classmethod
    def normalize_fields(cls, data: Any) -> Any:
        if isinstance(data, dict):
            if "event_name" not in data and "event_type" in data:
                data["event_name"] = data["event_type"]
            if "payload" not in data and "metadata" in data:
                data["payload"] = data["metadata"]
        return data

class TelemetryResponse(BaseModel):
    success: bool = True
    event_name: str
    recorded_at: str
