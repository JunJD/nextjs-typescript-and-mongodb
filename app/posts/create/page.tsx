'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from 'components/ui/button'
import { Textarea } from 'components/ui/textarea'
import { Input } from 'components/ui/input'
import { AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'
import { postSchema } from 'app/schemasValidations'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from 'components/ui/form'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import axios from 'axios'
import { Alert, AlertTitle } from 'components/ui/alert'
import PostForm from '../_components/PostForm'

type FormSchema = z.infer<typeof postSchema>

export default function Create() {
  const router = useRouter()

  const [error, setError] = useState('')
  const [isSubmitting, setSubmitting] = useState(false)

  const form = useForm<FormSchema>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: '',
      content: ''
    }
  })

  const onSubmit = form.handleSubmit(async data => {
    try {
      setSubmitting(true)
      await axios.post('/api/posts', {
        ...data
      })
      router.push('/posts')
      router.refresh()
    } catch (error) {
      console.error(error)
      setSubmitting(false)
      setError('An unexpected error occurred.')
    }
  })

  return (
    <section>
      <Link href='/posts' className='flex gap-1 items-center '>
        <ArrowLeft size={18} />
        Back
      </Link>
      <div className='max-w-3xl mx-auto'>
        <header className='my-4 md:my-8'>
          <h1 className='font-bold text-2xl'>Add Post</h1>
        </header>

        <PostForm />
      </div>
    </section>
  )
}
