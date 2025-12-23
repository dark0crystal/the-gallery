'use client'

import React, { useState } from 'react'
import { useToast } from '@/hooks/useToast'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export type CommentType = {
  id: string
  content: string
  createdAt: string
  user: { id: string; name?: string; username?: string; image?: string }
  replies?: CommentType[]
}

export default function CommentsSection({ postId, initialComments }: { postId: string; initialComments: CommentType[] }) {
  const { success, error } = useToast()
  const { data: session } = useSession()
  const [comments, setComments] = useState<CommentType[]>(initialComments || [])
  const [submitting, setSubmitting] = useState(false)
  const [text, setText] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)

  const canComment = Boolean(session?.user)

  const submit = async (parentCommentId?: string | null) => {
    if (!text.trim()) return
    if (!canComment) {
      error('Please sign in to comment')
      return
    }
    setSubmitting(true)
    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: text.trim(), parentCommentId }),
      })
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = '/auth/signin'
          return
        }
        const data = await res.json()
        throw new Error(data?.error || 'Failed to create comment')
      }
      const newComment = await res.json()
      setComments((c) => [newComment, ...c])
      setText('')
      setReplyTo(null)
      success('Comment posted')
    } catch (err) {
      error((err as Error).message || 'Failed to post comment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReply = (id: string) => setReplyTo(id)

  const renderReplies = (replies?: CommentType[]) => {
    if (!replies || replies.length === 0) return null
    return (
      <div className="pl-6 mt-3 space-y-3">
        {replies.map((r) => (
          <div key={r.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100">
              {r.user.image && <Image src={r.user.image} alt={r.user.username || r.user.name || 'Avatar'} width={40} height={40} className="object-cover" />}
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">{r.user.name || r.user.username}</div>
              <div className="text-sm text-gray-700 mt-1">{r.content}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg">
        <h3 className="text-lg font-semibold">Comments</h3>
        <p className="text-sm text-gray-500">Be kind and respectful. Comments are public.</p>

        <div className="mt-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full rounded-md border-gray-200 p-3"
            placeholder={canComment ? 'Write a comment...' : 'Sign in to post a comment'}
            disabled={!canComment || submitting}
          />
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => submit(null)}
              disabled={!canComment || submitting}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments.map((c) => (
          <div key={c.id} className="bg-white p-4 rounded-lg">
            <div className="flex gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                {c.user.image && <Image src={c.user.image} alt={c.user.username || c.user.name || 'Avatar'} width={48} height={48} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium">{c.user.name || c.user.username}</div>
                  <div className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</div>
                </div>
                <div className="mt-2 text-sm text-gray-700">{c.content}</div>
                <div className="mt-3 flex items-center gap-3 text-sm text-gray-500">
                  <button onClick={() => handleReply(c.id)} className="hover:underline">Reply</button>
                  {session?.user?.id === c.user.id && (
                    <>
                      <button className="hover:underline">Edit</button>
                      <button className="hover:underline text-rose-600">Delete</button>
                    </>
                  )}
                </div>

                {replyTo === c.id && (
                  <div className="mt-3">
                    <textarea rows={3} className="w-full rounded-md border-gray-200 p-3" value={text} onChange={(e) => setText(e.target.value)} />
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => submit(c.id)} disabled={submitting} className="px-3 py-2 bg-blue-600 text-white rounded">Reply</button>
                      <button onClick={() => setReplyTo(null)} className="px-3 py-2 rounded border">Cancel</button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {renderReplies(c.replies)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
