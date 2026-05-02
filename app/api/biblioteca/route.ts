import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
}

// GET /api/biblioteca - Lista planos públicos
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const disciplina = searchParams.get('disciplina')
    const serie = searchParams.get('serie')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = 12
    const offset = (page - 1) * limit

    const supabase = getSupabase()
    let query = supabase
      .from('planos_de_aula')
      .select('id, titulo, disciplina, serie, bimestre, conteudo, habilidades_bncc, objetivos, desenvolvimento, conclusao, dinamica, tipo_letra, downloads, created_at', { count: 'exact' })
      .eq('na_biblioteca', true)
      .eq('status', 'concluido')
      .order('downloads', { ascending: false })
      .range(offset, offset + limit - 1)

    if (disciplina) query = query.eq('disciplina', disciplina)
    if (serie) query = query.eq('serie', serie)

    const { data, error, count } = await query

    if (error) throw error

    return NextResponse.json({ planos: data || [], total: count || 0, page, limit })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST /api/biblioteca/download - Incrementa contador de downloads
export async function POST(req: NextRequest) {
  try {
    const { planoId } = await req.json()
    if (!planoId) return NextResponse.json({ error: 'planoId obrigatório' }, { status: 400 })

    const supabase = getSupabase()

    // Busca plano atual
    const { data: plano, error: fetchError } = await supabase
      .from('planos_de_aula')
      .select('downloads, na_biblioteca')
      .eq('id', planoId)
      .single()

    if (fetchError || !plano) return NextResponse.json({ error: 'Plano não encontrado' }, { status: 404 })
    if (!plano.na_biblioteca) return NextResponse.json({ error: 'Plano não está na biblioteca' }, { status: 403 })

    // Incrementa downloads
    const { error: updateError } = await supabase
      .from('planos_de_aula')
      .update({ downloads: (plano.downloads || 0) + 1 })
      .eq('id', planoId)

    if (updateError) throw updateError

    return NextResponse.json({ success: true })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
