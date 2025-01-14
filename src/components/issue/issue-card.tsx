'use client'
import Link from 'next/link'
import ReactMarkdown from 'react-markdown'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button
} from '@/components/ui'
import { formatDate } from '@/lib/utils'
import { Issue } from '@/schemas'

interface Props {
  issue: Issue
}

export default function IssueCard({ issue }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{issue.title}</CardTitle>
        <CardDescription>{issue.createdAt ? formatDate(issue.createdAt) : '-'}</CardDescription>
      </CardHeader>
      <CardContent>
        <article className='text-sm prose prose-stone dark:prose-invert'>
          <ReactMarkdown>{issue.description}</ReactMarkdown>
        </article>
      </CardContent>
      <CardFooter className='flex justify-end gap-2'>
        <Button size='sm' variant='outline' asChild>
          <Link href={`/client/issues/${issue.id}`}>View Issue</Link>
        </Button>
        <Button size='sm' variant='default' asChild>
          <Link href={`/client/issues/${issue.id}/edit`}>Edit Issue</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
