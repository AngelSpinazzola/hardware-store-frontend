// src/pages/Admin/Analytics/config/salesChartConfig.ts
import type { ApexOptions } from 'apexcharts';
import type { SalesDataPoint } from '../hooks/useSalesAnalytics';

/**
 * Configuración del gráfico de ingresos (área)
 */
export const getRevenueChartOptions = (revenueData: SalesDataPoint[]): ApexOptions => ({
    chart: {
        type: 'area',
        height: 350,
        toolbar: {
            show: true,
            tools: {
                download: true,
                selection: false,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true
            }
        },
        animations: {
            enabled: true,
            speed: 800,
        },
        zoom: {
            enabled: true,
            type: 'x',
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 3
    },
    fill: {
        type: 'gradient',
        gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 90, 100]
        }
    },
    colors: ['#8B5CF6'],
    xaxis: {
        categories: revenueData.map(d => d.period),
        labels: {
            style: {
                fontSize: '11px',
                colors: '#6B7280'
            },
            rotate: -45,
            rotateAlways: revenueData.length > 10,
        },
        axisBorder: {
            show: true,
            color: '#E5E7EB'
        }
    },
    yaxis: {
        labels: {
            style: {
                fontSize: '12px',
                colors: '#6B7280'
            },
            formatter: (val) => `$${val.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
        }
    },
    grid: {
        borderColor: '#F3F4F6',
        strokeDashArray: 3,
        xaxis: {
            lines: {
                show: false
            }
        }
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: (val) => `$${val.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
    },
    markers: {
        size: 4,
        colors: ['#8B5CF6'],
        strokeColors: '#fff',
        strokeWidth: 2,
        hover: {
            size: 6
        }
    }
});

/**
 * Configuración del gráfico de ticket promedio (línea)
 */
export const getTicketChartOptions = (
    ticketData: SalesDataPoint[], 
    averageOrderValue: number
): ApexOptions => ({
    chart: {
        type: 'line',
        height: 350,
        toolbar: {
            show: true,
            tools: {
                download: true,
                selection: false,
                zoom: true,
                zoomin: true,
                zoomout: true,
                pan: true,
                reset: true
            }
        },
        animations: {
            enabled: true,
            speed: 800,
        },
        zoom: {
            enabled: true,
            type: 'x',
        }
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        width: 4
    },
    colors: ['#10B981'],
    xaxis: {
        categories: ticketData.map(d => d.period),
        labels: {
            style: {
                fontSize: '11px',
                colors: '#6B7280'
            },
            rotate: -45,
            rotateAlways: ticketData.length > 10,
        },
        axisBorder: {
            show: true,
            color: '#E5E7EB'
        }
    },
    yaxis: {
        labels: {
            style: {
                fontSize: '12px',
                colors: '#6B7280'
            },
            formatter: (val) => `$${val.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
        }
    },
    grid: {
        borderColor: '#F3F4F6',
        strokeDashArray: 3,
        xaxis: {
            lines: {
                show: false
            }
        }
    },
    tooltip: {
        theme: 'light',
        y: {
            formatter: (val) => `$${val.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        }
    },
    markers: {
        size: 6,
        colors: ['#10B981'],
        strokeColors: '#fff',
        strokeWidth: 3,
        hover: {
            size: 8
        }
    },
    annotations: {
        yaxis: [
            {
                y: averageOrderValue,
                borderColor: '#F59E0B',
                strokeDashArray: 5,
                label: {
                    borderColor: '#F59E0B',
                    style: {
                        color: '#fff',
                        background: '#F59E0B',
                        fontSize: '11px',
                        fontWeight: 600
                    },
                    text: `Promedio General: $${averageOrderValue.toLocaleString('es-AR', { maximumFractionDigits: 0 })}`
                }
            }
        ]
    }
});