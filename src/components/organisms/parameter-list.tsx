'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Parameter } from '@/lib/types'
import { cn } from '@/lib/utils'

interface ParameterListProps {
  parameters: Parameter[]
  selectedParameter: Parameter | null
  onSelect: (parameter: Parameter) => void
}

export function ParameterList({
  parameters,
  selectedParameter,
  onSelect,
}: ParameterListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Список параметров</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[600px]">
          {parameters.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">
              Параметры отсутствуют. Создайте первый параметр.
            </div>
          ) : (
            <div className="space-y-1 p-4">
              {parameters.map((parameter) => (
                <div
                  key={parameter.id}
                  onClick={() => onSelect(parameter)}
                  className={cn(
                    'cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent',
                    selectedParameter?.id === parameter.id &&
                      'border-primary bg-accent'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{parameter.name}</h3>
                    <Badge variant="secondary">
                      {parameter.values.length} значений
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
                    {parameter.values.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
