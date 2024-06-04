"use client"

import { HPost } from '@server/h-modules/h-blog/entities/post.entity';
import { useQuery } from '@tanstack/react-query';
import { publicQuery } from '@web/lib/services/cq.service';
import React from 'react'
import PostCard from '../(landing)/components/PostCard';

function page() {
  const postsQuery = useQuery({
    queryKey: ['posts'],
    enabled: true,
    queryFn: async () => {
      const r = await publicQuery<{ posts: HPost[] }>('user', 'post.findAll', {})
      return r.data.posts;
    }
  })

  return (
    <div>
      {/* blog cards */}
      <main className="container mx-auto grid grid-cols-4 gap-4 p-4">
        {(postsQuery.data || []).map(post =>
          <PostCard post={post} />
        )}
      </main>
    </div>
  )
}

export default page