import chromadb
from chromadb.config import Settings

# Setup koneksi lokal dengan persistensi
client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet",
    persist_directory="./chroma_store"
))

# Buat atau ambil koleksi
def get_or_create_collection(name="docs"):
    return client.get_or_create_collection(name=name)

# Simpan embedding
def simpan_vektor(embedding, document, id):
    collection = get_or_create_collection()
    collection.add(
        documents=[document],
        embeddings=[embedding],
        ids=[id]
    )

# Query berdasarkan vektor
def query_vektor(embedding, top_k=3):
    collection = get_or_create_collection()
    results = collection.query(query_embeddings=[embedding], n_results=top_k)
    return results
