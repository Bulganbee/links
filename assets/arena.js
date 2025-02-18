
// This allows us to process/render the descriptions, which are in Markdown!
// More about Markdown: https://en.wikipedia.org/wiki/Markdown
let markdownIt = document.createElement('script')
markdownIt.src = 'https://cdn.jsdelivr.net/npm/markdown-it@14.0.0/dist/markdown-it.min.js'
document.head.appendChild(markdownIt)

let channelSlug = 'motion-of-nyc'

let placeChannelInfo = (data) => {
    let channelTitle = document.getElementById('channel-title')
    let channelDescription = document.getElementById('channel-description')
    let channelCount = document.getElementById('channel-count')
    let channelLink = document.getElementById('channel-link')

    channelTitle.innerHTML = data.title
    channelDescription.innerHTML = window.markdownit().render(data.metadata.description)
    channelCount.innerHTML = data.length
    channelLink.href = `https://www.are.na/channel/${channelSlug}`
}

let renderBlock = (block) => {
    let channelBlocks = document.getElementById('channel-blocks')

    // Images - part of "see"
    if (block.class == 'Image') {
        let imageItem = 
        `<li class="block block-image">
            <picture>
                <source media="(max-width: 428px)" srcset="${block.image.thumb.url}">
                <source media="(max-width: 640px)" srcset="${block.image.large.url}">
                <img src="${block.image.original.url}" alt="${block.title}">
            </picture>
            <h3>${block.title}</h3>
            ${block.description_html ? block.description_html : ''}
        </li>`
        channelBlocks.insertAdjacentHTML('beforeend', imageItem)
    }

    // Links and PDFs - part of "read"
    else if (block.class == 'Link') {
        let linkItem =
        `<li class="block block-link">
            <picture>
                <source media="(max-width: 428px)" srcset="${block.image.thumb.url}">
                <source media="(max-width: 640px)" srcset="${block.image.large.url}">
                <img src="${block.image.original.url}">
            </picture>
            <h3>${block.title}</h3>
           <p> ${block.description_html}</p>
            
            <p><a href="${block.source.url}">Read the article ↗</a></p>
        </li>`
        channelBlocks.insertAdjacentHTML('beforeend', linkItem)
    }

    // Text - part of "read"
    else if (block.class == 'Text') {
        let textItem = 
        `<li class="block block-text">
            <h3>${block.title}</h3>
            <p>${block.content}</p>
            <p>${block.description_html ? block.description_html : ''}</p>
           
        </li>`
        channelBlocks.insertAdjacentHTML('beforeend', textItem)
    }

    // Attachments (PDF, Audio, Video)
    else if (block.class == 'Attachment') {
        let attachment = block.attachment.content_type

        // Video - part of "see"
        if (attachment.includes('video')) {
            let videoItem =
            `<li class="block block-video">
                <p><em>Video</em></p>
                <video controls src="${block.attachment.url}"></video>
            </li>`
            channelBlocks.insertAdjacentHTML('beforeend', videoItem)
        }

        // PDF - part of "read"
        else if (attachment.includes('pdf')) {
            let pdfItem = 
            `<li class="block block-pdf">
                <picture>
                    <source media="(max-width: 428px)" srcset="${block.image.thumb.url}">
                    <source media="(max-width: 640px)" srcset="${block.image.large.url}">
                    <img src="${block.image.original.url}" alt="${block.title}">
                </picture>
                <h3>${block.title}</h3>
                <p><a href="${block.attachment.url}" target="_blank">View PDF ↗</a></p>
                ${block.description_html ? block.description_html : ''}
            </li>`
            channelBlocks.insertAdjacentHTML('beforeend', pdfItem)
        }

        // Audio - part of "listen"
        else if (attachment.includes('audio')) {
            let audioItem =
            `<li class="block block-audio">
                <audio controls src="${block.attachment.url}">
                    <source src="${block.attachment.url}" type="audio/mpeg">
                </audio>
            </li>`
            channelBlocks.insertAdjacentHTML('beforeend', audioItem)
        }
    }

    // Embedded Media (YouTube, etc.)
    else if (block.class == 'Media') {
        let embed = block.embed.type

        // Video - part of "see"
        if (embed.includes('video')) {
            let linkedVideoItem =
            `<li class="block block-video">
                <p><em>Video</em></p>
                ${block.embed.html}
            </li>`
            channelBlocks.insertAdjacentHTML('beforeend', linkedVideoItem)
        }
    }
}

let renderUser = (user, container) => {
    let userAddress =
    `<address>
        <img src="${user.avatar_image.display}">
        <h3>${user.first_name}</h3>
        <p><a href="https://are.na/${user.slug}">Are.na profile ↗</a></p>
    </address>`
    container.insertAdjacentHTML('beforeend', userAddress)
}

fetch(`https://api.are.na/v2/channels/${channelSlug}?per=100`, { cache: 'no-store' })
    .then((response) => response.json())
    .then((data) => {
        console.log(data)
        placeChannelInfo(data)

        data.contents.reverse().forEach((block) => {
            renderBlock(block)
        })

        let channelUsers = document.getElementById('channel-users')
        data.collaborators.forEach((collaborator) => renderUser(collaborator, channelUsers))
        renderUser(data.user, channelUsers)
    })