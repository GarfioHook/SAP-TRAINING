// Workflow step definitions for SAP S/4HANA Training
export const WORKFLOW_STEPS = [
    {
        index: 0,
        name: 'Pedido de Compra',
        transaction: 'ME21N',
        documentKey: 'po_number',
        documentLabel: 'EBELN',
        buttonLabel: 'Registrar Pedido de Compra',
        team: 'COMEX',
        teamColor: '#002e5d', // Navy
        inputType: 'text',
        placeholder: '45XXXXXXXX',
        validation: {
            length: 10,
            prefix: '45',
            pattern: /^45\d{8}$/,
            error: 'El Pedido de Compra debe tener 10 dígitos y comenzar con 45'
        }
    },
    {
        index: 1,
        name: 'Entrega Entrante (MIGO)',
        transaction: 'MIGO',
        documentKey: 'gr_number',
        documentLabel: 'MBLNR',
        buttonLabel: 'Registrar Entrega Entrante',
        team: 'Logística',
        teamColor: '#0ea5e9', // Sky Blue
        inputType: 'text',
        placeholder: '50XXXXXXXX',
        validation: {
            length: 10,
            prefix: '50',
            pattern: /^50\d{8}$/,
            error: 'La Entrega Entrante debe tener 10 dígitos y comenzar con 50'
        }
    },
    {
        index: 2,
        name: 'Pedido de Venta',
        transaction: 'VA01',
        documentKey: 'so_number',
        documentLabel: 'VBELN',
        buttonLabel: 'Registrar Pedido de Venta',
        team: 'Comercial',
        teamColor: '#10b981', // Emerald
        inputType: 'text',
        placeholder: '00XXXXXXXX',
        validation: {
            length: 10,
            prefix: '00',
            pattern: /^00\d{8}$/,
            error: 'El Pedido de Venta debe tener 10 dígitos y comenzar con 00'
        }
    },
    {
        index: 3,
        name: 'Aprobación de Crédito',
        transaction: 'VKM1',
        documentKey: 'cr_approved',
        documentLabel: 'Confirmación',
        buttonLabel: 'Confirmar Aprobación',
        team: 'Crédito',
        teamColor: '#f59e0b', // Amber
        inputType: 'checkbox',
        placeholder: null,
        validation: null
    },
    {
        index: 4,
        name: 'Entrega de Salida',
        transaction: 'VL01N',
        documentKey: 'dl_number',
        documentLabel: 'LIKP-VBELN',
        buttonLabel: 'Registrar Entrega de Salida',
        team: 'Logística',
        teamColor: '#0ea5e9', // Sky Blue
        inputType: 'text',
        placeholder: '80XXXXXXXX',
        validation: {
            length: 10,
            prefix: '80',
            pattern: /^80\d{8}$/,
            error: 'La Entrega de Salida debe tener 10 dígitos y comenzar con 80'
        }
    },
    {
        index: 5,
        name: 'Factura de Venta',
        transaction: 'VF01',
        documentKey: 'inv_number',
        documentLabel: 'VBRK-VBELN',
        buttonLabel: 'Registrar Factura',
        team: 'Facturación',
        teamColor: '#6366f1', // Indigo
        inputType: 'text',
        placeholder: '90XXXXXXXX',
        validation: {
            length: 10,
            prefix: '90',
            pattern: /^90\d{8}$/,
            error: 'La Factura debe tener 10 dígitos y comenzar con 90'
        }
    },
    {
        index: 6,
        name: 'Documento de Pago',
        transaction: 'F-28',
        documentKey: 'pay_number',
        documentLabel: 'BKPF-BELNR',
        buttonLabel: 'Registrar Pago',
        team: 'Cobranzas',
        teamColor: '#a855f7', // Purple
        inputType: 'text',
        placeholder: '14XXXXXXXX',
        validation: {
            length: 10,
            prefix: '14',
            pattern: /^14\d{8}$/,
            error: 'El Pago debe tener 10 dígitos y comenzar con 14'
        }
    }
]

export const TEAMS = [
    'COMEX',
    'Logística',
    'Comercial',
    'Crédito',
    'Facturación',
    'Cobranzas',
    'Administrador'
]

export const APP_ID = 'sap-s4-training'

export const STATUS_LABELS = {
    0: 'Pedido de Compra',
    1: 'Entrega Entrante',
    2: 'Pedido de Venta',
    3: 'Aprobación de Crédito',
    4: 'Entrega de Salida',
    5: 'Factura de Venta',
    6: 'Documento de Pago',
    7: 'Completado'
}

export const getStatusFromStep = (step) => {
    return STATUS_LABELS[step] || 'Desconocido'
}

// Demo data for when Supabase is not configured
export const DEMO_CYCLES = [
    {
        id: 1,
        app_id: APP_ID,
        name: 'Ciclo Demo - Exportación México',
        status: 'Pedido de Compra',
        company_code: '1000',
        purchase_type: 'Importación',
        vendor: 'VENDOR_INT_01',
        current_step: 0,
        margin: 15.5,
        client: 'CLIENTE001',
        material: 'MAT-12345',
        quantity: 1000,
        created_at: new Date().toISOString(),
        creator: 'usuario.demo',
        documents: {}
    }
]
