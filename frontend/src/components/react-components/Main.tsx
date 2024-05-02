import { type ReactNode } from 'react'

interface Props {
  children: ReactNode | ReactNode[]
}

export default function Main ({ children }: Props) {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">
      {
        Array.isArray(children)
          ? children.map((child, index) => <div key={index}>{child}</div>)
          : <div>{children}</div>
      }
    </main>
  )
}
