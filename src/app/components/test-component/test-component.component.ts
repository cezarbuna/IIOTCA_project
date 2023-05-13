import { Component, OnInit } from '@angular/core';
import { DbServiceService } from '../../services/db-service.service';
import { ChartDataset } from 'chart.js';

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css'],
})
export class TestComponentComponent implements OnInit {
  private records: any;

  // Create separate datasets for each type of data
  chartDataTemperatureKelvin: ChartDataset[] = [
    {
      label: 'Temperature (K)',
      data: [],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
    },
  ];
  chartDataTemperatureCelsius: ChartDataset[] = [
    {
      label: 'Temperature (°C)',
      data: [],
      borderColor: 'rgba(255, 99, 132, 1)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
    },
  ];
  chartDataHumidity: ChartDataset[] = [
    {
      label: 'Humidity (%)',
      data: [],
      borderColor: 'rgba(255, 206, 86, 1)',
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      fill: false,
    },
  ];

  // Create separate labels for each type of data
  chartLabelsTemperatureKelvin: string[] = [];
  chartLabelsTemperatureCelsius: string[] = [];
  chartLabelsHumidity: string[] = [];

  chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        display: true,
        title: {
          display: true,
        },
      },
    },
  };

  constructor(private dbService: DbServiceService) {}

  ngOnInit(): void {
    this.dbService.getAllDbEntries().then((records) => {
      this.records = records;
      console.log(this.records);
      this.processData();
    });
  }

  processData(): void {
    // Filter records and populate datasets and labels
    this.records.forEach((record: any) => {
      const value = parseFloat(record.record_value);
      if (record.record_type === 'temperature_kelvin') {
        this.chartLabelsTemperatureKelvin.push(record.id);
        this.chartDataTemperatureKelvin[0].data.push(value);
      } else if (record.record_type === 'temperature_celsius') {
        this.chartLabelsTemperatureCelsius.push(record.id);
        this.chartDataTemperatureCelsius[0].data.push(value);
      } else if (record.record_type === 'humidity') {
        this.chartLabelsHumidity.push(record.id);
        this.chartDataHumidity[0].data.push(value);
      }
    });
  }
}
