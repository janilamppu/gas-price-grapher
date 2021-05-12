import { groupBy, uniqBy, slice, orderBy } from 'lodash';
import moment from 'moment';

export const getPriceForDays = (data, daysToShow) => {
	let items = data.map((item) => {
		const date = moment(item.date).format('DD.MM.YYYY');
		return { ...item, date };
	});

	// reverse the items
	items = items.reverse();

	// pick one per date
	items = uniqBy(items, 'date');

	// slice array by amount of days to show
	const startIndex =
		items.length - daysToShow >= 0 ? items.length - daysToShow : 0;
	items = slice(items, startIndex, items.length);

	return items;
};

export const getPricesPerMonth = (data) => {
	let items = data.map((item) => {
		const date = moment(item.date).format('MMMM YYYY');
		return { ...item, date };
	});

	items = groupBy(items, 'date');
	const months = Object.keys(items);
	const monthData = months.map((month) => {
		const res = {
			date: month,
			naturalgas: { zone1: 0.0, zone2: 0.0 },
			biogas: { zone1: 0.0, zone2: 0.0 },
		};
		const noOfRecordsPerMonth = items[month].length;
		items[month].forEach((item) => {
			res.naturalgas.zone1 += item.naturalgas.zone1;
			res.naturalgas.zone2 += item.naturalgas.zone2;
			res.biogas.zone1 += item.biogas.zone1;
			res.biogas.zone2 += item.biogas.zone2;
		});
		res.naturalgas.zone1 = (res.naturalgas.zone1 / noOfRecordsPerMonth).toFixed(
			2
		);
		res.naturalgas.zone2 = (res.naturalgas.zone2 / noOfRecordsPerMonth).toFixed(
			2
		);
		res.biogas.zone1 = (res.biogas.zone1 / noOfRecordsPerMonth).toFixed(2);
		res.biogas.zone2 = (res.biogas.zone2 / noOfRecordsPerMonth).toFixed(2);
		return res;
	});
	return orderBy(monthData, (e) => moment(e.date, 'MMMM YYYY'));
};
