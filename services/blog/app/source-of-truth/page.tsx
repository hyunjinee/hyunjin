export default function page() {
  return (
    <>
      {/* <Title>Blog Archive</Title> */}

      <h1>Source Of Truth</h1>

      <ul className="space-y-2 sm:space-y-3">
        <li>1</li>
        <li>2</li>
        {/* {allPosts
          .sort((a, b) => (dayjs(a.posted).isBefore(b.posted) ? 1 : -1))
          .map((post) => (
            <li key={post._meta.path}>
              <Link
                href={`/blog/${post._meta.path}`}
                className="text-xl font-medium tracking-tighter text-green-700 font-display text-pretty hover:underline sm:text-2xl dark:text-green-500"
              >
                {post.title}
              </Link>

              <time
                dateTime={dayjs(post.posted).toISOString()}
                className="block text-sm text-zinc-600 sm:text-base dark:text-zinc-400"
              >
                {`${dayjs(post.posted).format('Do MMMM YYYY')}${
                  post.updated ? ` (Updated on ${dayjs(post.updated).format('Do MMMM YYYY')})` : ''
                }`}
              </time>
            </li>
          ))} */}
      </ul>
    </>
  )
}
