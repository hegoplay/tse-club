import React, { useEffect } from "react"
import { cn } from "../lib/utils"

interface NormalContentProps {
  content?: string
  tableOfContents: Array<{ id: string; title: string }>
  className?: string
}

const NormalContent: React.FC<NormalContentProps> = ({ content, tableOfContents, className }) => {
  if (!content) return null

  let modifiedContent = content
  let index = 0
  modifiedContent = modifiedContent.replace(/<h([2-5])>/g, (match, p1) => {
    const tocItem = tableOfContents[index] || { id: `section-${index + 1}` }
    index += 1
    return `<h${p1} id="${tocItem.id}">`
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          const element = entry.target as HTMLElement
          if (entry.isIntersecting) {
            document.querySelector(`[href="#${element.id}"]`)?.classList.add("active")
          } else {
            document.querySelector(`[href="#${element.id}"]`)?.classList.remove("active")
          }
        })
      },
      {
        rootMargin: "-20% 0px -80% 0px",
      },
    )

    tableOfContents.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      tableOfContents.forEach(({ id }) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [tableOfContents])

  return (
    <div
      dangerouslySetInnerHTML={{ __html: modifiedContent }}
      className={cn(`sm:px-16 px-4 content-wrapper text-[#31343e]`, className)}
    />
  )
}

export default NormalContent
