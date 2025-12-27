'use client'

import { ArrowLeft, Check, Pencil } from 'lucide-react'
import Image from 'next/image'
import type React from 'react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { TypeAnimation } from 'react-type-animation'
import { Button } from '@/components/ui/button'
import { getErrorMessage } from '@/lib/errors'
import { cn } from '@/lib/utils'

type Step = 'name' | 'testimonial' | 'feedback' | 'review' | 'success'

interface Message {
  id: string
  text: string
  type: 'bot' | 'user'
}

export function TestimonialForm() {
  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [testimonial, setTestimonial] = useState('')
  const [feedback, setFeedback] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState<string | null>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [pendingMessages, setPendingMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [currentTypingId, setCurrentTypingId] = useState<string | null>(null)
  const [inputReady, setInputReady] = useState(false)

  const chatEndRef = useRef<HTMLDivElement>(null)
  const hasInitialized = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced scroll helper - otimização sênior para evitar scroll excessivo
  const scrollToBottom = useCallback(() => {
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    scrollTimeoutRef.current = setTimeout(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }, [])

  // Memoizar botMessages - performance boost em re-renders
  const botMessages: Record<Step, string[]> = useMemo(
    () => ({
      name: [
        'Que alegria ter você aqui! Seu depoimento é super importante para nós e será usado no site da banda para inspirar outras pessoas.',
        'Para começar, qual é o seu nome?',
      ],
      testimonial: ['Conta pra gente o que achou da nossa apresentação?'],
      feedback: ['Tem algum feedback interno pra banda? Isso é opcional e não será publicado.'],
      review: [],
      success: [],
    }),
    []
  )

  const queueMessages = useCallback((msgs: Message[]) => {
    setPendingMessages(prev => [...prev, ...msgs])
  }, [])

  // Effect para processar fila de mensagens com TypeAnimation
  useEffect(() => {
    if (pendingMessages.length === 0 || isTyping) return

    const nextMessage = pendingMessages[0]

    if (nextMessage.type === 'user') {
      // Mensagem do usuário aparece instantaneamente
      setMessages(prev => [...prev, nextMessage])
      setPendingMessages(prev => prev.slice(1))
    } else {
      // Mensagem do bot com TypeAnimation
      setIsTyping(true)
      setCurrentTypingId(nextMessage.id)
      setInputReady(false)
    }
  }, [pendingMessages, isTyping])

  // Callback quando TypeAnimation terminar - memoizado para performance
  const handleTypingComplete = useCallback(() => {
    if (!currentTypingId || pendingMessages.length === 0) return

    const completedMessage = pendingMessages[0]
    setMessages(prev => [...prev, completedMessage])
    setCurrentTypingId(null)
    setIsTyping(false)
    setPendingMessages(prev => prev.slice(1))
  }, [currentTypingId, pendingMessages])

  useEffect(() => {
    if (pendingMessages.length === 0 && !isTyping && messages.length > 0) {
      const timer = setTimeout(() => setInputReady(true), 200)
      return () => clearTimeout(timer)
    }
  }, [pendingMessages, isTyping, messages])

  useEffect(() => {
    if (hasInitialized.current) return
    hasInitialized.current = true

    const initialMessages = botMessages.name.map((text, i) => ({
      id: `init-${i}`,
      text,
      type: 'bot' as const,
    }))

    queueMessages(initialMessages)
  }, [queueMessages, botMessages])

  // Scroll otimizado com debounce - evita thrashing
  // Precisamos disparar em mudanças de messages/typing para scroll automático
  useEffect(() => {
    scrollToBottom()
    // eslint-disable-next-line react-compiler/react-compiler
  }, [scrollToBottom])

  // Cleanup do timeout no unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  const handleNameSubmit = () => {
    if (!name.trim()) return

    const userMsg: Message = { id: `user-name`, text: name, type: 'user' }
    const botMsgs = botMessages.testimonial.map((text, i) => ({
      id: `testimonial-${i}`,
      text,
      type: 'bot' as const,
    }))

    queueMessages([userMsg, ...botMsgs])
    setStep('testimonial')
    setInputReady(false)
  }

  const handleTestimonialSubmit = () => {
    if (!testimonial.trim()) return

    const userMsg: Message = { id: `user-testimonial`, text: testimonial, type: 'user' }
    const botMsgs = botMessages.feedback.map((text, i) => ({
      id: `feedback-${i}`,
      text,
      type: 'bot' as const,
    }))

    queueMessages([userMsg, ...botMsgs])
    setStep('feedback')
    setInputReady(false)
  }

  const handleFeedbackSubmit = (skip = false) => {
    if (!skip && feedback.trim()) {
      const userMsg: Message = { id: `user-feedback`, text: feedback, type: 'user' }
      queueMessages([userMsg])
    }
    setStep('review')
  }

  const handleEdit = (targetStep: Step) => {
    setStep(targetStep)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setSubmissionError(null)

    try {
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, testimonial, feedback }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || 'Erro ao enviar')
      }

      setStep('success')
    } catch (error) {
      setSubmissionError(getErrorMessage(error))
    } finally {
      setIsSubmitting(false)
    }
  }

  const maxChars = 250
  const progress = ['name', 'testimonial', 'feedback'].indexOf(step)

  if (step === 'review') {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex flex-col items-center mb-10">
          <div className="mb-6 opacity-0 animate-[fadeInScale_0.5s_ease-out_forwards]">
            <Image
              src="/images/davince-logo.jpeg"
              alt="Davince"
              width={140}
              height={140}
              className="object-contain"
            />
          </div>
          <h2 className="text-xl font-semibold text-foreground tracking-tight opacity-0 animate-[fadeInUp_0.5s_ease-out_0.1s_forwards]">
            Revise seu depoimento
          </h2>
          <p className="text-sm text-muted-foreground mt-2 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.2s_forwards]">
            Confira se está tudo certo antes de enviar
          </p>
        </div>

        <div className="space-y-3">
          <ReviewCard label="Nome" value={name} onEdit={() => handleEdit('name')} delay={0.25} />
          <ReviewCard
            label="Depoimento"
            value={testimonial}
            onEdit={() => handleEdit('testimonial')}
            delay={0.35}
          />
          {feedback && (
            <ReviewCard
              label="Feedback interno"
              value={feedback}
              onEdit={() => handleEdit('feedback')}
              isPrivate
              delay={0.45}
            />
          )}
        </div>

        <div className="mt-10 space-y-3 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.5s_forwards]">
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full h-14 rounded-2xl font-medium text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                Enviando
              </span>
            ) : (
              'Enviar depoimento'
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setStep('feedback')}
            className="w-full h-12 rounded-xl text-muted-foreground font-medium transition-all duration-200 active:scale-[0.98]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {submissionError && (
            <div className="mt-4 p-4 bg-destructive/10 border border-destructive/50 rounded-2xl backdrop-blur-sm animate-[fadeInUp_0.3s_ease-out]">
              <p className="text-sm text-destructive text-center mb-3">{submissionError}</p>
              <Button
                variant="outline"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full h-12 rounded-xl border-destructive/50 text-destructive hover:bg-destructive/10"
              >
                Tentar novamente
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (step === 'success') {
    return (
      <div className="w-full max-w-md mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative opacity-0 animate-[fadeInScale_0.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
            <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center">
              <Check
                className="w-9 h-9 text-primary-foreground opacity-0 animate-[fadeInScale_0.4s_ease-out_0.4s_forwards]"
                strokeWidth={2.5}
              />
            </div>
            <div className="absolute inset-0 w-20 h-20 rounded-full bg-primary/20 animate-[ping_1.5s_ease-out]" />
          </div>

          <h2 className="text-2xl font-semibold text-foreground tracking-tight mt-8 mb-2 opacity-0 animate-[fadeInUp_0.5s_ease-out_0.5s_forwards]">
            Obrigado, {name.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground text-center text-base leading-relaxed max-w-[280px] opacity-0 animate-[fadeInUp_0.5s_ease-out_0.6s_forwards]">
            Seu depoimento foi enviado com sucesso. Agradecemos por fazer parte da nossa história.
          </p>

          <div className="mt-12 opacity-0 animate-[fadeIn_0.8s_ease-out_1s_forwards]">
            <Image
              src="/images/davince-logo.jpeg"
              alt="Davince"
              width={112}
              height={112}
              className="object-contain opacity-40"
            />
          </div>

          <div className="mt-8 opacity-0 animate-[fadeIn_0.8s_ease-out_1.2s_forwards]">
            <a
              href="https://github.com/rafactx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <span className="font-light">made w care by</span>
              <span className="font-medium">rafactx</span>
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current group-hover:scale-110 transition-transform duration-200"
                aria-hidden="true"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto px-4 flex flex-col h-full overflow-y-auto overscroll-contain">
      {/* Header com logo */}
      <div className="flex justify-center py-4 sm:py-6 opacity-0 animate-[fadeIn_0.6s_ease-out_forwards]">
        <Image
          src="/images/davince-logo.jpeg"
          alt="Davince"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-6 opacity-0 animate-[fadeIn_0.6s_ease-out_0.2s_forwards]">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={cn(
              'h-1 rounded-full transition-all duration-500 ease-out',
              i <= progress ? 'w-8 bg-primary shadow-lg shadow-primary/50' : 'w-2 bg-border'
            )}
          />
        ))}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto space-y-3 pb-4">
        {messages.map(msg => (
          <ChatBubble key={msg.id} type={msg.type === 'bot' ? 'received' : 'sent'}>
            {msg.text}
          </ChatBubble>
        ))}

        {/* TypeAnimation - performance otimizada com biblioteca */}
        {currentTypingId && pendingMessages.length > 0 && (
          <div className="flex justify-start animate-[fadeIn_0.2s_ease-out]">
            <div className="max-w-[85%] px-4 py-3 text-[15px] leading-relaxed bg-secondary/80 text-secondary-foreground rounded-[20px] rounded-bl-md backdrop-blur-sm border border-border/50 contain-layout-paint">
              <TypeAnimation
                sequence={[
                  400, // Delay inicial
                  pendingMessages[0].text,
                  () => handleTypingComplete(),
                ]}
                wrapper="span"
                speed={75}
                cursor={true}
                repeat={0}
                className="inline"
                style={{ display: 'inline' }}
              />
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input area */}
      <div
        className={cn(
          'border-t border-border/50 pt-4 pb-6 transition-all duration-300',
          inputReady ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        )}
      >
        {step === 'name' && (
          <InputArea
            placeholder="Seu nome"
            value={name}
            onChange={setName}
            onSubmit={handleNameSubmit}
            buttonLabel="Continuar"
            disabled={!name.trim()}
            ready={inputReady}
          />
        )}

        {step === 'testimonial' && (
          <InputArea
            placeholder="Escreva seu depoimento..."
            value={testimonial}
            onChange={v => v.length <= maxChars && setTestimonial(v)}
            onSubmit={handleTestimonialSubmit}
            buttonLabel="Continuar"
            disabled={!testimonial.trim()}
            multiline
            counter={`${testimonial.length}/${maxChars}`}
            counterWarning={testimonial.length >= maxChars}
            ready={inputReady}
          />
        )}

        {step === 'feedback' && (
          <InputArea
            placeholder="Sugestões, críticas ou elogios..."
            value={feedback}
            onChange={setFeedback}
            onSubmit={() => handleFeedbackSubmit(false)}
            buttonLabel="Revisar"
            multiline
            showSkip
            onSkip={() => handleFeedbackSubmit(true)}
            ready={inputReady}
          />
        )}
      </div>
    </div>
  )
}

const ReviewCard = memo(function ReviewCard({
  label,
  value,
  onEdit,
  isPrivate = false,
  delay = 0,
}: {
  label: string
  value: string
  onEdit: () => void
  isPrivate?: boolean
  delay?: number
}) {
  return (
    <div
      className="group bg-secondary/50 hover:bg-secondary/70 backdrop-blur-sm rounded-2xl p-4 transition-all duration-300 opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards] border border-border/50"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {label}
            </span>
            {isPrivate && (
              <span className="text-[10px] bg-muted/80 text-muted-foreground px-2 py-0.5 rounded-full backdrop-blur-sm">
                privado
              </span>
            )}
          </div>
          <p className="text-foreground text-[15px] leading-relaxed">{value}</p>
        </div>
        <button
          type="button"
          onClick={onEdit}
          className="p-2.5 -m-2 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100 active:scale-95"
          aria-label={`Editar ${label}`}
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
})

const ChatBubble = memo(function ChatBubble({
  children,
  type,
}: {
  children: React.ReactNode
  type: 'sent' | 'received'
}) {
  return (
    <div
      className={cn(
        'flex animate-[fadeInUp_0.3s_ease-out]',
        type === 'sent' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[85%] px-4 py-3 text-[15px] leading-relaxed backdrop-blur-sm border contain-layout-paint',
          type === 'sent'
            ? 'bg-primary text-primary-foreground rounded-[20px] rounded-br-md border-primary/20 shadow-lg shadow-primary/10'
            : 'bg-secondary/80 text-secondary-foreground rounded-[20px] rounded-bl-md border-border/50'
        )}
      >
        {children}
      </div>
    </div>
  )
})

const InputArea = memo(function InputArea({
  placeholder,
  value,
  onChange,
  onSubmit,
  buttonLabel,
  disabled,
  multiline = false,
  counter,
  counterWarning = false,
  showSkip = false,
  onSkip,
  ready = false,
}: {
  placeholder: string
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  buttonLabel: string
  disabled?: boolean
  multiline?: boolean
  counter?: string
  counterWarning?: boolean
  showSkip?: boolean
  onSkip?: () => void
  ready?: boolean
}) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (ready) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [ready])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey && !disabled) {
        e.preventDefault()
        onSubmit()
      }
    },
    [disabled, onSubmit]
  )

  const inputClasses = cn(
    'w-full px-4 py-4 bg-secondary/70 backdrop-blur-sm rounded-2xl text-foreground text-base',
    'placeholder:text-muted-foreground/50',
    'border border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-secondary/90 focus:border-primary/50',
    'transition-all duration-300'
  )

  return (
    <div className="space-y-3">
      <div className="relative">
        {multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className={cn(inputClasses, 'resize-none', counter && 'pb-9')}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={e => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className={inputClasses}
          />
        )}
        {counter && (
          <span
            className={cn(
              'absolute bottom-3 right-4 text-xs font-medium transition-colors duration-200 backdrop-blur-sm px-2 py-0.5 rounded-full',
              counterWarning ? 'text-destructive bg-destructive/10' : 'text-muted-foreground/60'
            )}
          >
            {counter}
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {showSkip && (
          <Button
            variant="ghost"
            onClick={onSkip}
            className="flex-1 h-14 rounded-2xl text-muted-foreground hover:text-foreground font-medium transition-all duration-300 active:scale-[0.98] hover:bg-secondary/50"
          >
            Pular
          </Button>
        )}
        <Button
          onClick={onSubmit}
          disabled={disabled}
          className={cn(
            'h-14 rounded-2xl font-medium text-base transition-all duration-300 active:scale-[0.98] shadow-lg shadow-primary/20',
            showSkip ? 'flex-1' : 'w-full'
          )}
        >
          {buttonLabel}
        </Button>
      </div>
    </div>
  )
})
