import { type ClassValue, clsx } from 'clsx'
import { House } from 'lucide-react'
import networks from '@/assets/networks.json'

import { twMerge } from 'tailwind-merge'
import type { NetworkType, RouterType, Vote } from './types'
import { ApiType, NetworksFromConfig } from '@/contexts/NetworkContext'
import { DEFAULT_TIME, lockPeriod, ONE_DAY, THRESHOLD } from './constants'
import { bnMin } from './bnMin'

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const routes: RouterType[] = [
  { link: 'home', name: 'Home', icon: House },
]

export const getChainInformation = (networkName: NetworksFromConfig) => {
  const network: NetworkType = networks[networkName]
  return {
    assetInfo: network.assets[0],
    wsEndpoint: network.nodes[0].url,
  }
}

export const getVoteFromNumber = (input: number): Vote => ({
  aye: Boolean(input & 0b1000_0000),
  conviction: input & 0b0111_1111,
})

export const getNumberFromVote = ({ aye, conviction }: Vote): number =>
  +aye * 0b1000_0000 + conviction

export const indexToConviction = (index: number) => {
  return Object.keys(lockPeriod)[index]
}

const convictionList = Object.keys(lockPeriod)

export const getExpectedBlockTimeMs = async (api: ApiType): Promise<bigint> => {
  const expectedBlockTime = await api.constants.Babe.ExpectedBlockTime()
  if (expectedBlockTime) {
    return bnMin(ONE_DAY, expectedBlockTime)
  }

  const thresholdCheck =
    (await api.constants.Timestamp.MinimumPeriod()) > THRESHOLD

  if (thresholdCheck) {
    return bnMin(ONE_DAY, (await api.constants.Timestamp.MinimumPeriod()) * 2n)
  }

  return bnMin(ONE_DAY, DEFAULT_TIME)
}

export const getLockTimes = async (api: ApiType) => {
  const voteLockingPeriodBlocks =
    await api.constants.ConvictionVoting.VoteLockingPeriod()

  const expectedBlockTimeMs = await getExpectedBlockTimeMs(api)

  const requests = convictionList.map((conviction) => {
    const lockTimeMs =
      expectedBlockTimeMs *
      BigInt(voteLockingPeriodBlocks) *
      BigInt(lockPeriod[conviction])

    return [conviction, lockTimeMs] as const
  })

  return requests.reduce(
    (acc, [conviction, lockPeriod]) => {
      acc[conviction] = lockPeriod

      return acc
    },
    {} as Record<string, bigint>,
  )
}
