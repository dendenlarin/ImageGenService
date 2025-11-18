'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { X, Download } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface GalleryImage {
  id: string
  url: string
  prompt: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  onDelete?: (id: string) => void
  className?: string
}

export function ImageGallery({
  images,
  onDelete,
  className,
}: ImageGalleryProps) {
  const handleDownload = (image: GalleryImage) => {
    const link = document.createElement('a')
    link.href = image.url
    link.download = `generated-image-${image.id}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle>Галерея ({images.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {images.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center rounded-md border border-dashed">
            <div className="text-center text-sm text-muted-foreground">
              Пока нет сгенерированных изображений
            </div>
          </div>
        ) : (
          <ScrollArea className="h-[500px] pr-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
                >
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100 flex flex-col justify-between p-2">
                    {/* Top actions */}
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8 bg-white/90 hover:bg-white"
                        onClick={() => handleDownload(image)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      {onDelete && (
                        <Button
                          variant="destructive"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => onDelete(image.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    {/* Bottom prompt */}
                    <div className="bg-black/80 rounded p-2">
                      <p className="text-xs text-white line-clamp-2">
                        {image.prompt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  )
}
