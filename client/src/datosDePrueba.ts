import type { Division, Expense, ExpenseId, Group, GroupId, Payment, PaymentId, User, UserId } from "@cuentas-claras/shared";

export const grupo: Group = {
    id: 1 as GroupId,
    nombre: "Mi grupo",
    usuarios: [1,2,3] as UserId[]
}

const martin: User = {id: 1 as UserId, nombre: "Martín"}
const nicolas: User = {id: 2 as UserId, nombre: "Nicolás"}
const romina: User = {id: 3 as UserId, nombre: "Romina"}

const divisionPorPartesIguales: Division = {tipo: "iguales", participantes: [1,2] as UserId[]}
const divisionPorMontos: Division = {tipo: "montos",
    montos: [
        {
            usuarioId: 1 as UserId,
            monto: 1000
        },
        {
            usuarioId: 3 as UserId,
            monto: 800
        }
    ]
}

const gastoUno: Expense = {
    id: 1 as ExpenseId,
    grupoId: 1 as GroupId,
    descripcion: "Gasto uno",
    division: divisionPorPartesIguales,
    fecha: new Date(),
    montoTotal: 2000,
    pagadorId: 1 as UserId
}

const gastoDos: Expense = {
    id: 2 as ExpenseId,
    grupoId: 1 as GroupId,
    descripcion: "Gasto dos",
    division: divisionPorMontos,
    fecha: new Date(),
    montoTotal: 1800,
    pagadorId: 2 as UserId
}

const gastoTres: Expense = {
    id: 3 as ExpenseId,
    grupoId: 1 as GroupId,
    descripcion: "Gasto tres",
    division: divisionPorPartesIguales,
    fecha: new Date(),
    montoTotal: 1000,
    pagadorId: 3 as UserId
}

const gastoCuatro: Expense = {
    id: 4 as ExpenseId,
    grupoId: 1 as GroupId,
    descripcion: "Gasto cuatro",
    division: divisionPorPartesIguales,
    fecha: new Date(),
    montoTotal: 1800,
    pagadorId: 3 as UserId
}

const pago: Payment = {
    id: 1 as PaymentId,
    grupoId: 1 as GroupId,
    fecha: new Date(),
    monto: 800,
    pagadorId: 2 as UserId,
    receptorId: 3 as UserId
}

export const usuarios: User[] = [martin,nicolas,romina]
export const gastos: Expense[] = [gastoUno,gastoDos,gastoTres,gastoCuatro]
export const pagos: Payment[] = [pago]