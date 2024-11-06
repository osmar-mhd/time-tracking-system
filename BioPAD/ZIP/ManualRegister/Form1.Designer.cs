namespace ManualRegister
{
    partial class Form1
    {
        /// <summary>
        /// Variable del diseñador necesaria.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Limpiar los recursos que se estén usando.
        /// </summary>
        /// <param name="disposing">true si los recursos administrados se deben desechar; false en caso contrario.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Código generado por el Diseñador de Windows Forms

        /// <summary>
        /// Método necesario para admitir el Diseñador. No se puede modificar
        /// el contenido de este método con el editor de código.
        /// </summary>
        private void InitializeComponent()
        {
            this.fromDate = new System.Windows.Forms.DateTimePicker();
            this.toDate = new System.Windows.Forms.DateTimePicker();
            this.label1 = new System.Windows.Forms.Label();
            this.label2 = new System.Windows.Forms.Label();
            this.employSelect = new System.Windows.Forms.ComboBox();
            this.label3 = new System.Windows.Forms.Label();
            this.button1 = new System.Windows.Forms.Button();
            this.dataGridView1 = new System.Windows.Forms.DataGridView();
            this.button2 = new System.Windows.Forms.Button();
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).BeginInit();
            this.SuspendLayout();
            // 
            // fromDate
            // 
            this.fromDate.Location = new System.Drawing.Point(58, 13);
            this.fromDate.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.fromDate.Name = "fromDate";
            this.fromDate.Size = new System.Drawing.Size(374, 31);
            this.fromDate.TabIndex = 0;
            // 
            // toDate
            // 
            this.toDate.Location = new System.Drawing.Point(485, 14);
            this.toDate.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.toDate.Name = "toDate";
            this.toDate.Size = new System.Drawing.Size(374, 31);
            this.toDate.TabIndex = 1;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(12, 16);
            this.label1.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(38, 29);
            this.label1.TabIndex = 2;
            this.label1.Text = "De";
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(451, 16);
            this.label2.Margin = new System.Windows.Forms.Padding(4, 0, 4, 0);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(26, 29);
            this.label2.TabIndex = 3;
            this.label2.Text = "A";
            // 
            // employSelect
            // 
            this.employSelect.FormattingEnabled = true;
            this.employSelect.Location = new System.Drawing.Point(110, 52);
            this.employSelect.Name = "employSelect";
            this.employSelect.Size = new System.Drawing.Size(605, 37);
            this.employSelect.TabIndex = 4;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 55);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(92, 29);
            this.label3.TabIndex = 5;
            this.label3.Text = "Empleado";
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(721, 52);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(138, 32);
            this.button1.TabIndex = 6;
            this.button1.Text = "Consultar";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // dataGridView1
            // 
            this.dataGridView1.ColumnHeadersHeightSizeMode = System.Windows.Forms.DataGridViewColumnHeadersHeightSizeMode.AutoSize;
            this.dataGridView1.Location = new System.Drawing.Point(17, 95);
            this.dataGridView1.Name = "dataGridView1";
            this.dataGridView1.RowHeadersWidth = 51;
            this.dataGridView1.RowTemplate.Height = 24;
            this.dataGridView1.Size = new System.Drawing.Size(842, 492);
            this.dataGridView1.TabIndex = 7;
            // 
            // button2
            // 
            this.button2.Location = new System.Drawing.Point(625, 593);
            this.button2.Name = "button2";
            this.button2.Size = new System.Drawing.Size(234, 37);
            this.button2.TabIndex = 8;
            this.button2.Text = "Transferir a BD";
            this.button2.UseVisualStyleBackColor = true;
            this.button2.Click += new System.EventHandler(this.button2_Click);
            // 
            // Form1
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(11F, 29F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(875, 638);
            this.Controls.Add(this.button2);
            this.Controls.Add(this.dataGridView1);
            this.Controls.Add(this.button1);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.employSelect);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.toDate);
            this.Controls.Add(this.fromDate);
            this.Font = new System.Drawing.Font("Gill Sans MT", 12F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.Margin = new System.Windows.Forms.Padding(4, 5, 4, 5);
            this.Name = "Form1";
            this.Text = "Actualizador";
            this.Load += new System.EventHandler(this.Form1_Load);
            ((System.ComponentModel.ISupportInitialize)(this.dataGridView1)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.DateTimePicker fromDate;
        private System.Windows.Forms.DateTimePicker toDate;
        private System.Windows.Forms.Label label1;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.ComboBox employSelect;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.DataGridView dataGridView1;
        private System.Windows.Forms.Button button2;
    }
}

