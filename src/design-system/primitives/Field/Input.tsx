import type { InputHTMLAttributes, TextareaHTMLAttributes } from 'react'
import { Icon } from '../Icon/Icon'
import styles from './Field.module.css'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export function Input({ className, ...props }: InputProps) {
  return <input className={[styles.control, className].filter(Boolean).join(' ')} {...props} />
}

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea className={[styles.control, styles.textarea, className].filter(Boolean).join(' ')} {...props} />
  )
}

export type SearchInputProps = InputProps & { wrapperClassName?: string }

export function SearchInput({ wrapperClassName, ...props }: SearchInputProps) {
  return (
    <div className={[styles.searchWrap, wrapperClassName].filter(Boolean).join(' ')}>
      <span className={styles.searchIcon}>
        <Icon name="search" size={15} />
      </span>
      <Input type="search" {...props} />
    </div>
  )
}

/** Fixed-length uppercase input for Distribution Codes (RF-09). */
export function CodeInput({ className, ...props }: InputProps) {
  return <Input className={[styles.code, className].filter(Boolean).join(' ')} {...props} />
}
