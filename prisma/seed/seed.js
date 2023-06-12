import fs from 'fs';
import zlib from 'zlib';
import { parseISO } from 'date-fns';

export function seed(prisma) {
	const url = new URL(`ohlc.csv.gz`, import.meta.url);
	const fileContents = fs.createReadStream(url);
	const unzip = zlib.createGunzip();

	let partial = '';
	let lastClose = 0;
	const data = [];

	fileContents
		.pipe(unzip)
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

					if (open && close) {
						lastClose = close || 0;
					}

					data.push({ time, open, high, low, close: close || lastClose });
				});
		})
		.on('finish', async () => {
			console.log(`Adding ${data.length} datapoints`);
			for (let i = 0; i < data.length; i++) {
				const { time, close } = data[i];
				await prisma.price.create({ data: data[i] });
				if (i % 10000 === 0) {
					console.log(time, close, `${((i / data.length) * 100).toPrecision(3)}%`);
				}
			}
		});
}
