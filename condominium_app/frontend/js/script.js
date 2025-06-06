document.addEventListener('DOMContentLoaded', () => {
    fetchAndDisplayAnnouncements();
});

async function fetchAndDisplayAnnouncements() {
    const announcementsListDiv = document.getElementById('announcements-list');
    announcementsListDiv.innerHTML = '<p>Loading announcements...</p>'; // Clear previous content and show loading message

    try {
        // Assuming the backend is running on localhost:5001
        const response = await fetch('http://localhost:5001/api/announcements');

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const announcements = await response.json();

        if (announcements.length === 0) {
            announcementsListDiv.innerHTML = '<p>No announcements yet.</p>';
        } else {
            announcementsListDiv.innerHTML = ''; // Clear loading message
            const ul = document.createElement('ul');
            announcements.forEach(announcement => {
                const li = document.createElement('li');
                li.innerHTML = `<strong>${escapeHTML(announcement.title)}</strong>: ${escapeHTML(announcement.content)}`;
                ul.appendChild(li);
            });
            announcementsListDiv.appendChild(ul);
        }
    } catch (error) {
        console.error('Error fetching announcements:', error);
        announcementsListDiv.innerHTML = '<p>Error loading announcements. Please try again later.</p>';
    }
}

// Helper function to escape HTML to prevent XSS
function escapeHTML(str) {
    if (str === null || str === undefined) {
        return '';
    }
    return str.toString()
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// (Keep existing code: DOMContentLoaded listener, fetchAndDisplayAnnouncements, escapeHTML)

const addAnnouncementForm = document.getElementById('add-announcement-form');

if (addAnnouncementForm) {
    addAnnouncementForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        const titleInput = document.getElementById('title');
        const contentInput = document.getElementById('content');

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();

        if (!title || !content) {
            alert('Please fill in both title and content.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5001/api/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title, content }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Clear the form fields
            titleInput.value = '';
            contentInput.value = '';

            // Refresh the announcements list
            fetchAndDisplayAnnouncements();

            alert('Announcement added successfully!');

        } catch (error) {
            console.error('Error adding announcement:', error);
            alert('Failed to add announcement. Please try again.');
        }
    });
}
