import { calcularBalances, type Division, type Expense, type ExpenseId, type GroupId, type UserId } from "@cuentas-claras/shared";

const pagadorGastoUno = 1 as UserId
const pagadorGastoDos = 2 as UserId
const divisionPartesIgualesGastoUno: Division = {
    tipo: 'iguales',
    participantes: [1,3] as UserId[]
}

const divisionPartesIgualesGastoDos: Division = {
    tipo: 'iguales',
    participantes: [2,3] as UserId[]
}

const gastos: Expense[] = [
    {
        id: 1 as ExpenseId,
        descripcion: "Gasto uno",
        division: divisionPartesIgualesGastoUno,
        fecha: new Date(),
        grupoId: 1 as GroupId,
        montoTotal: 1000,
        pagadorId: pagadorGastoUno
    },
    {
        id: 1 as ExpenseId,
        descripcion: "Gasto dos",
        division: divisionPartesIgualesGastoDos,
        fecha: new Date(),
        grupoId: 1 as GroupId,
        montoTotal: 1000,
        pagadorId: pagadorGastoDos
    }
]

const balances = calcularBalances(gastos, [])

function Component(){
  return (
    <>
      Cantidad de personas en el Map: {balances.size}
    </>
  )
}

export default Component 