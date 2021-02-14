import { Fragment, h } from 'vue'

export function wrapTemplate(children) {
  if (!Array.isArray(children)) {
    children = [children]
  }
  return h(Fragment, null, children)
}