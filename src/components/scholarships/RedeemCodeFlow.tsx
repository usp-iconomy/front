'use client'

import { useId, useState, type FormEvent } from 'react'
import { Button, CodeInput, FlowStep } from '@/design-system'
import { CODE_LENGTH } from '@/lib/distribution-codes'
import styles from './RedeemCodeFlow.module.css'

const TOKENS_PER_REDEMPTION = 200

type Result = { kind: 'success' | 'error'; message: string }

export function RedeemCodeFlow() {
  const codeId = useId()
  const [code, setCode] = useState('')
  const [result, setResult] = useState<Result | null>(null)

  const redeemed = result?.kind === 'success'

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (code.length !== CODE_LENGTH) {
      setResult({ kind: 'error', message: `Código inválido. São ${CODE_LENGTH} caracteres.` })
      return
    }

    setResult({
      kind: 'success',
      message: `Código validado. ${TOKENS_PER_REDEMPTION} UAIFAI creditados na sua carteira.`,
    })
    setCode('')
  }

  return (
    <div>
      <FlowStep
        step={1}
        title="Você recebeu um código?"
        description="Cole o código fornecido pela sua comunidade, por um parceiro local ou pela administração da USP."
        status={redeemed ? 'done' : 'current'}
      >
        <form onSubmit={handleSubmit}>
          <label htmlFor={codeId} className="sr-only">
            Código de distribuição
          </label>
          <div className={styles.row}>
            <CodeInput
              id={codeId}
              className={styles.input}
              placeholder="EX: ABC12345"
              maxLength={CODE_LENGTH}
              value={code}
              autoComplete="off"
              aria-describedby={`${codeId}-feedback`}
              onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            />
            <Button type="submit">Validar</Button>
          </div>
        </form>
        <p
          id={`${codeId}-feedback`}
          role="status"
          className={`${styles.feedback} ${result ? styles[result.kind] : ''}`.trim()}
        >
          {result?.message}
        </p>
      </FlowStep>

      <FlowStep
        step={2}
        title="Código verificado"
        description="A validade, o número de resgates restantes e o curso vinculado são conferidos no Peace Coin Explorer."
        status={redeemed ? 'done' : 'pending'}
      />

      <FlowStep
        step={3}
        title="Tokens e acesso liberados"
        description={`Você recebe ${TOKENS_PER_REDEMPTION} UAIFAI na carteira e a matrícula no curso vinculado é confirmada.`}
        status={redeemed ? 'done' : 'pending'}
      />
    </div>
  )
}
