import { redirect } from 'next/navigation'

// Página de login removida — autenticação agora ocorre apenas no download do planejamento
export default function LoginPage() {
  redirect('/')
  }