import { PageRendererProps } from "gatsby"

export interface IBlogIndexProps extends PageRendererProps {
  data: IMetaData & IMarkdownRemarks
}

export interface INotFoundPageProps extends PageRendererProps {
  data: IMetaData
}

export interface IPortfolioProps extends PageRendererProps {
  data: IMetaData & IMarkdownRemarks
}

export interface IBlogPostTemplateProps extends PageRendererProps {
  data: IMetaData & { markdownRemark: IMarkdownRemark }
  pageContext: IPageContext
}

export interface ILayoutProps extends PageRendererProps {
  title: string
}

interface IPageContext {
  slug: string
  previous: IMarkdownRemark
  next: IMarkdownRemark
}

interface IMetaData {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

interface IMarkdownRemarks {
  allMarkdownRemark: {
    edges: {
      node: IMarkdownRemark
    }[]
  }
}

export interface IFrontMatter {
  date: string
  title: string
  description: string
  image: string
  templatekey: string
  url: string
}

interface IMarkdownRemark {
  id: string
  html: string
  excerpt: string
  fields: {
    slug: string
  }
  frontmatter: IFrontMatter
}
