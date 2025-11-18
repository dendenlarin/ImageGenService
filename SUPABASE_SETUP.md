# Настройка Supabase Storage для сохранения изображений

Это руководство поможет вам настроить Supabase Storage для постоянного хранения сгенерированных изображений.

## Зачем нужен Supabase Storage?

По умолчанию изображения сохраняются как base64 Data URLs в localStorage браузера. Это означает:
- ❌ Изображения доступны только в одном браузере
- ❌ Нельзя делиться ссылками на изображения
- ❌ Ограничен размер хранилища (~5-10 MB)

С Supabase Storage:
- ✅ Изображения хранятся в облаке постоянно
- ✅ Можно делиться публичными ссылками
- ✅ Доступ с любого устройства
- ✅ Бесплатно до 1 GB + 2 GB трафика/месяц

**Примечание:** Supabase настройка **опциональна**. Если вы не настроите Supabase, приложение продолжит работать с base64 хранилищем в браузере.

---

## Шаг 1: Создание проекта Supabase

1. Перейдите на [supabase.com](https://supabase.com)
2. Нажмите **"Start your project"** или **"Sign Up"**
3. Войдите через GitHub (или создайте аккаунт)
4. Нажмите **"New Project"**
5. Заполните форму:
   - **Name**: `image-gen-service` (или любое другое имя)
   - **Database Password**: Сгенерируйте надежный пароль (сохраните его!)
   - **Region**: Выберите ближайший регион
   - **Pricing Plan**: Выберите **Free** (бесплатный тариф)
6. Нажмите **"Create new project"**
7. Подождите 1-2 минуты, пока проект создается

---

## Шаг 2: Создание Storage Bucket

1. В левом меню выберите **"Storage"**
2. Нажмите **"Create a new bucket"**
3. Заполните форму:
   - **Name**: `generated-images` (обязательно это имя!)
   - **Public bucket**: ✅ **Включите** (чтобы получать публичные ссылки)
4. Нажмите **"Create bucket"**

---

## Шаг 3: Настройка политик доступа (RLS Policies)

### Разрешить публичное чтение

1. Перейдите в **Storage → Policies**
2. Найдите bucket `generated-images`
3. Нажмите **"New Policy"**
4. Выберите **"For full customization, create a policy from scratch"**
5. Заполните форму:
   - **Policy name**: `Public Read Access`
   - **Allowed operation**: ✅ **SELECT**
   - **Target roles**: `public` (или оставьте пустым для всех)
   - **USING expression**:
     ```sql
     bucket_id = 'generated-images'
     ```
6. Нажмите **"Save policy"**

### Разрешить загрузку изображений

1. Нажмите **"New Policy"** снова
2. Выберите **"For full customization, create a policy from scratch"**
3. Заполните форму:
   - **Policy name**: `Allow Upload`
   - **Allowed operation**: ✅ **INSERT**
   - **Target roles**: `public` (или оставьте пустым)
   - **WITH CHECK expression**:
     ```sql
     bucket_id = 'generated-images'
     ```
4. Нажмите **"Save policy"**

### (Опционально) Ограничить размер файлов

Если хотите ограничить размер загружаемых файлов (например, до 10 MB):

```sql
bucket_id = 'generated-images' AND
(storage.foldername(name))[1] = 'generations' AND
length(content) < 10485760
```

---

## Шаг 4: Получение ключей API

1. В левом меню выберите **"Project Settings"** (иконка шестеренки)
2. Перейдите в **"API"**
3. Найдите следующие значения:

### **Project URL**
```
https://your-project-id.supabase.co
```
Скопируйте это значение

### **anon/public key**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS...
```
Скопируйте ключ из секции **"Project API keys"** → **"anon public"**

⚠️ **Важно:**
- Используйте **anon** ключ (не service_role)
- anon ключ безопасен для использования в браузере
- service_role ключ НИКОГДА не используйте в клиентском коде!

---

## Шаг 5: Настройка в приложении

1. Откройте ваше приложение
2. Перейдите в **Settings** (⚙️)
3. Прокрутите до секции **"Supabase Storage"**
4. Вставьте скопированные значения:
   - **Supabase URL**: `https://your-project-id.supabase.co`
   - **Supabase Anon Key**: `eyJhbGciOiJIUzI1NiIs...`
5. Нажмите **"Сохранить настройки"**

---

## Шаг 6: Проверка работы

1. Перейдите в раздел **Generations**
2. Создайте новую генерацию с несколькими вариантами
3. Запустите генерацию
4. После завершения:
   - Откройте любое изображение в новой вкладке
   - URL должен начинаться с `https://your-project-id.supabase.co/storage/v1/object/public/generated-images/...`
   - Если URL начинается с `data:image/png;base64,...` - значит Supabase не настроен или произошла ошибка

5. Проверьте в Supabase Dashboard:
   - **Storage → generated-images**
   - Должна появиться папка `generations/`
   - Внутри папки должны быть изображения

---

## Структура хранилища

Изображения сохраняются в следующей структуре:

```
generated-images/                    # bucket name
└── generations/                     # folder
    ├── gen_abc123/                  # generation ID
    │   ├── task_xyz_1699999999999.png
    │   ├── task_abc_1699999999998.png
    │   └── ...
    └── gen_def456/                  # another generation
        └── ...
```

### Naming convention:
- `{generationId}/{taskId}_{timestamp}.png`
- Уникальность гарантирована через taskId и timestamp
- Легко группировать по генерациям

---

## Управление хранилищем

### Просмотр файлов

1. **Supabase Dashboard** → **Storage** → **generated-images**
2. Здесь вы можете:
   - Просматривать все изображения
   - Скачивать файлы
   - Удалять файлы и папки
   - Смотреть статистику использования

### Удаление старых генераций

Чтобы освободить место:

1. В приложении удалите генерацию (если есть такая функция)
2. Или вручную в **Supabase Dashboard**:
   - Откройте папку `generations/`
   - Удалите папки старых генераций

### Мониторинг использования

1. **Supabase Dashboard** → **Project Settings** → **Usage**
2. Смотрите:
   - **Storage**: Сколько GB использовано
   - **Bandwidth**: Сколько трафика потрачено
   - **Requests**: Количество запросов

---

## Лимиты бесплатного тарифа

| Ресурс | Бесплатный тариф |
|--------|-----------------|
| Storage | 1 GB |
| Bandwidth | 2 GB/месяц |
| Requests | 5 million/месяц |

**Примерные расчеты:**
- 1 изображение ≈ 200-500 KB
- 1 GB ≈ 2000-5000 изображений
- Если генерируете 100 изображений/месяц → ~50 месяцев на бесплатном тарифе

---

## Troubleshooting

### Изображения не загружаются в Supabase

**Проблема:** Изображения сохраняются как base64, а не в Supabase

**Решения:**
1. Проверьте, что вы ввели правильные URL и Anon Key в Settings
2. Откройте консоль браузера (F12) и проверьте ошибки
3. Убедитесь, что bucket называется **именно** `generated-images`
4. Проверьте RLS Policies (см. Шаг 3)

### Ошибка "403 Forbidden"

**Причина:** Неправильные политики доступа (RLS)

**Решение:**
1. Перейдите в **Storage → Policies**
2. Убедитесь, что есть политика с операцией **INSERT** для `public` role
3. Попробуйте создать политику с более простым условием:
   ```sql
   true
   ```
   (временно, для тестирования)

### Ошибка "Storage bucket not found"

**Причина:** Bucket не создан или называется по-другому

**Решение:**
1. Проверьте, что bucket называется **точно** `generated-images`
2. Создайте bucket заново (см. Шаг 2)

### Изображения не открываются по ссылке

**Причина:** Bucket не публичный

**Решение:**
1. **Storage → Configuration**
2. Найдите `generated-images`
3. Убедитесь, что **"Public"** = ✅ ON
4. Если OFF, включите публичность:
   - Нажмите **"..."** → **"Edit bucket"**
   - Включите **"Public bucket"**

---

## Дополнительные возможности

### Автоматическая очистка старых файлов

Вы можете настроить SQL функцию для автоматического удаления файлов старше N дней:

```sql
-- Создать функцию для удаления старых файлов
CREATE OR REPLACE FUNCTION delete_old_images()
RETURNS void AS $$
BEGIN
  DELETE FROM storage.objects
  WHERE bucket_id = 'generated-images'
  AND created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- Создать задачу для запуска каждый день
-- (требуется Pro тариф для pg_cron)
SELECT cron.schedule('delete-old-images', '0 3 * * *', 'SELECT delete_old_images()');
```

### Оптимизация изображений

Supabase поддерживает трансформацию изображений (resizing, optimization):

```typescript
// Пример получения изображения с изменением размера
const { data } = supabase.storage
  .from('generated-images')
  .getPublicUrl('generations/gen_123/task_456.png', {
    transform: {
      width: 800,
      height: 450,
      resize: 'contain',
    },
  })
```

---

## Миграция с Pro/Enterprise

Если вам нужно больше ресурсов:

### Pro Plan ($25/месяц)
- 100 GB Storage
- 200 GB Bandwidth
- Приоритетная поддержка

### Enterprise (Custom)
- Unlimited Storage
- Custom Bandwidth
- SLA guarantees
- Dedicated support

---

## FAQ

**Q: Нужно ли создавать аккаунт Supabase?**
A: Да, но это бесплатно и занимает 2 минуты.

**Q: Безопасно ли хранить anon key в коде?**
A: Да, anon key защищен RLS (Row Level Security) политиками.

**Q: Что будет, если превысить лимиты?**
A: Запросы начнут возвращать ошибки. Нужно будет перейти на Pro или удалить старые файлы.

**Q: Можно ли использовать другой сервис?**
A: Да, можно адаптировать код для AWS S3, Cloudflare R2, или любого S3-compatible хранилища.

**Q: Что делать, если не хочу настраивать Supabase?**
A: Просто не заполняйте поля Supabase в Settings. Приложение продолжит работать с localStorage.

---

## Полезные ссылки

- [Supabase Storage Docs](https://supabase.com/docs/guides/storage)
- [RLS Policies Guide](https://supabase.com/docs/guides/storage/security/access-control)
- [Pricing Plans](https://supabase.com/pricing)

---

## Поддержка

Если у вас возникли проблемы:

1. Проверьте консоль браузера (F12 → Console)
2. Проверьте Network tab (F12 → Network)
3. Откройте issue на GitHub с описанием проблемы и screenshot ошибки
