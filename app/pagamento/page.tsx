'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function PagamentoPage() {
  const [plano, setPlano] = useState<'mensal' | 'anual'>('mensal')
  const [enviado, setEnviado] = useState(false)
  const [arquivo, setArquivo] = useState<File | null>(null)
  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleEnviar = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviado(true)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">← Dashboard</Link>
          <h1 className="text-xl font-bold text-blue-900">Pagamento</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {enviado ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Comprovante enviado!</h2>
            <p className="text-gray-600 mb-6">Seu pagamento será verificado e o plano ativado em até 24 horas.</p>
            <Link href="/dashboard" className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition inline-block">
              Voltar ao Dashboard
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold mb-6 text-gray-800">Escolha seu Plano</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <button
                onClick={() => setPlano('mensal')}
                className={"p-4 rounded-xl border-2 transition " + (plano === 'mensal' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300')}
              >
                <p className="font-bold text-lg">Mensal</p>
                <p className="text-2xl font-bold text-blue-600">R$ 9,90</p>
                <p className="text-sm text-gray-500">40 planos/mês</p>
              </button>
              <button
                onClick={() => setPlano('anual')}
                className={"p-4 rounded-xl border-2 transition " + (plano === 'anual' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 hover:border-blue-300')}
              >
                <p className="font-bold text-lg">Anual</p>
                <p className="text-2xl font-bold text-blue-600">R$ 100,00</p>
                <p className="text-sm text-gray-500">40 planos/mês</p>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-800 mb-2">Como pagar via PIX:</h3>
              <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                <li>Abra o app do seu banco</li>
                <li>Selecione pagamento via PIX</li>
                <li>Use a chave PIX: <strong>42988880353</strong></li>
                <li>Valor: <strong>{plano === 'mensal' ? 'R$ 9,90' : 'R$ 100,00'}</strong></li>
                <li>Tire foto do comprovante</li>
                <li>Envie o comprovante abaixo</li>
              </ol>
            </div>

            <div className="bg-gray-100 rounded-xl p-4 mb-6 text-center">
              <p className="text-sm text-gray-600 mb-1">Chave PIX</p>
              <p className="text-2xl font-bold text-gray-800 font-mono">42988880353</p>
              <p className="text-sm text-gray-500">(WhatsApp/Celular)</p>
            </div>

            <form onSubmit={handleEnviar}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comprovante de Pagamento
                </label>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setArquivo(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Enviar Comprovante
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}
