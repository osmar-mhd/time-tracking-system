import json
from collections import defaultdict
from datetime import datetime
import pandas as pd
import matplotlib.pyplot as plt

# Función para leer JSON desde un archivo
def cargar_json(archivo):
    try:
        with open(archivo, 'r') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: El archivo {archivo} no fue encontrado.")
        return None
    except json.JSONDecodeError:
        print(f"Error: El archivo {archivo} no es un JSON válido.")
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
def crear_dataframe(person_id, dias):
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

# Cargar los archivos JSON
ubicacion1 = cargar_json('zac.json')
ubicacion2 = cargar_json('sto.json')

if ubicacion1 is None or ubicacion2 is None:
    print("Error en la carga de archivos, terminando la ejecución.")
else:
    fechas_ubicacion1 = extraer_fechas_por_persona(ubicacion1['data']['records'], "Diet Zacatenco")
    fechas_ubicacion2 = extraer_fechas_por_persona(ubicacion2['data']['records'], "DIET Santo Tómas")
    
    dias_comunes_por_persona = defaultdict(set)

    for person_id in fechas_ubicacion1:
        if person_id in fechas_ubicacion2:
            dias_comunes = set(fechas_ubicacion1[person_id].keys()) & set(fechas_ubicacion2[person_id].keys())
            if dias_comunes:
                dias_comunes_por_persona[person_id].update(dias_comunes)

    # Generar PDF
    for person_id in dias_comunes_por_persona.keys():
        # Obtener el nombre de la persona
        nombre = fechas_ubicacion1[person_id][list(dias_comunes_por_persona[person_id])[0]][0]['nombre']  # Solo toma el nombre de la primera fecha
        
        # Crear PDF
        pdf_filename = f"resultados_checada_{nombre}_{person_id}.pdf"
        with plt.ioff():  # Desactivar modo interactivo para no mostrar figuras
            for dia in sorted(dias_comunes_por_persona[person_id]):
                # Crear DataFrame para el día actual
                data = crear_dataframe(person_id, {dia})
                
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
