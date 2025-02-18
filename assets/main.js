let channelBlocks = document.querySelector('#channel-blocks')
let showVideoButton = document.querySelector('#show-video-button')
let showImageButton = document.querySelector('#show-image-button')
let showTextButton = document.querySelector('#show-text-button')
let showPdfButton = document.querySelector('#show-pdf-button')
let showLinkButton = document.querySelector('#show-link-button')
let showAllButton = document.querySelector('#show-all-button')

// Add clickon for buttons
showVideoButton.onclick = () => {
	channelBlocks.classList.add('show-video')
}
showAllButton.onclick = () => {
	channelBlocks.classList.remove('show-video')
}
