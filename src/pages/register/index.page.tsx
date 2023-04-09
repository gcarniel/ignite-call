import { api } from '@/lib/axios'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Heading, MultiStep, Text, TextInput } from '@ignite-ui/react'
import { AxiosError } from 'axios'
import { useRouter } from 'next/router'
import { ArrowRight } from 'phosphor-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Container, Form, FormError, Header } from './styles'
import { NextSeo } from 'next-seo'

const userRegisterFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: 'Usuário deve ter pelo menos 3 letras' })
    .regex(/^([a-z\\-]+)$/i, {
      message: 'Permitido nome de usuário com letras e hífen',
    })
    .transform((username) => username.toLowerCase()),
  fullname: z.string().min(3, { message: 'Nome deve ter pelo menos 3 letras' }),
})

type UserRegisterFormData = z.infer<typeof userRegisterFormSchema>

export default function Register() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserRegisterFormData>({
    resolver: zodResolver(userRegisterFormSchema),
  })

  const router = useRouter()

  const handleRegisterSubmit = async (data: UserRegisterFormData) => {
    try {
      await api.post('/users', {
        username: data.username,
        fullname: data.fullname,
      })

      await router.push('register/connect-calendar')
    } catch (err) {
      console.error(err)
      if (err instanceof AxiosError && err?.response?.data?.message) {
        alert(err.response.data.message)
        return
      }
    }
  }

  useEffect(() => {
    const username = String(router.query?.username)

    if (username) {
      setValue('username', username)
    }
  }, [router.query.username, setValue])

  return (
    <>
      <NextSeo title="Crie uma conta | Ignite Call" />
      <Container>
        <Header>
          <Heading as="strong">Bem vindo ao ignite Call!</Heading>

          <Text>
            Conecte o seu calendário para verificar automaticamente as horas
            ocupadas e os novos eventos à medida em que são agendados.
          </Text>

          <MultiStep size={4} currentStep={1} />
        </Header>

        <Form as="form" onSubmit={handleSubmit(handleRegisterSubmit)}>
          <label>
            <Text size="sm">Nome de usuário</Text>
            <TextInput
              prefix="ignite.com/"
              placeholder="seu-usuario"
              {...register('username')}
            />
            {errors.username && (
              <FormError size="sm">{errors.username.message}</FormError>
            )}
          </label>

          <label>
            <Text size="sm">Nome completo</Text>
            <TextInput
              placeholder="seu nome completo"
              {...register('fullname')}
            />
            {errors.fullname && (
              <FormError size="sm">{errors.fullname.message}</FormError>
            )}
          </label>

          <Button type="submit" disabled={isSubmitting}>
            Próximo passo
            <ArrowRight />
          </Button>
        </Form>
      </Container>
    </>
  )
}
