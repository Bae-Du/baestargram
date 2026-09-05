import './PlaceholderPage.css'

type PlaceholderPageProps = {
  title: string
  description: string
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <div className="placeholder-page">
      <h1>{title}</h1>
      <p>{description}</p>
    </div>
  )
}
