// Opretter forbindelse til Socket.IO-serveren
// const socket = io(); // Opretter forbindelse til din server
const area = localStorage.getItem('area');
const socket = io(`https://${area}.joeandthejuice.digital`) // Opretter forbindelse til din server');



// Funktion til at fjerne aktiv klasse fra alle notes
function removeActiveNotes() {
    document.querySelectorAll('.sticky-note').forEach(note => {
        note.classList.remove('active-note');
    });
}

// Funktion til at gøre en note aktiv
function onNoteClick(noteId) {
    removeActiveNotes();

    // Tilføj aktiv klasse til den klikkede note
    const activeNote = document.getElementById(`note-${noteId}`);
    if (activeNote) {
        activeNote.classList.add('active-note');
        fetchAndDisplayAllComments(noteId); // Hent og vis alle kommentarer for den aktive note
    }
}

// Event listener til hele dokumentet for at fjerne aktive notes
document.addEventListener('click', async (event) => {
    if (!event.target.closest('.sticky-note')) {
        removeActiveNotes();
        const notes = document.querySelectorAll('.sticky-note');
        for (const note of notes) {
            const noteId = note.id.split('-')[1];
            await fetchAndDisplayFirstComment(noteId);
        }
    }
    
});

// Opdatering af fetchAndDisplayNotes for at tilføje event listeners
async function fetchAndDisplayNotes() {
    try {
        const response = await fetch('/sticky-notes'); // Angiv den korrekte sti til din GET endpoint
        const notesHTML = await response.text();

        // Opdater HTML indholdet i notesContainer
        document.getElementById('notesContainer').innerHTML = notesHTML;
        
        // // Tilføj event listeners til hver note
        // document.querySelectorAll('.sticky-note').forEach(note => {
        //     const noteId = note.id.split('-')[1];
        //     note.addEventListener('click', () => onNoteClick(noteId));

        //     // Hent kommentarer for denne note
        //     await fetchAndDisplayComments(noteId);
        // });
        // Hent og vis kommentarer for hver note
        document.querySelectorAll('.sticky-note').forEach(async (note) => {
            const noteId = note.id.split('-')[1];
            note.addEventListener('click', () => onNoteClick(noteId));

            // Hent kommentarer for denne note
            console.log("henter kommentarer")
            await fetchAndDisplayFirstComment(noteId);
        });
    } catch (error) {
        console.error('Fejl ved indlæsning af notes:', error);
    }
}


// // Funktion til at hente og vise kommentarer for en specifik note
// async function fetchAndDisplayComments(noteId) {
//     try {
//         const commentsResponse = await fetch(`/comments/${noteId}`);
//         const comments = await commentsResponse.json();
//         const commentsContainer = document.getElementById(`comments-container-${noteId}`);

//         comments.forEach(comment => {
//             const commentHtml = `
//                 <div class="comment">
//                     <span class="comment-username">${comment.username}</span>
//                     <span class="comment-timestamp">${new Date(comment.timestamp).toLocaleString()}</span>
//                     <p class="comment-text">${comment.comment}</p>
//                 </div>
//             `;
//             commentsContainer.innerHTML += commentHtml;
//         });
//     } catch (error) {
//         console.error(`Fejl ved indlæsning af kommentarer for note ${noteId}:`, error);
//     }
// }

// Funktion til at hente og vise den første kommentar for en specifik note
async function fetchAndDisplayFirstComment(noteId) {
    try {
        const commentsResponse = await fetch(`/comments/${noteId}`);
        const comments = await commentsResponse.json();
        const commentsContainer = document.getElementById(`comments-container-${noteId}`);

        // Tjek om der er kommentarer, og vis kun den første
        if (comments.length > 0) {
            const firstComment = comments[0];
            const commentHtml = `
                <div class="comment">
                    <span class="comment-username">${firstComment.username}</span>
                    <span class="comment-timestamp">${new Date(firstComment.timestamp).toLocaleString()}</span>
                    <p class="comment-text">${firstComment.comment}</p>
                </div>
            `;
            commentsContainer.innerHTML = commentHtml; // Vis kun den første kommentar
        }
    } catch (error) {
        console.error(`Fejl ved indlæsning af kommentarer for note ${noteId}:`, error);
    }
}

// Funktion til at hente og vise alle kommentarer for en specifik note
async function fetchAndDisplayAllComments(noteId) {
    try {
        const commentsResponse = await fetch(`/comments/${noteId}`);
        const comments = await commentsResponse.json();
        const commentsContainer = document.getElementById(`comments-container-${noteId}`);

        commentsContainer.innerHTML = ''; // Ryd tidligere kommentarer
        comments.forEach(comment => {
            const commentHtml = `
                <div class="comment">
                    <span class="comment-username">${comment.username}</span>
                    <span class="comment-timestamp">${new Date(comment.timestamp).toLocaleString()}</span>
                    <p class="comment-text">${comment.comment}</p>
                </div>
            `;
            commentsContainer.innerHTML += commentHtml;
        });
    } catch (error) {
        console.error(`Fejl ved indlæsning af kommentarer for note ${noteId}:`, error);
    }
}


// Send reaktion til serveren
function sendReaction(reactionType, noteId) {
    var reactionTypeStr = 'reaction' + reactionType;
    socket.emit('postReaction', { noteId: noteId, reactionType: reactionTypeStr });
}

// Send kommentar til serveren
function sendComment(noteId) {
    const commentInput = document.getElementById(`comment-input-${noteId}`);
    const comment = commentInput.value;
    const username = 'BrugerNavn'; // Erstat med faktisk brugernavn

    if (comment) {
        console.log("commentsent")
        socket.emit('postComment', { noteId, username, comment });
        commentInput.value = '';
    }
}


socket.on('updateReactions', updatedNote => {
    // Antager at updatedNote objektet indeholder id og de opdaterede reaktioner
    const noteElement = document.getElementById(`note-${updatedNote.id}`);

    if (noteElement) {
        // Opdater reaktionerne i note-elementet
        noteElement.querySelector(`button[onclick="sendReaction(1, ${updatedNote.id})"]`).textContent = ` <3 (${updatedNote.reaction1})`;
        noteElement.querySelector(`button[onclick="sendReaction(2, ${updatedNote.id})"]`).textContent = ` :) (${updatedNote.reaction2})`;
        noteElement.querySelector(`button[onclick="sendReaction(3, ${updatedNote.id})"]`).textContent = ` :| (${updatedNote.reaction3})`;
        noteElement.querySelector(`button[onclick="sendReaction(4, ${updatedNote.id})"]`).textContent = ` :( (${updatedNote.reaction4})`;
    }
});


socket.on('newComment', newComment => {
    // Find den rigtige note baseret på newComment.noteId
    const noteElement = document.getElementById(`note-${newComment.noteId}`);
    
    if (noteElement) {
        // Find kommentarcontaineren i denne note
        const commentsContainer = noteElement.querySelector('.comments-container');

        // Opret en ny HTML-streng for kommentaren
        const commentHtml = `
            <div class="comment">
                <span class="comment-username">${newComment.username}</span>
                <span class="comment-timestamp">${new Date(newComment.timestamp).toLocaleString()}</span>
                <p class="comment-text">${newComment.comment}</p>
            </div>
        `;

        // Tilføj den nye kommentar til containeren
        commentsContainer.innerHTML += commentHtml;
    }
});


// Kald funktionen når siden indlæses
window.onload = fetchAndDisplayNotes;
