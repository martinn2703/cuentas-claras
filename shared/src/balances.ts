import { Expense,Payment,Transferencia,UserId } from "./tipos";

export function calcularBalances(
  gastos: readonly Expense[],
  pagos: readonly Payment[],
): Map<UserId, number>{
    const balances: Map<UserId, number> = new Map()

    for(const gasto of gastos){
        const division = gasto.division
        const pagador = gasto.pagadorId
        const montoTotal = gasto.montoTotal
        
        balances.set(pagador, (balances.get(pagador) ?? 0) + montoTotal)

        switch (division.tipo){
            case "iguales":
                if (division.participantes.length === 0) throw new Error("No hay participantes en el gasto.")
                const cantidadParticipantes = division.participantes.length
                const cantidadCentavosExtra = montoTotal % cantidadParticipantes
                let centavosExtraRestantes = cantidadCentavosExtra

                for(const participante of division.participantes){
                    let montoPorParticipante = (montoTotal - cantidadCentavosExtra) / cantidadParticipantes
                    if (centavosExtraRestantes){
                        montoPorParticipante += 1
                        centavosExtraRestantes -= 1
                    }

                    balances.set(participante, (balances.get(participante) ?? 0) - montoPorParticipante)
                }
                break;
            case "montos":
                const sumaMontos = division.montos.reduce((acumulador, actual) => acumulador + actual.monto, 0)
                if (sumaMontos !== montoTotal) throw new Error("La suma de los montos no coincide con el monto total del gasto.");

                for(const monto of division.montos)
                    balances.set(monto.usuarioId, (balances.get(monto.usuarioId) ?? 0) - monto.monto)                 
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

export function simplificarDeudas(
  balances: Map<UserId, number>,
): Transferencia[]{
    const transferencias: Transferencia[] = []
    const _balances = new Map(balances) // si hacemos const _balances = balances, apuntan a lo mismo, entonces al modificar _balances también se modifica balances

    while(Array.from(_balances.values()).some(v => v !== 0)){
        const [usuarioConMayorSaldo, credito] = Array.from(_balances.entries()).reduce(
            (max, actual) => (actual[1] > max[1] ? actual : max)
        );
        
        const [usuarioQueDebeMas, deuda] = Array.from(_balances.entries()).reduce(
            (min, actual) => (actual[1] < min[1] ? actual : min)
        );

        const montoTransferido = Math.min(credito, -deuda)

        _balances.set(usuarioQueDebeMas, (credito + deuda) < 0 ? credito + deuda : 0 )
        _balances.set(usuarioConMayorSaldo, (credito + deuda) < 0 ? 0 : credito + deuda)

        transferencias.push({
            de: usuarioQueDebeMas,
            a: usuarioConMayorSaldo,
            monto: montoTransferido
        })
    }

    return transferencias
}
