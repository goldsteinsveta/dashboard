/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react'
// import { dotApi, dotClient } from '../clients'
import {
  Casting,
  Delegating,
  getVotingTrackInfo,
} from '../lib/currentVotesAndDelegations'
import { useAccounts } from './AccountsContext'
import { getLocksInfo, Locks } from '@/lib/locks'

type LocksContextProps = {
  children: React.ReactNode | React.ReactNode[]
}

export interface ILocksContext {
  currentVotes: Record<number, Casting | Delegating> | undefined
  currentLocks: Locks | undefined
}

const LocksContext = createContext<ILocksContext | undefined>(undefined)

const LocksContextProvider = ({ children }: LocksContextProps) => {
  const [currentVotes, setCurrentVotes] = useState<
    Record<number, Casting | Delegating> | undefined
  >()
  const [currentLocks, setCurrentLocks] = useState<Locks | undefined>()

  const { selectedAccount } = useAccounts()

  useEffect(() => {
    if (!selectedAccount) {
      setCurrentVotes(undefined)
      return
    }

    getVotingTrackInfo(selectedAccount.address)
      .then((votes) => setCurrentVotes(votes))
      .catch(console.error)
  }, [selectedAccount])

  useEffect(() => {
    if (!selectedAccount) {
      setCurrentVotes(undefined)
      return
    }

    getLocksInfo(selectedAccount.address)
      .then((locks) => setCurrentLocks(locks))
      .catch(console.error)
  }, [selectedAccount])

  return (
    <LocksContext.Provider value={{ currentVotes, currentLocks }}>
      {children}
    </LocksContext.Provider>
  )
}

const useLocks = () => {
  const context = useContext(LocksContext)
  if (context === undefined) {
    throw new Error('useLocks must be used within a LocksContextProvider')
  }
  return context
}

export { LocksContextProvider, useLocks }
