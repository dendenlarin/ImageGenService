'use client'

import { ContactForm, ContactFormData } from '@/components/forms/contact-form'
import { MainLayout } from '@/components/templates/main-layout'
import { Home, Mail } from 'lucide-react'

export default function ContactPage() {
  const handleContact = async (data: ContactFormData) => {
    console.log('Contact data:', data)
    // Здесь должна быть логика отправки формы
    // Пример: await sendContactForm(data)
    alert('Форма отправлена! (это демо)')
  }

  return (
    <MainLayout
      header={{
        logoText: 'MyService',
        navItems: [
          { href: '/dashboard', label: 'Dashboard', icon: Home },
          { href: '/contact', label: 'Контакты', icon: Mail },
        ],
      }}
      showSidebar={false}
    >
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <ContactForm onSubmit={handleContact} />
      </div>
    </MainLayout>
  )
}
