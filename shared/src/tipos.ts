type Brand<K,T> = K & { readonly __brand: T }

type UserId = Brand<number, "UserId">
type GroupId = Brand<number, "GroupId">
type ExpenseId = Brand<number, "ExpenseId">
type PaymentId = Brand<number, "PaymentId">

export type User = {
    readonly id: UserId
    readonly nombre: string
}

export type Group = {
    readonly id: GroupId
    readonly nombre: string
    readonly usuarios: number[]
}

type Division = 
| { tipo: "iguales"; pagadores: number[] }
| { tipo: "montos"; pagadores: number[]; montos: number[] }

export type Expense = {
    readonly id: ExpenseId
    readonly descripcion: string
    readonly montoTotal: number
    readonly grupoId: number
    readonly pagadorId: number
    readonly fecha: Date
    readonly division: Division
}

export type Payment = {
    readonly id: PaymentId
    readonly monto: number // en centavos
    readonly grupoId: number
    readonly pagadorId: number
    readonly receptorId: number
    readonly fecha: Date
}