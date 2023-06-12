import fs from 'fs';
import zlib from 'zlib';
import { parseISO } from 'date-fns';

const url = new URL(`ohlc.csv.gz`, import.meta.url);
const fileContents = fs.createReadStream(url);
const unzip = zlib.createGunzip();

let partial = '';
let lastClose = 0;
let count = 0;

fileContents
	.pipe(unzip)
	.on('data', (d: Buffer) => {
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
				const date = parseISO(`${datestr}Z`);
				const [open, close, low, high] = values.map((s) => (s ? parseFloat(s) : null));

				if (open && close) {
					lastClose = close || 0;
				}

				if (count < 100) {
					console.log({ date, open, high, low, close: close || lastClose });
				}

				count++;
			});
	})
	.on('finish', () => {
		console.log(`total: ${count} datapoints`);
	});
