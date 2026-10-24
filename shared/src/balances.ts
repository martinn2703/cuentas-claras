import { Expense,Payment,UserId } from "./tipos";

export function calcularBalances(
  gastos: readonly Expense[],
  pagos: readonly Payment[],
): Map<UserId, number>{
    const balances: Map<UserId, number> = new Map()

    for(const gasto of gastos){
        const division = gasto.division
        const pagador = gasto.pagadorId
        const montoTotal = gasto.montoTotal
        
        switch (division.tipo){
            case "iguales":
                if (division.participantes.length === 0) throw new Error("No hay participantes en el gasto.")
                const pagadorParticipa = division.participantes.includes(pagador)
                if (!pagadorParticipa) balances.set(pagador, (balances.get(pagador) ?? 0) + montoTotal)
                const cantidadParticipantes = division.participantes.length
                const cantidadCentavosExtra = montoTotal % cantidadParticipantes
                let centavosExtraRestantes = cantidadCentavosExtra

                for(let i=0; i<cantidadParticipantes; i++){
                    const userId = division.participantes[i];
                    let montoPorParticipante = (montoTotal - cantidadCentavosExtra) / cantidadParticipantes
                    if (centavosExtraRestantes){
                        montoPorParticipante += 1
                        centavosExtraRestantes -= 1
                    }

                    if (userId === undefined) continue;
                    if (pagador === userId){
                        balances.set(userId, (balances.get(userId) ?? 0) + (montoTotal - montoPorParticipante))
                    } else {
                        balances.set(userId, (balances.get(userId) ?? 0) - montoPorParticipante)
                    }
                }
                break;
            case "montos":
                const sumaMontos = division.montos.reduce((acumulador, actual) => acumulador + actual.monto, 0)
                if (sumaMontos !== montoTotal) throw new Error("La suma de los montos no coincide con el monto total del gasto.");

                for(const monto of division.montos){
                    if(monto.usuarioId === pagador){
                        balances.set(monto.usuarioId, (balances.get(monto.usuarioId) ?? 0) + (montoTotal - monto.monto))
                    } else {
                        balances.set(monto.usuarioId, (balances.get(monto.usuarioId) ?? 0) - monto.monto)
                    }                    
                }
                break;
            default:
                const _chequeo: never = division;
                return _chequeo;
        }
    }

    for(const pago of pagos){
        const pagador = pago.pagadorId
        const receptor = pago.receptorId
        const monto = pago.monto

        balances.set(pagador, (balances.get(pagador) ?? 0) + monto)
        balances.set(receptor, (balances.get(receptor) ?? 0) - monto)
    }

    const sumaBalances = Array.from(balances.values()).reduce((acumulador, actual) => acumulador + actual, 0);

    if (sumaBalances !== 0) throw new Error("La suma de los balances no dio 0.");

    return balances
}
