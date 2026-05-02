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
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Biblioteca de Planos</h3>
            <p className="text-gray-600">Acesse planos prontos criados por outros professores e compartilhe os seus.</p>
          </div>
        </div>

        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8 rounded-2xl mb-16">
          <div className="text-4xl mb-3">🎁</div>
          <h2 className="text-2xl font-bold mb-2">Primeiro planejamento gratuito!</h2>
          <p className="text-blue-100 mb-6">Crie sua conta, gere seu primeiro plano de aula com IA e baixe gratuitamente. Sem precisar de cartão.</p>
          <Link href="/cadastro" className="bg-white text-blue-600 px-8 py-3 rounded-lg text-lg font-bold hover:bg-blue-50 transition inline-block">
            Começar Grátis Agora
          </Link>
        </div>

        <footer className="text-center text-gray-500 text-sm">
          <p>Desenvolvido com ❤️ para educadores brasileiros</p>
          <p className="mt-1">Contato: dicatop0001@gmail.com</p>
        </footer>
      </div>
    </main>
  )
}
