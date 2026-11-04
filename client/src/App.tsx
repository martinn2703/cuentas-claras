import type { Expense, Transferencia, User, UserId } from "@cuentas-claras/shared";

type ListaDeGastosProps = {
    gastos: readonly Expense[],
    usuarios: User[]
}

type BalancesProps = {
    balances: Map<UserId,number>,
    usuarios: User[]
}

type DeudasProps = {
    transferencias: readonly Transferencia[],
    usuarios: User[]
}

function formatearMonto(centavos: number): string{
    return Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS" }).format(centavos/100)
}

function buscarUsuario(usuarios: User[], id: UserId){
    const usuario = usuarios.find(u => u.id === id);
    if (usuario === undefined) return "(desconocido)"

    return usuario.nombre
}

export function ListaDeGastos({gastos, usuarios}: ListaDeGastosProps){
    return (
        <div>
            {
                gastos.map(gasto => {
                    const pagador: string = buscarUsuario(usuarios, gasto.pagadorId)
                    return (
                        <section key={gasto.id}>
                            <h4>Descripción: {gasto.descripcion}</h4>
                            <p>Monto total: {formatearMonto(gasto.montoTotal)}</p>
                            <p>Pagó {pagador}</p>
                            <p>Fecha: {gasto.fecha.toLocaleDateString("es-AR")}</p>
                        </section>
                    )
                })
            }
        </div>
    )
}

export function Balances({balances, usuarios}: BalancesProps){
    return (
        <ul>
            {Array.from(balances, ([id,monto]) => 
                <li key={id} style={{ color: monto >= 0 ? 'green' : 'red' }}>
                    {buscarUsuario(usuarios, id)}: {formatearMonto(monto)}
                </li>
            )}
        </ul>
    )
}

export function Deudas({transferencias, usuarios}: DeudasProps){
    return (
        <div>
            {
                transferencias.map(t => {
                    const key: string = t.de + "|" + t.a
                    console.log("Key: ",key)
                    const deudor: string = buscarUsuario(usuarios, t.de);
                    const acreedor: string = buscarUsuario(usuarios, t.a);
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