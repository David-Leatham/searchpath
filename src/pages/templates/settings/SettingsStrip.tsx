import settingsStripStyles from './SettingsStrip.module.css'
import { Title, StartSearchButton, ClearSearchButten, SearchAlgorithmsElements, MazeElements, StyleElements, SlowMazeGenerationToggleButton } from '@/lib/elements/elements'
import classNames from 'classnames'
import { useStyleStore } from '@/lib/store/styleStore';
import { Style, StyleInfoList } from '@/lib/types'
import { conditionalStyleDict } from '@/lib/hepers'


export default function SettingsStrip() {
  const style: Style = useStyleStore<Style>((state)=>state.style);
  const styleInfoList: StyleInfoList = useStyleStore<StyleInfoList>((state)=>state.styleInfoList);

	return (
		<div className={classNames(settingsStripStyles.settingsOuter, conditionalStyleDict(style, styleInfoList, settingsStripStyles))}>
			<div className={settingsStripStyles.settings}>
        <div>
          <StartSearchButton></StartSearchButton>
          <ClearSearchButten></ClearSearchButten>
          <SlowMazeGenerationToggleButton></SlowMazeGenerationToggleButton>
        </div>
		    <div>
          <Title title='Shortest Path Algorithms'></Title>
          <SearchAlgorithmsElements></SearchAlgorithmsElements>
		    </div>
			  <div>
          <Title title='Maizes'></Title>
          <MazeElements></MazeElements>
			  </div>
			  <div>
          <Title title='Styles'></Title>
          <StyleElements></StyleElements>
			  </div>
			</div>
		</div>
	)
}
