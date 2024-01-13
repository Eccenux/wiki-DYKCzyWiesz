const fs = require('fs').promises;

async function replaceVersionDay() {
	try {
		const filePath = './src/build/version.js';
		const data = await fs.readFile(filePath, 'utf8');

		// replace with current date in Y-m-d format
		const currentDate = (new Date()).toISOString().slice(0, 10);
		const updatedContent = data.replace(/(buildDay *: *['"])[0-9-]+/, '$1'+currentDate);

		// write the updated content back to the file
		await fs.writeFile(filePath, updatedContent, 'utf8');

		console.log('File updated successfully.');
	} catch (err) {
		console.error(err);
	}
}

// EXECUTE
replaceVersionDay();
