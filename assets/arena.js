// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)



// Okay, Are.na stuff!
let channelSlug = 'motion-of-nyc' // The “slug” is just the end of the URL



// First, let’s lay out some *functions*, starting with our basic metadata:
let placeChannelInfo = (data) => {
	// Target some elements in your HTML:
	let channelTitle = document.querySelector('#channel-title')
	let channelDescription = document.querySelector('#channel-description')
	let channelCount = document.querySelector('#channel-count')
	let channelLink = document.querySelector('#channel-link')

	// Then set their content/attributes to our data:
	channelTitle.innerHTML = data.title
	channelDescription.innerHTML = window.markdownit().render(data.metadata.description) // Converts Markdown → HTML
	channelCount.innerHTML = data.length
	channelLink.href = `https://www.are.na/channel/${channelSlug}`
}



// Then our big function for specific-block-type rendering:
let renderBlock = (block) => {
	// To start, a shared `ul` where we’ll insert all our blocks
	let channelBlocks = document.querySelector('#channel-blocks')

	// Links!
	if (block.class == 'Link') {
		let linkItem =
			`
			<li class="block-link">
				
				<picture>
					<source media="(max-width: 428px)" srcset="${ block.image.thumb.url }">
					<source media="(max-width: 640px)" srcset="${ block.image.large.url }">
					<img src="${ block.image.original.url }">
				</picture>
				<h3>${ block.title }</h3>
				${ block.description_html }
				<p><a href="${ block.source.url }">See the original ↗</a></p>
			</li>
			`
		channelBlocks.insertAdjacentHTML('beforeend', linkItem)
	}

	// Images!
    if (block.class == 'Image') {
        let imageItem = 
        `<li class="block-image">
            <button>
                <picture>
                    <source media="(max-width: 428px)" srcset="${block.image.thumb.url}">
                    <source media="(max-width: 640px)" srcset="${block.image.large.url}">
                    <img src="${block.image.original.url}" alt="${block.title}">
                </picture>
            </button>
            <dialog>
                <div class="dialog-content">
                    <img src="${block.image.large.url}" alt="${block.title}">
                    <div class="dialog-text">
                        <h3>${block.title}</h3>
                        <p>${block.description_html ? block.description_html : ''}</p>
                    </div>
                    <button class="close">×</button>
                </div>
            </dialog>
        </li>`
        channelBlocks.insertAdjacentHTML('beforeend', imageItem)
    }

	// Text!
    else if (block.class == 'Text') {
        let textItem = 
        `<li class="block-text">
           
            <p>${block.content}</p>
            <p>${block.description_html ? block.description_html : ''}</p>
           
        </li>`
        channelBlocks.insertAdjacentHTML('beforeend', textItem)
    }

	// Uploaded (not linked) media…
	else if (block.class == 'Attachment') {
		let attachment = block.attachment.content_type // Save us some repetition

		// Uploaded videos!
		if (attachment.includes('video')) {
			// …still up to you, but we’ll give you the `video` element:
			let videoItem =
				`
				<li>
					<p><em>Video</em></p>
					<video controls src="${ block.attachment.url }"></video>
				</li>
				`
			channelBlocks.insertAdjacentHTML('beforeend', videoItem)
			// More on video, like the `autoplay` attribute:
			// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video
		}

		// Uploaded PDFs!
		else if (attachment.includes('pdf')) {
			// …up to you!
		}

		// Uploaded audio!
		else if (attachment.includes('audio')) {
			// …still up to you, but here’s an `audio` element:
			let audioItem =
				`
				  <li class="block-audio">
				<button class="button">
                <div id="title-container"> 
                <div id="titlediv">
                    <h3>${block.title}</h3>
                </div>
                <div id="audio-player"> 
				 <audio controls src="${block.attachment.url}"></audio>
                 </div>
                </div>
				</button>

                 
				<dialog>
                <div class="dialog-style">
					<h3>${block.title}</h3>
                        <p>${block.description_html ? block.description_html : ''}</p>
					<audio controls src="${block.attachment.url}"></audio>
					<button class="close">×</button>
                </div>
				</dialog>
				</li>
                
				`
			channelBlocks.insertAdjacentHTML('beforeend', audioItem)
			// More on audio: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio
		}
	}

	// Linked media…
	else if (block.class == 'Media') {
		let embed = block.embed.type

		// Linked video!
        if (embed.includes('video')) {
            let linkedVideoItem =
            `<li class="block-video">
            <div id="video-div">
            <button class="button">
            ${block.embed.html}
            </button>
            </div>
            <dialog>
             ${block.embed.html}
             <button class="close">×</button>
				</dialog>
            </li>`
            channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
        }

		// Linked audio!
		else if (embed.includes('rich')) {
			// …up to you!
		}
	}
}



// It‘s always good to credit your work:
let renderUser = (user, container) => { // You can have multiple arguments for a function!
	let userAddress =
		`
		<address>
			<img src="${ user.avatar_image.display }">
			<h3>${ user.first_name }</h3>
			<p><a href="https://are.na/${ user.slug }">Are.na profile ↗</a></p>
		</address>
		`
	container.insertAdjacentHTML('beforeend', userAddress)
}

let initInteraction = () => {
	let audioBlocks = document.querySelectorAll('.block-audio')
	audioBlocks.forEach((block) => {
		let openButton = block.querySelector('button')
		let dialog = block.querySelector('dialog')
		let closeButton = dialog.querySelector('button')
		
		openButton.onclick = () => {
			dialog.showModal()
		}

		closeButton.onclick = () => {
			dialog.close()
		}

		dialog.onclick = (event) => { 
			if (event.target == dialog) {
				dialog.close() 
			}}
	})
    let imageBlocks = document.querySelectorAll('.block-image')
	imageBlocks.forEach((block) => {
		let openButton = block.querySelector('button')
		let dialog = block.querySelector('dialog')
		let closeButton = dialog.querySelector('.close')
		
		openButton.onclick = () => {
			dialog.showModal()
		}

		closeButton.onclick = () => {
			dialog.close()
		}

		dialog.onclick = (event) => { 
			if (event.target == dialog) {
				dialog.close() 
			}}
	})
    let videoBlocks = document.querySelectorAll('.block-video')
	videoBlocks.forEach((block) => {
		let openButton = block.querySelector('button')
		let dialog = block.querySelector('dialog')
		let closeButton = dialog.querySelector('.close')
		
		openButton.onclick = () => {
			dialog.showModal()
		}

		closeButton.onclick = () => {
			dialog.close()
		}

		dialog.onclick = (event) => { 
			if (event.target == dialog) {
				dialog.close() 
			}}
	})
}

// Now that we have said what we can do, go get the data:
fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
	.then((response) => response.json()) // Return it as JSON data
	.then((data) => { // Do stuff with the data
		console.log(data) // Always good to check your response!
		placeChannelInfo(data) // Pass the data to the first function

		// Loop through the `contents` array (list), backwards. Are.na returns them in reverse!
		data.contents.reverse().forEach((block) => {
			// console.log(block) // The data for a single block
			renderBlock(block) // Pass the single block data to the render function
		})
        initInteraction()
		// Also display the owner and collaborators:
		let channelUsers = document.querySelector('#channel-users') // Show them together
		data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
		renderUser(data.user, channelUsers)
	})