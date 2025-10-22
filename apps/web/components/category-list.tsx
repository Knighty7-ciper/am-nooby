import Link from 'next/link'
import { Card } from '@/components/ui/card'

interface CategoryListProps {
  categories: any[]
}

export function CategoryList({ categories }: CategoryListProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.slug}`}>
          <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
            <div className="flex items-center gap-3">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl"
                style={{ backgroundColor: category.color + '20' }}
              >
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {category.postCount} posts
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
