import React, { FunctionComponent } from "react"
import { IFrontMatter } from "../types"
import { rhythm } from "../utils/typography"

export const Project: FunctionComponent<IFrontMatter> = ({
  title,
  image,
  description,
  url,
}) => {
  return (
    <div
      style={{
        display: "flex",
        marginBottom: rhythm(1 / 4),
        marginTop: "3.5rem",
      }}
    >
      <img src={image} alt={title} style={{ width: "50%", margin: "0 1em" }} />
      <div style={{ alignSelf: "center", textAlign: "center" }}>
        <h3 style={{ margin: "0 0 0.5em 0" }}>
          <a href={url} target="_blank" style={{ boxShadow: `none` }}>
            {title}
          </a>
        </h3>
        <p>{description}</p>
      </div>
    </div>
  )
}
