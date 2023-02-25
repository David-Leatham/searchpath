import { create } from 'zustand'
import { StyleState, StyleInfoList, StyleInfo, Style } from '@/lib/types'


let styleInfoList: StyleInfoList = [
  {
    style: Style.BlueOrage,
    name: 'Orange Blue',
    cssTag: 'orangeBlue'
  },
  {
    style: Style.Dark,
    name: 'Dark',
    cssTag: 'dark'
  },
  {
    style: Style.NoWalls,
    name: 'No Walls',
    cssTag: 'noWalls'
  }
]

export const useStyleStore = create<StyleState>((set) => ({
  style: Style.Dark,
  styleInfoList: styleInfoList,
  setStyle: (style: Style) => {
    set((state) => ({
      style: style
    }))
  },
}))
  