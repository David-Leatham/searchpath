import { Style, StyleInfoList } from '@/lib/types'

export function conditionalStyleDict(style: Style, styleInfoList: StyleInfoList, styleModule: {[key: string]: string}) {
  let out: {[key: string]: boolean} = {};
  for (let styleInfo of styleInfoList) {
    out[styleModule[styleInfo.cssTag]] = style == styleInfo.style
  }
  return out
}