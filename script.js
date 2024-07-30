document.addEventListener('DOMContentLoaded', function() {
    const gallery = document.getElementById('gallery');
    const storedItems = JSON.parse(localStorage.getItem('galleryItems')) || [];

    storedItems.forEach(item => addGalleryItem(item));

    document.getElementById('fileInput').addEventListener('change', function(event) {
        const files = event.target.files;
        
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e) {
                const fileUrl = e.target.result;
                const item = { type: file.type, src: fileUrl, date: new Date().toLocaleDateString() };
                storedItems.push(item);
                localStorage.setItem('galleryItems', JSON.stringify(storedItems));
                addGalleryItem(item);
            };

            reader.readAsDataURL(file);
        }
    });

    function addGalleryItem(item) {
        const galleryItem = document.createElement('div');
        galleryItem.classList.add('gallery-item');

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.textContent = 'Delete';
        deleteBtn.onclick = function() {
            gallery.removeChild(galleryItem);
            const index = storedItems.findIndex(storedItem => storedItem.src === item.src);
            if (index > -1) {
                storedItems.splice(index, 1);
                localStorage.setItem('galleryItems', JSON.stringify(storedItems));
            }
        };

        const downloadBtn = document.createElement('button');
        downloadBtn.classList.add('download-btn');
        downloadBtn.textContent = 'Download';
        downloadBtn.onclick = function() {
            const a = document.createElement('a');
            a.href = item.src;
            a.download = `download.${item.type.split('/')[1]}`;
            a.click();
        };

        const uploadDate = document.createElement('div');
        uploadDate.classList.add('upload-date');
        uploadDate.textContent = `Uploaded on: ${item.date}`;

        if (item.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = item.src;
            img.onclick = function() {
                const fullscreenContainer = document.getElementById('fullscreen-container');
                const fullscreenImage = document.getElementById('fullscreen-image');
                fullscreenImage.src = item.src;
                fullscreenContainer.style.display = 'flex';
            };
            galleryItem.appendChild(img);
        } else if (item.type.startsWith('video/')) {
            const video = document.createElement('video');
            video.src = item.src;
            video.controls = true;
            galleryItem.appendChild(video);
        }

        galleryItem.appendChild(uploadDate);
        // galleryItem.appendChild(deleteBtn);
        galleryItem.appendChild(downloadBtn);
        gallery.appendChild(galleryItem);
    }

    document.getElementById('logo').onclick = function() {
        const fullscreenContainer = document.getElementById('fullscreen-container');
        const fullscreenImage = document.getElementById('fullscreen-image');
        fullscreenImage.src = this.src;
        fullscreenContainer.style.display = 'flex';
    };

    document.getElementById('close-fullscreen').onclick = function() {
        document.getElementById('fullscreen-container').style.display = 'none';
    };
});
