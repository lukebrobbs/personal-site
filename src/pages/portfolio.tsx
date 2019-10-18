import React, { FunctionComponent } from "react"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Nav from "../components/Nav"
import { Project } from "../components/Project"
import { graphql } from "gatsby"
import { IPortfolioProps } from "../types"

const Portfolio: FunctionComponent<IPortfolioProps> = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata.title

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="Portfolio" />
      <Bio />
      <Nav />
      <section style={{ marginBottom: "3.5em" }}>
        {data.allMarkdownRemark.edges.map(project => {
          return <Project {...project.node.frontmatter} />
        })}
      </section>
    </Layout>
  )
}

export default Portfolio

export const pageQuery = graphql`
  query Portfolio {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      filter: { frontmatter: { templatekey: { eq: "project" } } }
    ) {
      edges {
        node {
          frontmatter {
            url
            image
            description
            title
          }
        }
      }
    }
  }
`
