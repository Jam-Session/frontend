import { env } from '$env/dynamic/private';
import { error, type ServerLoad } from '@sveltejs/kit';

function valid(s: unknown, m = 90) {
	const v = Number(s);
	return v < m && v > -m;
}

type Jam = {
  artist_name: string;
  datetime: string;
  venue_address: string;
  venue_name: string;
}

export const load: ServerLoad = async function ({ params }) {
	const { lat, long } = params;

	if (!valid(lat) || !valid(long, 180)) {
		throw error(400, { message: 'Invalid coordinates'});
	}

	const backendUrl = new URL(String(env.JAMS_API_URL));
	backendUrl.searchParams.set('latitude', String(lat));
	backendUrl.searchParams.set('longitude', String(long));

	try {
		console.log(backendUrl.toString());
		const backendResponse = await fetch(backendUrl);
		const backendData = await backendResponse.json();
		console.log(backendData);

		return { lat, long, jams: backendData.events as Jam[] };
	} catch (oops) {
		console.log(oops);
		throw error(401, { message: 'Backend failed'});
	}
};
