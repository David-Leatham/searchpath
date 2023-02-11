import settingsStripStyles from './SettingsStrip.module.css'
import { Title, StartSearchButton, ClearSearchButten, SearchAlgorithmsElements, MazeElements } from './elements/elements'

export default function SettingsStrip() {
	return (
		<div className={settingsStripStyles.settingsOuter}>
			<div className={settingsStripStyles.settings}>
        <div>
          <StartSearchButton></StartSearchButton>
          <ClearSearchButten></ClearSearchButten>
        </div>
				<div>
          <Title title='Shortest Path Algorithms'></Title>
          <SearchAlgorithmsElements></SearchAlgorithmsElements>
				</div>
				<div>
          <Title title='Maizes'></Title>
          <MazeElements></MazeElements>
				</div>
			</div>
		</div>
	)
}
