import requests
import json
from collections import defaultdict
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt

# Función para realizar una solicitud HTTP y cargar el JSON
def cargar_json_desde_url(url):
    try:
        response = requests.get(url)
        response.raise_for_status()  # Lanza una excepción si la respuesta no es exitosa
        data = response.json()
        # Verificar si 'data' y 'records' existen en el JSON
        if 'data' in data and 'records' in data['data']:
            return data['data']['records']
        else:
            print(f"Error: Estructura inesperada en los datos de la respuesta desde {url}")
            return None
    except requests.RequestException as e:
        print(f"Error al realizar la solicitud a {url}: {e}")
        return None

# Función para extraer fechas de checada por personId
def extraer_fechas_por_persona(records, ubicacion):
    fechas = defaultdict(lambda: defaultdict(list))  # Cambia a lista para incluir horas
    for record in records:
        # Convertir el tiempo de milisegundos a fecha y hora
        fecha_hora = datetime.fromtimestamp(record['time'] / 1000)
        fecha = fecha_hora.date()
        hora = fecha_hora.strftime("%H:%M:%S")  # Formato de hora
        person_id = record['personId']
        # Agregar la fecha, hora, nombre y ubicación
        fechas[person_id][fecha].append({
            'nombre': record['name'],
            'hora': hora,
            'ubicacion': ubicacion
        })
    return fechas

# Crear DataFrame de pandas para almacenar los datos
def crear_dataframe(person_id, dias, fechas_ubicacion1, fechas_ubicacion2):
    rows = []
    for dia in sorted(dias):
        # Agregar datos de la primera ubicación
        for registro in fechas_ubicacion1[person_id][dia]:
            rows.append({
                'Fecha': dia,
                'Nombre': registro['nombre'],
                'Hora': registro['hora'],
                'Ubicacion': registro['ubicacion']
            })
        # Agregar datos de la segunda ubicación
        for registro in fechas_ubicacion2[person_id][dia]:
            rows.append({
                'Fecha': dia,
                'Nombre': registro['nombre'],
                'Hora': registro['hora'],
                'Ubicacion': registro['ubicacion']
            })
    return pd.DataFrame(rows)

# Definir las URLs y las fechas de inicio y fin
startDate = '2023-10-01'
endDate = datetime.now().strftime('%Y-%m-%d')

url1 = f'http://148.204.9.88:8090/newFindRecords?pass=1208&personId=-1&startTime={startDate}%2000:01:00&endTime={endDate}%2023:59:59&length=1000&model=-1&order=1&index=0'
url2 = f'http://148.204.148.124:8090/newFindRecords?pass=1409&personId=-1&startTime={startDate}%2000:01:00&endTime={endDate}%2023:59:59&length=1000&model=-1&order=1&index=0'

# Cargar datos desde las URLs
ubicacion1_records = cargar_json_desde_url(url1)
ubicacion2_records = cargar_json_desde_url(url2)

if ubicacion1_records is None or ubicacion2_records is None:
    print("Error en la carga de datos desde las URLs, terminando la ejecución.")
else:
    fechas_ubicacion1 = extraer_fechas_por_persona(ubicacion1_records, "Diet Zacatenco")
    fechas_ubicacion2 = extraer_fechas_por_persona(ubicacion2_records, "DIET Santo Tomás")
    
    dias_comunes_por_persona = defaultdict(set)

    # Identificar días comunes en ambas ubicaciones
    for person_id in fechas_ubicacion1:
        if person_id in fechas_ubicacion2:
            dias_comunes = set(fechas_ubicacion1[person_id].keys()) & set(fechas_ubicacion2[person_id].keys())
            if dias_comunes:
                dias_comunes_por_persona[person_id].update(dias_comunes)

    # Lista de nombres a filtrar
    nombres_a_filtrar = {'Edgar', 'Germán', 'Víctor', 'Jessica', 'Tere', 'Gerardo'}

    # Generar PDF para cada persona que esté en la lista de nombres a filtrar
    for person_id in dias_comunes_por_persona.keys():
        # Obtener el nombre de la persona
        nombre = fechas_ubicacion1[person_id][list(dias_comunes_por_persona[person_id])[0]][0]['nombre']  # Solo toma el nombre de la primera fecha
        
        # Verificar si el nombre está en la lista de nombres a filtrar
        if nombre in nombres_a_filtrar:
            # Crear PDF
            pdf_filename = f"resultados_checada_{nombre}_{person_id}.pdf"
            with plt.ioff():  # Desactivar modo interactivo para no mostrar figuras
                for dia in sorted(dias_comunes_por_persona[person_id]):
                    # Crear DataFrame para el día actual
                    data = crear_dataframe(person_id, {dia}, fechas_ubicacion1, fechas_ubicacion2)
                    
                    # Crear figura
                    fig, ax = plt.subplots(figsize=(12, 6))
                    ax.axis('tight')
                    ax.axis('off')

                    # Título con el nombre y la fecha
                    ax.set_title(f"{nombre} - {dia}", fontsize=14, fontweight='bold')

                    # Crear tabla
                    table_data = [data.columns.tolist()] + data.values.tolist()
                    ax.table(cellText=table_data, colLabels=None, cellLoc='center', loc='center')

                    # Guardar el contenido en un archivo temporal y luego añadir al PDF
                    plt.savefig(pdf_filename, bbox_inches='tight', dpi=300, facecolor='w', edgecolor='w')  # Establecer fondo blanco
                    plt.clf()  # Limpiar la figura para la próxima tabla

            print(f"PDF generado exitosamente: {pdf_filename}")
