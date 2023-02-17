import { create } from 'zustand'
import { StyleState, StyleInfoList, StyleInfo, Style } from '@/lib/types'


let styleInfoList: StyleInfoList = [
  {
    style: Style.BlueOrage,
    name: 'OrageBlue'
  },
  {
    style: Style.Dark,
    name: 'Dark'
  }
]

export const useStyleStore = create<StyleState>((set) => ({
  style: Style.BlueOrage,
  styleInfoList: styleInfoList,
  setStyle: (style: Style) => {
    set((state) => ({
      style: style
    }))
  },
}))
  