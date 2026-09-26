from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.chapters import router as chapters_router
from app.routes.wiki import router as wiki_router
from app.routes.telemetry import router as telemetry_router

app = FastAPI(
    title="O Caminho das Flores — API",
    description="Backend oficial da plataforma da webtoon 'O Caminho das Flores'. Serve metadados de capítulos para o leitor contínuo seam-free, enciclopédia interativa (Wiki) e telemetria de eventos.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configuração de CORS para permitir requisições de qualquer origem local (Vite, HTTP Server, file://)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusão dos roteadores de API
app.include_router(chapters_router)
app.include_router(wiki_router)
app.include_router(telemetry_router)

# Montagem de arquivos estáticos das imagens dos capítulos
ROOT_DIR = Path(__file__).resolve().parent.parent.parent
cap1_dir = ROOT_DIR / "capitulo-01"
cap2_dir = ROOT_DIR / "capitulo-02"

if cap1_dir.exists():
    app.mount("/media/capitulo-01", StaticFiles(directory=str(cap1_dir)), name="capitulo-01")
if cap2_dir.exists():
    app.mount("/media/capitulo-02", StaticFiles(directory=str(cap2_dir)), name="capitulo-02")

@app.get("/", tags=["Saúde"])
def root():
    return {
        "name": "O Caminho das Flores — API",
        "version": "1.0.0",
        "status": "online",
        "docs": "/docs",
        "endpoints": [
            "/api/chapters",
            "/api/chapters/{id}",
            "/api/chapters/{id}/panels",
            "/api/wiki",
            "/api/wiki/{id}",
            "/api/telemetry"
        ]
    }

@app.get("/api/health", tags=["Saúde"])
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
