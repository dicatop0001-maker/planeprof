import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="text-6xl mb-4">🎓</div>
          <h1 className="text-5xl font-bold text-blue-900 mb-4">Planeprof</h1>
          <p className="text-xl text-gray-600 mb-2">
            Planejamento de Aulas baseado na BNCC
          </p>
          <p className="text-gray-500 mb-8">Para Educação Infantil e Ensino Fundamental</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition">
              Entrar
            </Link>
            <Link href="/cadastro" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-50 transition">
              Cadastrar Grátis
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">📋</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Alinhado à BNCC</h3>
            <p className="text-gray-600">Habilidades e competências automaticamente vinculadas à Base Nacional Comum Curricular.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">🤖</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">IA com GPT-4</h3>
            <p className="text-gray-600">Inteligência artificial gera planos completos com objetivos, desenvolvimento e avaliação.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">📄</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Exportação PDF/Word</h3>
            <p className="text-gray-600">Exporte seus planos de aula em PDF ou Word com formatação profissional.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Dinâmicas Visuais</h3>
            <p className="text-gray-600">Geração automática de jogos e dinâmicas com imagens ilustrativas.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">♿</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">PDI Inclusivo</h3>
            <p className="text-gray-600">Plano de Desenvolvimento Individual para alunos com necessidades especiais.</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Acessível</h3>
            <p className="text-gray-600">Apenas R$ 9,90/mês ou R$ 100,00/ano para 40 planejamentos mensais.</p>
          </div>
        </div>

        <div className="text-center bg-blue-600 text-white p-8 rounded-2xl mb-16">
          <h2 className="text-3xl font-bold mb-6">Escolha seu Plano</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/20 p-6 rounded-xl border border-white/30">
              <h3 className="text-xl font-bold mb-2">Mensal</h3>
              <p className="text-4xl font-bold mb-1">R$ 9,90</p>
              <p className="text-sm opacity-80 mb-4">por mês</p>
              <p className="text-sm">40 planejamentos/mês</p>
              <p className="text-sm">Exportação PDF e Word</p>
              <p className="text-sm">Suporte por e-mail</p>
            </div>
            <div className="bg-white p-6 rounded-xl text-blue-900 border-2 border-yellow-400">
              <div className="text-xs font-bold text-yellow-600 mb-2 uppercase">Mais Popular</div>
              <h3 className="text-xl font-bold mb-2">Anual</h3>
              <p className="text-4xl font-bold mb-1">R$ 100,00</p>
              <p className="text-sm text-gray-500 mb-4">por ano (economia de R$ 18,80)</p>
              <p className="text-sm">40 planejamentos/mês</p>
              <p className="text-sm">Exportação PDF e Word</p>
              <p className="text-sm">Suporte prioritário</p>
            </div>
          </div>
          <div className="mt-6">
            <Link href="/cadastro" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-50 transition inline-block">
              Começar Agora
            </Link>
          </div>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <p>Desenvolvido com ❤️ para educadores brasileiros</p>
          <p className="mt-1">Contato: dicatop0001@gmail.com</p>
        </footer>
      </div>
    </main>
  )
}
