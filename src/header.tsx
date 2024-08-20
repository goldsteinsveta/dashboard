import { Polkicon } from '@polkadot-ui/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { routes } from '@/lib/utils'
import { useWalletDisconnector } from '@reactive-dot/react'
import { Settings2, PanelLeft } from 'lucide-react'

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from '@/components/ui/menubar'
import { useAccounts } from './contexts/AccountsContext'

export const Header = () => {
  const { accounts, selectAccount, selectedAccount } = useAccounts()
  const [, disconnectAll] = useWalletDisconnector()
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:sticky sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            {routes.map((r) => (
              <a
                key={r.name}
                href={`/${r.link || ''}`}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <r.icon className="h-5 w-5" />
                {r.name}
              </a>
            ))}
            <a
              href="#"
              className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
            >
              <Settings2 className="h-5 w-5" />
              Settings
            </a>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex justify-between w-full">
        <div>
          {/* TODO: split submenu based on routes */}
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>File</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Share</MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Print</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>
        </div>
        <div className="">
          {!accounts.length && (
            <dc-connection-button>Connect</dc-connection-button>
          )}
          {!!accounts.length && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="default"
                  className="overflow-hidden cursor-pointer"
                >
                  <Polkicon
                    size={36}
                    address={selectedAccount?.address || ''}
                    className="mr-2"
                  />
                  {selectedAccount?.name}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {accounts.map((account, index) => (
                  <>
                    <DropdownMenuItem
                      className="cursor-pointer"
                      key={account.address}
                      onClick={() => selectAccount(account)}
                    >
                      <Polkicon
                        copy
                        size={28}
                        address={account.address || ''}
                        className="mr-2"
                      />
                      {account.name}
                    </DropdownMenuItem>
                    {index !== accounts.length - 1 && <DropdownMenuSeparator />}
                  </>
                ))}
                <DropdownMenuItem
                  className="cursor-pointer"
                  key={'logout'}
                  onClick={() => disconnectAll()}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  )
}
