interface SubcategoryType {
    id: string;
    name: string;
    keywords: string[];
    priority: number;
}

interface CategoryRule {
    name: string;
    types: Record<string, SubcategoryType>;
}

export const SUBCATEGORY_RULES: Record<string, CategoryRule> = {
    'almacenamiento': {
        name: 'Almacenamiento',
        types: {
            SSD: {
                id: 'ssd',
                name: 'SSD',
                keywords: ['ssd', 'nvme', 'm.2', 'm2', 'sata'],
                priority: 1
            },
            HDD: {
                id: 'hdd',
                name: 'HDD',
                keywords: ['hdd', 'rpm', 'mecanico'],
                priority: 2
            }
        }
    },

    'placas de video': {
        name: 'Placas de Video',
        types: {
            NVIDIA: {
                id: 'nvidia',
                name: 'NVIDIA',
                keywords: ['nvidia', 'geforce', 'rtx', 'gtx'],
                priority: 1
            },
            AMD: {
                id: 'amd-gpu',
                name: 'AMD',
                keywords: ['amd', 'radeon', 'rx'],
                priority: 2
            }
        }
    },

    'refrigeración': {
        name: 'Refrigeración',
        types: {
            AIR: {
                id: 'aire',
                name: 'Por Aire',
                keywords: ['aire', 'fan', 'tower', 'cooler', 'disipador', 'cpu cooler'],
                priority: 1
            },
            LIQUID: {
                id: 'liquida',
                name: 'Líquida',
                keywords: ['liquida', 'liquid', 'aio', 'watercooling', 'water cooling'],
                priority: 2
            }
        }
    },

    'procesadores': {
        name: 'Procesadores',
        types: {
            INTEL: {
                id: 'intel-procesadores',
                name: 'Intel',
                keywords: ['intel', 'core i', 'i3', 'i5', 'i7', 'i9'],
                priority: 1
            },
            AMD_CPU: {
                id: 'amd-procesadores',
                name: 'AMD',
                keywords: ['amd', 'ryzen', 'threadripper'],
                priority: 2
            }
        }
    },

    'mothers': {
        name: 'Mothers',
        types: {
            INTEL: {
                id: 'intel-mothers',
                name: 'Intel',
                keywords: ['lga', 'intel', 'z790', 'b760', 'h770', 'z690', 'b660', 'h610', 'z590', 'b560', 'h510'],
                priority: 1
            },
            AMD: {
                id: 'amd-mothers',
                name: 'AMD',
                keywords: ['am5', 'am4', 'amd', 'x670', 'b650', 'a620', 'x570', 'b550', 'a520', 'b450'],
                priority: 2
            }
        }
    },

    'memorias ram': {
        name: 'Memorias RAM',
        types: {
            DDR5: {
                id: 'ddr5',
                name: 'DDR5',
                keywords: ['ddr5', 'ddr 5'],
                priority: 1
            },
            DDR4: {
                id: 'ddr4',
                name: 'DDR4',
                keywords: ['ddr4', 'ddr 4'],
                priority: 2
            }
        }
    },

    'periféricos': {
        name: 'Periféricos',
        types: {
            MOUSE: {
                id: 'mouse',
                name: 'Mouses',
                keywords: ['mouse', 'raton', 'gaming mouse', 'wireless mouse', 'optical', 'laser'],
                priority: 1
            },
            TECLADO: {
                id: 'teclado',
                name: 'Teclados',
                keywords: ['teclado', 'keyboard', 'mecanico', 'membrana', 'gaming keyboard', 'wireless keyboard'],
                priority: 2
            },
            AURICULARES: {
                id: 'auriculares',
                name: 'Auriculares',
                keywords: ['auriculares', 'headset', 'headphones', 'gaming headset', 'wireless headphones', 'bluetooth'],
                priority: 3
            },
            MICROFONO: {
                id: 'microfono',
                name: 'Micrófonos',
                keywords: ['microfono', 'microphone', 'mic', 'streaming mic', 'usb mic', 'condenser'],
                priority: 4
            },
            PARLANTES: {
                id: 'parlantes',
                name: 'Parlantes',
                keywords: ['parlantes', 'speakers', 'altavoces', 'bluetooth speakers', 'gaming speakers', '2.1', '5.1'],
                priority: 5
            },
            WEBCAM: {
                id: 'webcam',
                name: 'Webcam',
                keywords: ['webcam', 'camara web', 'camera', 'streaming camera', '1080p', '4k'],
                priority: 6
            },
            MOUSEPAD: {
                id: 'mousepad',
                name: 'Mouse Pads',
                keywords: ['mousepad', 'mouse pad', 'alfombrilla', 'gaming pad', 'xl mousepad', 'rgb mousepad'],
                priority: 7
            },
            JOYSTICK: {
                id: 'joystick',
                name: 'Joysticks',
                keywords: ['joystick', 'gamepad', 'control', 'controller', 'xbox controller', 'playstation controller'],
                priority: 8
            }
        }
    }

};