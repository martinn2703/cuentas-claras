import { describe, test, expect } from 'vitest';
import { Expense, Payment, Division, ExpenseId, PaymentId, UserId, GroupId, User } from './tipos';
import { calcularBalances, simplificarDeudas } from './balances';

describe("Tests de calcular balances", () => {
    test("Sin gastos ni pagos, todos los balances vacíos", () => {
        const gastos: Expense[] = []
        const pagos: Payment[] = []

        const balances = calcularBalances(gastos, pagos)
        expect(balances).toEqual(new Map())
    })

    test("Un gasto en partes iguales sin redondeo", () => {
        const pagadorGasto = 1 as UserId
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
                pagadorId: pagadorGasto
            }
        ]

        const balances = calcularBalances(gastos, [])
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 600],
           [2 as UserId, -300],
           [3 as UserId, -300]
        ]))
    })

    test("Un gasto en partes iguales con redondeo", () => {
        const pagadorGasto = 1 as UserId
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
                pagadorId: pagadorGasto
            }
        ]

        const balances = calcularBalances(gastos, [])
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 666],
           [2 as UserId, -333],
           [3 as UserId, -333]
        ]))
    })

    test("Un gasto por montos", () => {
        const pagadorGasto = 1 as UserId
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
                pagadorId: pagadorGasto
            }
        ]

        const balances = calcularBalances(gastos, [])
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 750],
           [2 as UserId, -650],
           [3 as UserId, -100]
        ]))
    })

    test("Un gasto donde quien paga no participa (iguales)", () => {
        const pagadorGasto = 1 as UserId
        const divisionPartesIguales: Division = {
            tipo: 'iguales',
            participantes: [2,3] as UserId[]
        }

        const gastos: Expense[] = [
            {
                id: 1 as ExpenseId,
                descripcion: "Gasto de prueba",
                division: divisionPartesIguales,
                fecha: new Date(),
                grupoId: 1 as GroupId,
                montoTotal: 1000,
                pagadorId: pagadorGasto
            }
        ]

        const balances = calcularBalances(gastos, [])
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 1000],
           [2 as UserId, -500],
           [3 as UserId, -500]
        ]))      
    })

    test("Un gasto donde quien paga no participa (por montos)", () => {
        const pagadorGasto = 1 as UserId
        const divisionPorMontos: Division = {
            tipo: 'montos',
            montos: [
                {
                    usuarioId: 2 as UserId,
                    monto: 700
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
                montoTotal: 800,
                pagadorId: pagadorGasto
            }
        ]

        const balances = calcularBalances(gastos, [])
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 800],
           [2 as UserId, -700],
           [3 as UserId, -100]
        ]))      
    })

    test("Un pago que salda exactamente una deuda (balances en 0)", () => {
        const pagadorGasto = 1 as UserId
        const divisionPartesIguales: Division = {
            tipo: 'iguales',
            participantes: [1,2,3,4] as UserId[]
        }

        const gastos: Expense[] = [
            {
                id: 1 as ExpenseId,
                descripcion: "Gasto de prueba",
                division: divisionPartesIguales,
                fecha: new Date(),
                grupoId: 1 as GroupId,
                montoTotal: 2000,
                pagadorId: pagadorGasto
            }
        ]

        const pagos: Payment[] = [
            {
                id: 1 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 500,
                pagadorId: 2 as UserId,
                receptorId: pagadorGasto
            },
            {
                id: 2 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 500,
                pagadorId: 3 as UserId,
                receptorId: pagadorGasto
            },
            {
                id: 3 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 500,
                pagadorId: 4 as UserId,
                receptorId: pagadorGasto
            }
        ]

        const balances = calcularBalances(gastos, pagos)
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 0],
           [2 as UserId, 0],
           [3 as UserId, 0],
           [4 as UserId, 0]
        ]))
    })

    test("Un gasto por montos mal cargado por montos lanza error", () => {
        const pagadorGasto = 1 as UserId
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
                montoTotal: 1300,
                pagadorId: pagadorGasto
            }
        ]

        expect(() => calcularBalances(gastos, [])).toThrow("La suma de los montos no coincide con el monto total del gasto.")
    })

    test("Varios gastos y pagos mezclados, y verificar que la suma da 0", () => {
        const pagadorGastoUno = 1 as UserId
        const pagadorGastoDos = 2 as UserId
        const divisionPartesIguales: Division = {
            tipo: 'iguales',
            participantes: [1,2,3,4] as UserId[]
        }
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
                descripcion: "Primer gasto de prueba",
                division: divisionPartesIguales,
                fecha: new Date(),
                grupoId: 1 as GroupId,
                montoTotal: 2000,
                pagadorId: pagadorGastoUno
            },
            {
                id: 2 as ExpenseId,
                descripcion: "Segundo gasto de prueba",
                division: divisionPorMontos,
                fecha: new Date(),
                grupoId: 1 as GroupId,
                montoTotal: 1250,
                pagadorId: pagadorGastoDos               
            }
        ]

        const pagos: Payment[] = [
            {
                id: 1 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 500,
                pagadorId: 2 as UserId,
                receptorId: pagadorGastoUno
            },
            {
                id: 2 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 500,
                pagadorId: 3 as UserId,
                receptorId: pagadorGastoUno
            },
            {
                id: 3 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 500,
                pagadorId: 4 as UserId,
                receptorId: pagadorGastoUno
            },
            {
                id: 4 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 500,
                pagadorId: 1 as UserId,
                receptorId: pagadorGastoDos
            },
            {
                id: 5 as PaymentId,
                grupoId: 1 as GroupId,
                fecha: new Date(),
                monto: 100,
                pagadorId: 3 as UserId,
                receptorId: pagadorGastoDos
            }
        ]

        const balances = calcularBalances(gastos, pagos)
        expect(balances).toEqual(new Map<UserId, number>([
           [1 as UserId, 0],
           [2 as UserId, 0],
           [3 as UserId, 0],
           [4 as UserId, 0]
        ]))
    })

    test("Probando simplificarDeudas", () => {
        const pagadorGastoUno = 1 as UserId
        const pagadorGastoDos = 2 as UserId
        const divisionPartesIguales: Division = {
            tipo: 'iguales',
            participantes: [1,2,3,4] as UserId[]
        }
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
                descripcion: "Primer gasto de prueba",
                division: divisionPartesIguales,
                fecha: new Date(),
                grupoId: 1 as GroupId,
                montoTotal: 2000, // [1500,-500,-500,-500]
                pagadorId: pagadorGastoUno
            },
            {
                id: 2 as ExpenseId,
                descripcion: "Segundo gasto de prueba",
                division: divisionPorMontos,
                fecha: new Date(),
                grupoId: 1 as GroupId,
                montoTotal: 1250, // [-500,600,-100]
                pagadorId: pagadorGastoDos
            }
        ]

        const balances = calcularBalances(gastos, []);
        expect(balances).toEqual(new Map<UserId, number>([
            [1 as UserId, 1000],
            [2 as UserId, 100],
            [3 as UserId, -600],
            [4 as UserId, -500]
        ]))
        const transferencias = simplificarDeudas(balances);
        expect(transferencias).toEqual([
            {
                de: 3,
                a: 1,
                monto: 600 // [400,100,0,-500]
            },
            {
                de: 4,
                a: 1,
                monto: 400 // [0,100,0,-100]
            },
            {
                de: 4,
                a: 2,
                monto: 100 // [0,0,0,0]
            }
        ])
    })
})