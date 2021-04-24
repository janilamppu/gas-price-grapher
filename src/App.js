import './App.css';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getPricesPerMonth, getPriceForDays } from './utils/dataParser';

const App = () => {
	const [priceData, setPriceData] = useState([]);
	const [showingData, setShowingData] = useState([]);
	const [viewMode, setViewMode] = useState('0');
	const daysToShow = 15;

	useEffect(() => {
		async function fetch() {
			const headers = {
				'x-api-key': process.env.REACT_APP_API_KEY,
			};
			const url = `${process.env.REACT_APP_API_URL}/get-prices`;
			const response = await axios.get(url, { headers });
			const items = response.data;
			setPriceData(items);
		}

		fetch();
	}, []);

	useEffect(() => {
		setShowingData(getPreparedData(priceData, viewMode));
	}, [priceData, viewMode]);

	const getPreparedData = (data, mode) => {
		if (mode === '0') {
			// show latest 15 days
			return getPriceForDays(data, daysToShow);
		} else if (mode === '1') {
			// show avg price per month
			return getPricesPerMonth(data);
		}
	};

	const changeViewMode = (event) => {
		setViewMode(event.target.value);
	};

	return (
		<div>
			<div
				style={{
					width: '100%',
					height: '500px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: '25px',
				}}
			>
				<ResponsiveContainer width="80%">
					<LineChart data={showingData} width="100%">
						<CartesianGrid strokeDasharray="1 4" />
						<XAxis dataKey="date" />
						<Tooltip
							contentStyle={{ backgroundColor: '#656970', color: 'white' }}
						/>
						<YAxis
							type="number"
							tickCount={7}
							tickFormatter={(item) => `${item.toFixed(2)} €`}
							domain={[1.0, 2]}
						/>
						<Tooltip />
						<Legend layout="horizontal" iconSize="5" iconType="dot" />

						<Line
							type="monotone"
							name="Maakaasu, alue 1"
							dataKey="naturalgas.zone1"
							stroke="orange"
						/>
						<Line
							type="monotone"
							name="Maakaasu, alue 2"
							dataKey="naturalgas.zone2"
							stroke="lightblue"
						/>
						<Line
							type="monotone"
							name="Biokaasu, alue 1"
							dataKey="biogas.zone1"
							stroke="lightgreen"
						/>
						<Line
							type="monotone"
							name="Biokaasu, alue 2"
							dataKey="biogas.zone2"
							stroke="yellow"
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
			<div
				style={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					marginTop: 30,
				}}
			>
				<select value={viewMode} onChange={changeViewMode}>
					<option value="0">Viimeiset {daysToShow} päivää</option>
					<option value="1">Kuukausien keskihinta</option>
				</select>
			</div>
		</div>
	);
};

export default App;
