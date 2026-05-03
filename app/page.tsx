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
