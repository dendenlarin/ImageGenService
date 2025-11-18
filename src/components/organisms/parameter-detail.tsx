'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Parameter } from '@/lib/types'
import { Edit, Trash2 } from 'lucide-react'

interface ParameterDetailProps {
  parameter: Parameter
  onEdit: () => void
  onDelete: (id: string) => void
}

export function ParameterDetail({
  parameter,
  onEdit,
  onDelete,
}: ParameterDetailProps) {
  const handleDelete = () => {
    if (
      confirm(
        `Вы уверены, что хотите удалить параметр "${parameter.name}"? Это действие нельзя отменить.`
      )
    ) {
      onDelete(parameter.id)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{parameter.name}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Редактировать
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Информация
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Всего значений:</span>
              <span className="font-medium">{parameter.values.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Создан:</span>
              <span className="font-medium">
                {new Date(parameter.createdAt).toLocaleString('ru-RU')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Обновлен:</span>
              <span className="font-medium">
                {new Date(parameter.updatedAt).toLocaleString('ru-RU')}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-muted-foreground mb-2">
            Значения параметра
          </h3>
          <ScrollArea className="h-[400px] rounded-md border p-4">
            <div className="flex flex-wrap gap-2">
              {parameter.values.map((value, index) => (
                <Badge key={index} variant="secondary">
                  {value}
                </Badge>
              ))}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
