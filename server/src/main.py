"""Entry point for the server. You can run this file directly to start the server locally."""

from os import environ
from typing import List

import uvicorn
from fastapi import FastAPI, File, Response, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from handlers import calendar_handler, file_handler, openai_handler, xlsx_handler
from mangum import Mangum

IS_IN_PROD = "LAMBDA_TASK_ROOT" in dict(environ)

app = FastAPI(
    title="Lifeline Server",
    description="Server for the Lifeline project",
    version="0.1.0",
    docs_url="/docs" if not IS_IN_PROD else None,
    redoc_url="/redoc" if not IS_IN_PROD else None,
)
handler = Mangum(app)  # required for AWS Lambda


origins = (
    ["https://lifeline.techstartucalgary.com"]
    if IS_IN_PROD
    else ["http://localhost:3000", "http://127.0.0.1:3000"]
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/test-calendar-json")
async def show_calendar():
    """sends a test json to client"""
    return calendar_handler.get_calendar_json()


@app.post("/files", status_code=200)
async def get_deadlines(response: Response, outline_file: UploadFile = File(...)):
    """Returns the extracted dates and info from the uploaded file"""
    return file_handler.handle_file(outline_file, response)


@app.post("/premium-files", status_code=200)
async def premium_get_deadlines(response: Response, outline_file: UploadFile = File(...)):
    """Returns the extracted dates and info from the uploaded file, uses the openai api"""
    return openai_handler.get_deadlines(outline_file, response)


@app.post("/xlsx")
async def get_xlsx(semester: List[dict]):
    """Takes as input an array of JSON objects, each containing a course code and list
    of assessments like in ./data/calendar.json.
    Returns an XLSX file which is a to-do list for the assessments"""
    return xlsx_handler.get_xlsx_file(semester)


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
