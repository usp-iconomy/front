import { Badge, Button, Card, Icon } from '@/design-system'
import { accessTypePresentation } from '@/lib/access-type'
import { formatNumber } from '@/lib/format'
import type { Course } from '@/types/domain'
import styles from './CourseCard.module.css'

export type CourseCardProps = {
  course: Course
  enrolled: boolean
  onEnroll: (courseId: string) => void
}

export function CourseCard({ course, enrolled, onEnroll }: CourseCardProps) {
  return (
    <Card as="article" interactive className={styles.card}>
      <h3 className={styles.title}>{course.title}</h3>

      <p className={styles.meta}>
        <span>
          <Icon name="user" size={13} />
          {course.instructor}
        </span>
        <span>
          <Icon name="users" size={13} />
          {formatNumber(course.participants)} participantes
        </span>
        <span>
          <Icon name="book" size={13} />
          {course.workloadHours}h
        </span>
      </p>

      <p className={styles.description}>{course.description}</p>

      <div className={styles.footer}>
        <div className={styles.badges}>
          {course.accessTypes.map((accessType) => {
            const { label, tone } = accessTypePresentation[accessType]
            return (
              <Badge key={accessType} tone={tone}>
                {label}
              </Badge>
            )
          })}
        </div>

        {enrolled ? (
          <Button variant="ghost" size="sm" disabled>
            <Icon name="check" size={13} />
            Inscrito
          </Button>
        ) : (
          <Button size="sm" onClick={() => onEnroll(course.id)}>
            Inscrever
          </Button>
        )}
      </div>
    </Card>
  )
}
