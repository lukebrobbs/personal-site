import { PageRendererProps } from "gatsby"

export interface IBlogIndexProps extends PageRendererProps {
  data: IMetaData & IMarkdownRemark
}

export interface INotFoundPageProps extends PageRendererProps {
  data: IMetaData
}

export interface IPortfolioProps extends PageRendererProps {
  data: IMetaData
}

interface IMetaData {
  site: {
    siteMetadata: {
      title: string
    }
  }
}

interface IMarkdownRemark {
  allMarkdownRemark: {
    edges: {
      node: {
        excerpt: string
        fields: {
          slug: string
        }
        frontmatter: {
          date: string
          title: string
          description: string
          image: string
          templatekey: string
          url: string
        }
      }
    }[]
  }
}
