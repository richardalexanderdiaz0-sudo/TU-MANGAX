import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { useStore } from '../store';
import { MessageCircle, Send, Trash2, Reply, ChevronDown, ChevronUp, User } from 'lucide-react';

interface Comment {
  id: string;
  chapter: string;
  user: string;
  content: string;
  parent: string | null;
  created: string;
  expand?: {
    user: {
      display_name: string;
      role: string;
    }
  }
}

interface CommentSectionProps {
  chapterId: string;
}

export default function CommentSection({ chapterId }: CommentSectionProps) {
  const { user, userProfile } = useStore();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.interactions.getComments(chapterId);

      if (data) {
          setComments(data);
      }
    } catch (err) {
      console.error("Error fetching comments:", err);
    } finally {
      setLoading(false);
    }
  }, [chapterId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e: React.FormEvent, parentId: string | null = null) => {
    e.preventDefault();
    if (!user) {
      alert("Debes iniciar sesión para comentar.");
      return;
    }
    const content = parentId ? customReplyContent : newComment;
    if (!content.trim()) return;

    try {
      await api.interactions.postComment({
          chapter_id: chapterId,
          content: content.trim(),
          parent_id: parentId
      });
      
      setNewComment('');
      setCustomReplyContent('');
      setReplyTo(null);
      fetchComments();
    } catch (err) {
      console.error("Error posting comment:", err);
      alert("Hubo un error al publicar tu comentario.");
    }
  };

  const [customReplyContent, setCustomReplyContent] = useState('');

  const handleDelete = async (id: string) => {
    if (!confirm("¿Borrar este comentario?")) return;
    try {
      await api.interactions.deleteComment(id);
      fetchComments();
    } catch (err) {
      console.error(err);
    }
  };

  const renderComment = (comment: Comment, isReply = false) => {
    const isOwner = user?.id === comment.user || userProfile?.role === 'admin';
    const displayName = comment.expand?.user?.display_name || 'Anónimo';
    const role = comment.expand?.user?.role || 'user';
    
    return (
      <div key={comment.id} className={`flex gap-4 p-4 rounded-3xl border-4 border-black mb-4 transition-all ${isReply ? 'ml-8 bg-slate-50 scale-95' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}>
        <div className={`w-10 h-10 rounded-full border-2 border-black flex items-center justify-center bg-slate-200 shrink-0 ${role === 'admin' ? 'bg-primary/20 ring-2 ring-primary ring-offset-2' : ''}`}>
          <User className={`h-6 w-6 ${role === 'admin' ? 'text-primary' : 'text-slate-500'}`} />
        </div>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800 uppercase italic tracking-tighter">
                {displayName}
              </span>
              {role === 'admin' && (
                <span className="bg-primary text-white text-[8px] font-black px-2 py-0.5 rounded-lg border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]">ADMIN</span>
              )}
              <span className="text-[10px] font-bold text-slate-400">
                {new Date(comment.created).toLocaleDateString()}
              </span>
            </div>
            
            {isOwner && (
              <button onClick={() => handleDelete(comment.id)} className="text-slate-300 hover:text-red-500 transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          
          <p className="text-sm font-medium text-slate-600 mb-3 whitespace-pre-wrap leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center gap-4">
            {!isReply && (
              <button 
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 text-[10px] font-black text-primary hover:underline uppercase italic"
              >
                <Reply className="h-3 w-3" />
                Responder
              </button>
            )}
          </div>

          {replyTo === comment.id && !isReply && (
            <form onSubmit={(e) => handleSubmit(e, comment.id)} className="mt-4 flex gap-2">
              <input
                value={customReplyContent}
                onChange={(e) => setCustomReplyContent(e.target.value)}
                placeholder="Escribe tu respuesta..."
                className="flex-1 bg-white border-2 border-black rounded-xl px-4 py-2 text-xs font-medium focus:ring-0 focus:border-primary transition-all"
              />
              <button type="submit" className="bg-primary p-2 rounded-xl border-2 border-black text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none translate-y-[-2px] active:translate-y-0">
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Render Replies */}
          {!isReply && comments.filter(c => c.parent === comment.id).map(reply => renderComment(reply, true))}
        </div>
      </div>
    );
  };

  const topLevelComments = comments.filter(c => !c.parent);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-12 border-t-8 border-black bg-white/30" onClick={e=>e.stopPropagation()}>
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-primary p-3 rounded-2xl border-4 border-black rotate-[-3deg]">
          <MessageCircle className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Comentarios ({comments.length})</h3>
      </div>

      <form onSubmit={(e) => handleSubmit(e)} className="mb-12 relative group">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="¿Qué te pareció este capítulo? Deja tu opinión..."
          className="w-full bg-white border-4 border-black rounded-3xl p-6 min-h-[120px] font-medium text-slate-700 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[8px_8px_0px_0px_rgba(255,45,133,0.3)] transition-all resize-none outline-none"
        />
        <button 
          type="submit"
          className="absolute bottom-4 right-4 toon-button bg-primary flex items-center gap-2 py-3 px-6"
        >
          <Send className="h-4 w-4" />
          <span>COMENTAR</span>
        </button>
      </form>

      {loading ? (
        <div className="flex justify-center p-8"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div></div>
      ) : topLevelComments.length === 0 ? (
        <div className="text-center py-12 bg-white/50 border-4 border-black border-dashed rounded-[2rem]">
          <p className="font-black text-slate-300 uppercase italic tracking-widest text-xs">Sé el primero en comentar...</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {topLevelComments.map(c => renderComment(c))}
        </div>
      )}
    </div>
  );
}
