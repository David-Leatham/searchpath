import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import dynamic from "next/dynamic";
import SettingsStrip from '@/pages/templates/settings/SettingsStrip';

import classNames from 'classnames'
import { useStyleStore } from '@/lib/store/styleStore';
import { Style, StyleInfoList } from '@/lib/types'
import { conditionalStyleDict } from '@/lib/hepers'

const Middle = dynamic(() => import('./templates/Middle'), {
  ssr: false
})

export default function Home() {
  const style: Style = useStyleStore<Style>((state)=>state.style);
  const styleInfoList: StyleInfoList = useStyleStore<StyleInfoList>((state)=>state.styleInfoList);

  return (
    <>
      <Head>
        <title>Maze Solver</title>
        <meta name="description" content="CV App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={classNames(styles.main, conditionalStyleDict(style, styleInfoList, styles))}>
      {/* <main className={styles.main + ' ' + styles.dark}> */}
        <SettingsStrip></SettingsStrip>
        <Middle></Middle>
      </main>
    </>
  )
}
