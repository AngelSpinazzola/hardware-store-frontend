// src/pages/Admin/Analytics/config/dashboardChartConfig.ts
import type { ApexOptions } from 'apexcharts';

// Gráfico 1: Ingresos + Órdenes (Área + Línea combinados)
export const getRevenueOrdersChartOptions = (data: any[]): ApexOptions => ({
    chart: {
        type: 'area',
        height: 350,
        toolbar: {
            show: false
        },
        zoom: {
            enabled: false
        },
        fontFamily: 'Inter, sans-serif'
    },
    colors: ['#8B5CF6', '#10B981'], // Morado para ingresos, Verde para órdenes
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: [0, 3] // 0 para área, 3 para línea
    },
    fill: {
        type: ['gradient', 'solid'],
        gradient: {
            shade: 'light',
            type: 'vertical',
            shadeIntensity: 0.3,
            opacityFrom: 0.7,
            opacityTo: 0.1,
            stops: [0, 100]
        }
    },
    xaxis: {
        categories: data.map(d => d.period),
        labels: {
            style: {
                colors: '#6B7280',
                fontSize: '12px'
            }
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: [
        {
            // Eje Y para Ingresos (izquierda)
            title: {
                text: 'Ingresos ($)',
                style: {
                    color: '#8B5CF6',
                    fontSize: '12px',
                    fontWeight: 500
                }
            },
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '11px'
                },
                formatter: (value: number) => {
                    return `$${value.toFixed(0)}`;
                }
            }
        },
        {
            // Eje Y para Órdenes (derecha)
            opposite: true,
            title: {
                text: 'Órdenes',
                style: {
                    color: '#10B981',
                    fontSize: '12px',
                    fontWeight: 500
                }
            },
            labels: {
                style: {
                    colors: '#6B7280',
                    fontSize: '11px'
                },
                formatter: (value: number) => {
                    return Math.round(value).toString();
                }
            }
        }
    ],
    grid: {
        show: true,
        borderColor: '#F3F4F6',
        strokeDashArray: 3,
        padding: {
            left: 10,
            right: 10
        }
    },
    legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'right',
        fontSize: '12px',
        fontWeight: 500,
        markers: {
            size: 10
        },
        itemMargin: {
            horizontal: 10
        }
    },
    tooltip: {
        shared: true,
        intersect: false,
        y: [
            {
                formatter: (value: number) => {
                    return `$${value.toLocaleString('es-AR', { 
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2 
                    })}`;
                }
            },
            {
                formatter: (value: number) => {
                    return `${Math.round(value)} órdenes`;
                }
            }
        ],
        style: {
            fontSize: '12px'
        }
    },
    responsive: [
        {
            breakpoint: 640,
            options: {
                chart: {
                    height: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    ]
});

// Gráfico 2: Órdenes por Estado (Donut)
export const getOrdersStatusChartOptions = (labels: string[]): ApexOptions => ({
    chart: {
        type: 'donut',
        height: 350,
        fontFamily: 'Inter, sans-serif'
    },
    labels: labels,
    colors: ['#F59E0B', '#8B5CF6', '#3B82F6', '#10B981'], // Amarillo, Morado, Azul, Verde
    dataLabels: {
        enabled: true,
        style: {
            fontSize: '14px',
            fontWeight: 'bold',
            colors: ['#fff']
        },
        dropShadow: {
            enabled: false
        },
        formatter: (val: number) => {
            return val.toFixed(0) + '%';
        }
    },
    legend: {
        show: true,
        position: 'bottom',
        fontSize: '13px',
        fontWeight: 500,
        markers: {
            size: 12
        },
        itemMargin: {
            horizontal: 8,
            vertical: 4
        },
        formatter: (seriesName: string, opts: any) => {
            const value = opts.w.globals.series[opts.seriesIndex];
            return `${seriesName}: <strong>${value}</strong>`;
        }
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%',
                labels: {
                    show: true,
                    name: {
                        show: true,
                        fontSize: '16px',
                        fontWeight: 600,
                        color: '#374151'
                    },
                    value: {
                        show: true,
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#111827',
                        formatter: (val: string) => {
                            return val;
                        }
                    },
                    total: {
                        show: true,
                        label: 'Total',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#6B7280',
                        formatter: (w: any) => {
                            const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                            return total.toString();
                        }
                    }
                }
            }
        }
    },
    stroke: {
        width: 0
    },
    tooltip: {
        y: {
            formatter: (value: number) => {
                return `${value} órdenes`;
            }
        },
        style: {
            fontSize: '13px'
        }
    },
    responsive: [
        {
            breakpoint: 640,
            options: {
                chart: {
                    height: 300
                },
                legend: {
                    position: 'bottom'
                }
            }
        }
    ]
});

// NUEVO: Gráfico 3: Ventas por Categoría (Barras Horizontales)
export const getCategorySalesChartOptions = (categories: string[]): ApexOptions => ({
    chart: {
        type: 'bar',
        height: 350,
        toolbar: {
            show: false
        },
        fontFamily: 'Inter, sans-serif'
    },
    plotOptions: {
        bar: {
            horizontal: true,
            borderRadius: 6,
            dataLabels: {
                position: 'top'
            },
            distributed: true // Colores diferentes por barra
        }
    },
    colors: [
        '#8B5CF6', // Morado
        '#3B82F6', // Azul
        '#10B981', // Verde
        '#F59E0B', // Amarillo
        '#EF4444', // Rojo
        '#EC4899', // Rosa
        '#6366F1', // Indigo
        '#14B8A6'  // Teal
    ],
    dataLabels: {
        enabled: true,
        formatter: (val: number) => {
            return `$${val.toLocaleString('es-AR', { 
                minimumFractionDigits: 0,
                maximumFractionDigits: 0 
            })}`;
        },
        offsetX: 0,
        style: {
            fontSize: '12px',
            fontWeight: 600,
            colors: ['#fff']
        }
    },
    xaxis: {
        categories: categories,
        labels: {
            style: {
                colors: '#6B7280',
                fontSize: '12px'
            },
            formatter: (value: string) => {
                const num = parseFloat(value);
                return `$${num.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`;
            }
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        labels: {
            style: {
                colors: '#374151',
                fontSize: '13px',
                fontWeight: 500
            },
            maxWidth: 160
        }
    },
    grid: {
        show: true,
        borderColor: '#F3F4F6',
        strokeDashArray: 3,
        xaxis: {
            lines: {
                show: true
            }
        },
        yaxis: {
            lines: {
                show: false
            }
        },
        padding: {
            top: 0,
            right: 20,
            bottom: 0,
            left: 10
        }
    },
    legend: {
        show: false // No mostrar leyenda porque es distributed
    },
    tooltip: {
        y: {
            formatter: (value: number, { dataPointIndex, w }: any) => {
                const percentage = w.config.series[0].data[dataPointIndex]?.percentage || 0;
                return `$${value.toLocaleString('es-AR', { 
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2 
                })} (${percentage.toFixed(1)}%)`;
            }
        },
        style: {
            fontSize: '13px'
        }
    },
    responsive: [
        {
            breakpoint: 640,
            options: {
                chart: {
                    height: 400
                },
                plotOptions: {
                    bar: {
                        borderRadius: 4
                    }
                },
                dataLabels: {
                    style: {
                        fontSize: '10px'
                    }
                }
            }
        }
    ]
});