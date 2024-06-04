"use client";
import { HPost } from "@server/h-modules/h-blog/entities/post.entity";

export default function PostCard({ post }: { post: HPost }) {
    return <article className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm">
    <img
      alt=""
      src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80"
      className="h-56 w-full object-cover"
    />

    <div className="p-4 sm:p-6">
      <a href="#">
        <h3 className="text-lg font-medium text-gray-900">
          {post.title}
        </h3>
      </a>

      <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
        {post.summary}
        <span className="text-opacity-80">{'' + post.createdAt}</span>
      </p>


      <a href="#" className="group mt-4 inline-flex items-center gap-1 text-sm font-medium text-blue-600">
        Read more
        <span aria-hidden="true" className="block transition-all group-hover:ms-0.5 rtl:rotate-180">
          &rarr;
        </span>
      </a>
    </div>
  </article>;
}
