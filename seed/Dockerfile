FROM python:3.7.3-slim

WORKDIR /app 

COPY requirements.txt ./

RUN buildDeps='gcc g++ libpq-dev ' \
    && apt-get update \
    && apt-get install -y $buildDeps\
    && pip3 install -r requirements.txt --no-cache-dir \
    && apt-get purge -y --auto-remove $buildDeps

COPY . . 

CMD ["python3", "main.py"]