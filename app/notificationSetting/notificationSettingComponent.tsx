'use client';

import { CreateThreadForm } from '@/components/CreateThreadForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Bell, Search, SquarePen } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export const NotificationSettingComponent = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isVisibleSearch, setIsVisibleSearch] = useState(false);

  return (
    <div className="container mx-auto py-1.5">
      <div className="flex gap-1 bg-gray-700 rounded-lg px-2 h-12 items-center">
        <div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide">
                <SquarePen />
                新規作成
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-screen overflow-auto">
              <DialogHeader>
                <DialogTitle>新規スレッド作成</DialogTitle>
                <DialogDescription className="py-2">
                  タイトルとコメントを入力してください
                </DialogDescription>
              </DialogHeader>
              <CreateThreadForm setIsDialogOpen={setIsDialogOpen} />
            </DialogContent>
          </Dialog>
        </div>
        <div>
          <Button
            onClick={() => setIsVisibleSearch(!isVisibleSearch)}
            className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide"
          >
            <Search />
            検索
          </Button>
        </div>
        <div>
          <Button className="h-12 bg-gray-700 hover:bg-gray-700 hover:text-gray-300 font-semibold gap-2 text-base tracking-wide">
            <Link
              className="flex justify-center items-center gap-2"
              href={'/notificationSetting'}
            >
              <Bell />
              通知設定
            </Link>
          </Button>
        </div>
      </div>
      <RadioGroup defaultValue="option-one">
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-one" id="option-one" />
          <Label htmlFor="option-one">Option One</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="option-two" id="option-two" />
          <Label htmlFor="option-two">Option Two</Label>
        </div>
      </RadioGroup>
    </div>
  );
};
