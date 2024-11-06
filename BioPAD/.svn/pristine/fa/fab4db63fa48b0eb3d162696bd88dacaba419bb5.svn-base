using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using MySql.Data.MySqlClient;
using System.Diagnostics;
using System.ServiceProcess;
using System.Threading;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Globalization;
using ChecadorServiceBPLT;

namespace ManualRegister
{
    public partial class Form1 : Form
    {
        public RecordsDataModel dataZac;
        public RecordsDataModel dataSto;
        public Form1()
        {
            InitializeComponent();
        }

        private void Form1_Load(object sender, EventArgs e)
        {
            using (MySqlConnection conn = new MySqlConnection("server=148.204.148.99;User Id=root;password=Pollito;database=checador;CheckParameters=False;"))
            {
                try
                {
                    MySqlCommand cmd = new MySqlCommand("spObtenerUsuariosInfo", conn);
                    cmd.CommandType = CommandType.StoredProcedure;
                    conn.Open();
                    MySqlDataReader mySqlDataReader = cmd.ExecuteReader();
                    if (mySqlDataReader != null && mySqlDataReader.HasRows)
                    {
                        DataTable dt = new DataTable();
                        dt.Load(mySqlDataReader);
                        DataRow dataRow = dt.NewRow();
                        dataRow["ID"] = "-1";
                        dataRow["IDPersona"] = "-1";
                        dataRow["tipo"] = "-1";
                        dataRow["fullName"] = "----Todos----";
                        dt.Rows.Add(dataRow);
                        employSelect.DataSource = dt;
                        employSelect.DisplayMember = "fullName";
                        employSelect.ValueMember = "ID";

                    }
                }
                catch (Exception ex)
                {
                    MessageBox.Show(ex.Message);
                    throw;
                }
            }
        }

        async Task GetInformationSto()
        {
            HttpClient client = new HttpClient();
            InterfaceResultModel result = null;
            RecordsDataModel resultData = null;

            DateTime from = fromDate.Value;
            DateTime to = toDate.Value;

            List<KeyValuePair<string, string>> list = new List<KeyValuePair<string, string>>();
            list.Add(new KeyValuePair<string, string>("pass", "1409"));
            list.Add(new KeyValuePair<string, string>("personId", employSelect.SelectedValue.ToString()));
            list.Add(new KeyValuePair<string, string>("startTime", from.ToString("yyyy-MM-dd 00:01:00")));
            list.Add(new KeyValuePair<string, string>("endTime", to.ToString("yyyy-MM-dd 23:00:00")));
            list.Add(new KeyValuePair<string, string>("length", "1000"));
            list.Add(new KeyValuePair<string, string>("model", "8"));
            list.Add(new KeyValuePair<string, string>("order", "1"));

            client.BaseAddress = new Uri("http://148.204.148.124:8090/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

            string parameters = string.Format("?pass={0}&personId={1}&startTime={2}&endTime={3}&length={4}&model=-1&order=1&index=0",
               list[0].Value, list[1].Value, list[2].Value, list[3].Value, list[4].Value, list[5].Value);

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
                        dataSto = resultData;
                        // SaveData(resultData.records);
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

        async Task GetInformationZac()
        {
            HttpClient client = new HttpClient();
            InterfaceResultModel result = null;
            RecordsDataModel resultData = null;

            DateTime from = fromDate.Value;
            DateTime to = toDate.Value;

            List<KeyValuePair<string, string>> list = new List<KeyValuePair<string, string>>();
            list.Add(new KeyValuePair<string, string>("pass", "1409"));
            list.Add(new KeyValuePair<string, string>("personId", employSelect.SelectedValue.ToString()));
            list.Add(new KeyValuePair<string, string>("startTime", from.ToString("yyyy-MM-dd 00:01:00")));
            list.Add(new KeyValuePair<string, string>("endTime", to.ToString("yyyy-MM-dd 23:00:00")));
            list.Add(new KeyValuePair<string, string>("length", "1000"));
            list.Add(new KeyValuePair<string, string>("model", "8"));
            list.Add(new KeyValuePair<string, string>("order", "1"));

            client.BaseAddress = new Uri("http://148.204.9.88:8090/");
            client.DefaultRequestHeaders.Accept.Clear();
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/x-www-form-urlencoded"));

            string parameters = string.Format("?pass={0}&personId={1}&startTime={2}&endTime={3}&length={4}&model=-1&order=1&index=0", 
                list[0].Value, list[1].Value, list[2].Value, list[3].Value, list[4].Value, list[5].Value);

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
                        dataZac = resultData;
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
                System.IO.StreamWriter fs = new System.IO.StreamWriter("C:\\logChecador.txt", true);
                fs.WriteLine(stamp.ToString("yyyy-MM-dd HH:mm:ss") + message);
                fs.Close();
            }
            catch (Exception)
            {
                throw;
            }
        }

        private void button1_Click(object sender, EventArgs e)
        {
            //GetInformationSto();
            GetInformationZac();
            viewMergeData();
        }

        public void viewMergeData()
        {
            DataTable dt = new DataTable();
            dt.TableName = "Data";
            dt.Columns.Add(new DataColumn("ID"));
            dt.Columns.Add(new DataColumn("Nombre"));
            dt.Columns.Add(new DataColumn("Fecha"));
            dt.Columns.Add(new DataColumn("Hora"));

            for (int i = 0; i < dataZac.records.Count; i++)
            {
                if (dataZac.records[i].personId != "NOMASK" && dataZac.records[i].personId != "STRANGERBABY" && dataZac.records[i].personId != "")
                {
                    try
                    {
                        long ticks = dataZac.records[i].time;
                        DateTime date = DateTimeOffset.FromUnixTimeMilliseconds(ticks).DateTime;
                        DateTime dateReal = date.ToLocalTime();

                        bool isDaylight = TimeZoneInfo.Local.IsDaylightSavingTime(dateReal);

                        if (isDaylight)
                            dateReal = dateReal.AddHours(-1);


                        DataRow row = dt.NewRow();
                        row["ID"] = dataZac.records[i].personId;
                        row["Nombre"] = dataZac.records[i].name;
                        row["Fecha"] = dateReal.ToString("yyyy-MM-dd");
                        row["Hora"] = dateReal.ToString("HH:mm:ss");

                        dt.Rows.Add(row);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message);
                       // Log("Error: " + ex.Message, DateTime.Now);
                        continue;
                    }
                }
            }

           /* for (int i = 0; i < dataSto.records.Count; i++)
            {
                if (dataSto.records[i].personId != "NOMASK" && dataSto.records[i].personId != "STRANGERBABY" && dataSto.records[i].personId != "")
                {
                    try
                    {
                        long ticks = dataSto.records[i].time;
                        DateTime date = DateTimeOffset.FromUnixTimeMilliseconds(ticks).DateTime;
                        DateTime dateReal = date.ToLocalTime();

                        bool isDaylight = TimeZoneInfo.Local.IsDaylightSavingTime(dateReal);

                        if(isDaylight)
                            dateReal = dateReal.AddHours(-1);

                        DataRow row = dt.NewRow();
                        row["ID"] = dataSto.records[i].personId;
                        row["Nombre"] = dataSto.records[i].name;
                        row["Fecha"] = dateReal.ToString("yyyy-MM-dd");
                        row["Hora"] = dateReal.ToString("HH:mm:ss");

                        dt.Rows.Add(row);
                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message);
                        // Log("Error: " + ex.Message, DateTime.Now);
                        continue;
                    }
                }
            }*/
            dataGridView1.DataSource = dt;
        }

        private void button2_Click(object sender, EventArgs e)
        {
            //SaveData(dataSto.records);
            SaveData(dataZac.records);
        }
    }
}
