﻿// Dos servicios,
// Actualizar el tiempo
// Generar un Trigger
// Josue peñaloza 
// psico smart
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Threading;
using System.Text;
using System.Threading.Tasks;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Globalization;
using MySql.Data.MySqlClient;

namespace ChecadorServiceBPLT
{
    public partial class GetRecords : ServiceBase
    {
        private static System.Timers.Timer mTimer;
        private static System.Timers.Timer mTimer2;
        private static TimerCallback mTimerCallback;

        public GetRecords()
        {
            InitializeComponent();
        }

        protected override void OnStart(string[] args)
        {
            base.OnStart(args);
            DateTime today = DateTime.Today.AddHours(22).AddMinutes(10);
            DateTime morning = DateTime.Today.AddHours(11).AddMinutes(20);

            mTimer = new System.Timers.Timer();
            mTimer2 = new System.Timers.Timer();

            mTimer.Enabled = true;
            mTimer.Interval = today.Subtract(DateTime.Now).TotalSeconds * 1000;
            mTimer.Elapsed += new System.Timers.ElapsedEventHandler(MTimer_Elapsed);
            Log("Timer 1 iniciado", DateTime.Now);
           /* mTimer2.Enabled = true;
            mTimer2.Interval = morning.Subtract(DateTime.Now).TotalSeconds * 1000;
            mTimer2.Elapsed += new System.Timers.ElapsedEventHandler(MTimer_Elapsed2);*/
            Log("Timer 2 iniciado", DateTime.Now);
            Log("Servicios iniciados", DateTime.Now);
        }

        private void MTimer_Elapsed(object sender, System.Timers.ElapsedEventArgs e)
        {
            UpdateInfo(sender);
            if (mTimer.Interval != 24 * 60 * 60 * 1000)
            {
                mTimer.Interval = 24 * 60 * 60 * 1000;
            }
        }

        private void MTimer_Elapsed2(object sender, System.Timers.ElapsedEventArgs e)
        {
            UpdateInfo(sender);
            if (mTimer2.Interval != 24 * 60 * 60 * 1000)
            {
                mTimer2.Interval = 24 * 60 * 60 * 1000;
            }
        }
        protected override void OnStop()
        {
            base.OnStop();
        }

        private static void UpdateInfo(object o)
        {
            RunAsyncZac().GetAwaiter().GetResult();
            RunAsyncSto().GetAwaiter().GetResult();
        }

        static async Task RunAsyncZac()
        {
            HttpClient client = new HttpClient();
            InterfaceResultModel result = null;
            RecordsDataModel resultData = null;

            DateTime from = DateTime.Now;
            if (from.Hour < 12) {
                from = DateTime.Today.AddHours(6);
            }
            else
            {
                from = DateTime.Today.AddHours(12);
            }
            List<KeyValuePair<string, string>> list = new List<KeyValuePair<string, string>>();
            list.Add(new KeyValuePair<string, string>("pass", "1409"));
            list.Add(new KeyValuePair<string, string>("personId", "-1"));
            list.Add(new KeyValuePair<string, string>("startTime", from.ToString("yyyy-MM-dd 00:01:00")));
            list.Add(new KeyValuePair<string, string>("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:00:00")));
            list.Add(new KeyValuePair<string, string>("length", "100"));
            list.Add(new KeyValuePair<string, string>("model", "8"));
            list.Add(new KeyValuePair<string, string>("order", "1"));

            client.BaseAddress = new Uri("http://148.204.9.88:8090/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

            string parameters = string.Format("?pass={0}&personId={1}&startTime={2}&endTime={3}&length={4}&model=-1&order=1&index=0", list[0].Value, list[1].Value, list[2].Value, list[3].Value, 1000);
            Task<HttpResponseMessage> response = client.GetAsync("newFindRecords" + parameters);
            HttpResponseMessage responseMessage = null;
            response.Wait();
            if (response.IsCompleted)
            {
                responseMessage = response.Result;
                if (responseMessage.StatusCode == HttpStatusCode.OK)
                {
                    result = JsonConvert.DeserializeObject<InterfaceResultModel>(responseMessage.Content.ReadAsStringAsync().Result);
                    Console.WriteLine(result.msg.ToString(), string.Format("Code: {0}", result.code.ToString()));
                    if (result.data != null)
                    {
                        resultData = JsonConvert.DeserializeObject<RecordsDataModel>(result.data.ToString());
                        SaveData(resultData.records);
                        Log("Datos  de Zac obtenidos", DateTime.Now);
                    }
                    else
                    {
                        Log("Error al obtener Datos", DateTime.Now);
                    }
                }
                else
                {
                    throw new Exception(String.Format("Error al consumir la API, Status : {0}", responseMessage.StatusCode.ToString()));
                }
            }
        }
        ///Sacar tabla , hacer copia, quitar teperaturas, hora de entrada, 
        static async Task RunAsyncSto()
        {
            HttpClient client = new HttpClient();
            InterfaceResultModel result = null;
            RecordsDataModel resultData = null;

            DateTime from = DateTime.Now;
            if (from.Hour < 12)
            {
                from = DateTime.Today.AddHours(6);
            }
            else
            {
                from = DateTime.Today.AddHours(12);
            }

            List<KeyValuePair<string, string>> list = new List<KeyValuePair<string, string>>();
            list.Add(new KeyValuePair<string, string>("pass", "1409"));
            list.Add(new KeyValuePair<string, string>("personId", "-1"));
            list.Add(new KeyValuePair<string, string>("startTime", from.ToString("yyyy-MM-dd HH:mm:ss")));
            list.Add(new KeyValuePair<string, string>("endTime", DateTime.Now.ToString("yyyy-MM-dd 23:00:00")));
            list.Add(new KeyValuePair<string, string>("length", "100"));
            list.Add(new KeyValuePair<string, string>("model", "8"));
            list.Add(new KeyValuePair<string, string>("order", "1"));

            client.BaseAddress = new Uri("http://148.204.148.124:8090/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

            string parameters = string.Format("?pass={0}&personId={1}&startTime={2}&endTime={3}&length={4}&model=-1&order=1&index=0", list[0].Value, list[1].Value, list[2].Value, list[3].Value, 1000);
            Task<HttpResponseMessage> response = client.GetAsync("newFindRecords" + parameters);
            HttpResponseMessage responseMessage = null;
            response.Wait();
            if (response.IsCompleted)
            {
                responseMessage = response.Result;
                if (responseMessage.StatusCode == HttpStatusCode.OK)
                {
                    result = JsonConvert.DeserializeObject<InterfaceResultModel>(responseMessage.Content.ReadAsStringAsync().Result);
                    Console.WriteLine(result.msg.ToString(), string.Format("Code: {0}", result.code.ToString()));
                    if (result.data != null)
                    {
                        resultData = JsonConvert.DeserializeObject<RecordsDataModel>(result.data.ToString());
                        SaveData(resultData.records);
                        Log("Datos  de Sto obtenidos", DateTime.Now);
                    }
                    else
                    {
                        Log("Error al obtener Datos", DateTime.Now);
                    }
                }
                else
                {
                    throw new Exception(String.Format("Error al consumir la API, Status : {0}", responseMessage.StatusCode.ToString()));
                }
            }
        }

        static void SaveData(List<RecordsRegisterModel> data)
        {
            /*MySQL para poder guardar la informaci{on*/
            try
            {
                for (int i = 0; i < data.Count; i++)
                {
                    if (data[i].personId != "NOMASK" && data[i].personId != "STRANGERBABY" && data[i].personId != "")
                    {
                        using (MySqlConnection conn = new MySqlConnection("server=148.204.148.99;User Id=root;password=Pollito;database=checador;CheckParameters=False;"))
                        {
                            MySqlCommand cmd = new MySqlCommand("spInsertarAsistenciaSinRepeticion", conn);
                            conn.Open();
                            cmd.CommandType = CommandType.StoredProcedure;
                            cmd.Parameters.Clear();

                            try
                            {
                                long ticks = data[i].time;
                                DateTime date = DateTimeOffset.FromUnixTimeMilliseconds(ticks).DateTime;
                                DateTime dateReal = date.ToLocalTime();
                                bool isDaylight = TimeZoneInfo.Local.IsDaylightSavingTime(dateReal);

                                if (isDaylight)
                                    dateReal = dateReal.AddHours(-1);
                                MySqlParameter[] parameters = { new MySqlParameter("p_idUsuario", data[i].personId), new MySqlParameter("", dateReal.ToString("yyyy-MM-dd HH:mm:ss")) };
                                cmd.Parameters.AddRange(parameters);

                                cmd.ExecuteNonQuery();
                                cmd.Parameters.Clear();
                            }
                            catch (Exception ex)
                            {
                                Log("Error: " + ex.Message, DateTime.Now);
                                continue;
                            }
                            conn.Close();
                        }
                    }

                }
            }
            catch (Exception ex)
            {
                Log("Error: " + ex.Message, DateTime.Now);
                throw;
            }
        }

        static void Log(string message, DateTime stamp)
        {
            try
            {
                System.IO.StreamWriter fs = new System.IO.StreamWriter("C:\\logChecador.txt",true);
                fs.WriteLine(stamp.ToString("yyyy-MM-dd HH:mm:ss") + message);
                fs.Close();
            }
            catch (Exception)
            {
                throw;
            }
        }
    }
}