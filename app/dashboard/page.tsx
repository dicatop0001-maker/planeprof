'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface Planejamento {
  id: string
  titulo: string
  disciplina: string
  serie: string
  created_at: string
  status: string
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return; }
      setUser(user)

      const { data } = await supabase
        .from('planos_de_aula')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (data) setPlanejamentos(data)
      setLoading(false)
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4 animate-spin">⚙️</div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎓</span>
            <h1 className="text-xl font-bold text-blue-900">Planeprof</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600 hidden sm:block">
              {user?.user_metadata?.nome || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-500 hover:text-gray-700 border border-gray-300 px-3 py-1 rounded-lg transition"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Planejamentos</p>
            <p className="text-3xl font-bold text-blue-600">{planejamentos.length}</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Este mês</p>
            <p className="text-3xl font-bold text-green-600">0</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Disponíveis</p>
            <p className="text-3xl font-bold text-purple-600">40</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500">Plano</p>
            <p className="text-lg font-bold text-orange-600 capitalize">
              {user?.user_metadata?.plano || 'Free'}
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-2xl mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="text-xl font-bold">Criar Novo Planejamento</h2>
            <p className="text-blue-100 text-sm mt-1">Use IA para gerar um plano de aula alinhado à BNCC</p>
          </div>
          <Link
            href="/planejamento/novo"
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition whitespace-nowrap"
          >
            + Novo Plano
          </Link>
        </div>

        {/* Lista de planejamentos */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Meus Planejamentos</h2>
          {planejamentos.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nenhum planejamento ainda</h3>
              <p className="text-gray-500 mb-6">Crie seu primeiro plano de aula com inteligência artificial</p>
              <Link
                href="/planejamento/novo"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition inline-block"
              >
                Criar Primeiro Plano
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {planejamentos.map((plano) => (
                <Link
                  key={plano.id}
                  href={"/planejamento/" + plano.id}
                  className="bg-white p-5 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-2xl">📋</span>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      {plano.status || 'Concluído'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">{plano.titulo}</h3>
                  <p className="text-sm text-gray-500">{plano.disciplina} • {plano.serie}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(plano.created_at).toLocaleDateString('pt-BR')}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
