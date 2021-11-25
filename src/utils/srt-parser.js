import parseSRT from "parse-srt";

async function fetchFile (path) {
	const stream = await fetch(path)
	const text = await stream.text()
	return text
}

function convertTimetoMS (val) {
	var regex = /(\d+):(\d{2}):(\d{2}),(\d{3})/;
	var parts = regex.exec(val);

	if (parts === null) {
		return 0;
	}

	for (var i = 1; i < 5; i++) {
		parts[i] = parseInt(parts[i], 10);
		if (isNaN(parts[i])) parts[i] = 0;
	}
	// hours + minutes + seconds + ms
	return parts[1] * 3600000 + parts[2] * 60000 + parts[3] * 1000 + parts[4];
};

async function parseTimeline (path) {
	let dataSource = await fetchFile(path);
	return new Promise((resolve, reject) => {
		if (dataSource.startsWith('<?xml')) resolve([])
		let timelineArr = [];
		let timelineSource = dataSource.split('\n');
		timelineSource.map((_, idx) => {
			_ = _.trim();
			if ((_ !== null && _ !== '')) {
				let isNewParse = (_.indexOf(" --> ") > -1);
				let timeData = isNewParse ? _.split(" --> ") : _.split(" ");
				let obj = {
					startTime: isNewParse ? convertTimetoMS(timeData[0]) : timeData[0],
					endTime: isNewParse ? convertTimetoMS(timeData[1]) : timeData[1],
				}
				timelineArr.push(obj);
			}
		});
		resolve(timelineArr);
	});
}

async function parseSrt (path) {
	let dataSource = await fetchFile(path)
	return new Promise((resolve, reject) => {
		if (dataSource.startsWith('<?xml')) resolve([])
		let srt = [];
		let srtSource = dataSource.split('\n');
		srtSource.map(_ => {
			_ = _.trim();
			if ((_ !== null && _ !== ''))
				srt.push(_);
		});

		resolve(srt);
	});
}

async function parseNewSentenceSrt (timeline, srt, srt_alter) {
	let mediaSentenceSource = [];

	let alterSrt;
	let mainSrt
	let timelineSrt = await parseTimeline(timeline);
	if (srt) {
		mainSrt = await parseSrt(srt);
	}
	if (srt_alter) {
		alterSrt = await parseSrt(srt_alter);
	}

	timelineSrt.map((item, idx) => {
		let object = {};
		object.id = idx;
		object.startTime = timelineSrt[idx].startTime;
		object.endTime = timelineSrt[idx].endTime;
		object.content = srt && mainSrt[idx] ? mainSrt[idx].trim() : '';
		object.content_alter = alterSrt && alterSrt[idx] ? alterSrt[idx].trim() : "";
		object.highlight = "";
		mediaSentenceSource.push(object);
	});
	return mediaSentenceSource;
}

async function parseOldSentenceSrt (oldSRT) {
	const res = await fetch(oldSRT)
	const text = await res.text()
	let srt2 = parseSRT(text)
	srt2.forEach(item => {
		item.startTime = item.start * 1000
		item.endTime = item.end * 1000
		item.content = item.text
		delete item.start
		delete item.end
		delete item.text
	})
	return srt2
}

export {parseNewSentenceSrt, parseOldSentenceSrt}
