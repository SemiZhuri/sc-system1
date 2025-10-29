from fastapi import FastAPI
from database import Base, engine
import endpoints # Import the endpoints module
from fastapi.middleware.cors import CORSMiddleware # Import CORS middleware

Base.metadata.create_all(bind=engine)

app = FastAPI()

# Define allowed origins for CORS
origins = [
    "http://localhost:3000",
]

# Add CORS middleware to the application
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the router from the endpoints module
app.include_router(endpoints.router)

@app.get("/")
def read_root():
    return {"message": "Hello, Cognyss Portal lives."}