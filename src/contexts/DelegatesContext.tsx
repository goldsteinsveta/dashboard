/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from 'react'
import { useNetwork } from './NetworkContext'
import { DelegeeListKusama, DelegeeListPolkadot } from '@/lib/constants'
// import { dotApi } from '@/clients'

type DelegatesContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export type Delegate = {
  address: string
  name: string
  image: string
  shortDescription: string
  longDescription: string
  isOrganization: boolean
}

export interface IDelegatesContext {
  delegates: Delegate[]
  getDelegateByAddress: (address: string) => Delegate | undefined
}

const DelegatesContext = createContext<IDelegatesContext | undefined>(undefined)

const DelegateContextProvider = ({ children }: DelegatesContextProps) => {
  const { network } = useNetwork()
  const [delegates, setDelegates] = useState<Delegate[]>([])

  useEffect(() => {
    const fetchOpenPRs = async () => {
      const response = await (
        await fetch(
          network === 'polkadot' || network === 'polkadot-lc'
            ? DelegeeListPolkadot
            : DelegeeListKusama,
        )!
      ).json()
      setDelegates(response)
    }
    fetchOpenPRs()
  }, [network])

  const getDelegateByAddress = (address: string) =>
    delegates.find((d) => d.address === address)

  // Votes thingy - pause for now
  // useEffect(() => {
  //   const a = async (delegates: any[]) => {
  //     const result: Promise<any>[] = delegates.map((d) => {
  //       return dotApi.query.ConvictionVoting.VotingFor.getEntries(d.address)
  //     })
  //     await Promise.all(result).then((res) => {
  //       console.log(res)
  //     })
  //   }
  //   a(delegates)
  // }, [delegates])

  return (
    <DelegatesContext.Provider value={{ delegates, getDelegateByAddress }}>
      {children}
    </DelegatesContext.Provider>
  )
}

const useDelegates = () => {
  const context = useContext(DelegatesContext)
  if (context === undefined) {
    throw new Error(
      'useDelegates must be used within a DelegatesContextProvider',
    )
  }
  return context
}

export { DelegateContextProvider, useDelegates }
