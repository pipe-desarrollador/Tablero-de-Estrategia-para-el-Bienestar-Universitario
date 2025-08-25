import { Link } from 'react-router-dom'

export default function NotFound(){
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-slate-600">Página no encontrada.</p>
      <Link to="/" className="btn-primary mt-6 inline-block">Volver al inicio</Link>
    </div>
  )
}
