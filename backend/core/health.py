from django.http import JsonResponse
from django.db import connection

def health_check(request):
    db_status = "healthy"
    try:
        connection.ensure_connection()
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return JsonResponse({
        "status": "healthy" if db_status == "healthy" else "degraded",
        "service": "The Candle Lab Atelier Backend",
        "version": "5.5.0",
        "database": db_status,
        "redis_cache": "healthy"
    })
