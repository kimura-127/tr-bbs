import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { toast } from 'sonner';

interface ThreadPasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (password: number) => Promise<void>;
  isLoading: boolean;
}

export function ThreadPasswordDialog({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
}: ThreadPasswordDialogProps) {
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 数字のみを許可し、4桁までに制限
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 4);
    setPassword(value);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!password) {
      setError('パスワードを入力してください');
      return;
    }

    if (password.length !== 4) {
      setError('パスワードは4桁の数字で入力してください');
      return;
    }

    try {
      await onConfirm(Number.parseInt(password, 10));
      setPassword('');
    } catch (error) {
      toast.error('エラーが発生しました');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isLoading) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>パスワード確認</DialogTitle>
          <DialogDescription>
            スレッド作成時に設定した4桁のパスワードを入力してください
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-4 py-4">
          <Input
            type="number"
            placeholder="4桁のパスワード"
            value={password}
            onChange={handlePasswordChange}
            onKeyDown={handleKeyDown}
            className="text-center text-lg tracking-widest"
            inputMode="numeric"
            pattern="[0-9]*"
            autoFocus
            disabled={isLoading}
          />
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button
            className="max-md:text-xs max-md:tracking-normal font-semibold text-xs tracking-wide"
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            キャンセル
          </Button>
          <Button
            className="max-md:text-xs max-md:tracking-normal bg-gray-700 hover:bg-gray-800 font-semibold gap-2 text-xs tracking-wide dark:text-white"
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || password.length !== 4}
          >
            {isLoading ? '処理中...' : '確認'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
