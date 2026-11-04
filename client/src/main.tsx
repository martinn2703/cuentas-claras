import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Balances, Deudas, ListaDeGastos } from './App.tsx'
import { gastos, usuarios, pagos } from './datosDePrueba.ts'
import { calcularBalances, simplificarDeudas } from '@cuentas-claras/shared'

const balances = calcularBalances(gastos, pagos)
const transferencias = simplificarDeudas(balances)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListaDeGastos gastos={gastos} usuarios={usuarios}/>
    <Balances balances={balances} usuarios={usuarios}/>
    <Deudas usuarios={usuarios} transferencias={transferencias}/>
  </StrictMode>,
)
