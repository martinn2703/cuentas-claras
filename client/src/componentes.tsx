import type { Expense, Transferencia, User, UserId } from "@cuentas-claras/shared";
import { usuarios } from "./datosDePrueba";

type ListaDeGastosProps = {
    gastos: Expense[],
    usuarios: User[]
}

type BalancesProps = {
    balances: Map<UserId,number>,
    usuarios: User[]
}

function formatearMonto(centavos: number): string{
    return Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(centavos/100)
}

export function ListaDeGastos({ gastos , usuarios}: ListaDeGastosProps){
    return (
        <div>
            {
                gastos.map(gasto => {
                    const pagador: string = usuarios.find(u => u.id === gasto.pagadorId)!.nombre;
                    return (
                        <section key={gasto.id}>
                            <h4>Descripción: {gasto.descripcion}</h4>
                            <p>Monto total: {formatearMonto(gasto.montoTotal)}</p>
                            <p>Pagó {pagador}</p>
                            <p>Fecha: {gasto.fecha.toDateString()}</p>
                        </section>
                    )
                })
            }
        </div>
    )
}

export function Balances({balances, usuarios}: BalancesProps){
    let retorno = []
    
    for(const balance of balances){
        const usuario: string = usuarios.find(u => u.id === balance[0])!.nombre;
        const color: string = balance[1] >= 0 ? 'green' : 'red';
        retorno.push(
            <li key={balance[0]} style={{ color: color }}>{usuario}: {formatearMonto(balance[1])}</li>
        )
    }

    return <ul>{retorno}</ul>
}

export function Deudas({transferencias}: {transferencias: Transferencia[]}){
    return (
        <div>
            {
                transferencias.map(t => {
                    const key = crypto.randomUUID()
                    const deudor: string = usuarios.find(u => u.id === t.de)!.nombre;
                    const acreedor: string = usuarios.find(u => u.id === t.a)!.nombre;
                    return (
                        <p key={key}>
                            {deudor} le debe {formatearMonto(t.monto)} a {acreedor}
                        </p>                        
                    )
                })
            }
        </div>
    )
}