'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export function NotificationSettingComponent() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">通知設定</h1>
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">メール通知</TabsTrigger>
          <TabsTrigger value="line">LINE通知</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>メール通知設定</CardTitle>
              <CardDescription>
                通知設定しているメールアドレスの一覧です
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label>登録済みメールアドレス</Label>
                {/* TODO: 登録済みメールアドレスの一覧表示 */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="line">
          <Card>
            <CardHeader>
              <CardTitle>LINE通知設定</CardTitle>
              <CardDescription>LINE通知の設定を管理します</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="line-token">LINEトークン</Label>
                <Input
                  id="line-token"
                  type="password"
                  placeholder="LINE Notify トークン"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button>設定を保存</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
