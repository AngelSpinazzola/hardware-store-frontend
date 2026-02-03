import type { ApexOptions } from 'apexcharts';

interface BarChartData {
    name: string;
    'Unidades Vendidas': number;
    'Ingresos': number;
}

interface PieChartData {
    series: number[];
    labels: string[];
}

// ApexCharts internal types (not exported by library)
interface ApexLegendFormatterOpts {
    w: { globals: { series: number[]; seriesTotals: number[] } };
    seriesIndex: number;
}

/**
 * Configuración del gráfico de barras para Top 10 productos
 */
export const getBarChartOptions = (barData: BarChartData[]): ApexOptions => {
    return {
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: false
            },
            animations: {
                enabled: true,
                speed: 800,
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: '60%',
                distributed: true,
            }
        },
        colors: [
            '#EAB308', // Oro
            '#9CA3AF', // Plata
            '#F97316', // Bronce
            '#4F46E5', '#4F46E5', '#4F46E5', '#4F46E5', '#4F46E5', '#4F46E5', '#4F46E5'
        ],
        dataLabels: {
            enabled: false
        },
        legend: {
            show: false
        },
        xaxis: {
            categories: barData.map(p => p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name),
            labels: {
                style: {
                    fontSize: '10px',
                    colors: '#6B7280'
                },
                rotate: -45,
                rotateAlways: true,
            }
        },
        yaxis: {
            labels: {
                formatter: (val) => val.toFixed(0)
            }
        },
        grid: {
            borderColor: '#F3F4F6',
            strokeDashArray: 3,
        },
        tooltip: {
            theme: 'light',
            y: {
                formatter: (val, opts) => {
                    const product = barData[opts.dataPointIndex];
                    return `${val} unidades - $${product['Ingresos'].toLocaleString('es-AR')}`;
                }
            },
            x: {
                formatter: (_val, opts) => barData[opts.dataPointIndex].name
            }
        }
    };
};

/**
 * Configuración del gráfico de donut para Top 3 productos por ingresos
 */
export const getPieChartOptions = (pieChartData: PieChartData): ApexOptions => {
    const formatLegend = (seriesName: string, opts: ApexLegendFormatterOpts, maxLength: number) => {
        const value = opts.w.globals.series[opts.seriesIndex];
        const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
        const percentage = ((value / total) * 100).toFixed(1);
        const displayName = seriesName.length > maxLength 
            ? seriesName.substring(0, maxLength) + '...' 
            : seriesName;

        return `<div style="display: flex; flex-direction: column; gap: 4px; padding: 6px 4px;">
            <span style="font-weight: 600; color: #374151; font-size: 13px;" title="${seriesName}">${displayName}</span>
            <div style="display: flex; align-items: baseline; gap: 6px;">
                <span style="font-weight: 700; color: #5b5959; font-size: 15px;">$${value.toLocaleString('es-AR')}</span>
                <span style="color: #6B7280; font-size: 12px;">${percentage}%</span>
            </div>
        </div>`;
    };

    return {
        chart: {
            type: 'donut',
            height: 150,
            toolbar: {
                show: false
            }
        },
        colors: ['#4F46E5', '#10B981', '#F59E0B'],
        labels: pieChartData.labels,
        dataLabels: {
            enabled: false
        },
        legend: {
            show: true,
            position: 'right',
            fontSize: '13px',
            markers: {
                size: 6,
            },
            itemMargin: {
                horizontal: 8,
                vertical: 10
            },
            formatter: (seriesName, opts) => formatLegend(seriesName, opts, 28)
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '35%',
                },
            },
        },
        tooltip: {
            y: {
                formatter: (val: number) => '$' + val.toLocaleString('es-AR')
            },
        },
        stroke: {
            width: 2,
            colors: ['#fff'],
        },
        responsive: [{
            breakpoint: 768,
            options: {
                chart: {
                    height: 320,
                },
                legend: {
                    position: 'bottom',
                    fontSize: '12px',
                    formatter: (seriesName: string, opts: ApexLegendFormatterOpts) => formatLegend(seriesName, opts, 30)
                },
                plotOptions: {
                    pie: {
                        donut: {
                            size: '45%',
                        }
                    }
                }
            },
        }],
    };
};