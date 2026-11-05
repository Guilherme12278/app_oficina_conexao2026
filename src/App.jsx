import { useState } from 'react'
import {
  Activity, ArrowUpRight, Bell, Check, ChevronDown, CircleHelp,
  ClipboardList, Gauge, LayoutDashboard, Menu, Plus, Settings,
  ShieldCheck, Users, Wrench, X,
} from 'lucide-react'
import { isSupabaseConfigured, supabase } from './supabaseClient'

const navigation = [
  { label: 'Visão geral', icon: LayoutDashboard },
  { label: 'Cadastros', icon: Users },
  { label: 'Ordens de serviço', icon: ClipboardList },
  { label: 'Configurações', icon: Settings },
]

export default function App() {
  const [activePage, setActivePage] = useState('Visão geral')
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [recentNames, setRecentNames] = useState([])

  async function handleSubmit(event) {
    event.preventDefault()
    const cleanName = name.trim()
    if (!cleanName) {
      setMessage('Digite um nome antes de salvar.')
      return
    }

    if (!isSupabaseConfigured) {
      setMessage('Modo demonstração: configure as variáveis do Supabase para salvar no banco.')
      return
    }

    setSaving(true)
    setMessage('')
    const { error } = await supabase.from('teste_nomes').insert({ nome: cleanName })
    setSaving(false)

    if (error) {
      setMessage(`Não foi possível salvar: ${error.message}`)
      return
    }

    setRecentNames((items) => [cleanName, ...items].slice(0, 4))
    setName('')
    setMessage('Nome salvo no Supabase com sucesso!')
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <button className="icon-button mobile-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Abrir menu">
            {sidebarOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <div className="brand-mark"><Wrench size={19} /></div>
          <span>Oficina<span className="brand-light">Conexão</span></span>
          <span className="brand-tag">2026</span>
        </div>
        <div className="topbar-actions">
          <span className={`connection-pill ${isSupabaseConfigured ? 'connected' : 'disconnected'}`}>
            <span className="status-dot" /> {isSupabaseConfigured ? 'Supabase configurado' : 'Modo demonstração'}
          </span>
          <button className="icon-button notification-button" aria-label="Notificações"><Bell size={18} /><i /></button>
          <div className="avatar">GL</div>
          <button className="profile-button">Guilherme <ChevronDown size={15} /></button>
        </div>
      </header>

      <div className="workspace">
        <aside className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="workspace-label">WORKSPACE</div>
          <div className="workspace-select"><div className="workspace-icon"><Wrench size={16} /></div><span>Oficina Central</span><ChevronDown size={15} /></div>
          <div className="nav-label">MENU PRINCIPAL</div>
          <nav>
            {navigation.map(({ label, icon: Icon }) => (
              <button key={label} className={`nav-item ${activePage === label ? 'active' : ''}`} onClick={() => { setActivePage(label); setSidebarOpen(false) }}>
                <Icon size={18} /><span>{label}</span>{label === 'Ordens de serviço' && <span className="nav-count">3</span>}
              </button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <div className="help-card"><div className="help-icon"><CircleHelp size={17} /></div><strong>Precisa de ajuda?</strong><p>Este é um ambiente de demonstração.</p><button onClick={() => setMessage('Central de ajuda: funcionalidade mockada.')}>Acessar ajuda <ArrowUpRight size={14} /></button></div>
            <div className="sidebar-version"><span>Oficina Conexão</span><span>v0.1.0 · Teste</span></div>
          </div>
        </aside>

        <main className="main-content">
          <div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{activePage}</strong></div>
          <div className="page-heading">
            <div><div className="eyebrow"><Activity size={14} /> AMBIENTE DE TESTES</div><h1>{activePage}</h1><p>Uma estrutura inicial para validar a navegação e a conexão com o banco de dados.</p></div>
            <div className="date-chip"><Gauge size={15} /> Projeto de demonstração</div>
          </div>

          <section className="stats-grid">
            <article className="stat-card"><div className="stat-icon purple"><Users size={19} /></div><span className="stat-label">Cadastros nesta sessão</span><strong>{recentNames.length.toString().padStart(2, '0')}</strong><small>Dados locais de demonstração</small></article>
            <article className="stat-card"><div className="stat-icon green"><ShieldCheck size={19} /></div><span className="stat-label">Banco de dados</span><strong>{isSupabaseConfigured ? 'Pronto' : 'Pendente'}</strong><small>{isSupabaseConfigured ? 'Credenciais encontradas' : 'Aguardando credenciais'}</small></article>
            <article className="stat-card"><div className="stat-icon orange"><Activity size={19} /></div><span className="stat-label">Navegação</span><strong>Mockada</strong><small>Menus interativos para teste</small></article>
          </section>

          <section className="content-grid">
            <article className="panel form-panel">
              <div className="panel-heading"><div><span className="panel-kicker">CADASTRO SIMPLES</span><h2>Teste de conexão</h2><p>Informe um nome para testar a gravação no Supabase.</p></div><div className="panel-heading-icon"><Plus size={19} /></div></div>
              <form onSubmit={handleSubmit}>
                <label htmlFor="person-name">Nome</label>
                <input id="person-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Digite um nome..." maxLength={100} />
                <div className="input-hint">Até 100 caracteres.</div>
                <button className="submit-button" type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Salvar nome'} <ArrowUpRight size={17} /></button>
                {message && <div className={`feedback ${message.includes('sucesso') ? 'success' : 'info'}`}>{message.includes('sucesso') && <Check size={16} />}{message}</div>}
              </form>
            </article>

            <article className="panel activity-panel">
              <div className="panel-heading"><div><span className="panel-kicker">ATIVIDADE</span><h2>Últimos registros</h2><p>Registros feitos nesta sessão.</p></div></div>
              {recentNames.length ? <ul className="recent-list">{recentNames.map((item, index) => <li key={index}><div className="recent-avatar">{item.charAt(0).toUpperCase()}</div><span>{item}</span><Check size={16} className="recent-check" /></li>)}</ul> : <div className="empty-state"><div className="empty-icon"><Users size={21} /></div><strong>Nenhum registro por aqui</strong><span>Os nomes salvos nesta sessão aparecerão aqui.</span></div>}
            </article>
          </section>
          <div className="mock-notice"><Activity size={16} /><span><strong>Área de teste:</strong> os itens do menu são navegáveis, mas as outras telas ainda são apenas demonstração.</span></div>
        </main>
      </div>

      <footer className="footer"><span>© 2026 Oficina Conexão · Projeto de teste</span><div><button onClick={() => setMessage('Documentação mockada para este protótipo.')}>Documentação</button><span className="footer-separator">·</span><button onClick={() => setMessage('Status do protótipo: interface carregada.')}>Status do sistema</button><span className="footer-status"><i /> Todos os sistemas operacionais</span></div></footer>
    </div>
  )
}
