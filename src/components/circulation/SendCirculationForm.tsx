'use client'

import { useId, useState, type FormEvent } from 'react'
import { Button, Icon, Input, Textarea } from '@/design-system'
import styles from './SendCirculationForm.module.css'

/** RN-02 — a transfer without a message of at least 10 characters is not processed. */
const MIN_MESSAGE_LENGTH = 10

export function SendCirculationForm() {
  const recipientId = useId()
  const amountId = useId()
  const messageId = useId()

  const [recipient, setRecipient] = useState('')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')
  const [confirmation, setConfirmation] = useState<string | null>(null)

  const messageIsValid = message.trim().length >= MIN_MESSAGE_LENGTH
  const canSubmit = recipient.trim() !== '' && Number(amount) > 0 && messageIsValid

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!canSubmit) return

    setConfirmation(`Circulação de ${amount} UAIFAI para ${recipient.trim()} registrada.`)
    setRecipient('')
    setAmount('')
    setMessage('')
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.title}>Enviar circulação</h3>
      <p className={styles.hint}>Reconheça uma contribuição. A mensagem faz parte da transação.</p>

      <div className={styles.row}>
        <div className={styles.recipient}>
          <label className={styles.label} htmlFor={recipientId}>
            Para quem
          </label>
          <Input
            id={recipientId}
            placeholder="Nome da pessoa ou coletivo"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            required
          />
        </div>
        <div className={styles.amount}>
          <label className={styles.label} htmlFor={amountId}>
            Quantidade
          </label>
          <Input
            id={amountId}
            type="number"
            min={1}
            inputMode="numeric"
            placeholder="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            required
          />
        </div>
      </div>

      <label className={styles.label} htmlFor={messageId}>
        Mensagem de reconhecimento
      </label>
      <Textarea
        id={messageId}
        placeholder="O que essa pessoa fez que merece reconhecimento?"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        aria-describedby={`${messageId}-counter`}
        required
      />
      <small
        id={`${messageId}-counter`}
        className={`${styles.counter} ${message.length > 0 && !messageIsValid ? styles.invalid : ''}`.trim()}
      >
        Mínimo de {MIN_MESSAGE_LENGTH} caracteres — {message.trim().length} escritos
      </small>

      <div className={styles.actions}>
        <Button type="submit" disabled={!canSubmit}>
          <Icon name="arrowRight" size={15} />
          Circular agora
        </Button>
      </div>

      <p className={styles.feedback} role="status">
        {confirmation}
      </p>
    </form>
  )
}
