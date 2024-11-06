using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Configuration.Install;
using System.ComponentModel;
using System.ServiceProcess;

namespace ChecadorServiceBPLT
{
    public class ServiceInstaller: Installer
    {
        public ServiceInstaller() { 
            ServiceProcessInstaller serviceProcessInstaller = new ServiceProcessInstaller();
            System.ServiceProcess.ServiceInstaller serviceInstaller = new System.ServiceProcess.ServiceInstaller();

            serviceProcessInstaller.Account = ServiceAccount.LocalSystem;
            serviceProcessInstaller.Username = null;
            serviceProcessInstaller.Password = null;

            serviceInstaller.DisplayName = "ChecadorBioPAD";
            serviceInstaller.StartType = ServiceStartMode.Automatic;
            serviceInstaller.ServiceName = "BIOPADLT";
            this.Installers.Add(serviceProcessInstaller);
            this.Installers.Add(serviceInstaller);
        }
    }
}
