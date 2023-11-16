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

        <Form {...form}>
          {error && (
            <Alert className='mb-4' variant='destructive'>
              <AlertCircle className='h-4 w-4' />
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <form onSubmit={onSubmit} className='w-2/3 space-y-6'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea className='min-h-[200px]' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting} type='submit'>
              {isSubmitting && (
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              )}
              Create Post
            </Button>
          </form>
        </Form>
      </div>
    </section>
  )
}
