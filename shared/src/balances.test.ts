import { describe, test, expect } from 'vitest';
import { Expense, Payment, Division, ExpenseId, PaymentId, UserId, GroupId, User } from './tipos';
import { calcularBalances } from './balances';

describe("Tests de calcular balances", () => {
    test("Sin gastos ni pagos, todos los balances vacíos", () => {
        const gastos: Expense[] = []
        const pagos: Payment[] = []

        const balances = calcularBalances(gastos, pagos)
        expect(balances).toEqual(new Map())
    })

    test("Un gasto en partes iguales sin redondeo", () => {
        const divisionPartesIguales: Division = {
            tipo: 'iguales',
            participantes: [1,2,3] as UserId[]
        }

        const gastos: Expense[] = [
            {
                id: 1 as ExpenseId,
                descripcion: "Gasto de prueba",
                division: divisionPartesIguales,
                fecha: new Date(),
                grupoId: 1 as GroupId,
                montoTotal: 900,
                pagadorId: 1 as UserId
            }
        ]

        const pagos: Payment[] = [
            {
                id: 1 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 300,
                pagadorId: 2 as UserId,
                receptorId: 1 as UserId
            },
            {
                id: 2 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 300,
                pagadorId: 3 as UserId,
                receptorId: 1 as UserId
            }
        ]

        const balances = calcularBalances(gastos, pagos)
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 0],
           [2 as UserId, 0],
           [3 as UserId, 0]
        ]))
    })
    
    test("Un gasto en partes iguales con redondeo", () => {
        const divisionPartesIguales: Division = {
            tipo: 'iguales',
            participantes: [1,2,3] as UserId[]
        }

        const gastos: Expense[] = [
            {
                id: 1 as ExpenseId,
                descripcion: "Gasto de prueba",
                division: divisionPartesIguales,
                fecha: new Date(),
                grupoId: 1 as GroupId,
                montoTotal: 1000,
                pagadorId: 1 as UserId
            }
        ]

        const pagos: Payment[] = [
            {
                id: 1 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 333,
                pagadorId: 2 as UserId,
                receptorId: 1 as UserId
            },
            {
                id: 2 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 333,
                pagadorId: 3 as UserId,
                receptorId: 1 as UserId
            }
        ]

        const balances = calcularBalances(gastos, pagos)
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 0],
           [2 as UserId, 0],
           [3 as UserId, 0]
        ]))
    })

    test("Un gasto por montos", () => {
        const divisionPorMontos: Division = {
            tipo: 'montos',
            montos: [
                {
                    usuarioId: 1 as UserId,
                    monto: 500
                },
                {
                    usuarioId: 2 as UserId,
                    monto: 650
                },
                {
                    usuarioId: 3 as UserId,
                    monto: 100
                }
            ]
        }

        const gastos: Expense[] = [
            {
                id: 1 as ExpenseId,
                descripcion: "Gasto de prueba",
                division: divisionPorMontos,
                fecha: new Date(),
                grupoId: 1 as GroupId,
                montoTotal: 1250,
                pagadorId: 1 as UserId
            }
        ]

        const pagos: Payment[] = [
            {
                id: 1 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 650,
                pagadorId: 2 as UserId,
                receptorId: 1 as UserId
            },
            {
                id: 2 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 100,
                pagadorId: 3 as UserId,
                receptorId: 1 as UserId
            }
        ]

        const balances = calcularBalances(gastos, pagos)
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 0],
           [2 as UserId, 0],
           [3 as UserId, 0]
        ]))
    })

    test("El pagador del gasto no participa", () => {
        
    })
})