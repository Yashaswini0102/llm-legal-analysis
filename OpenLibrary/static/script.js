document.getElementById('searchButton').addEventListener('click', searchBooks);

async function searchBooks() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = ''; // Clear previous results

    if (query === '') {
        resultsDiv.innerHTML = '<p class="error">Please enter a search term.</p>';
        return;
    }

    try {
        const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`);
        const data = await response.json();

        if (data.docs.length === 0) {
            resultsDiv.innerHTML = '<p class="error">No books found.</p>';
            return;
        }

        // Limit number of displayed books (e.g., to 10)
        const maxBooks = 10;
        const booksToShow = data.docs.slice(0, maxBooks);

        booksToShow.forEach(book => {
            const bookDiv = document.createElement('div');
            bookDiv.classList.add('book');

            const title = book.title || 'No title';
            const author = book.author_name ? book.author_name.join(', ') : 'No author';
            const coverId = book.cover_i ? book.cover_i : null;
            const coverUrl = coverId ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg` : 'https://via.placeholder.com/100x150?text=No+Cover';
            const bookUrl = book.key ? `https://openlibrary.org${book.key}` : '#';

            // Display book cover, title, and author
            bookDiv.innerHTML = `
                <a href="${bookUrl}" target="_blank" class="book-link">
                    <img src="${coverUrl}" alt="Book Cover">
                    <h3>${title}</h3>
                    <p><strong>Author:</strong> ${author}</p>
                </a>
            `;

            resultsDiv.appendChild(bookDiv);
        });
    } catch (error) {
        resultsDiv.innerHTML = '<p class="error">An error occurred while fetching data.</p>';
    }
}
