'use client'

import { useMemo, useState } from 'react'
import { Chip, SearchInput } from '@/design-system'
import { accessTypePresentation, accessTypes } from '@/lib/access-type'
import type { AccessType, Course } from '@/types/domain'
import { CourseCard } from './CourseCard'
import styles from './CourseCatalog.module.css'

export type CourseCatalogProps = {
  courses: readonly Course[]
  initialEnrolledIds: readonly string[]
}

export function CourseCatalog({ courses, initialEnrolledIds }: CourseCatalogProps) {
  const [query, setQuery] = useState('')
  const [accessFilter, setAccessFilter] = useState<AccessType | null>(null)
  const [enrolledIds, setEnrolledIds] = useState<readonly string[]>(initialEnrolledIds)

  const visible = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesQuery =
        normalized === '' ||
        course.title.toLowerCase().includes(normalized) ||
        course.instructor.toLowerCase().includes(normalized)
      const matchesAccess = accessFilter === null || course.accessTypes.includes(accessFilter)
      return matchesQuery && matchesAccess
    })
  }, [courses, query, accessFilter])

  return (
    <div>
      <SearchInput
        wrapperClassName={styles.search}
        placeholder="Buscar cursos ou instrutores..."
        aria-label="Buscar cursos ou instrutores"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <ul className={styles.filters} aria-label="Filtrar por tipo de acesso">
        <li>
          <Chip active={accessFilter === null} onClick={() => setAccessFilter(null)}>
            Todos
          </Chip>
        </li>
        {accessTypes.map((accessType) => (
          <li key={accessType}>
            <Chip active={accessFilter === accessType} onClick={() => setAccessFilter(accessType)}>
              {accessTypePresentation[accessType].longLabel}
            </Chip>
          </li>
        ))}
      </ul>

      {visible.length === 0 ? (
        <p className={styles.empty}>Nenhum curso encontrado com esses critérios.</p>
      ) : (
        <div className={styles.grid}>
          {visible.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              enrolled={enrolledIds.includes(course.id)}
              onEnroll={(courseId) => setEnrolledIds((current) => [...current, courseId])}
            />
          ))}
        </div>
      )}
    </div>
  )
}
