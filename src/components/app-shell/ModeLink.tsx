'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ComponentProps } from 'react'
import { modeFromPath, pathFor, type Mode } from '@/lib/mode'

export function useMode(): Mode {
  return modeFromPath(usePathname())
}

type ModeLinkProps = Omit<ComponentProps<typeof Link>, 'href'> & {
  /** An app path such as `/profile`; the current tree's prefix is added. */
  href: string
}

export function ModeLink({ href, ...props }: ModeLinkProps) {
  return <Link href={pathFor(useMode(), href)} {...props} />
}
