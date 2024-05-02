import type React from 'react'

interface Props {
  title: string
  filter?: React.ReactElement
}

export default function Title ({ title, filter }: Props) {
  return (
    <div className="mx-auto flex items-center justify-between w-full gap-2">
      <h1 className="text-3xl font-semibold">{title}</h1>
      {(filter != null) && <div>{filter}</div>}
    </div>
  )
}
