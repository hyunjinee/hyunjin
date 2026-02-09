import { navigate } from 'gatsby'
import { useCallback, useMemo } from 'react'
import CategoryPageHeader from '../components/category-page-header'
import PostTabs from '../components/post-tabs'
import Seo from '../components/seo'
import Layout from '../layout'
import Post from '../models/post'

function CategoryTemplate({ pageContext }) {
  const { edges, currentCategory } = pageContext
  const { categories } = pageContext
  const currentTabIndex = useMemo(
    () => categories.findIndex((category) => category === currentCategory),
    [categories, currentCategory],
  )
  const posts = edges.map(({ node }) => new Post(node))

  const onTabIndexChange = useCallback(
    (e, value) => {
      if (value === 0) return navigate(`/posts`)
      navigate(`/posts/${categories[value]}`)
    },
    [categories],
  )

  return (
    <Layout>
      <Seo title="Posts" />
      <CategoryPageHeader title={categories[currentTabIndex]} subtitle={`${posts.length} posts`} />
      <PostTabs tabIndex={currentTabIndex} onChange={onTabIndexChange} tabs={categories} posts={posts} />
    </Layout>
  )
}

export default CategoryTemplate
