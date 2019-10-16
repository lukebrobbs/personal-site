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
      <Project />
    </Layout>
  )
}

export default Portfolio

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`
