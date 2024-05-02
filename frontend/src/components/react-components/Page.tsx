import { type ReactNode } from 'react'

interface Props {
  children: ReactNode | ReactNode[]
}

export default function Page ({ children }: Props) {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {
        Array.isArray(children)
          ? children.map((child, index) => <div key={index}>{child}</div>)
          : <div>{children}</div>
      }
    </div>
  )
}
