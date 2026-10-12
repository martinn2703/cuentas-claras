export type User = {
    nombre: string
    plata: number
}

export type Group = {
    nombre: string
    pagos: Payment[]
    usuarios: User[]
}

export type Expense = {
    id: number
    descripcion: string
    montoTotal: number
    grupo: Group
    pagador: User
    readonly fecha: Date
    division: "iguales" | "montos"
}

export type Payment = {
    monto: number
    pagador: User
    receptor: User
}