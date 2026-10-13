type Brand<K,T> = K & { readonly __brand: T }

export type UserId = Brand<number, "UserId">
export type GroupId = Brand<number, "GroupId">
export type ExpenseId = Brand<number, "ExpenseId">
export type PaymentId = Brand<number, "PaymentId">

export type User = {
    readonly id: UserId
    readonly nombre: string
}

export type Group = {
    readonly id: GroupId
    readonly nombre: string
    readonly usuarios: readonly UserId[]
}

type Division = 
| { tipo: "iguales"; participantes: readonly UserId[] }
| { tipo: "montos"; montos: readonly { usuarioId: UserId; monto: number }[] }

export type Expense = {
    readonly id: ExpenseId
    readonly descripcion: string
    readonly montoTotal: number // en centavos
    readonly grupoId: GroupId
    readonly pagadorId: UserId
    readonly fecha: Date
    readonly division: Division
}

export type Payment = {
    readonly id: PaymentId
    readonly monto: number // en centavos
    readonly grupoId: GroupId
    readonly pagadorId: UserId
    readonly receptorId: UserId
    readonly fecha: Date
}