import { Component, OnInit } from '@angular/core';
import { DbServiceService } from '../../services/db-service.service';
import { ChartDataset, ChartOptions } from 'chart.js';

interface Record {
  id: string;
  record_type: string;
  record_value: string;
  thing_type: string;
}

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrls: ['./test-component.component.css']
})
export class TestComponentComponent implements OnInit {
  chartDataTemperatureCelsius: ChartDataset[] = [];
  chartLabelsTemperatureCelsius: string[] = [];

  chartDataTemperatureKelvin: ChartDataset[] = [];
  chartLabelsTemperatureKelvin: string[] = [];

  chartDataHumidity: ChartDataset[] = [];
  chartLabelsHumidity: string[] = [];

  isCelsius = true;
  temperatureButtonLabel = 'Celsius (C)';

  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false
  };

  constructor(private dbService: DbServiceService) { }

  ngOnInit(): void {
    this.dbService.getAllDbEntries().then((records: Record[]) => {
      this.organizeChartData(records);
    });
  }

  navigateToUrl(url: string): void {
    window.open(url, '_blank');
  }

  toggleTemperature(): void {
    this.isCelsius = !this.isCelsius;
    this.temperatureButtonLabel = this.isCelsius ? 'Celsius (C)' : 'Kelvin (K)';
  }

  organizeChartData(records: Record[]): void {
    // reset data
    this.chartDataTemperatureCelsius = [{ data: [], label: 'Temperature Celsius' }];
    this.chartLabelsTemperatureCelsius = [];

    this.chartDataTemperatureKelvin = [{ data: [], label: 'Temperature Kelvin' }];
    this.chartLabelsTemperatureKelvin = [];

    this.chartDataHumidity = [{ data: [], label: 'Humidity' }];
    this.chartLabelsHumidity = [];

    records.forEach(record => {
      switch (record.record_type) {
        case 'temperature_celsius':
          this.chartDataTemperatureCelsius[0].data?.push(+record.record_value);
          this.chartLabelsTemperatureCelsius.push('');
          break;
        case 'temperature_kelvin':
          this.chartDataTemperatureKelvin[0].data?.push(+record.record_value);
          this.chartLabelsTemperatureKelvin.push('');
          break;
        case 'humidity':
          this.chartDataHumidity[0].data?.push(+record.record_value);
          this.chartLabelsHumidity.push('');
          break;
      }
    });
  }
}
