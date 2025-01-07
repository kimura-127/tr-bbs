import { columns, type Payment } from "@/components/columns"
import { DataTable } from "@/components/data-table"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Pen, Search, SquarePen } from "lucide-react"


async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      title:"とぴっく",name:"名無し",replyCount:3,createdAt:new Date()
    },
    // ...
  ]
}

export default async function Home() {
  const data = await getData()

  return (
    <div className="container mx-auto py-10">
      <div className="flex bg-gray-700 rounded-lg px-2 py-1.5 mb-6">
        <div>
          <Dialog>
            <DialogTrigger asChild>
             <Button className="h-8 bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-base tracking-wide">
               <SquarePen />
               新規作成
             </Button>
            </DialogTrigger>
            <DialogContent  className="max-w-4xl max-h-screen overflow-auto">
              <DialogHeader>
                <DialogTitle>新規スレッド作成</DialogTitle>
                <DialogDescription className="py-2">
                  タイトルとコメントを入力してください
                </DialogDescription>
              </DialogHeader>
              <div className="my-2 font-semibold tracking-wide">
                <p>タイトル</p>
                <Input />
              </div>
              <div className="mb-4 font-semibold tracking-wider">
                <p>コメント</p>
                <Textarea className="h-40" />
              </div>
              <div className="flex justify-center">
              <Button className="h-12 w-80 bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-base tracking-wide">
                  スレッド作成
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        
        </div>
        <div>
        <Button className="h-8 bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-base tracking-wide">
          <Search />
            検索
          </Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
