'use client';

import { createClient } from '@/utils/supabase/client';
import { useState } from 'react';

export default function TestPage() {
  const [inputValue, setInputValue] = useState('');
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase
        .from('test_items')
        .insert([{ content: inputValue }])
        .select();

      if (error) throw error;

      console.log('保存成功:', data);
      setInputValue('');
    } catch (error) {
      console.error('エラー:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">テストページ</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="border p-2 rounded w-full"
          placeholder="テストデータを入力"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          保存
        </button>
      </form>
    </div>
  );
}
