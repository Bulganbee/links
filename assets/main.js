let channelBlocks = document.querySelector('#channel-blocks');
let showSeeButton = document.querySelector('#show-see-button');
let showListenButton = document.querySelector('#show-listen-button');
let showReadButton = document.querySelector('#show-read-button');

//Below code from line 6 to 14 was generated by ChatGPT
// Function to filter blocks based on type
const filterBlocks = (types) => {
    let allBlocks = channelBlocks.querySelectorAll('.block');
    allBlocks.forEach(block => {
        block.style.display = 'none'; // Hide all by default
        types.forEach(type => {
            if (block.classList.contains(type)) {
                block.style.display = 'block'; // Show matching types
            }
        });
    });
};

// Event listeners for buttons
showSeeButton.onclick = () => filterBlocks(['block-image', 'block-video']);
showListenButton.onclick = () => filterBlocks(['block-audio']);
showReadButton.onclick = () => filterBlocks(['block-link', 'block-pdf', 'block-text']);

//Below code from line 6 to 14 was generated by ChatGPT
