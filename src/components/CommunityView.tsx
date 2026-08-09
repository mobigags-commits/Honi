import React, { useState } from 'react';
import { CommunityPost } from '../types';
import { Award, ThumbsUp, MessageSquare, Plus, ShieldCheck, Flag } from 'lucide-react';

interface CommunityViewProps {
  posts: CommunityPost[];
  onCreatePost: (postData: { title: string; content: string; topic: string }) => Promise<void>;
}

export const CommunityView: React.FC<CommunityViewProps> = ({ posts, onCreatePost }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [topic, setTopic] = useState('AVQ Ecosystem');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;
    setIsSubmitting(true);
    try {
      await onCreatePost({ title, content, topic });
      setTitle('');
      setContent('');
      setIsModalOpen(false);
    } catch (err: any) {
      alert(err.message || 'Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
            <Award className="w-6 h-6 text-purple-400" />
            <span>Global Community & Governance Feed</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Connect with worldwide AVERIQ members, discuss AVQ ecosystem utility, and share Web3 educational insights.
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion Post</span>
        </button>
      </div>

      {/* Posts Feed */}
      <div className="space-y-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
                  <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-white text-xs">
                    {post.authorName.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{post.authorName}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {post.authorCountry} • {post.createdAt}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-950 text-cyan-400 border border-slate-800">
                  {post.topic}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  <span>AI Risk: {(post.aiRiskScore * 100).toFixed(0)}%</span>
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">{post.title}</h3>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>

            {/* Comments list if any */}
            {post.comments && post.comments.length > 0 && (
              <div className="pt-2 space-y-2 border-t border-slate-800/80">
                {post.comments.map((c) => (
                  <div key={c.id} className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300">
                    <span className="font-bold text-cyan-400 mr-2">{c.authorName}:</span>
                    <span>{c.text}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-6 pt-2 text-xs font-mono text-slate-400">
              <button className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                <ThumbsUp className={`w-4 h-4 ${post.isLiked ? 'text-cyan-400 fill-cyan-400' : ''}`} />
                <span>{post.likes} Likes</span>
              </button>

              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>{post.commentsCount} Comments</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Community Discussion</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Discussion Topic</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="AVQ Ecosystem">AVQ Ecosystem & Staking</option>
                  <option value="Cash-out & Local Gateways">Cash-out & Local Gateways</option>
                  <option value="Trading & Markets">Trading & Markets</option>
                  <option value="General Discussion">General Discussion</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Post Title</label>
                <input
                  type="text"
                  placeholder="e.g. AVQ Staking Yield Overview"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Content</label>
                <textarea
                  rows={4}
                  placeholder="Write your discussion content..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 px-3 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !title || !content}
                  className="px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold"
                >
                  {isSubmitting ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
