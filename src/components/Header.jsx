export default function Header() {
  return (
    <div className="header">
      <img src={`${import.meta.env.BASE_URL}logo-192.png`} alt="Gotcha" className="header-logo" />
      <span className="header-title">Gotcha</span>
    </div>
  )
}
