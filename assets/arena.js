let channelSlug = 'design-born-raised-in-nyc' // The “slug” is just the end of the URL


// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		console.log(data.title)
		console.log(data.created_at)

		let title = document.querySelector('#mainh1')
		console.log(title)

		title.innerHTML = data.title 
	
		let channelDescription = document.querySelector('#channeldescription')
		channelDescription.innerHTML = data.metadata.description
	})