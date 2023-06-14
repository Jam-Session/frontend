import zlib from 'zlib';
import fs from 'fs';
import { pipeline } from 'stream';
import { getMinutes, parseISO } from 'date-fns';

export async function seed(prisma) {
	let source;
	try {
		const url = new URL('ohlc.csv.gz', import.meta.url);
		fs.statSync(url);
		console.log('Parsing local file...');
		source = fs.createReadStream(url);
	} catch (e) {
		console.log('Fetching data from GitHub...');
		const response = await fetch(
			'https://github.com/Jam-Session/frontend/raw/582fa97c11c51df9d4d72e74fed23d6f3b0a0451/prisma/seed/ohlc.csv.gz'
		);
		console.log(response.status, response.statusText);
		source = response.body;
	}

	const unzip = zlib.createGunzip();

	let partial = '';
	const data = [];

	pipeline(source, unzip, (err) => err && console.error(err))
		.on('data', (d) => {
			d.toString()
				.split('\n')
				.forEach((chunk) => {
					const line = `${partial}${chunk}`;
					const cells = line.split(',').map((s) => s.trim());
					if (cells.length !== 6) {
						partial = line;
						return;
					} else if (partial) {
						partial = '';
					}
					const [id, datestr, ...values] = cells;
					if (!id) {
						// header row
						return;
					}
					const time = parseISO(`${datestr}Z`);
					const [open, close, low, high] = values.map((s) => (s ? parseFloat(s) : null));

					data.push({ time, open, close, low, high });
				});
		})
		.on('finish', async () => {
			console.log(`Parsed ${data.length} datapoints`);

			let candles = 0;
			let prices = [];
			let hour;
			let n = 0;
			for (let i = 0; i < data.length; i++) {
				const { time, open } = data[i];

				if (getMinutes(time)) {
					prices.push(open);
				} else {
					// top of the hour
					if (hour) {
						const update = {
							time: hour,
							prices: JSON.stringify(prices)
						};
						await prisma.candle.upsert({
							where: {
								time: hour,
							},
							update,
							create: update,
						});
						candles++;
					}
					hour = time;
					prices = [open];
				}

				const p = Math.floor(i / (data.length - 1) * 100);
				if (p > n) {
					if(p%10 === 0) {
						console.log(`Progress: ${p}% ${Array(p/5).fill('.').join('')}`);
					}
					n++;
				}
			}
			console.log(`Total: ${candles} candles`);
		});
}
