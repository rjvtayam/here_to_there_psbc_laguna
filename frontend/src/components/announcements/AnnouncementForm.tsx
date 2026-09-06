import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';

interface AnnouncementFormProps {
  onSubmit: (data: {
    title: string;
    content: string;
    type: string;
    target_campus: string;
  }) => void;
  onCancel: () => void;
}

export function AnnouncementForm({ onSubmit, onCancel }: AnnouncementFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('bulletin');
  const [targetCampus, setTargetCampus] = useState('both');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ title, content, type, target_campus: targetCampus });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Announcement title"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Announcement content"
          className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent h-24 resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="bulletin">Bulletin</option>
            <option value="info">Info</option>
            <option value="emergency">Emergency</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Target Campus</label>
          <select
            value={targetCampus}
            onChange={(e) => setTargetCampus(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="both">Both</option>
            <option value="paete">Paete</option>
            <option value="pagsanjan">Pagsanjan</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Create Announcement</Button>
      </div>
    </form>
  );
}
