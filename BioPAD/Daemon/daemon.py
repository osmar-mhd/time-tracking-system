import win32serviceutil
import win32service
import win32event
import logging
import time
import requests
import mysql.connector
from mysql.connector import Error

# Configuración de logging
logging.basicConfig(filename='C:\\ruta\\del\\log\\ChecadorService.log', level=logging.INFO, 
                    format='%(asctime)s %(message)s')

class ChecadorService(win32serviceutil.ServiceFramework):
    _svc_name_ = "ChecadorBioPAD"
    _svc_display_name_ = "Servicio de Checador BioPAD"
    _svc_description_ = "Realiza llamadas a API y guarda datos en MySQL."

    def __init__(self, args):
        super().__init__(args)
        self.hWaitStop = win32event.CreateEvent(None, 0, 0, None)
        self.is_running = True

    def SvcStop(self):
        self.ReportServiceStatus(win32service.SERVICE_STOP_PENDING)
        win32event.SetEvent(self.hWaitStop)
        self.is_running = False

    def SvcDoRun(self):
        self.main()

    def main(self):
        while self.is_running:
            try:
                # Llamada a la API
                response = requests.get("http://api-endpoint-url")
                if response.status_code == 200:
                    data = response.json()
                    self.save_to_database(data)
                else:
                    logging.error(f"Error en la API: {response.status_code}")
            except Exception as e:
                logging.error(f"Error en el servicio: {str(e)}")

            time.sleep(600)  # Espera de 10 minutos antes de la próxima llamada

    def save_to_database(self, data):
        try:
            connection = mysql.connector.connect(
                host="localhost",
                database="nombre_db",
                user="tu_usuario",
                password="tu_password"
            )
            cursor = connection.cursor()
            # Insertar los datos en la base de datos
            cursor.execute("INSERT INTO tu_tabla (campo1, campo2) VALUES (%s, %s)", 
                           (data['campo1'], data['campo2']))
            connection.commit()
        except Error as e:
            logging.error(f"Error de MySQL: {str(e)}")
        finally:
            if connection.is_connected():
                cursor.close()
                connection.close()