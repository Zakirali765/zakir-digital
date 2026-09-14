import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  Bot,
  Check,
  CheckCircle2,
  ClipboardCheck,
  FileSpreadsheet,
  HelpCircle,
  Mail,
  MessageCircle,
  MessagesSquare,
  Route,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck,
  X,
} from 'lucide-react'

type BotpressApi = {
  open?: () => void
  sendMessage?: (message: string) => Promise<void>
  on?: (event: string, handler: () => void) => (() => void) | void
}

declare global {
  interface Window {
    botpress?: BotpressApi
  }
}

type IconType = typeof CheckCircle2

const prompts = [
  'I have a leaking kitchen tap. Is this urgent?',
  'Do you offer boiler repairs in Hackney?',
  'I need a quote for a new boiler.',
]

const valueCards: { icon: IconType; title: string; copy: string }[] = [
  {
    icon: ShieldCheck,
    title: 'Answers common questions',
    copy: 'Gives visitors helpful answers from verified A&E service information.',
  },
  {
    icon: Route,
    title: 'Understands the request',
    copy: 'Guides visitors to the right service without making them complete a long form.',
  },
  {
    icon: AlertTriangle,
    title: 'Handles potential urgency carefully',
    copy: 'Recognises urgent plumbing or heating requests and collects the shortest necessary information.',
  },
  {
    icon: ClipboardCheck,
    title: 'Captures a clearer enquiry',
    copy: 'Collects relevant details one by one, checks for missing information, then asks for consent before submitting.',
  },
]

const deliveryCards: { icon: IconType; title: string; copy: string }[] = [
  { icon: Mail, title: 'Email notification', copy: 'A clear enquiry sent to your inbox.' },
  { icon: MessageCircle, title: 'WhatsApp Business', copy: 'A formatted service request sent to your business WhatsApp.' },
  { icon: UserCheck, title: 'HubSpot CRM', copy: 'Contact details and enquiry information saved in your CRM.' },
  { icon: FileSpreadsheet, title: 'Google Sheets or another approved system', copy: 'A simple shared lead log for follow-up.' },
]

const does = [
  'Use verified service and contact information.',
  'Make clear that enquiries are reviewed by the team.',
  'Ask for consent before submitting personal details.',
  'Escalate potentially urgent requests without making promises.',
]

const doesNot = [
  'Invent prices, availability, guarantees or service areas.',
  'Confirm an appointment or engineer arrival.',
  'Give unverified gas-safety advice.',
  'Submit details when the visitor does not consent.',
]

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function PrimaryButton({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <button type="button" onClick={onClick} className={`button button-primary ${className}`}>
      {children}
    </button>
  )
}

function App() {
  const [assistantReady, setAssistantReady] = useState(false)
  const [promptStatus, setPromptStatus] = useState('')

  useEffect(() => {
    let cancelled = false
    let attempts = 0
    let removeListener: (() => void) | void

    const connect = () => {
      const botpress = window.botpress
      if (botpress?.on) {
        setAssistantReady(true)
        removeListener = botpress.on('webchat:initialized', () => !cancelled && setAssistantReady(true))
        return
      }
      attempts += 1
      if (attempts < 40) window.setTimeout(connect, 250)
    }

    connect()
    return () => {
      cancelled = true
      if (typeof removeListener === 'function') removeListener()
    }
  }, [])

  const openAssistant = () => {
    scrollTo('assistant')
    window.setTimeout(() => window.botpress?.open?.(), 250)
  }

  const usePrompt = async (prompt: string) => {
    const botpress = window.botpress
    if (botpress?.open) {
      botpress.open()
      if (botpress.sendMessage) {
        try {
          await botpress.sendMessage(prompt)
          setPromptStatus('Prompt sent to the assistant.')
          return
        } catch {
          // The first send can arrive before Webchat is ready; retry through its ready event below.
        }
      }
      if (botpress.on) {
        let remove: (() => void) | void
        remove = botpress.on('webchat:ready', async () => {
          try {
            await window.botpress?.sendMessage?.(prompt)
            setPromptStatus('Prompt sent to the assistant.')
          } finally {
            if (typeof remove === 'function') remove()
          }
        })
        return
      }
    }

    try {
      await navigator.clipboard.writeText(prompt)
      setPromptStatus('Prompt copied. Open the assistant and paste it into the message box.')
    } catch {
      setPromptStatus(`Copy this prompt: ${prompt}`)
    }
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">Skip to main content</a>

      <div className="preview-notice" role="note">
        <ShieldCheck size={16} aria-hidden="true" />
        <span>Private preview prepared independently by ZAKIR DIGITAL for A&amp;E Plumbing &amp; Gas 24/7. This is not an official A&amp;E website or a live customer-service channel.</span>
      </div>

      <header className="site-header">
        <div className="header-inner">
          <a className="wordmark" href="#top" aria-label="ZAKIR DIGITAL home">ZAKIR DIGITAL</a>
          <div className="header-actions">
            <span className="header-label">Private Preview for A&amp;E</span>
            <PrimaryButton onClick={openAssistant}>Test the assistant <ArrowRight size={17} /></PrimaryButton>
          </div>
        </div>
      </header>

      <main id="main">
        <section id="top" className="hero section-pad">
          <div className="page-grid hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">Private support &amp; lead-capture preview for A&amp;E Plumbing &amp; Gas 24/7</p>
              <h1>Turn more website visitors into clear service enquiries — even when you’re busy.</h1>
              <p className="hero-lede">This tailored website assistant can answer verified service questions, recognise potentially urgent enquiries, and collect the right details for your team to review.</p>
              <div className="hero-actions">
                <PrimaryButton onClick={openAssistant}>Test the A&amp;E assistant <ArrowRight size={18} /></PrimaryButton>
                <button type="button" className="button button-secondary" onClick={() => scrollTo('handoff')}>See how enquiries reach your team <ArrowDown size={17} /></button>
              </div>
              <div className="trust-chips" aria-label="Assistant safeguards">
                <span><Check size={15} /> Uses verified business information</span>
                <span><Check size={15} /> Does not promise bookings, prices or arrival times</span>
                <span><Check size={15} /> Submits details only after customer consent</span>
              </div>
            </div>

            <div id="assistant" className="assistant-frame scroll-target" aria-label="Live A&E assistant test area">
              <div className="browser-bar" aria-hidden="true">
                <div className="browser-dots"><span /><span /><span /></div>
                <div className="browser-address">Private preview · Live assistant</div>
              </div>
              <div id="bp-embedded-webchat" className="embedded-chat" />
              <div className="assistant-fallback">
                <div className="assistant-identity">
                  <div className="assistant-icon"><Bot size={24} /></div>
                  <div>
                    <strong>A&amp;E website assistant</strong>
                    <span><i className={assistantReady ? 'ready-dot' : 'loading-dot'} /> {assistantReady ? 'Ready to test' : 'Connecting…'}</span>
                  </div>
                </div>
                <div className="assistant-intro">
                  <Sparkles size={19} aria-hidden="true" />
                  <p>Try a real conversation about a plumbing, heating or quote enquiry. The live assistant opens securely in this page.</p>
                </div>
                <div className="quick-prompts">
                  <p>Start with a test prompt</p>
                  {prompts.slice(0, 2).map((prompt) => (
                    <button type="button" key={prompt} onClick={() => usePrompt(prompt)}>{prompt}<ArrowRight size={15} /></button>
                  ))}
                </div>
                <PrimaryButton onClick={openAssistant} className="full-width">Open live assistant <MessagesSquare size={17} /></PrimaryButton>
                <p className="assistant-smallprint">Private demonstration only. Please don’t enter real customer details.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section-pad values-section">
          <div className="page-grid">
            <div className="section-heading">
              <p className="kicker">A clearer first conversation</p>
              <h2>Built for the enquiries that matter</h2>
            </div>
            <div className="card-grid four-up">
              {valueCards.map(({ icon: Icon, title, copy }) => (
                <article className="feature-card" key={title}>
                  <div className="icon-box"><Icon size={22} /></div>
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad conversation-section">
          <div className="page-grid conversation-grid">
            <figure className="conversation-card">
              <img src="/zakir-digital/ae-chat-example.png" alt="Example A&E Plumbing & Gas chatbot conversation about a slowly leaking kitchen tap" />
              <figcaption>Example conversation. The assistant asks relevant questions, avoids promising an appointment, and prepares a clear enquiry for the team.</figcaption>
            </figure>
            <div className="conversation-copy">
              <p className="kicker">Form less. Understand more.</p>
              <h2>A more helpful alternative to a normal contact form</h2>
              <ul className="point-list">
                <li><CheckCircle2 size={21} /> Visitors can explain the problem in their own words.</li>
                <li><CheckCircle2 size={21} /> The assistant asks only the next useful question.</li>
                <li><CheckCircle2 size={21} /> The team receives a structured enquiry rather than an incomplete form.</li>
              </ul>
              <p className="example-note"><ShieldCheck size={17} /> Example only — no real customer data is shown.</p>
            </div>
          </div>
        </section>

        <section id="handoff" className="section-pad handoff-section scroll-target">
          <div className="page-grid">
            <div className="section-heading centered">
              <p className="kicker">A handoff that fits your workflow</p>
              <h2>Choose how your team receives qualified enquiries</h2>
              <p>The same assistant can be connected to the method your team already prefers. One primary destination and one backup can be configured after approval.</p>
            </div>
            <div className="flow" aria-label="Lead delivery flow">
              <div><UserCheck size={20} /> Website visitor</div><ArrowRight size={20} />
              <div><Bot size={20} /> A&amp;E website assistant</div><ArrowRight size={20} />
              <div><Send size={20} /> Your chosen lead destination</div>
            </div>
            <div className="card-grid four-up delivery-grid">
              {deliveryCards.map(({ icon: Icon, title, copy }) => (
                <article className="delivery-card" key={title}>
                  <Icon size={23} />
                  <h3>{title}</h3>
                  <p>{copy}</p>
                </article>
              ))}
            </div>
            <div className="trust-statement"><ShieldCheck size={21} /><p>The delivery method is chosen with you. No customer details are sent until you approve the destination and the collection process.</p></div>
          </div>
        </section>

        <section className="section-pad safety-section">
          <div className="page-grid safety-grid">
            <div className="safety-intro">
              <p className="kicker">Careful by design</p>
              <h2>Designed to protect your reputation</h2>
              <p>The assistant helps with the first step while keeping decisions, commitments and sensitive guidance with the right people.</p>
            </div>
            <div className="do-card does-card">
              <div className="do-title"><Check size={20} /><h3>It does</h3></div>
              <ul>{does.map((item) => <li key={item}><CheckCircle2 size={18} />{item}</li>)}</ul>
            </div>
            <div className="do-card does-not-card">
              <div className="do-title"><X size={20} /><h3>It does not</h3></div>
              <ul>{doesNot.map((item) => <li key={item}><X size={18} />{item}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="section-pad test-section">
          <div className="page-grid test-panel">
            <div className="test-copy">
              <p className="kicker light-kicker">Live private demonstration</p>
              <h2>Try the assistant as if you were a customer</h2>
              <p>Ask about a leak, boiler repair, heating issue, CP12, service area, or a quote request. The assistant is designed to answer what it can verify and pass on a structured enquiry only when appropriate.</p>
              <PrimaryButton onClick={openAssistant}>Open assistant <MessagesSquare size={18} /></PrimaryButton>
            </div>
            <div className="prompt-panel">
              <p className="prompt-label"><HelpCircle size={18} /> Choose a prompt to test</p>
              {prompts.map((prompt) => (
                <button type="button" key={prompt} onClick={() => usePrompt(prompt)}>
                  <span>{prompt}</span><ArrowRight size={17} />
                </button>
              ))}
              <p className="prompt-status" aria-live="polite">{promptStatus || 'A prompt will be sent when the assistant opens. If unavailable, it will be copied for you.'}</p>
            </div>
          </div>
        </section>

        <section className="closing-section section-pad">
          <div className="page-grid closing-grid">
            <div>
              <p className="kicker">Next step</p>
              <h2>If this fits how A&amp;E wants to handle website enquiries, let’s tailor the final version together.</h2>
              <p>We can confirm your exact services, service areas, emergency process, lead destination, and the questions you want the assistant to ask before anything goes live.</p>
            </div>
            <div className="contact-actions">
              <a className="button button-primary" href="mailto:zakirdigitalco@gmail.com"><Mail size={18} /> Email ZAKIR DIGITAL</a>
              <a className="button button-secondary" href="https://wa.me/923140217680" target="_blank" rel="noreferrer"><MessageCircle size={18} /> Message on WhatsApp</a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="page-grid footer-inner">
          <p>Prepared by ZAKIR DIGITAL · Website support, lead capture and practical automation for local businesses.</p>
          <p>Private preview · Not an official A&amp;E customer-service channel</p>
        </div>
      </footer>
    </div>
  )
}

export default App
